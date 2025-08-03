const formatChatTime = (timestamp) => {
  if (!timestamp) return "";

  const now = new Date();
  const date = new Date(timestamp);

  const isToday = now.toDateString() === date.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = yesterday.toDateString() === date.toDateString();

  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  if (isToday) {
    return <>{time}</>;
  } else if (isYesterday) {
    return (
      <>
        Yesterday<br />
        {time}
      </>
    );
  } else {
    const formattedDate = date.toLocaleDateString("en-GB"); // dd/mm/yyyy
    return (
      <>
        {formattedDate}<br />
        {time}
      </>
    );
  }
};

export default formatChatTime;
