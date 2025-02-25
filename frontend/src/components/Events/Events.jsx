import Card from "../Card/Card";
import { useState, useEffect } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const Events = () => {
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [events, setEvents] = useState([
    {
      name: "Hackathon 2025",
      date: "March 15, 2025",
      deadline: "March 10, 2025",
      location: "Tech Innovation Hub, San Francisco, CA",
      time: "9:00 AM - 9:00 PM",
      description:
        "A 12-hour coding marathon for developers, designers, and entrepreneurs to build innovative tech solutions.",
      image: "hackathon.jpg",
      team_size: "2-5 members",
    },
    {
      name: "Medical AI Conference",
      date: "April 5, 2025",
      deadline: "March 25, 2025",
      location: "Grand Convention Center, New York, NY",
      time: "10:00 AM - 4:00 PM",
      description:
        "A conference focusing on AI advancements in healthcare, featuring keynote speakers and panel discussions.",
      image: "medical_ai.jpg",
      team_size:1,
    },
    {
      name: "Startup Pitch Fest",
      date: "May 20, 2025",
      deadline: "May 10, 2025",
      location: "Silicon Valley, CA",
      time: "1:00 PM - 6:00 PM",
      description:
        "A platform for startups to pitch their ideas to investors and industry leaders for funding and mentorship.",
      image: "startup_pitch.jpg",
      team_size: "1-3 members",
    },
    {
      name: "E-Sports Championship",
      date: "June 18, 2025",
      deadline: "June 10, 2025",
      location: "Esports Arena, Los Angeles, CA",
      time: "2:00 PM - 11:00 PM",
      description:
        "A high-stakes gaming competition featuring top players from around the world in multiple gaming categories.",
      image: "esports.jpg",
      team_size: "3-5 members",
    },
    {
      name: "Global Tech Meetup",
      date: "July 12, 2025",
      deadline: "July 5, 2025",
      location: "London Tech Hub, UK",
      time: "10:00 AM - 5:00 PM",
      description:
        "A networking event for tech enthusiasts, software engineers, and industry experts to discuss trends and future innovations.",
      image: "tech_meetup.jpg",
      team_size: "Individual",
    },
    {
      name: "Cybersecurity Workshop",
      date: "August 8, 2025",
      deadline: "August 1, 2025",
      location: "Online (Zoom)",
      time: "3:00 PM - 6:00 PM",
      description:
        "A hands-on workshop teaching the latest cybersecurity techniques and ethical hacking strategies.",
      image: "cybersecurity.jpg",
      team_size: "Individual",
    },
    {
      name: "Green Energy Summit",
      date: "September 25, 2025",
      deadline: "September 15, 2025",
      location: "Berlin Conference Center, Germany",
      time: "9:00 AM - 5:00 PM",
      description:
        "A summit discussing sustainable energy solutions and global climate initiatives.",
      image: "green_energy.jpg",
      team_size: "Individual",
    },
  ]);

  const renderLoadingView = () => (
    <div className="flex justify-center items-center min-h-screen" data-testid="loader">
      <ClipLoader color="#0b69ff" size={50} />
    </div>
  );

  const getEvents = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    try {
      const url = import.meta.env.VITE_BACKEND_URL+'/events/';
      const response = await axios.get(url);
      console.log(response.data)
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

  const renderEventsDetailsView = () => (
    <div className="min-h-screen p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-300 shadow-lg">
          Upcoming Events
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10">
        {events.map((event, index) => (
          <Card event={event} key={index} id={index} register />
        ))}
      </div>
    </div>
  );

  

  const renderFailureView = () => (
    <div className="flex flex-col items-center justify-center min-h-screen text-center text-red-500">
      <img
        alt="error view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="w-60 h-auto mb-4"
      />
      <p className="text-lg font-semibold">Failed to load events. Please try again later.</p>
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
    <div className="min-h-screen">
      {renderEventDetails()}
    </div>
  );
};

export default Events;
