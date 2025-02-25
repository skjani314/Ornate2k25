import { useState, useEffect } from "react";
import axios from "axios";
import Card from "../Card/Card";
import { ClipLoader } from "react-spinners";
import { Modal, Form, Input, DatePicker, TimePicker, Button } from "antd";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const Admin = () => {
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm(); // Initializing the form instance

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setIsModalOpen(false);
    form.resetFields(); // Reset form fields when closing the modal
  };

  const getEvents = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    try {
      const url = import.meta.env.VITE_BACKEND_URL + "/events/";
      const response = await axios.get(url);
      setEvents(response.data);
      setApiStatus(apiStatusConstants.success);
    } catch (err) {
      console.error("Error fetching events:", err);
      setApiStatus(apiStatusConstants.failure);
    }
  };

  useEffect(() => {
    getEvents();
  }, []);

  const handleSubmit = async (values) => {
    try {
      console.log("Form Values:", values);
      const url = import.meta.env.VITE_BACKEND_URL + "/events/";
      await axios.post(url, values);
      setIsModalOpen(false);
      form.resetFields();
      getEvents(); // Refresh event list
    } catch (error) {
      console.error("Error submitting event:", error);
    }
  };

  const renderFailureView = () => (
    <div className="flex flex-col items-center justify-center min-h-screen text-center text-red-500">
      <img
        alt="error view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="w-60 h-auto mb-4"
      />
      <p className="text-lg font-semibold">
        Failed to load events. Please try again later.
      </p>
    </div>
  );

  const renderLoadingView = () => (
    <div className="flex justify-center items-center min-h-screen" data-testid="loader">
      <ClipLoader color="#0b69ff" size={50} />
    </div>
  );

  const renderEventsDetailsView = () => (
    <div className="min-h-screen p-6">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold text-green-300 shadow-lg">
          Upcoming Events
        </h1>
        <div className="flex">
          <button
            className="text-lg text-white mr-4 border w-1/3 px-4 rounded-xl hover:bg-primary-800 hover:border-none"
            onClick={showModal}
          >
            Add
          </button>
          <button className="text-lg text-white border w-2/3 px-4 rounded-xl hover:bg-primary-800 hover:border-none">
            Announcement
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10">
        {events.map((event, index) => (
          <Card event={event} key={index} id={index} admin />
        ))}
      </div>
    </div>
  );

  const renderEventDetails = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderEventsDetailsView();
      case apiStatusConstants.failure:
        return renderFailureView();
      case apiStatusConstants.inProgress:
        return renderLoadingView();
      default:
        return null;
    }
  };

  return (
    <>
      {renderEventDetails()}

      <Modal
        title={<h2 className="text-xl font-bold text-indigo-700">Add Event</h2>}
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
        onClick={(e) => e.stopPropagation()}
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
            name="deadLine"
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
            <TimePicker className="w-full" format="HH:mm" />
          </Form.Item>

          <Form.Item
            label="To Time"
            name="to_time"
            rules={[{ required: true, message: "End time is required" }]}
          >
            <TimePicker className="w-full" format="HH:mm" />
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

          <Form.Item className="flex justify-end">
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Admin;
