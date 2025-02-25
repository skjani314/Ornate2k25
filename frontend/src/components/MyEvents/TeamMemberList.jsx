import { useContext } from "react";
import { FaTrash } from "react-icons/fa";
import EventContext from "../../context/EventContext";

const TeamMemberList = ({ members, onDelete, team_lead }) => {

  const { user } = useContext(EventContext);

  return (
    <div className="space-y-3 mt-4">
      {members.length > 0 ? (
        members.map((member) => (
          <div
            key={member.id}
            className="flex justify-between items-center bg-gray-700 p-3 rounded-lg border border-blue-500"
          >
            <div>
              <p className="text-white font-semibold">{member.name}</p>
              <p className="text-gray-300 text-sm">{member.email}</p>
            </div>
            {user._id == member._id || user._id == team_lead._id ?
              <button onClick={() => onDelete(member._id)} className="text-red-500 hover:text-red-700">
                <FaTrash size={18} />
              </button>
              : null
            }
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-center">No team members yet.</p>
      )}
    </div>
  );
};

export default TeamMemberList;
