import { IoTimeOutline } from "react-icons/io5";
import dayjs from "dayjs";
import { Modal, Form, Input, DatePicker, TimePicker, Button, Upload } from "antd";
import { FaUpload } from 'react-icons/fa';
import axios from "axios";
import { useState, useEffect } from "react";


const Card = ({ event, id, register, admin, getEvents }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList.reverse());
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
  const handleRegister = (e) => {
    e.stopPropagation();
  }
  const handleTeam = (e) => {
    e.stopPropagation();
  }
  const handleEdit = (e) => {
    e.stopPropagation();
    setEdit(true);

  }
  const handleRemove = async (e) => {
    e.stopPropagation();

    try {

      const url = import.meta.env.VITE_BACKEND_URL + "/events/remove/" + event._id;
      const result = await axios.delete(url);
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

      const result = await axios.put(url, form_Data);
      console.log(result);
      setEdit(false);
      form.resetFields();
      getEvents();

    } catch (error) {
      console.error("Error submitting event:", error);
    }
  };

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
    </>
  )
}

export default Card
