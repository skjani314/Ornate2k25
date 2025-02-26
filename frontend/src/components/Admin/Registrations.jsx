import React, { useEffect, useState } from 'react';
import { IoTimeOutline } from "react-icons/io5";
import dayjs from "dayjs";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Modal } from 'antd';
import * as XLSX from "xlsx";

const Registrations = (props) => {
    const { id } = useParams()
    const [data, setData] = useState({ event: null, members: [] });
    const accessToken = localStorage.getItem("accessToken");
    const [isView, setView] = useState(null);


    const getData = async () => {


        try {

            const url = import.meta.env.VITE_BACKEND_URL + "/events/registration/" + id;
            const result = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,

                }
            })
            setData(result.data);
            console.log(result);


        }
        catch (err) {
            console.log(err);

        }



    }

    const handleViewClick = (idx) => {


        setView(data.members[idx])


    }


    useEffect(() => {

        getData()

    }, [])



    const downloadExcelSolo = (members) => {
        if (!members || members.length === 0) {
            alert("No data available to download!");
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(members);

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Participants");

        XLSX.writeFile(workbook, "participants.xlsx");
    };


    const downloadTeamsExcel = (teams) => {
        if (!teams || teams.length === 0) {
            alert("No teams data available to download!");
            return;
        }

        // Prepare data for Excel
        const excelData = [];

        teams.forEach(team => {
            excelData.push({
                "Team Name": team.team_name,
                "Team Code": team.team_code,
                "Lead Name": team.team_lead.name,
                "Lead Email": team.team_lead.email,
                "Lead Mobile": team.team_lead.mobile,
                "Lead Branch": team.team_lead.branch,
                "Lead College ID": team.team_lead.collage_id
            });

            team.members.forEach(member => {
                excelData.push({
                    "Team Name": team.team_name,  // Keeping same for all members
                    "Team Code": team.team_code,
                    "Member Name": member.name,
                    "Member Email": member.email,
                    "Member Mobile": member.mobile,
                    "Member Branch": member.branch,
                    "Member College ID": member.collage_id
                });
            });
        });

        // Convert JSON to worksheet
        const worksheet = XLSX.utils.json_to_sheet(excelData);

        // Create workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Teams");

        // Convert workbook to binary
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

        // Create blob for download
        const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

        // Create a link and trigger download
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "Teams_Participated.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const downloadData = () => {
        if (data.event.team_size == "1") {
            downloadExcelSolo(data.members)
        }
        else {
            downloadTeamsExcel(data.members);
        }
    };

    return (
        <>
            <div className="bg-gray-900 min-h-screen text-white p-6">
                <div className="max-w-5xl mx-auto">
                    {/* Event Information */}
                    {data.event &&
                        <div className="shadow-lg rounded-xl p-6 border border-blue-500 flex gap-6 items-center relative">
                            <img src={data.event ? data.event.img : ""} alt="Event" className="w-1/3 h-64 object-cover rounded-lg mt-4" />
                            <div className="w-2/3">
                                <div className="border-b border-blue-400 pb-2 mb-4">
                                    <h1 className="text-blue-300 text-2xl font-bold text-center">
                                        Event Information
                                    </h1>
                                </div>
                                <div className="space-y-4">
                                    <p className="text-lg flex items-center gap-2 text-yellow-400">
                                        📅 {data.event ? dayjs(data.event.date).format("D ddd YYYY") : "Loading..."}
                                    </p>
                                    <p className="text-lg flex items-center gap-2 text-green-300">
                                        <IoTimeOutline /> <span>{data.event.from_time} - {data.event.to_time}</span>
                                    </p>
                                    <p className="text-lg flex items-center gap-2 text-purple-300">
                                        👥 <span><strong>Team Size:</strong> 1 - {data.event.team_size}</span>
                                    </p>
                                    <p className="text-lg flex items-center gap-2 text-red-400">
                                        📍 <span><strong>Location:</strong> {data.event.location}</span>
                                    </p>
                                    <p className="text-lg flex items-center gap-2 text-orange-400">
                                        ⏳ <span><strong>Deadline:</strong> {data.event ? dayjs(data.event.deadline).format("D ddd YYYY") : "Loading..."}</span>
                                    </p>
                                    <div>
                                        <h2 className="text-xl text-blue-300 font-semibold mb-2">Description:</h2>
                                        <p className="text-gray-300 text-md leading-relaxed">{data.event.des}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    {/* Members List */}
                    <div className="shadow-lg rounded-xl p-6 border border-blue-500 mt-6">
                        <div className="border-b border-blue-400 pb-2 mb-4 flex justify-between items-center">
                            <h1 className="text-blue-300 text-2xl font-bold text-center">
                                Registered Members
                            </h1>
                            <button onClick={downloadData} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Download Data
                            </button>
                        </div>
                        <div className="space-y-4">
                            {data.members.map((member, index) => (
                                <div key={index} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                                    {data.event?.team_size == "1" ?
                                        <>
                                            <p className="text-lg text-white">{member.name}</p>
                                            <span className="text-sm text-gray-400">{member.collage_id}</span>
                                        </>
                                        : <>

                                            <p className="text-lg text-white">{member.team_name}</p>
                                            <span className="text-sm text-gray-400">{member.team_lead?.name}</span>
                                        </>}
                                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded" onClick={() => handleViewClick(index)} >
                                        View
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                footer={null}
                open={isView}
                onCancel={() => setView(null)}
                className="custom-modal "
            >
                <div className="bg-[#1E1E2F] p-6 rounded-xl shadow-lg mt-5">
                    <h3 className="text-xl font-bold text-white">Participant Details</h3>
                    <div className="mt-3 text-gray-300 text-sm">
                        <p><span className="font-bold text-blue-400">Name:</span> {isView?.name || "N/A"}</p>
                        <p><span className="font-bold text-blue-400">Email:</span> {isView?.email || "N/A"}</p>
                        <p><span className="font-bold text-blue-400">Mobile:</span> {isView?.mobile || "N/A"}</p>
                        <p><span className="font-bold text-blue-400">College ID:</span> {isView?.collage_id || "N/A"}</p>
                        <p><span className="font-bold text-blue-400">Branch:</span> {isView?.branch || "N/A"}</p>
                    </div>
                </div>
            </Modal>

            <Modal
                footer={null}
                open={isView && data?.event?.team_size != "1"}
                onCancel={() => setView(null)}
                className="custom-modal"
            >
                <div className="bg-[#1E1E2F] p-6 rounded-xl shadow-lg mt-5">
                    <h3 className="text-xl font-bold text-white">Team Details</h3>

                    {/* Team Info */}
                    <div className="mt-4 text-gray-300 text-sm">
                        <p><span className="font-bold text-blue-400">Team Name:</span> {isView?.team_name || "N/A"}</p>
                        <p><span className="font-bold text-blue-400">Team Code:</span> {isView?.team_code || "N/A"}</p>
                    </div>

                    {/* Members List */}
                    <h4 className="text-lg font-bold text-white mt-4">Team Lead</h4>
                    <div className="mt-2 space-y-2">
                        <div className="bg-[#2A2A3B] p-3 rounded-lg">
                            <p className="text-gray-300"><span className="font-bold text-blue-400">Name:</span> {isView?.team_lead?.name || "N/A"}</p>
                            <p className="text-gray-300"><span className="font-bold text-blue-400">Email:</span> {isView?.team_lead?.email || "N/A"}</p>
                            <p className="text-gray-300"><span className="font-bold text-blue-400">Mobile:</span> {isView?.team_lead?.mobile || "N/A"}</p>
                        </div>
                        <h4 className="text-lg font-bold text-white mt-4">Members</h4>

                        {isView?.members?.length > 0 ? (
                            team.members.map((member, index) => (
                                <div key={index} className="bg-[#2A2A3B] p-3 rounded-lg">
                                    <p className="text-gray-300"><span className="font-bold text-blue-400">Name:</span> {member.name}</p>
                                    <p className="text-gray-300"><span className="font-bold text-blue-400">Email:</span> {member.email}</p>
                                    <p className="text-gray-300"><span className="font-bold text-blue-400">Mobile:</span> {member.mobile}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400">No members available</p>
                        )}
                    </div>
                </div>
            </Modal>


        </>
    );
};

export default Registrations;
