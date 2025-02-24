import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa"; 

const navList = [
  { id: "HOME", displayText: "Home" },
  { id: "MYEVENTS", displayText: "My Events" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); 

  return (
    <nav className="bg-gradient-to-r from-indigo-500 to-indigo-400 p-3">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
     
        <div className="flex items-center">
          <img
            className="h-[50px] w-auto mr-4"
            alt="nav-logo"
            src="https://res.cloudinary.com/dsad92ak9/image/upload/j33zalyizg3ebqpgg9nn"
          />
          <h1 className="text-white font-bold text-2xl">TechZeon</h1>
        </div>

    
        
    <ul className="hidden md:flex space-x-6 flex items-center">
          {navList.map((each) => (
            <NavLink
              key={each.id}
              to={`/${each.id.toLowerCase()}`}
              className="text-white font-semibold"
            >
              {each.displayText}
            </NavLink>
          ))}
          <button className="hidden md:block bg-green-500 p-2 text-white rounded-xl w-[80px] hover:bg-white hover:text-blue-600 font-bold">
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
            >
              {each.displayText}
            </NavLink>
          ))}
          <button className="bg-green-500 p-2 text-white rounded-xl w-[80px] hover:bg-white hover:text-blue-600 font-bold">
            Login
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
