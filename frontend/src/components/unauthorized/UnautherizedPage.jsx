import { FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {

    const navigate = useNavigate();
    return (
        <div className="flex items-center justify-center h-screen bg-gray-900">
            <div className="bg-gray-800 shadow-lg rounded-xl p-8 w-full max-w-md border border-red-600 text-center">
                <FaLock className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-red-400 text-3xl font-bold">403 Unauthorized</h1>
                <p className="text-white mt-2">You don’t have permission to access this page.</p>
                <button
                    onClick={() => navigate('/home')}
                    className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg border border-red-500 shadow-md transition-all"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default UnauthorizedPage;
