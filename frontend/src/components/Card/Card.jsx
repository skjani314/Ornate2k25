import { Modal } from "antd"; 
import { toast } from 'react-toastify';
import { useContext, useState } from "react";
import EventContext from "../../context/EventContext";
import axios from "axios";

const Card = ({ event, id, register, admin }) => {
  const { user, accessToken } = useContext(EventContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [newTeam, setNewTeam] = useState(false);
  const [teamName,setTeamName]=useState("");

  const handleCreateTeam = async(e) => {
    e.preventDefault();
    if (!teamName.trim()) {
      toast.error("Team name cannot be empty");
      return;
    }
    try{
      const url=import.meta.env.VITE_BACKEND_URL+'/register/team/create/';
    const response=await axios.post(url,{event_id:event._id,team_name:teamName},{headers:{
      Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
    }})
    console.log(response);
    }
    catch(error){
      console.log(error);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setIsModalOpen(false);
  };

  const handleTeamCancel = (e) => {
    e.stopPropagation();
    setIsTeamModalOpen(false);
  };

  const individualRegister = async () => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + '/register/soloregister/',
        { event_id: id },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        toast.success('Registration successful');
      } else {
        toast.error(response.data.error || 'Registration failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'An error occurred');
    }
  };

  const teamRegister = () => {
    setIsTeamModalOpen(true);
  };

  const handleRegister = (e) => {
    e.stopPropagation();

    if (!accessToken) {
      toast.error("Please Login To Register");
      return;
    }

    if (event.team_size === 1) {
      individualRegister();
    } else {
      teamRegister();
    }
  };

  return (
    <>
      <div
        id={id}
        className="bg-gradient-to-b from-green-400 to-indigo-500 cursor-pointer p-1 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
        onClick={showModal}
      >
        <img
          src="https://res.cloudinary.com/dsad92ak9/image/upload/ak12ipywf80euvkcnv8z"
          alt={event.name}
          className="w-full h-40 object-cover rounded-t-xl"
        />
        <div className="p-4">
          <h2 className="text-lg font-bold text-white">{event.name}</h2>
          <p className="text-yellow-200 text-sm mt-1">
            📅 {event.date} | 🕒 {event.time}
          </p>
          <p className="text-green-200 text-sm mt-1">
            👥 <strong>Team Size:</strong> {event.team_size}
          </p>
          <p className="text-red-300 text-sm mt-1">
            ⏳ <strong>Deadline:</strong> {event.deadline}
          </p>
          
          {register ? (
            <div className="text-center mt-3">
              <button
                className="bg-gray-700 hover:bg-green-600 hover:border-green-600 text-white font-semibold py-2 px-4 rounded-xl border border-gray-600 w-1/3 transition duration-300 shadow-lg"
                onClick={(e) => handleRegister(e)}
              >
                Register
              </button>
            </div>
          ) : admin ? (
            <div className="mt-3 flex">
              <button className="bg-gray-700 hover:bg-green-600 hover:border-green-600 text-white font-semibold py-2 px-4 rounded-xl border border-gray-600 w-1/3 transition duration-300 shadow-lg ml-3">
                Edit
              </button>
              <button className="bg-gray-700 hover:bg-green-600 hover:border-green-600 text-white font-semibold py-2 px-4 rounded-xl border border-gray-600 w-1/3 transition duration-300 shadow-lg ml-3">
                Remove
              </button>
            </div>
          ) : (
            <div className="text-center mt-3">
              <button className="bg-gray-700 hover:bg-green-600 hover:border-green-600 text-white font-semibold py-2 px-4 rounded-xl border border-gray-600 w-2/3 transition duration-300 shadow-lg">
                My Team
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Event Details Modal */}
      <Modal
        title={<h2 className="text-xl font-bold text-indigo-700">{event.name}</h2>}
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
        onClick={(e) => e.stopPropagation()}
        centered
      >
        <div className="p-4 space-y-3">
          <p className="text-yellow-500 font-medium text-sm flex items-center">
            📅 <span className="ml-2">{event.date} | 🕒 {event.time}</span>
          </p>
          <p className="text-gray-700 text-sm leading-relaxed">{event.description}</p>
          <p className="text-green-600 font-medium text-sm flex items-center">
            👥 <span className="ml-2"><strong>Team Size:</strong> {event.team_size}</span>
          </p>
          <p className="text-blue-700 font-medium text-sm flex items-center">
            📍 <span className="ml-2"><strong>Location:</strong> {event.location}</span>
          </p>
          <p className="text-red-500 font-medium text-sm flex items-center">
            ⏳ <span className="ml-2"><strong>Deadline:</strong> {event.deadline}</span>
          </p>
        </div>
      </Modal>

      {/* Team Registration Modal */}
      <Modal
        open={isTeamModalOpen}
        footer={null}
        onCancel={handleTeamCancel}
        onClick={(e) => e.stopPropagation()}
        centered
      >
        <div className="p-6 flex flex-col items-center space-y-4">
          <button
            className="w-40 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
            onClick={() => setNewTeam(true)}
          >
            Create Team
          </button>
          <button className="w-40 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105">
            Join Team
          </button>
        </div>
      </Modal>

      {/* Create New Team Modal */}
      <Modal
        open={newTeam}
        footer={null}
        onCancel={() => setNewTeam(false)}
        onClick={(e) => e.stopPropagation()}
        centered
      >
        <div className="p-6 flex flex-col items-center space-y-4">
    <h2 className="text-lg font-bold text-indigo-700">Create a New Team</h2>
    <form onSubmit={handleCreateTeam} className="w-full flex flex-col items-center">
      <label className="text-gray-700 font-medium">Team Name</label>
      <input
        type="text"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        className="w-64 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        type="submit"
        className="w-40 mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
      >
        Confirm
      </button>
    </form>
  </div>
      </Modal>
    </>
  );
};

export default Card;
