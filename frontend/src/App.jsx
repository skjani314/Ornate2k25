import { Route, Routes } from "react-router-dom"
import Events from "./components/Events/Events"
import Navbar from "./components/Navbar/Navbar"
import MyEvents from "./components/MyEvents/MyEvents"
import Admin from "./components/Admin/Admin"

const App = () => {
  return (
    <div className="bg-dark-800">
      <Navbar fix/>
      <Navbar/>
      <Routes>
        <Route exact path="/home" element={<Events/>}/>
        <Route exact path="/my-account" element={<MyEvents/>}/>
        <Route exact path="/admin" element={<Admin/>}/>
      </Routes>
    </div>
  )
}

export default App
