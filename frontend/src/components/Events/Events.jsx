import Card from "../Card/Card";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { Input, Space } from "antd";
import EventContext from "../../context/EventContext";
import { useParams, Link, useLocation } from 'react-router-dom';
const { Search } = Input;

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const Events = () => {
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const { my_events } = useContext(EventContext);
  const { isSearchActive, setIsSearchActive, events, setEvents, search_events, setSearchEvents } = useContext(EventContext)
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  console.log(searchParams.get("event"));
  const onSearch = (value) => {
    console.log("Search input:", value);
  };


  const renderLoadingView = () => (
    <div className="flex justify-center items-center min-h-screen" data-testid="loader">
      <ClipLoader color="#0b69ff" size={50} />
    </div>
  );

  const getEvents = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    try {
      const query = searchParams.get("event") ? searchParams.get("event").toLocaleLowerCase() : "";
      const url = import.meta.env.VITE_BACKEND_URL + '/events/?event=' + query;
      const response = await axios.get(url);
      console.log(response);
      setSearchEvents(response.data);
      setApiStatus(apiStatusConstants.success);
    } catch (err) {
      console.error("Error fetching events:", err);
      setApiStatus(apiStatusConstants.failure);
    }
  };
  const getAllEvents = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    try {
      const url = import.meta.env.VITE_BACKEND_URL + '/events/?event=' + "";
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
    getAllEvents();
  }, [location]);

  console.log(events)
  console.log(my_events)

  const renderEventsDetailsView = () => (
    <>

     

      <div className="min-h-screen p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-300 shadow-lg">
            Upcoming Events
          </h1>
        </div>
        {searchParams.get("event") ?
          <h1 className="text-white  text-2xl font-bold">Search Result for {searchParams.get("event")}</h1>
          : null}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10">
          {
            searchParams.get("event") ?
              search_events.map((event, index) => (
                <Card event={event} key={index} id={index} registered={my_events.includes(event._id)} register />
              ))
              :
              events.map((event, index) => (
                <Card event={event} key={index} id={index} registered={my_events.includes(event._id)} register />
              ))

          }
        </div>
      </div>
    </>
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
