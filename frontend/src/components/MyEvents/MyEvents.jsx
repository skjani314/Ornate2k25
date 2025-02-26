import { useContext,useEffect,useState } from "react";
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

  const { apiStatus, eventDetails, soloEventDetails, user, accessToken,setUser} = useContext(EventContext)
  const [isEdit,setIsEdit]=useState(false);
  const [image,setImage]=useState(null);
  const [userData,setUserData]=useState({name:''});


  console.log(userData)

  const renderLoggedOutView = () => (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-2xl font-bold text-red-600">You're Not Logged In!</h1>
      <p className="text-lg text-gray-700 mt-2">
        Please log in to view your events.
      </p>

    </div>
  );

useEffect(()=>{
setUserData({name:user.name,mobile:user.mobile,branch:user.branch});
},[user])

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

  const onSubmitProfileDetails = async (profileData) => {
    try {
      const formData = new FormData();
      if (image) {
        formData.append("img", image);
      }
      formData.append("name", profileData.name);
      formData.append("mobile", profileData.mobile);
      formData.append("branch", profileData.branch);
  
      const response = await axios.put(import.meta.env.VITE_BACKEND_URL+"/user/update-profile", formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
         
        },
      });
  
      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        setUserData(response.data);
        console.log(response.data)
        setUser(prev=>({...prev,...response.data}))
        setIsEdit(false);

      }
    } catch (error) {
      toast.error("Failed to update profile. Try again!");
      console.error(error);
    }
  };
  

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
              {
  isEdit ? (
    <div>
      <img
        src={user.img || "https://res.cloudinary.com/dsad92ak9/image/upload/cjxhkplev75abm5zha9c"}
        alt="Profile"
        className="w-24 h-24 rounded-full mb-4 border-2 border-green-400"
      />
      <label
        htmlFor="image"
        className="cursor-pointer border  text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
      >
        Upload 
      </label>
      <input
        type="file"
        id="image"
        className="hidden"
        onChange={(e) => setImage(e.target.files[0])}
      />
    </div>
  ) : (
    <img
      src={user.img || "https://res.cloudinary.com/dsad92ak9/image/upload/cjxhkplev75abm5zha9c"}
      alt="Profile"
      className="w-24 h-24 rounded-full mb-4 border-2 border-green-400"
    />
  )
}

              {
                isEdit
                ?<div className="flex items-center">
                 <p><strong className="text-green-400 text-lg mr-2">Name:</strong></p><input className='bg-gray-50 text-lg font-medium max-w-60 mt-4' type='text' onChange={(e)=>{setUserData(prev=>({...prev,name:e.target.value}))}} value={userData.name}/>
                </div>
                :<p className="text-white text-lg">
                <strong className="text-green-400">Name:</strong> {user.name}
              </p>
              }
              
              <p className="text-white text-lg">
                <strong className="text-green-400">Email:</strong> {user.email}
              </p>
              {
                isEdit
                ?<div className="flex items-center">
                  <p><strong className="text-green-400 text-lg mr-2">Phone:</strong></p>
                  <input className='bg-gray-50 text-lg font-medium max-w-60 mt-4' type='text' onChange={(e)=>{setUserData(prev=>({...prev,phone:e.target.value}))}} value={userData.mobile}/>
                </div>
                :<p className="text-white text-lg">
                <strong className="text-green-400">Phone:</strong> {user.mobile}
              </p>
              }
              
              <p className="text-white text-lg">
                <strong className="text-green-400">Id:</strong> {user.collage_id}
              </p>

              {
                isEdit
                ?<div className="flex items-center">
                  <p><strong className="text-green-400 text-lg mr-2">Branch:</strong></p>
                  <input className='bg-gray-50 text-lg font-medium max-w-60 mt-4' type='text' onChange={(e)=>{setUserData(prev=>({...prev,branch:e.target.value}))}} value={userData.branch}/>
                </div>
                :<p className="text-white text-lg">
                <strong className="text-green-400">Branch:</strong> {user.branch&&user.branch}
              </p>
              }
              
              <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md w-1/4" onClick={()=>{setIsEdit(true)}}>Edit</button>
              <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md w-1/4 ml-4" onClick={()=>{onSubmitProfileDetails(userData)}}>Save</button>
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
