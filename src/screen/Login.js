import React, { useState } from 'react';
import SignUp from './Sign-Up';
import { Button, Form, Image, Input, Segment }  from "semantic-ui-react";
import Logo from './MypayanamLogo.png';
import './Login.css';
import * as yup from 'yup';
import md5 from 'md5';
import { Formik } from 'formik';
import axios from "axios";
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const LoginForm = (props) => {
  const Location = useLocation();
  const { history } = props;
  const [role, setRole] = useState('')
  const [name, setName] = useState('')
  const [isLogin, setIsLogin] = useState(false)
  const [login, setLogin] = useState(true)
  const [signup, setSignUp] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [initialValues, setInitialValue] = useState({
    email: '',
    password: ''
  })

  // useEffect = (() => {
  //   const { match } = props;
  //   console.log(match);
  // }, [])

  const handleSignUp = () => {
    const { history } = props;
    setLogin(false)
    setSignUp(true)
    history.push("/sign-Up")
  }

  const handleSignIn = () => {
    const { history } = props;
    setLogin(true)
    setSignUp(false)
    history.push("/sign-In")
  }

  const schema = yup.object().shape({
    email: yup
          .string()
          .trim()
          .required("Email required")
          .email("Invalid Email format"),
    password: yup.string().required("Password required")
  });

  const handleAllowUser = (values) => {
    setInitialValue({
      ...values
    })
    axios.post("http://localhost:5000/signIn",
    {
      "email": values.email,
      "password": md5(values.password),
    }).then((response) => {
      if(response.data.role !== '-') {
        const userRole = response.data.data[0].role
        const useName = response.data.data[0].name
        const userMail = response.data.data[0].email

        setRole(userRole)
        setName(useName)
        setIsLogin(true)
        const userDetails = {
          "name": useName,
          "role": userRole,
          "email": userMail,
          "isLogin": true
        }
        localStorage.setItem('userDetail', JSON.stringify(userDetails));
        handlePageReDirect()
      } else {
        alert("Please Check your cerdentials")
      }
      
    }).catch((error) => {
      console.log('error', error)
    })
  }

  const handleFirstLogin = () => {
    setLogin(true)
    setSignUp(false)
  }

  const handlePageReDirect = () => {
    const { history } = props;
    history.push('/')
  }

  const handleIsAdmin = (role) => {
    role === 'user' ? setIsAdmin(false) : setIsAdmin(true)
  }

  const loginForm = (handleChange, handleBlur, values, touched, errors) => (
    <>
      <div>
      <label className='inputLabel'>E-mail</label>
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
      <label className='inputLabel'>Password</label>
      <Form.Field
        fluid
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
    </>
  )


  return (
    <>
      <div className='loginContainer'>
        <div className='logoDiv'>
          <Link to="/">
            <Image src={Logo} alt="logo" className='logoImage' />
          </Link>
        </div>
        
        <div className='inputFeild'>
          <Segment className='loginSegemt'>
          <div className='btnContainer'>
          <Button onClick={handleSignIn} active={login} color={login ? "green" : "grey"} className='signInBtn' basic>Sign-In</Button>
          <Button active={signup} onClick={handleSignUp} color={signup ? "green" : "grey"} className='signUpBtn' basic>Sign-Up</Button>
        </div>
        {
          login ? 
          <>
          <Formik
            validationSchema={schema}
            enableReinitialize
            initialValues={initialValues}
            onSubmit={handleAllowUser}
          >
            {({
                    handleSubmit, handleChange, handleBlur, values, touched, errors,
                }) => (
                  <>
                    {
                      loginForm(handleChange, handleBlur, values, touched, errors)
                    }
                    {/* <div className='askRole'>
                      {!isAdmin ? 
                        <span className='askAdmin' onClick={() => handleIsAdmin('admin')}>Login as Admin</span> : 
                        <span className='askUser' onClick={() => handleIsAdmin('user')}>Login as User</span>
                      }
                      
                    </div> */}
                    <div className="loginBtn">
                      <Button color="green" onClick={() => handleSubmit(values)}>Sign-In</Button>
                    </div>
                  </>
                )}
          </Formik>
          
          </> 
          :
          <>
            <SignUp 
              history={history}
              handleFirstLogin = {handleFirstLogin}
            />
          </>
        }
            
          </Segment>
        </div>
      </div>
    </>
  )  
}

export default LoginForm