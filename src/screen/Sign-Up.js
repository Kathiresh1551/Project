import React, { useState } from "react";
import { Button, Form, Input } from "semantic-ui-react";
import * as yup from 'yup';
import md5 from 'md5';
import { Formik } from 'formik';
import axios from "axios";

const SignUp = (props) => {
    const [ initialValues, setInitialValue ] = useState({
        email: '',
        name: '',
        password: '',
        reEnterPassword: '',
        mobileNumber: '',
    });

    const schema = yup.object().shape({
        name: yup.string().trim().required("Required Name"),
        email: yup
              .string()
              .trim()
              .required("Email required")
              .email("Invalid Email format"),
        password: yup.string().required("Password required")
          .min(8, 'Password is too short - should be 8 chars minimum.')
          .matches(/[a-zA-Z0-9]/, 'Password can only contain Latin letters.'),
        reEnterPassword:  yup.string().required("Re-enter password required"),
        mobileNumber: yup
            .number()
            .typeError('Invalid Mobile Number')
            .required('Mobile Number is required')
            .test(
              'Invalid Mobile Number',
              (value) => value && value.toString().length === 10,
            ),
      });
    
    const errorToast = () => {
        alert("Password not matching")
    }

    const saveUserDetails = (values) => {
        const { handleFirstLogin, history } = props;
        setInitialValue({
            ...values
        })
        console.log(values);
        if (values.password === values.reEnterPassword) {
            const { name, email, password, mobileNumber} = values;
            console.log(name);
            axios.post("http://localhost:5000/signUp",
            {
                "name": name,
                "email": email,
                "role": "user",
                "password": md5(password),
                "mobileNumber": mobileNumber
            }).then((response) => {
                console.log(response);
                if (response.data.estatus === true && response.data.emessage === "success"){
                    handleFirstLogin();
                    history.push('/sign-In');
                }
            })
            .catch((error) => {
                console.log('error', error);
            })
        } else {
            errorToast()
            console.log('password not match')
        }

    }
    return (
        <>
            <Formik
                validationSchema={schema}
                enableReinitialize
                initialValues={initialValues}
                onSubmit={saveUserDetails}
            >
                {({
                    handleSubmit, handleChange, handleBlur, values, touched, errors,
                }) => (
                    <>
                        <Form>
                            <div>
                                <label className='inputLabel'>Email</label>
                                <Form.Field
                                    required
                                    fluid
                                    control={Input}
                                    placeholder="E-mail"
                                    value={values.email}
                                    name='email'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.email && errors.email}
                                />
                            </div>
                            <div>
                                <label className='inputLabel'>Name</label>
                                <Form.Field
                                    required
                                    control={Input}
                                    placeholder="Name"
                                    name='name'
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.name && errors.name}
                                />
                            </div>
                            <div>
                                <label className='inputLabel'>Mobile</label>
                                <Form.Field
                                    required
                                    control={Input}
                                    placeholder="Mobile No"
                                    name="mobileNumber"
                                    value={values.mobileNumber}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.mobileNumber && errors.mobileNumber}
                                />
                            </div>
                            <div>
                                <label className='inputLabel'>Password</label>
                                <Form.Field
                                    required
                                    type="password"
                                    control={Input}
                                    placeholder="Password"
                                    name='password'
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.password && errors.password}
                                />
                            </div>
                            <div>
                                <label className='inputLabel'>Re-enter Password</label>
                                <Form.Field
                                    required
                                    type="password"
                                    control={Input}
                                    placeholder="reEnterPassword"
                                    name='reEnterPassword'
                                    value={values.reEnterPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.reEnterPassword && errors.reEnterPassword}
                                />
                            </div>
                            <div className="loginBtn">
                                <Button
                                    color="green"
                                    onClick={() => handleSubmit(values)}
                                >
                                    Sign-Up
                                </Button>
                            </div>
                        </Form>
                    </>
                )}
                
            </Formik>
        </>
    )
}
export default SignUp;