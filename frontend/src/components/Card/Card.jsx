import { Modal } from "antd"; 
import { Card as AntdCard} from "antd";
import { useState } from "react";
const Card = ({event,id,register,admin}) => {
    const [isModalOpen,setIsModalOpen]=useState(false);

    const showModal=()=>{
        setIsModalOpen(true);
    }

    const handleCancel=(e)=>{
        e.stopPropagation();
        setIsModalOpen(false)
    }
    const handleRegister=(e)=>{
        e.stopPropagation();
    }
    const handleTeam=(e)=>{
        e.stopPropagation();
    }
    const handleEdit=(e)=>{
      e.stopPropagation();
  }
  const handleRemove=(e)=>{
    e.stopPropagation();
}
  return (
   
    <div id={id}
    className="bg-gradient-to-b from-green-400  to-indigo-500 cursor-pointer p-1 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
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
      {register?<div className="text-center mt-3">
        <button className="bg-gray-700 hover:bg-green-600 hover:border-green-600 text-white font-semibold py-2 px-4 rounded-xl border border-gray-600 w-1/3 transition duration-300 shadow-lg" onClick={(e)=>{handleRegister(e)}}>Register</button>
      </div>:
      admin? <div className="mt-3 flex">
      <button className="bg-gray-700 hover:bg-green-600 hover:border-green-600 text-white font-semibold py-2 px-4 rounded-xl border border-gray-600 w-1/3 transition duration-300 shadow-lg ml-3" onClick={(e)=>{handleEdit(e)}}>Edit</button>
      <button className="bg-gray-700 hover:bg-green-600 hover:border-green-600 text-white font-semibold py-2 px-4 rounded-xl border border-gray-600 w-1/3 transition duration-300 shadow-lg ml-3" onClick={(e)=>{handleRemove(e)}}>Remove</button>
    </div>:
      <div className="text-center mt-3">
      <button className="bg-gray-700 hover:bg-green-600 hover:border-green-600 text-white font-semibold py-2 px-4 rounded-xl border border-gray-600 w-2/3 transition duration-300 shadow-lg" onClick={(e)=>{handleTeam(e)}}>My Team</button>
    </div>}
    </div>
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

  </div>
  )
}

export default Card
