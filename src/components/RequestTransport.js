import { Formik } from "formik";
import * as yup from 'yup';
import React, { useState } from "react";
import './RequestTransport.css'
import { Button, Form, Input, Select } from "semantic-ui-react";
import axios from 'axios';
 
const RequestTransport = () => {
    const [initialValues, setInitialValue] = useState({
                fromStation: '',
                destStation: '',
                arrivalTime: null,
                deptTime: null,
    })
    const schema = yup.object().shape({
        fromStation: yup.string().trim().required("Required From Station"),
        destStation: yup.string().trim().required("Required Destination Station"),
        arrivalTime: yup.string().trim().required('Time isRequired'),
        deptTime: yup.string().trim().required('Time isRequired')

    })
    const handleRequestTrain = (values) => {
        const userDetails = JSON.parse(localStorage.getItem('userDetail'));
        axios.post('http://localhost:5000/requestTrains', {
            username: userDetails.name,
            fromStation: values.fromStation,
            destStation: values.destStation,
            arrivalTime: values.arrivalTime,
            departureTime: values.deptTime
        }).then((response) => {
            console.log('response', response)
        }).catch((error) => {
            console.log('error', error)
        })
    }

    // const station = ["Ariyalur", "Chengalpet", "Chennai", "Coimbatore",
    // "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kancheepuram", "Karur",
    // "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Kanyakumari", "Namakkal",
    // "Perambalur", "Pudukottai", "Ramanathapuram", "Ranipet", "Salem", "Sivagangai", "Tenkasi", "Thanjavur",
    // "Theni", "Thiruvallur", "Thiruvarur", "Tuticorin", "Tiruchirappalli", "Thirunelveli", "Tirupathur",
    // "Tiruppur", "Tiruvannamalai", "Nilgiris", "Vellore", "Viluppuram", "Virudhunagar"
    // ]

    // const fromStationOptions = station.map((ele) => (
    //     [
    //         { key: ele, value: ele, text: ele }
    //     ]
    // ))
    return (
        <>
            <Formik
                validationSchema={schema}
                enableReinitialize
                initialValues={initialValues}
                onSubmit={handleRequestTrain}
            >
                {({ errors, touched, setFieldValue, handleSubmit, handleBlur, values }) => {
                    const handleChange = (e, { name, value }) => setFieldValue(name, value)
                    return (
                        <>
                            <Form className="requestFormPage">
                                <div className="requestForm">
                                    <div>
                                        <label className='inputLabel'>From</label>
                                        <Form.Field
                                            required
                                            control={Input}
                                            placeholder="From.."
                                            value={values.fromStation}
                                            name="fromStation"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.fromStation && errors.fromStation} 
                                        />
                                    </div>
                                    <div>
                                        <label className='inputLabel'>To</label>
                                        <Form.Field
                                            required
                                            control={Input}
                                            placeholder="To..."
                                            value={values.destStation}
                                            name="destStation"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.destStation && errors.destStation} 
                                        />
                                    </div>

                                    <div>
                                        <label className='inputLabel'>Prefer Arrival Time</label>
                                        <Form.Field
                                            type="time"
                                            required
                                            control={Input}
                                            value={values.arrivalTime}
                                            name="arrivalTime"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.arrivalTime && errors.arrivalTime} 
                                        />
                                    </div>

                                    <div>
                                        <label className='inputLabel'>Prefer Departure Time</label>
                                        <Form.Field
                                            type="time"
                                            required
                                            control={Input}
                                            value={values.deptTime}
                                            name="deptTime"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.deptTime && errors.deptTime} 
                                        />
                                    </div>
                                    <div className="submitButton">
                                        <Button color="green" onClick={handleSubmit}>Submit</Button>
                                    </div>
                                </div>
                                
                            </Form>
                        </>
                    )
                }}
            </Formik>
        </>
    )
}
export default RequestTransport;