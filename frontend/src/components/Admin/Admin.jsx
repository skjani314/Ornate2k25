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

const Admin = () => {
  return (
    <div className="min-h-screen p-6">
     <div className="flex justify-between">   
      <div>
        <h1 className="text-3xl font-bold text-green-300 shadow-lg">
          Upcoming Events
        </h1>
      </div>
      <div className="flex">
        <button className="text-lg text-white mr-4 border w-1/3 px-4 rounded-xl">Add</button>
        <button className="text-lg  text-white border w-2/3 px-4 rounded-xl">Announcement</button>
      </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10">
        {events.map((event, index) => (
          <Card event={event} key={index} id={index}  admin/>
        ))}
      </div>
    </div>
  );
};

export default Admin;
