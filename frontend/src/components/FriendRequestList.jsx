// components/FriendRequestList.jsx
import React, { useEffect, useState } from "react";
import axios from "../axios";
import toast from "react-hot-toast";

const FriendRequestList = () => {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await axios.get("/friend/requests");
      setRequests(res.data);
    } catch (error) {
      toast.error("Failed to load friend requests");
    }
  };

  const handleAction = async (requestId, action) => {
    try {
      await axios.post(`/friend/${action}`, { requestId });
      toast.success(`Request ${action}ed`);
      setRequests((prev) => prev.filter((r) => r._id !== requestId));
    } catch (err) {
      toast.error("Action failed");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Friend Requests</h2>
      {requests.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        requests.map((req) => (
          <div
            key={req._id}
            className="flex justify-between items-center mb-3 border-b pb-2"
          >
            <span>{req.sender.name}</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleAction(req._id, "accept")}
                className="bg-green-500 text-white px-2 py-1 rounded"
              >
                Accept
              </button>
              <button
                onClick={() => handleAction(req._id, "reject")}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default FriendRequestList;
