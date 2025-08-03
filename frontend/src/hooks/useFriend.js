import axios from "axios";

const useFriend = () => {
  const sendRequest = async (receiverId) => {
    return await axios.post(`/api/friend/send/${receiverId}`, {}, { withCredentials: true });
  };

  const acceptRequest = async (requestId) => {
    return await axios.put(`/api/friend/accept/${requestId}`, {}, { withCredentials: true });
  };

  const rejectRequest = async (requestId) => {
    return await axios.put(`/api/friend/reject/${requestId}`, {}, { withCredentials: true });
  };

  const getReceivedRequests = async () => {
    return await axios.get(`/api/friend/requests`, { withCredentials: true });
  };

  const getSentRequests = async () => {
    return await axios.get(`/api/friend/sent`, { withCredentials: true });
  };

  return {
    sendRequest,
    acceptRequest,
    rejectRequest,
    getReceivedRequests,
    getSentRequests,
  };
};

export default useFriend;
