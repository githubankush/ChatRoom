// utils/groupMessagesByDate.js
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";

dayjs.extend(isToday);
dayjs.extend(isYesterday);

export const groupMessagesByDate = (messages) => {
  const groups = {};

  messages.forEach((message) => {
    const date = dayjs(message.createdAt);

    let label = date.format("DD/MM/YYYY");

    if (date.isToday()) label = "Today";
    else if (date.isYesterday()) label = "Yesterday";

    if (!groups[label]) {
      groups[label] = [];
    }

    groups[label].push(message);
  });

  return groups;
};
