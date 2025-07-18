import { format, differenceInMinutes, differenceInHours, differenceInDays } from "date-fns";

export const formatDate = (timestamp, formatStr = "MMM d, yyyy") => {
  return format(new Date(timestamp), formatStr);
};

export const formatTime = (timestamp, formatStr = "h:mm a") => {
  return format(new Date(timestamp), formatStr);
};

export const formatDateTime = (timestamp, formatStr = "MMM d, yyyy 'at' h:mm a") => {
  return format(new Date(timestamp), formatStr);
};

export const formatDuration = (startTime, endTime) => {
  const minutes = differenceInMinutes(endTime, startTime);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }
  return `${remainingMinutes}m`;
};

export const formatRelativeTime = (timestamp) => {
  const now = new Date();
  const date = new Date(timestamp);
  const minutes = differenceInMinutes(now, date);
  const hours = differenceInHours(now, date);
  const days = differenceInDays(now, date);
  
  if (minutes < 1) {
    return "Just now";
  } else if (minutes < 60) {
    return `${minutes}m ago`;
  } else if (hours < 24) {
    return `${hours}h ago`;
  } else if (days < 7) {
    return `${days}d ago`;
  } else {
    return formatDate(timestamp);
  }
};

export const getDateRangePresets = () => {
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
  
  return {
    today: {
      start: startOfToday,
      end: endOfToday,
    },
    thisWeek: {
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay()),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - today.getDay()), 23, 59, 59),
    },
    thisMonth: {
      start: new Date(today.getFullYear(), today.getMonth(), 1),
      end: new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59),
    },
    last30Days: {
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30),
      end: endOfToday,
    },
  };
};