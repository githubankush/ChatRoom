import React, { useEffect, useState, useCallback } from "react";
import axios from "../axios";
import toast from "react-hot-toast";
import useSocket from "../hooks/useSocket";

const SkeletonItem = () => (
  <div className="animate-pulse flex items-center gap-3 py-3">
    <div className="w-10 h-10 bg-gray-200 rounded-full" />
    <div className="flex-1">
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/4" />
    </div>
  </div>
);

const FriendRequestList = ({ userId }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket, isConnected } = useSocket();

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/friend/requests", { withCredentials: true });
      // Expecting an array of requests with sender object
      setRequests(res.data || []);
    } catch (error) {
      console.error("Failed to load friend requests:", error);
      toast.error("Failed to load friend requests");
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle accept/reject with optimistic UI & rollback
  const handleAction = useCallback(
    async (requestId, action) => {
      // optimistic remove
      const prev = requests;
      setRequests((r) => r.filter((x) => x._id !== requestId));
      try {
        await axios.post(`/friend/${action}`, { requestId }, { withCredentials: true });
        toast.success(`Request ${action}ed`);
      } catch (err) {
        // rollback on error
        console.error(`${action} failed`, err);
        setRequests(prev);
        toast.error("Action failed. Try again.");
      }
    },
    [requests]
  );

  // Socket listener to push incoming requests (and show popup)
  useEffect(() => {
    if (!socket || !isConnected || !userId) return;

    // Join personal room (safe to call repeatedly)
    socket.emit("joinRoom", userId);

    const onIncoming = (payload) => {
      // Expecting payload.request object (see server suggestion)
      const incoming = payload?.request;
      if (!incoming) {
        // fallback: if server sent minimal data, create a lightweight object
        const fallback = {
          _id: payload?.id || `${Date.now()}`,
          sender: { name: payload?.from || "Unknown" },
          createdAt: new Date().toISOString(),
        };
        setRequests((prev) => [fallback, ...prev]);
        toast(payload?.message || "New friend request");
        return;
      }

      // Add to top of list
      setRequests((prev) => {
        // avoid duplicates
        if (prev.some((r) => r._id === incoming._id)) return prev;
        return [incoming, ...prev];
      });

      // short, informative popup
      toast.success(`${incoming.sender?.name || "Someone"} sent you a friend request`);
    };

    socket.on("friendRequestNotification", onIncoming);

    return () => {
      socket.off("friendRequestNotification", onIncoming);
    };
  }, [socket, isConnected, userId]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return (
    <div className="p-4 bg-white rounded shadow-md max-w-md mx-auto w-full">
      <h2 className="text-lg font-semibold mb-3">Friend Requests</h2>

      {loading ? (
        <div aria-busy="true" aria-live="polite">
          <SkeletonItem />
          <SkeletonItem />
          <SkeletonItem />
        </div>
      ) : requests.length === 0 ? (
        <p className="text-sm text-gray-600">No pending requests</p>
      ) : (
        <ul className="space-y-3">
          {requests.map((req) => (
            <li
              key={req._id}
              className="flex items-center justify-between gap-3 p-2 rounded border"
            >
              <div className="flex items-center gap-3">
                <img
                  src={req.sender?.avatar || `/default-avatar.webp`}
                  alt={`${req.sender?.name || "User"}'s avatar`}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium">{req.sender?.name || "Unknown"}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(req.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleAction(req._id, "accept")}
                  className="px-3 py-1 rounded bg-green-500 text-white text-sm disabled:opacity-50"
                  aria-label={`Accept friend request from ${req.sender?.name || "user"}`}
                >
                  Accept
                </button>
                <button
                  onClick={() => handleAction(req._id, "reject")}
                  className="px-3 py-1 rounded bg-red-500 text-white text-sm disabled:opacity-50"
                  aria-label={`Reject friend request from ${req.sender?.name || "user"}`}
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendRequestList;
