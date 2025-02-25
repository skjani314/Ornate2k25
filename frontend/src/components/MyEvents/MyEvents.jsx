import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Card from "../Card/Card";
import { ClipLoader } from "react-spinners";
import EventContext from "../../context/EventContext";


const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const MyEvents = () => {
  const {accessToken}=useContext(EventContext)

  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [eventDetails, setEventDetails] = useState([]);
  const [soloEventDetails,setSoloEventDetails]=useState([]);
  const [profileDetails, setProfileDetails] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1-123-456-7890",
    id: "RO20021",
    branch: "CSE",
  });

  const getEventDetails = async () => {
   
    setApiStatus(apiStatusConstants.inProgress);
    if(!accessToken){
      return;
    }
    try {
      const url = import.meta.env.VITE_BACKEND_URL + "/user/myevents/";
      const response = await axios.get(url,{headers:{
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      }});
      setEventDetails(response.data.team);
      setSoloEventDetails(response.data.solo);
      setApiStatus(apiStatusConstants.success);
      console.log(soloEventDetails)
    } catch (err) {
      console.error("Error fetching events:", err);
      setApiStatus(apiStatusConstants.failure);
    }
  };

  useEffect(() => {
    getEventDetails();
  }, [accessToken]);

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

  const renderEventsDetailsView = () => {
    return (
      <div className="min-h-screen p-6">
        <div className="bg-gray-800 shadow-lg rounded-xl p-5 w-2/3 border border-blue-600 mb-5">
          <div className="border-b border-blue-500 pb-2 mb-4">
            <h1 className="text-green-300 text-2xl font-bold text-center">
              Profile Information
            </h1>
          </div>
          <div className="space-y-2">
            <p className="text-white text-lg">
              <strong className="text-green-400">Name:</strong> {profileDetails.name}
            </p>
            <p className="text-white text-lg">
              <strong className="text-green-400">Email:</strong> {profileDetails.email}
            </p>
            <p className="text-white text-lg">
              <strong className="text-green-400">Phone:</strong> {profileDetails.phone}
            </p>
            <p className="text-white text-lg">
              <strong className="text-green-400">Id:</strong> {profileDetails.id}
            </p>
            <p className="text-white text-lg">
              <strong className="text-green-400">Branch:</strong> {profileDetails.branch}
            </p>
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-300 shadow-lg">My Events</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10">
          {eventDetails.map((event, index) => (
            <Card key={index} id={index} event={event.event_id} />
          ))}
          
        </div>
      </div>
    );
  };

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

  return <div>{renderEventDetails()}</div>;
};

export default MyEvents;
