import { useContext } from "react";
import axios from "axios";
import Card from "../Card/Card";
import { ClipLoader } from "react-spinners";
import EventContext from "../../context/EventContext";
import { toast } from "react-toastify";



const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const MyEvents = () => {

  const { apiStatus, eventDetails, soloEventDetails, user, accessToken } = useContext(EventContext)

  const renderLoggedOutView = () => (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-2xl font-bold text-red-600">You're Not Logged In!</h1>
      <p className="text-lg text-gray-700 mt-2">
        Please log in to view your events.
      </p>

    </div>
  );



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
          {user &&
            <div className="space-y-2">
              <p className="text-white text-lg">
                <strong className="text-green-400">Name:</strong> {user.name}
              </p>
              <p className="text-white text-lg">
                <strong className="text-green-400">Email:</strong> {user.email}
              </p>
              <p className="text-white text-lg">
                <strong className="text-green-400">Phone:</strong> {user.mobile}
              </p>
              <p className="text-white text-lg">
                <strong className="text-green-400">Id:</strong> {user.collage_id}
              </p>
            </div>
          }
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-300 shadow-lg">My Events</h1>
        </div>


        <div className="mt-6">
          <h1 className="text-blue-800 text-3xl font-bold">Team</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-4">
            {eventDetails.map((event, index) => (
              <Card key={index} id={index} event={event.event_id} members={event.members} team_code={event.team_code}

                team_lead={event.team_lead}
                team_name={event.team_name}
                team_id={event._id}
              />
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h1 className="text-blue-800 text-3xl font-bold">Solo</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-4">
            {soloEventDetails.map((event, index) => (
              <Card key={index} id={index} event={event.event_id} solo />
            ))}
          </div>
        </div>

      </div>
    );
  };

  const renderEventDetails = () => {
    if (!accessToken) {
      return renderLoggedOutView();
    }
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
