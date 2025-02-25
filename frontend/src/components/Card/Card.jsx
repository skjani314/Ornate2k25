import { IoTimeOutline } from "react-icons/io5";
import dayjs from "dayjs";
import { Modal, Form, Input, DatePicker, TimePicker, Button, Upload, Row } from "antd";
import { FaTrash, FaUpload } from 'react-icons/fa';
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { toast } from 'react-toastify';
import EventContext from "../../context/EventContext";
import TeamMemberList from "../MyEvents/TeamMemberList";


const Card = ({ event, id, register, admin, members, team_lead, team_code, team_name, team_id }) => {
  const { user } = useContext(EventContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [newTeam, setNewTeam] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [joinTeam, setJoinTeam] = useState({ open: false, team_code: "" });
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [myteam, setMyTeam] = useState(false);
  const { success, error, getEvents } = useContext(EventContext);
  const accessToken = localStorage.getItem('accessToken');
  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList.reverse());
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!teamName.trim()) {
      toast.error("Team name cannot be empty");
      return;
    }
    try {
      const url = import.meta.env.VITE_BACKEND_URL + '/register/team/create/';
      const response = await axios.post(url, { event_id: event._id, team_name: teamName }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        }
      })
      if (response.status >= 200 && response.status < 300) {
        toast.success('team creation success')
        setNewTeam(false)
      }
      else {
        toast.error("team creation failed")
      }
    }
    catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  };

  const handleEditCancel = (e) => {
    e.stopPropagation();
    setEdit(false);
  };
  useEffect(() => {
    if (event) {
      console.log("Setting Form Values:", event);  // Debugging log

      form.setFieldsValue({
        ...event,
        date: event.date ? dayjs(event.date) : null,
        deadline: event.deadline ? dayjs(event.deadline) : null,
        from_time: event.from_time || "",   // Ensure these fields are not undefined
        to_time: event.to_time || "",
        location: event.location || "",
        team_size: event.team_size || 1,    // Default value to avoid undefined
        des: event.des || ""
      });
    }
  }, [event, form]);


  const showModal = (e) => {
    e.stopPropagation()
    setIsModalOpen(true);
  }

  const handleCancel = (e) => {
    e.stopPropagation();
    setIsModalOpen(false)

  }

  const handleTeam = (e) => {
    e.stopPropagation();
    setMyTeam(true);


  }
  const handleEdit = (e) => {
    e.stopPropagation();
    setEdit(true);

  }

  const handleTeamCancel = (e) => {
    e.stopPropagation();
    setIsTeamModalOpen(false);
  };

  const individualRegister = async () => {

    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + '/register/soloregister/',
        { event_id: event._id },
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


  const handleJoinTeam = async (e) => {

    e.preventDefault();

    try {

      const form_data = new FormData();

      form_data.append('user_id', user._id);
      form_data.append('team_code', joinTeam.team_code);
      form_data.append('event_id', event._id);
      const url = import.meta.env.VITE_BACKEND_URL + '/register/team/join';
      const result = await axios.post(url, form_data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        }
      });

      console.log(result);
      setJoinTeam({ open: false, team_code: "" })
      success("Joined in team")
    }
    catch (err) {
      error("Team filled")
      console.log(err);

    }


  }

  const teamRegister = () => {
    setIsTeamModalOpen(true);
  };
  const onDelete = async (user_id) => {

    try {
      const url = import.meta.env.VITE_BACKEND_URL + '/register/team/remove_member/' + team_id;
      const form_data = new FormData();
      form_data.append('user_id', user_id);
      const result = await axios.put(url, form_data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        }
      });
      success("Member removed successfully");
      setMyTeam(false);
      getEvents();

    }
    catch (err) {
      console.log(err);
    }

  }
  const handleDeleteTeam = async () => {


    try {

      const url = import.meta.env.VITE_BACKEND_URL + '/register/team/delete/' + team_id;

      const result = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        }
      });

      success("Team deleted successfully");
      setIsTeamModalOpen(false);
      getEvents();
    }
    catch (err) {
      console.log(err);
    }


  }

  const handleRegister = (e) => {
    e.stopPropagation();

    if (!accessToken) {
      toast.error("Please Login To Register");
      return;
    }

    if (event.team_size === '1') {
      individualRegister();
    } else {
      teamRegister();
    }
  };
  const handleRemove = async (e) => {
    e.stopPropagation();

    try {

      const url = import.meta.env.VITE_BACKEND_URL + "/events/remove/" + event._id;
      const result = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        }
      });
      console.log(result);
      getEvents();

    }
    catch (err) {
      console.log(err);

    }



  }

  const handleEditSubmit = async (values) => {
    try {
      values.date = new Date(values.date.toISOString());
      values.deadline = new Date(values.deadline.toISOString());
      console.log("Form Values:", values);
      const form_Data = new FormData();
      fileList.forEach(file => {
        form_Data.append('img', file.originFileObj);
      });
      const { _id } = event;

      form_Data.append('name', values.name);
      form_Data.append('date', values.date);
      form_Data.append('deadline', values.deadline);
      form_Data.append('location', values.location);
      form_Data.append('from_time', values.from_time);
      form_Data.append('to_time', values.to_time);
      form_Data.append('des', values.des);
      form_Data.append('team_size', values.team_size);

      const url = import.meta.env.VITE_BACKEND_URL + "/events/update/" + event._id;

      const result = await axios.put(url, form_Data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        }
      });
      console.log(result);
      setEdit(false);
      form.resetFields();
      getEvents();

    } catch (error) {
      console.error("Error submitting event:", error);
    }
  };

  console.log(members);
  return (
    <>
      <div id={id}
        className="bg-gradient-to-b from-green-400  to-indigo-500 cursor-pointer p-1 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
        onClick={showModal}
      >
        <img
          src={event.img}
          alt={event.name}
          className="w-full h-40 object-cover rounded-t-xl"
        />
        <div className="p-4">
          <h2 className="text-lg font-bold text-white">{event.name}</h2>
          <p className="text-yellow-200 text-sm mt-1">
            📅 {event.date ? dayjs(event.date).format("D ddd YYYY") : "Loading..."}
          </p>
          <p className="text-green-200 text-sm mt-1 flex items-center">
            <IoTimeOutline /> <p>{event.from_time} - {event.to_time}</p>
          </p>

          <p className="text-green-200 text-sm mt-1">
            👥 <strong>Team Size:</strong> {event.team_size}
          </p>
          <p className="text-red-300 text-sm mt-1">
            ⏳ <strong>Deadline:</strong> {event.deadline ? dayjs(event.deadline).format("D ddd YYYY") : "Loading..."}
          </p>
          {register ? <div className="text-center mt-3">
            <button className="bg-gray-700 hover:bg-green-600 hover:border-green-600 text-white font-semibold py-2 px-4 rounded-xl border border-gray-600 w-1/3 transition duration-300 shadow-lg" onClick={(e) => { handleRegister(e) }}>Register</button>
          </div> :
            admin ? <div className="mt-3 flex">
              <button className="bg-gray-700 hover:bg-green-600 hover:border-green-600 text-white font-semibold py-2 px-4 rounded-xl border border-gray-600 w-1/3 transition duration-300 shadow-lg ml-3" onClick={(e) => { handleEdit(e) }}>Edit</button>
              <button className="bg-gray-700 hover:bg-green-600 hover:border-green-600 text-white font-semibold py-2 px-4 rounded-xl border border-gray-600 w-1/3 transition duration-300 shadow-lg ml-3" onClick={(e) => { handleRemove(e) }}>Remove</button>
            </div> :
              <div className="text-center mt-3">
                <button className="bg-gray-700 hover:bg-green-600 hover:border-green-600 text-white font-semibold py-2 px-4 rounded-xl border border-gray-600 w-2/3 transition duration-300 shadow-lg" onClick={(e) => { handleTeam(e) }}>My Team</button>
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
              📅 {event.date ? dayjs(event.date).format("D ddd YYYY") : "Loading..."}
            </p>
            <p className="text-sm mt-1 flex items-center">
              <IoTimeOutline /> <p>{event.from_time} - {event.to_time}</p>
            </p>
            <p className="text-green-600 font-medium text-sm flex items-center">
              👥 <span className="ml-2"><strong>Team Size:</strong> 1 - {event.team_size}</span>
            </p>

            <p className="text-blue-700 font-medium text-sm flex items-center">
              📍 <span className="ml-2"><strong>Location:</strong> {event.location}</span>
            </p>

            <p className="text-red-500 font-medium text-sm flex items-center">
              ⏳ <span className="ml-2"><strong>Deadline:</strong> {event.deadline ? dayjs(event.deadline).format("D ddd YYYY") : "Loading..."}</span>
            </p>
            <h2>Description:</h2>
            <p className="text-gray-700 text-sm leading-relaxed">{event.des}</p>

          </div>
        </Modal>

      </div>
      <Modal
        title={<h2 className="text-xl font-bold text-indigo-700">{event.name}</h2>}
        open={isEdit}
        footer={null}
        onCancel={handleEditCancel}
        onClick={(e) => e.stopPropagation()}
        centered
      >



        <Form form={form} layout="vertical" onFinish={handleEditSubmit}>
          <Form.Item
            label="Event Name"
            name="name"
            rules={[{ required: true, message: "Event name is required" }]}
          >
            <Input placeholder="Enter event name" />
          </Form.Item>

          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: "Date is required" }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item
            label="Deadline"
            name="deadline"
            rules={[{ required: true, message: "Deadline is required" }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item
            label="Location"
            name="location"
            rules={[{ required: true, message: "Location is required" }]}
          >
            <Input placeholder="Enter location" />
          </Form.Item>

          <Form.Item
            label="From Time"
            name="from_time"
            rules={[{ required: true, message: "Start time is required" }]}
          >
            <Input placeholder="From" />
          </Form.Item>

          <Form.Item
            label="To Time"
            name="to_time"
            rules={[{ required: true, message: "End time is required" }]}
          >
            <Input placeholder="To" />
          </Form.Item>

          <Form.Item label="Description" name="des">
            <Input.TextArea rows={3} placeholder="Enter description" />
          </Form.Item>

          <Form.Item
            label="Team Size"
            name="team_size"
            rules={[{ required: true, message: "Team size is required" }]}
          >
            <Input type="number" placeholder="Enter team size" />
          </Form.Item>
          <Upload
            multiple
            listType="picture"
            beforeUpload={() => false}
            fileList={fileList}
            onChange={handleUploadChange}
          >  <Button className='mt-1 p-4'><FaUpload /> Upload</Button>
          </Upload>
          <Form.Item className="flex justify-end">
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>

        </Form>

      </Modal>


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
          <button onClick={() => { setIsTeamModalOpen(false); setJoinTeam(prev => ({ ...prev, open: true })) }} className="w-40 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105">
            Join Team
          </button>
        </div>
      </Modal>

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

      <Modal footer={null} open={joinTeam.open} onCancel={() => { setJoinTeam({ open: false, team_code: "" }) }}>
        <div className="p-6 flex flex-col items-center space-y-4">
          <h2 className="text-lg font-bold text-indigo-700">Join In a team</h2>
          <form onSubmit={handleJoinTeam} className="w-full flex flex-col items-center">
            <label className="text-gray-700 font-medium">Enter Team Code</label>
            <input
              type="text"
              value={joinTeam.team_code}
              onChange={(e) => setJoinTeam(prev => ({ ...prev, team_code: e.target.value }))}
              className="w-64 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="w-40 mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Join Team
            </button>
          </form>
        </div>
      </Modal>
      <Modal footer={null} open={myteam} onCancel={() => { setMyTeam(false); }} >
        {event.team_size != '1' ?
          <div className="bg-gray-800 shadow-lg rounded-xl mt-4 p-5 w-full border border-blue-600 mb-5">
            <div className="border-b border-blue-500 pb-2 mb-4">
              <h1 className="text-green-300 text-2xl font-bold text-center">
                Team Information
              </h1>
            </div>
            <div className="space-y-2">
              <p className="text-white text-lg">
                <strong className="text-green-400">Name:</strong> {team_name}
              </p>
              <p className="text-white text-lg">
                <strong className="text-green-400">Team_Code:</strong> {team_code}
              </p>
              <p className="text-white text-lg">
                <strong className="text-green-400">Team_lead:</strong> {team_lead && team_lead.name}
              </p>
              {user && team_lead && user._id == team_lead._id ?
                <button
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 border border-red-500 shadow-md transition-all"
                  onClick={handleDeleteTeam}
                >
                  <FaTrash className="w-5 h-5" />
                  <span>Delete Team</span>
                </button>
                : null
              }
              <h1 className="text-green-300 text-2xl font-bold text-center">
                Team Members
              </h1>
              {

                <TeamMemberList team_lead={team_lead} members={members} onDelete={onDelete} />
              }

            </div>
          </div>
          : null
        }
      </Modal>
    </>
  )
}

export default Card
