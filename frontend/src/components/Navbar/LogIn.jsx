

import { Button, Input, Spin } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import './login.css';
import axios from 'axios';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Navigate, useNavigate } from 'react-router-dom';
import EventContext from '../../context/EventContext';

function LogIn(props) {
  const [loading, setLoading] = useState(false);
  const [FormFlag, setFormFlag] = useState('reg');
  const [FormData, setFormData] = useState({ name: '', email: '', password: '', cpassword: '', mobile: '' });
  const [LogData, setLogdata] = useState({ email: '', password: '' });
  const [psicon, setPsicon] = useState(false);
  const [ValData, setValData] = useState({ name: true, email: true, password: true, cpassword: true, mobile: true });
  const [plen, setPlen] = useState(false);
  const [lcase, setLcase] = useState(false);
  const [ucase, setUcase] = useState(false);
  const [dig, setDig] = useState(false);
  const [spc, setSpc] = useState(false);
  const { user, setUser, success, error, contextHolder, setAccessToken } = useContext(EventContext);
  const [forgetpass, setForgetPass] = useState({ email: '', flag: false });
  const { otpform, setOtpform } = props;
  const navigate = useNavigate();
  const [role, setRole] = useState("student");






  const onChange = async (text) => {

    try {

      setLoading(true);


      const user = await axios.post(import.meta.env.VITE_BACKEND_URL + '/user/auth/register', { ...FormData, otp: text })
      success("Account Created successfully");
      setFormData({ name: '', email: '', password: '', cpassword: '', mobile: '' })
      setLoading(false);
      setOtpform(false);


    } catch (err) {
      setLoading(false);
      error("OTP Wrong");
    }

  };


  const sharedProps = {
    onChange,
  };


  useEffect(() => {
    const signUpButton = document.getElementById('sign-up-button');
    const logInButton = document.getElementById('log-in-button');
    const signUpForm = document.getElementById('sign-up-form');
    const logInForm = document.getElementById('log-in-form');


    if (signUpButton && logInButton && signUpForm && logInForm) {
      if (FormFlag !== 'reg') {
        logInButton.classList.add('active');
        signUpButton.classList.remove('active');
        signUpForm.style.display = 'none';
        logInForm.style.display = 'block';
        setPsicon(false);
        setLogdata({ email: '', password: '' });
        setValData({
          name: true,
          email: true,
          password: true,
          cpassword: true,
          mobile: true,

        });
      } else {
        signUpButton.classList.add('active');
        logInButton.classList.remove('active');
        logInForm.style.display = 'none';
        signUpForm.style.display = 'block';
        setPsicon(false);
        setFormData({ name: '', email: '', password: '', cpassword: '', mobile: '' });
        setValData({
          name: true,
          email: true,
          password: true,
          cpassword: true,
          mobile: true,

        });
      }
    }
  }, [FormFlag, otpform]);


  const handleFormData = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));

    if (value != '') {
      switch (name) {
        case 'name':
          const isValidName = /^[A-Za-z ]{2,}$/.test(value);
          setValData(prev => ({ ...prev, [name]: isValidName }));
          break;
        case 'email':
          const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          setValData(prev => ({ ...prev, email: isValidEmail }));
          break;
        case 'password':
          setValData(prev => ({ ...prev, password: false }));
          setPlen(/^.{8,20}$/.test(value));
          setUcase(/[A-Z]/.test(value));
          setLcase(/[a-z]/.test(value));
          setDig(/[0-9]/.test(value));
          setSpc(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value));
          setValData(prev => ({ ...prev, password: /^.{8,20}$/.test(value) && /[A-Z]/.test(value) && /[a-z]/.test(value) && /[0-9]/.test(value) && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value) }));
          break;
        case 'cpassword':
          setValData(prev => ({ ...prev, cpassword: value === FormData.password }));
          break;
        case 'mobile':
          const isValidMobile = /^\d{10}$/.test(value);
          setValData(prev => ({ ...prev, mobile: isValidMobile }));
          break;
        default:
          break;
      }
    } else {
      setValData(prev => ({ ...prev, [name]: true }));
    }

  };

  const showForget = () => {
    setOtpform(true);
    setForgetPass((prev) => ({ ...prev, flag: true }));
  }

  const handleLogData = (e) => {
    const { name, value } = e.target;
    setLogdata({ ...LogData, [name]: value })

  }

  const handleRegSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (ValData.name && ValData.email && ValData.password && ValData.cpassword && ValData.mobile) {
      setFormData((prev) => ({ ...prev }));
      try {
        const isOtpSent = await axios.post(import.meta.env.VITE_BACKEND_URL + '/user/auth/send-otp', { email: FormData.email })
        setLoading(false);
        setOtpform(true);
        setForgetPass(false);
        success("OTP sent successfully");

      } catch (err) {
        console.log(err);
        error("User Already Found or something wentwrong");
        setLoading(false);
      }

    }
    else {

      error("Fill All the Required Files");
      setLoading(false);
    }



  };

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {

      if (role !== "organizer") {
        const token = await axios.post(import.meta.env.VITE_BACKEND_URL + '/user/auth/login', LogData)
        localStorage.setItem("accessToken", token.data);
        const result = await axios.get(import.meta.env.VITE_BACKEND_URL + '/user/profile', {
          headers: {
            Authorization: `Bearer ${token.data}`,
            "Content-Type": "application/json",
          },
        });
        setUser(result.data);
        console.log(result.data)
        setLogdata({ email: '', password: '' });
        setAccessToken(token);

        props.handleCancel();
        setLoading(false);


        success("Logged In successfully");
      }
      else {
        const token = await axios.post(import.meta.env.VITE_BACKEND_URL + '/user/auth/ologin', LogData);
        localStorage.setItem("accessToken", token.data);
        const result = await axios.get(import.meta.env.VITE_BACKEND_URL + '/user/profile', {
          headers: {
            Authorization: `Bearer ${token.data}`,
            "Content-Type": "application/json",
          },
        });

        setUser({ ...result.data, role: "organizer" });
        setAccessToken(token);

        navigate('/admin');
        setLogdata({ email: '', password: '' });


        props.handleCancel();
        setLoading(false);


        success("Logged In successfully");
      }




    } catch (err) {
      error("Invalid Credentials");
      console.log(err);
      setLoading(false);

    }

  }

  const handleForgetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await axios.post(import.meta.env.BACKEND_URL + '/forget', { email: forgetpass.email })
      success("Reset Link sent to Mail Successfully");
      setLoading(false);
      setForgetPass({ email: '', flag: false });
      setOtpform(false);
      props.handleModalCancel();

    } catch {
      error("User not found");
      setLoading(false);

    }


  }

  return (
    <>
      {contextHolder}
      <Spin tip="Loading...." size='large' spinning={loading}>
        {
          (!otpform) ?
            <div className="fcontainer mt-4">
              <div className="flex mx-1">
                <div
                  className="sign-up active w-1/2 text-center cursor-pointer"
                  id="sign-up-button"
                  onClick={() => setFormFlag('reg')}
                >
                  <p className="sign-up-header">Sign Up</p>
                </div>
                <div
                  className="log-in w-1/2 text-center cursor-pointer"
                  id="log-in-button"
                  onClick={() => setFormFlag('')}
                >
                  <p className="log-in-header">Log In</p>
                </div>
              </div>

              <form id="sign-up-form" onSubmit={handleRegSubmit} method='POST'>
                <div className="header">
                  <h1>Sign Up for Free</h1>
                </div>

                <input className="first-name" name='name' type="text" placeholder="Enter Your Name*" required value={FormData.name} onChange={handleFormData} />
                {!ValData.name ? <p>First name should be greater than one letter and Have No numbers</p> : null}
                <input type="email" name='email' placeholder="Email Address*" required value={FormData.email} onChange={handleFormData} />
                {!ValData.email ? <p>Email should contain @ and . symbols</p> : null}

                <input type="text" name='mobile' placeholder="Mobile Number*" required value={FormData.mobile} onChange={handleFormData} />

                {!ValData.mobile ? <p>Mobile Number should contain 10 digits</p> : null}

                <div style={{ position: 'relative' }}> <input type={!psicon ? 'password' : 'text'} name='password' placeholder="Your password*" required value={FormData.password} onChange={handleFormData} />{' '}{psicon ? <FaEyeSlash className='passicon' onClick={() => { setPsicon(!psicon); }} /> : <FaEye className='passicon' onClick={() => { setPsicon(!psicon) }} />}</div>
                {!ValData.password && !plen ? <p>Password must be between 8 and 20 characters long.</p> : null}
                {!ValData.password && !lcase ? <p>"Password must include at least one lowercase letter."</p> : null}

                {!ValData.password && !ucase ? <p>Password must include at least one uppercase letter.</p> : null}
                {!ValData.password && !dig ? <p>"Password must include at least one digit."</p> : null}
                {!ValData.password && !spc ? <p>"Password must include at least one special character."</p> : null}

                <input type={!psicon ? 'password' : 'text'} name='cpassword' placeholder="confirm password*" required value={FormData.cpassword} onChange={handleFormData} />
                {!ValData.cpassword ? <p>Password And Confirm Password Should be same</p> : null}
                <label><input type='checkbox' name='cbox'></input>{' '}By Registering,you confirm that you accept our <a>Terms</a> of Uses and <a>Privacy Policy</a> </label>
                <button id="sign-up-submit">Register</button>
              </form>
              <form id="log-in-form" onSubmit={handleLogSubmit} method='POST'>
                <div className="header">
                  <h1>Welcome back!</h1>
                </div>
                <div className='radio-buttons d-flex justify-content-around'>
                  <label className='mt-1'>I AM </label>
                  <label><input type="radio" name="role" value="student" checked={role === "student"} onClick={(e) => setRole(e.target.value)} />{" "}Student</label>
                  <label> <input type="radio" name="role" value="organizer" checked={role === "organizer"} onClick={(e) => setRole(e.target.value)} />{" "}Organizer</label>
                </div>
                <input className="email" name='email' type="email" placeholder="Email Address*" required value={LogData.email} onChange={handleLogData} />
                <div style={{ position: 'relative' }}> <input type={!psicon ? 'password' : 'text'} name='password' placeholder="Your password*" required value={LogData.password} onChange={handleLogData} />{' '}{psicon ? <FaEyeSlash className='passicon' onClick={() => { setPsicon(!psicon); }} /> : <FaEye className='passicon' onClick={() => { setPsicon(!psicon) }} />}</div>

                <div className="password" onClick={showForget}>
                  Forgot Password?
                </div>
                <button id="log-in-submit mb-6">Log in</button><br></br>
                <center>If you Are Not Registered,Please <a>Sign Up</a></center>
              </form>

            </div>
            :
            (!forgetpass.flag) ?
              <div>
                <p className='fs-4'>Enter the OTP sent to your Mail {FormData.email.slice(0, 5)}....</p>
                <center> <Input.OTP length={6} {...sharedProps} /><br />
                  <Button onClick={() => { setOtpform(false); }} className='mt-3' type='primary'>Back To register</Button>
                </center>
              </div> :
              <div className='fcontainer mt-4'>
                <form method='POST' onSubmit={handleForgetSubmit}>
                  <div className="header">
                    <h1>Reset Password</h1>
                  </div>
                  <input className="email" name='email' type="email" placeholder="Email Address*" value={forgetpass.email} onChange={(e) => { setForgetPass((prev) => ({ ...prev, email: e.target.value })) }} required />
                  <button id="log-in-submit mb-6">Send Reset Link</button><br></br>
                </form>
              </div>
        }</Spin>
    </>
  );
}

export default LogIn;
