import { useState } from "react";
import Card from "../Card/Card";

const events = [
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
    team_size: "Individual",
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
];

const MyEvents = () => {
  const [profileDetails,setProfileDetails]=useState({
    "name": "John Doe",
    "email": "johndoe@example.com",
    "phone": "+1-123-456-7890",
    "id":"RO20021",
    "branch":"CSE"
  })
  return (
    <div className="min-h-screen p-6">
      
      <div className="bg-gray-800 shadow-lg rounded-xl p-5 w-2/3 border border-blue-600 mb-5">
  <div className="border-b border-blue-500 pb-2 mb-4">
    <h1 className="text-green-300 text-2xl font-bold text-center">Profile Information</h1>
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
        <h1 className="text-3xl font-bold text-green-300 shadow-lg">
          My Events
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10">
        {events.map((event, index) => (
         <Card key={index} id={index} event={event}/>
        ))}
      </div>
    </div>
  );
};

export default MyEvents;
