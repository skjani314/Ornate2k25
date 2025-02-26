import { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Modal } from "antd";
import LogIn from "./LogIn";
import EventContext from "../../context/EventContext";
import { useNavigate } from "react-router-dom";
import { Input, Space } from "antd";


const { Search } = Input;
const navList = [
  { id: "HOME", displayText: "Home" },
  { id: "MY-ACCOUNT", displayText: "My Account" },
];

const Navbar = (props) => {
  const { fix } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [isModel, setModel] = useState(false);
  const [otpform, setOtpform] = useState(false);
  const { user, accessToken, setAccessToken, setMySevents, setUser, setIsSearchActive, isSearchActive, events, setSearchEvents } = useContext(EventContext);
  const [search_suggest, setSearchSuggest] = useState([]);
  const [search_value, setSearch_value] = useState("");
  const navigate = useNavigate();
  const handleCancel = () => {
    setModel(false);
    setOtpform(false);
  }

  const onSearch = (value) => {
    navigate("/home/?event=" + search_value);
    setSearchSuggest([]);
    setSearch_value("");
    setIsSearchActive(false)
  };
  const onSearchChange = (e) => {
    setSearch_value(e.target.value);
    if (e.target.value != "") {

      const result = events.filter((item) =>
        item.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setSearchSuggest(result);
      console.log(events);

    }
    else {
      setSearchSuggest([]);
    }

  }
  const handleSearchClick = () => {


    navigate("/home/?event=" + search_value);
    setSearchSuggest([]);
    setSearch_value("");
    setIsSearchActive(false)

  }




  return (
    <nav className={`bg-gradient-to-r from-indigo-500 to-indigo-400 p-3 w-full ${fix && 'fixed top-0 left-0 z-10'}`}>
      <div className="flex justify-between items-center w-full mx-auto">

        <div className="flex justify-between items-center gap-12 w-2/3">
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


          <Space direction="vertical" style={{ width: "300px" }} className="hidden sm:flex">
            <Search
              placeholder="Input search text"
              allowClear
              enterButton="Search"
              size="large"
              onSearch={onSearch}
              onChange={onSearchChange}
              value={search_value}
            />
            {
              search_suggest.length > 0 ?
                <div style={{ position: 'fixed', top: '55px', }} className="bg-gray-300 rounded text-white p-1 w-1/3">
                  {
                    search_suggest.map((each, index) => (
                      <div onClick={handleSearchClick} key={index} className="w-full my-1 bg-gray-800 px-2 py-2 rounded-lg">

                        <p>{each.name}</p>
                      </div>
                    ))
                  }
                </div> : null
            }

          </Space>
        </div>
        <div>

          <ul className="hidden md:flex space-x-6 flex items-center">
            {navList.map((each) => (
              <NavLink
                key={each.id}
                to={`/${each.id.toLowerCase()}`}
                className=
                {`text-white font-semibold`}
              >
                {each.displayText}
                <hr className='border-none outline-none h-0.5 w-4/5 bg-white m-auto hidden' />
              </NavLink>

            ))}
            {user === null ?
              <button onClick={() => setModel(true)} className="hidden md:block bg-green-500 p-2 text-white rounded-xl w-[80px] hover:bg-white hover:text-green-600 font-bold">
                Login
              </button>
              : <button onClick={() => { setAccessToken(null); localStorage.removeItem('accessToken'); setUser(null); navigate('/home'); setMySevents([]); }} className="hidden md:block bg-green-500 p-2 text-white rounded-xl w-[80px] hover:bg-white hover:text-green-600 font-bold">
                Logout
              </button>
            }


          </ul>
        </div>

        <div className="flex items-center">
          <div className="sm:hidden text-white mr-3 text-xl">
            <FaSearch onClick={() => setIsSearchActive((prev) => !prev)} />
          </div>
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
          </button>
        </div>

      </div>
      {
        isSearchActive &&
        <div className="md:hidden flex flex-col items-center mt-3 space-y-3 bg-indigo-500 p-4 rounded-lg shadow-lg">

          <div className="sm:hidden text-center mt-5">
            <Space direction="vertical" className="w-full" >
              <Search
                placeholder="Input search text"
                allowClear
                enterButton="Search"
                size="large"
                onSearch={onSearch}
                onChange={onSearchChange}
                value={search_value}
              />
              {
                search_suggest.length > 0 ?
                  <div style={{ position: 'fixed', top: '158px', }} className="bg-gray-300 rounded text-white p-1 w-1/3">
                    {
                      search_suggest.map((each, index) => (
                        <div onClick={handleSearchClick} key={index} className="w-full my-1 bg-gray-800 px-2 py-2 rounded-lg">

                          <p>{each.name}</p>
                        </div>
                      ))
                    }
                  </div> : null
              }

            </Space>
          </div>
        </div>
      }

      {isOpen && (
        <div className="md:hidden flex flex-col items-center mt-3 space-y-3 bg-indigo-500 p-4 rounded-lg shadow-lg">
          {navList.map(({ id, displayText }) => (
            <NavLink
              key={id}
              to={`/${id.toLowerCase()}`}
              className="text-white font-semibold text-lg"
              onClick={() => setIsOpen(false)}
            >
              {displayText}
              <hr className="border-none outline-none h-0.5 w-4/5 bg-white m-auto hidden" />
            </NavLink>
          ))}


          {user ? (
            <button
              onClick={() => {
                setAccessToken(null);
                localStorage.removeItem("accessToken");
                setUser(null);
                setIsOpen(false);
                navigate("/home");
              }}
              className="bg-green-500 p-2 text-white rounded-xl w-[80px] hover:bg-white hover:text-green-600 font-bold"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => {
                setModel(true);
                setIsOpen(false);
              }}
              className="bg-green-500 p-2 text-white rounded-xl w-[80px] hover:bg-white hover:text-green-600 font-bold"
            >
              Login
            </button>
          )}
        </div>
      )}
      <Modal footer={null} onCancel={handleCancel} open={isModel}>
        <LogIn otpform={otpform} setOtpform={setOtpform} handleCancel={handleCancel} />
      </Modal>
    </nav>
    
  );
};

export default Navbar;
