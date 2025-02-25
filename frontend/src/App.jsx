import { Route, Routes } from "react-router-dom"
import Events from "./components/Events/Events"
import Navbar from "./components/Navbar/Navbar"
import MyEvents from "./components/MyEvents/MyEvents"
import Admin from "./components/Admin/Admin"
import {message} from 'antd';
import EventContext from "./context/EventContext"
import { useEffect, useState } from "react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios"



const App = () => {

  const [messageApi, contextHolder] = message.useMessage();

 const [user,setUser]=useState(null);
const [accessToken,setAccessToken]=useState(null);



const success = (msg) => {
  messageApi.open({
    type: 'success',
    content: msg,
  });
};
const error = (msg) => {
  messageApi.open({
    type: 'error',
    content: msg,
  });
};


const data={
  success,
  error,
  contextHolder,
  user,
  setUser,
  accessToken,
  setAccessToken

}


useEffect(()=>{


const getUser=async ()=>{

const token=localStorage.getItem('accessToken');
console.log(token);
if(token!=null){
  setAccessToken(token);

  const result= await axios.get(import.meta.env.VITE_BACKEND_URL+'/user/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  setUser(result.data);
}

}

getUser();

},[])


  return (
    <EventContext.Provider value={data}>
    <div className="bg-dark-800">
      <ToastContainer/>
      <Navbar fix/>
      <Navbar/>
      <Routes>
        <Route exact path="/home" element={<Events/>}/>
        <Route exact path="/my-account" element={<MyEvents/>}/>
        <Route exact path="/admin" element={<Admin/>}/>
       
      </Routes>
    </div>
    </EventContext.Provider>
  )
}

export default App
