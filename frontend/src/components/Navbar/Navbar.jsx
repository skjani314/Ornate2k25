import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa"; 
import { Link } from "react-router-dom";
import { Modal } from "antd";
import LogIn from "./LogIn";

const navList = [
  { id: "HOME", displayText: "Home" },
  { id: "MY-ACCOUNT", displayText: "My Account" },
];

const Navbar = (props) => {
  const {fix}=props;
  const [isOpen, setIsOpen] = useState(false); 
  const [isModel,setModel]=useState(false);
  const [otpform, setOtpform] = useState(false);


  const handleCancel=()=>{
    setModel(false);
    setOtpform(false);
  }

  return (
    <nav className={`bg-gradient-to-r from-indigo-500 to-indigo-400 p-3 w-full ${fix && 'fixed top-0 left-0 z-10'}`}>
      <div className="flex justify-between items-center max-w-7xl mx-auto">
     
        <div className="flex items-center">
         <Link to="/home">
         <img
            className="h-[50px] w-auto mr-4 cursor-pointer"
            alt="nav-logo"
            src="https://res.cloudinary.com/dsad92ak9/image/upload/j33zalyizg3ebqpgg9nn"
          />
         </Link>   
          <h1 className="text-white font-bold text-2xl">TechZeon</h1>
        </div>

    
        
    <ul className="hidden md:flex space-x-6 flex items-center">
          {navList.map((each) => (
           <NavLink
           key={each.id}
           to={`/${each.id.toLowerCase()}`}
           className=
             'text-white font-semibold'
         >
           {each.displayText}
           <hr className='border-none outline-none h-0.5 w-4/5 bg-white m-auto hidden'/>
         </NavLink>
        
          ))}
          <button  onClick={()=>setModel(true)} className="hidden md:block bg-green-500 p-2 text-white rounded-xl w-[80px] hover:bg-white hover:text-green-600 font-bold">
          Login
        </button>
        </ul>       
       
  

   
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
        </button>
      </div>

    
      {isOpen && (
        <div className="md:hidden flex flex-col items-center mt-3 space-y-3 bg-indigo-500 p-4 rounded-lg shadow-lg">
          {navList.map((each) => (
            <NavLink
              key={each.id}
              className="text-white font-semibold text-lg"
              onClick={() => setIsOpen(false)}
              to={`/${each.id.toLowerCase()}`}
            >
              {each.displayText}
              <hr className='border-none outline-none h-0.5 w-4/5 bg-white m-auto hidden'/>
            </NavLink>
          ))}
          <button  className="bg-green-500 p-2 text-white rounded-xl w-[80px] hover:bg-white hover:text-green-600 font-bold">
            Login
          </button>
        </div>
      )}

      <Modal footer={null} onCancel={handleCancel} open={isModel}>
       <LogIn otpform={otpform} setOtpform={setOtpform} handleCancel={handleCancel} />
      </Modal>
    </nav>
  );
};

export default Navbar;
