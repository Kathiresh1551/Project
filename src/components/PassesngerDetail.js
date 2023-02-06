import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import { Button, Form, Header, Icon, Input, Modal, Segment, Select, Divider, Table } from "semantic-ui-react";
import * as yup from 'yup';
import './PassengerDetails.css'
import axios from "axios";

const PassengerDetails = (props) => {
    const [open, setOpen] = useState(false);
    const [ticketDetails, setTicketDetails] = useState([]);
    const [totalRate, setTotalRate] = useState(0)
    const [initialValues , setInitialValues] = useState({
        passengerForm: [
            {
                name: '',
                age: null,
                gender: '',
                compartment: '',
                berth: ''
            }
        ]
    });
    
    useEffect(() => {  
        ticketInfo();
    }, []);

    const schema = yup.object().shape({
        passengerForm:yup.array().of(
            yup.object().shape({
                name: yup.string().max(40).required("Name is required"),
                age: yup.number().required("Age is required").test(
                    'Invalid Age',
                    (value) => value && value.toString() > 3 && value.toString().length < 3,
                ).typeError('Invalid Age'),
                gender: yup.string().required("Gender is required"),
                compartment: yup.string().required("Compartment details is required"),
                berth: yup.string().required("choose your berth")
            })
        ),
        
    })

    const deletePassenger = (name) => {
        setInitialValues({
            passengerForm: [
                ...initialValues.passengerForm.splice(0, initialValues.passengerForm.length - 1)
            ]
        })
    }

    const addNewPassenger = (values) => {
        if (open === true) {
            setOpen(false)
        }
        setInitialValues(
            {
                passengerForm: [
                    ...values.passengerForm,
                    {
                        name: '',
                        age: null,
                        gender: '',
                        berth: ''
                    }
                ]
            }
        ) 
    }

    const handleBookTickets = (values) => { 
        // const { history } = this.props; 
        // history.push('/payment') 
        setOpen(false);
        const userDetails = JSON.parse(localStorage.getItem('userDetail'));
        const SelectedTrain = JSON.parse(localStorage.getItem('selectedTrain'));
        const trainDetails = JSON.parse(localStorage.getItem('travelData'));
        const passengerName = values.passengerForm.map((ele) => ele.name);
        const passengerAge = values.passengerForm.map((ele) => ele.age);
        const passengerCompartment = values.passengerForm.map((ele) => ele.compartment);
        const ticketRate = values.passengerForm.map((ele) => handleTicketAmount(ele));
        console.log('ticketRate', ticketRate);
        axios.post("http://localhost:5000/bookTickets",
        {
            "userName": userDetails.name,
            "userEmail": userDetails.email,
            "trainName": SelectedTrain.train_name,
            "fromStation": SelectedTrain.from_station,
            "destStation": SelectedTrain.dest_station,
            "passengerName": passengerName,
            "passengerAge": passengerAge,
            "passengerCompartment": passengerCompartment,
            "ticketRate": ticketRate,
            "totalRate": totalRate,
            "travelDate": trainDetails.dateOfTravel,
        }).then((response) => {
            console.log('handleBookTickets', response)
        }).catch((error) => {
            console.log('error', error)
        })
    }

    const calculateTicketRate = (values) => {
        const ticketRate = values.passengerForm.map((ele) => handleTicketAmount(ele));
        const totalRate = ticketRate.reduce((a, b) => a + b, 0);
        setTotalRate(totalRate)
        return totalRate;
    }

    const ticketInfo = () => {
        const trainDetails = JSON.parse(localStorage.getItem('selectedTrain'));
        axios.post("http://localhost:5000/ticketInfo",
        {
            "fromStation": trainDetails.from_station,
            "destStation": trainDetails.dest_station
        }
        ).then((response) => {
            setTicketDetails(response?.data.tickectInfo)
        }).catch((error) => {
            console.log('error', error)
        })
    }

    const handleBack = () => {
        const { history } = props;
        history.push('/mypayanam/train')
    }

    const handleRedirectToHome = () => {
        const { history } = props;
        history.push('/');
        localStorage.removeItem("selectedTrain");
        localStorage.removeItem("travelData");
    }


    const genderOption = [
        {key: "Male", value: "Male", text: "Male"},
        {key: "Female", value: "Female", text: "Female"},
        {key: "Others", value: "Others", text: "Others"},
      ]
  
    const BerthOptiMiddle = [
        {key: "Lower", value: "Lower", text: "Lower"},
        {key: "Middle", value: "Middle", text: "Middle"},
        {key: "Upper", value: "Upper", text: "Upper"},
        {key: "Side-Lower", value: "Side-Lower", text: "Side-Lower"},
        {key: "Side-Upper", value: "Side-Upper", text: "Side-Upper"}
    ]

    const compartmentOptions = [
        {
            key:"general", value: "General Compartment", text: "General Compartment"
        },
        {
            key: "ac", value: "AC Compartment", text: "AC Compartment"
        }
    ]

    const addPassenger = (values) => {
        setOpen(true)
    }


    const handleTicketAmount = (data) => {
        if (data.age >= 3 && data.age <= 8) {
            if(data.compartment === 'General Compartment') {
                const ticketRate = ticketDetails.map((ele) => ele.general_comp_ticket_rate) * 0.50;
                return ticketRate;
            } else if (data.compartment === 'AC Compartment') {
                const ticketRate = ticketDetails.map((ele) => ele.ac_comp_ticket_rate) * 0.50;
                return ticketRate;
            }
        } else if (data.age >= 60) {
            if(data.compartment === 'General Compartment') {
                const ticketRate = ticketDetails.map((ele) => ele.general_comp_ticket_rate) * 0.50;
                return ticketRate;
            } else if (data.compartment === 'AC Compartment') {
                const ticketRate = ticketDetails.map((ele) => ele.ac_comp_ticket_rate) * 0.50;
                return ticketRate;
            }
        } else {
            if(data.compartment === 'General Compartment') {
                const ticketRate = ticketDetails.map((ele) => ele.general_comp_ticket_rate) * 1;
                return ticketRate;
            } else if (data.compartment === 'AC Compartment') {
                const ticketRate = ticketDetails.map((ele) => ele.ac_comp_ticket_rate) * 1;
                return ticketRate;
            }
        }
    }
    const selectedTrain = JSON.parse(localStorage.getItem('selectedTrain'));
    const travelData = JSON.parse(localStorage.getItem('travelData'));
    return (
        <>
            <Formik
              validationSchema={schema}
              enableReinitialize
              initialValues={initialValues}
              onSubmit={addPassenger}
            >
                {({ errors, touched, handleSubmit, setFieldValue, handleBlur, values }) => {
                    const handleChange = (e, { name, value }) => setFieldValue(name, value);
                    return (
                        <>
                        <div className="segmentHeader">
                            <Segment inverted className="segment">
                                <div className="headerContainer">
                                    <div className="titleHeader">
                                        <Icon className="backIcon" onClick={handleBack} size="big" name="arrow left" />
                                        <h2 className="addPassengerTittle">Add Passenger</h2>
                                    </div>
                                    <div className="homeContainer">
                                        <Icon className="homeIcon" name="home" size="large" onClick={handleRedirectToHome} />
                                    </div>
                                </div>
                            </Segment>
                            <div className="trainDetailsCard">
                                <Segment className="trainDetailsSegment">
                                    <div className="trainDetails">
                                        <h1>{selectedTrain.train_name}</h1>
                                        <div>
                                            {travelData.dateOfTravel}
                                        </div>
                                    </div>
                                    <div className="trainDetails">
                                        <span>{selectedTrain.from_station} <Icon name="angle double right" />{selectedTrain.dest_station}</span>
                                        <div>{selectedTrain.arrival_time} - {selectedTrain.departure_time}</div>
                                    </div>
                                </Segment>
                            </div>
                        </div>
                        
                        <div className="pdContainer">
                                <div className="formContainer">
                                    {values.passengerForm.map((ele, index) => (
                                        <>
                                            <div>
                                                <h4>Passenger {index + 1}</h4>
                                            </div>

                                            <div className="passengerForm">
                                                <div>
                                                    <label className='inputLabel'>Name</label>
                                                    <Form.Field
                                                        required
                                                        fluid
                                                        control={Input}
                                                        placeholder="Name"
                                                        value={ele.name}
                                                        name={`passengerForm.${index}.name`}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched
                                                            && touched.passengerForm
                                                            && touched.passengerForm[index]
                                                            && touched.passengerForm[index].name
                                                            && errors
                                                            && errors.passengerForm
                                                            && errors.passengerForm[index]
                                                            && errors.passengerForm[index].name} 
                                                    />
                                                </div>
                                                <div>
                                                    <label className='inputLabel'>Age</label>
                                                    <Form.Field
                                                        fluid
                                                        required
                                                        control={Input}
                                                        placeholder="Age"
                                                        name={`passengerForm.${index}.age`}
                                                        value={ele.age}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched
                                                            && touched.passengerForm
                                                            && touched.passengerForm[index]
                                                            && touched.passengerForm[index].age
                                                            && errors
                                                            && errors.passengerForm
                                                            && errors.passengerForm[index]
                                                            && errors.passengerForm[index].age} />
                                                </div>

                                                <div>
                                                    <label className='inputLabel'>Gender</label>
                                                    <Form.Field
                                                        required
                                                        fluid
                                                        control={Select}
                                                        options={genderOption}
                                                        placeholder="Gender"
                                                        value={ele.gender}
                                                        name={`passengerForm.${index}.gender`}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched
                                                            && touched.passengerForm
                                                            && touched.passengerForm[index]
                                                            && touched.passengerForm[index].gender
                                                            && errors
                                                            && errors.passengerForm
                                                            && errors.passengerForm[index]
                                                            && errors.passengerForm[index].gender} />
                                                </div>

                                                <div>
                                                    <label className='inputLabel'>Compartment</label>
                                                    <Form.Field
                                                        required
                                                        fluid
                                                        control={Select}
                                                        options={compartmentOptions}
                                                        placeholder="Compartment"
                                                        value={ele.compartment}
                                                        name={`passengerForm.${index}.compartment`}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched
                                                            && touched.passengerForm
                                                            && touched.passengerForm[index]
                                                            && touched.passengerForm[index].compartment
                                                            && errors
                                                            && errors.passengerForm
                                                            && errors.passengerForm[index]
                                                            && errors.passengerForm[index].compartment} />
                                                </div>

                                                <div>
                                                    <label className='inputLabel'>Berth Preference</label>
                                                    <Form.Field
                                                        required
                                                        fluid
                                                        control={Select}
                                                        options={BerthOptiMiddle}
                                                        placeholder="Berth"
                                                        value={ele.berth}
                                                        name={`passengerForm.${index}.berth`}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched
                                                            && touched.passengerForm
                                                            && touched.passengerForm[index]
                                                            && touched.passengerForm[index].berth
                                                            && errors
                                                            && errors.passengerForm
                                                            && errors.passengerForm[index]
                                                            && errors.passengerForm[index].berth} />
                                                </div>
                                                {initialValues.passengerForm.length > 1 &&
                                                    <div className="removeBtn">
                                                        <Button color="red" onClick={() => deletePassenger(index + 1)}><Icon name="remove user" />Remove</Button>
                                                    </div>
                                                }
                                            </div>
                                            <Divider />
                                        </>
                                    ))}

                                    <div className="Btn">
                                        {
                                            initialValues.passengerForm.length < 6 && (
                                                <>
                                                    <Button
                                                        content="Add Passenger"
                                                        labelPosition='right'
                                                        icon='add user'
                                                        onClick={() => addNewPassenger(values)}
                                                        color="orange" 
                                                    />
                                                </>
                                            )
                                        }
                                        
                                        <Button
                                            content="Proceed"
                                            labelPosition='right'
                                            icon='arrow right'
                                            onClick={handleSubmit}
                                            color="red" />
                                    </div>

                                    <Modal
                                        closeIcon
                                        onClose={() => setOpen(false)}
                                        onOpen={() => setOpen(true)}
                                        open={open}
                                    >
                                        <Modal.Header>Ticket Details</Modal.Header>
                                        <Modal.Content>
                                            <Modal.Description>
                                                <Header></Header>
                                                <Table celled>
                                                    <Table.Row>
                                                        <Table.HeaderCell>S.No</Table.HeaderCell>
                                                        <Table.HeaderCell>Name</Table.HeaderCell>
                                                        <Table.HeaderCell>Age</Table.HeaderCell>
                                                        <Table.HeaderCell>Gender</Table.HeaderCell>
                                                        <Table.HeaderCell>Compartment</Table.HeaderCell>
                                                        <Table.HeaderCell>Berth</Table.HeaderCell>
                                                        <Table.HeaderCell>Ticket Rate</Table.HeaderCell>
                                                    </Table.Row>
                                                    {values.passengerForm.map((ele, ind) => (
                                                        <Table.Row>
                                                            <Table.Cell>{ind + 1}</Table.Cell>
                                                            <Table.Cell>{ele.name}</Table.Cell>
                                                            <Table.Cell>{ele.age}</Table.Cell>
                                                            <Table.Cell>{ele.gender}</Table.Cell>
                                                            <Table.Cell>{ele.compartment}</Table.Cell>
                                                            <Table.Cell>{ele.berth}</Table.Cell>
                                                            <Table.Cell>
                                                                {handleTicketAmount(ele, ind)}
                                                            </Table.Cell>
                                                        </Table.Row>

                                                    ))}
                                                </Table>
                                                
                                                <div className="totalRate">
                                                    {
                                                        `Total Amount ₹${calculateTicketRate(values)}`
                                                    }
                                                </div>
                                                 
                                            </Modal.Description>
                                        </Modal.Content>
                                        <Modal.Actions>
                                            <Button
                                                content="Add Passenger"
                                                labelPosition='right'
                                                icon='add user'
                                                onClick={() => addNewPassenger(values)}
                                                color="orange" />
                                            <Button
                                                content="Book Tickets"
                                                labelPosition='right'
                                                icon='checkmark'
                                                onClick={() => handleBookTickets(values)}
                                                positive />
                                        </Modal.Actions>
                                    </Modal>
                                </div>
                            </div>
                        </>
                    )
                    
                }}

            </Formik>
        </>
    )
}
export default PassengerDetails;