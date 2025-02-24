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

const Events = () => {
  return (
    <div className="min-h-screen p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-300 shadow-lg">
          Upcoming Events
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 mt-10">
        {events.map((event, index) => (
          <div
            key={index}
            className="bg-gradient-to-b from-green-400  to-indigo-500 cursor-pointer p-1 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <img
              src="https://res.cloudinary.com/dsad92ak9/image/upload/ak12ipywf80euvkcnv8z"
              alt={event.name}
              className="w-full h-40 object-cover rounded-t-xl"
            />
            <div className="p-4">
              <h2 className="text-lg font-bold text-white">{event.name}</h2>
              <p className="text-yellow-200 text-sm mt-1">
                📅 {event.date} | 🕒 {event.time}
              </p>
              <p className="text-white mt-1 text-sm">{event.description}</p>
              <p className="text-white text-sm mt-2">
                📍 <strong>Location:</strong> {event.location}
              </p>
              <p className="text-green-200 text-sm mt-1">
                👥 <strong>Team Size:</strong> {event.team_size}
              </p>
              <p className="text-red-300 text-sm mt-1">
                ⏳ <strong>Deadline:</strong> {event.deadline}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
