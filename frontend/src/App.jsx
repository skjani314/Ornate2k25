import { Route, Routes } from "react-router-dom"
import Events from "./components/Events/Events"
import Navbar from "./components/Navbar/Navbar"
import MyEvents from "./components/MyEvents/MyEvents"
import Admin from "./components/Admin/Admin"
import { message } from 'antd';
import EventContext from "./context/EventContext"
import { useEffect, useState } from "react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import UnauthorizedPage from "./components/unauthorized/UnautherizedPage"
import Forgotpass from "./components/Navbar/ForgetPass"


const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};


const App = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : '');

  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [eventDetails, setEventDetails] = useState([]);
  const [soloEventDetails, setSoloEventDetails] = useState([]);
  const [my_events, setMySevents] = useState([]);
  const [isSearchActive,setIsSearchActive]=useState(false);




  const getEventDetails = async () => {
    setApiStatus(apiStatusConstants.inProgress)
    const token = localStorage.getItem('accessToken');

    try {
      const url = import.meta.env.VITE_BACKEND_URL + "/user/myevents/";
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });

      setEventDetails(response.data.team);
      setSoloEventDetails(response.data.solo);
      setApiStatus(apiStatusConstants.success);
      setMySevents(response.data.my_events);

    } catch (err) {
      console.error("Error fetching events:", err);
      setApiStatus(apiStatusConstants.failure);
    }

  };

  useEffect(() => {
    getEventDetails();
  }, [accessToken]);


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
  setAccessToken,
  apiStatus,
  eventDetails,
  soloEventDetails,
 setIsSearchActive,
 isSearchActive,
 getEvents: getEventDetails,
 my_events
}


  useEffect(() => {


    const getUser = async () => {

      const token = localStorage.getItem('accessToken');
      console.log(token);
      if (token != null) {
        setAccessToken(token);

        const result = await axios.get(import.meta.env.VITE_BACKEND_URL + '/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setUser(result.data);
        console.log(result.data);
      }

    }

    getUser();

  }, [])


  return (
    <EventContext.Provider value={data}>
      <div className="bg-dark-800">
        <ToastContainer />
        <Navbar fix />
        <Navbar />
        <Routes>
          <Route exact path="/home" element={<Events />} />
          <Route exact path="/my-account" element={<MyEvents />} />
          <Route path='/forgot/:token' element={<Forgotpass />} />
          <Route exact path="/admin" element={user && user.role == 'organizer' ? <Admin /> : <UnauthorizedPage />} />

        </Routes>
      </div>
    </EventContext.Provider>
  )
}

export default App
