import { Route, Routes } from "react-router-dom"
import Events from "./components/Events/Events"
import Navbar from "./components/Navbar/Navbar"
import MyEvents from "./components/MyEvents/MyEvents"
import Admin from "./components/Admin/Admin"
import {message} from 'antd';
import EventContext from "./context/EventContext"

const App = () => {

  const [messageApi, contextHolder] = message.useMessage();






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

}

  return (
    <EventContext.Provider value={data}>
    <div className="bg-dark-800">
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
