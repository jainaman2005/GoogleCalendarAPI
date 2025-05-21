// Format a JS Date object into RFC3339 format (for Google Calendar)
export const toRFC3339 = (date) => {
    return new Date(date).toISOString();
};

// Format a date-time nicely for displaying to user
export const formatDateTime = (dateString) => {
    const options = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    };
    return new Date(dateString).toLocaleString(undefined, options);
};

// Get current date-time in RFC3339 (useful for "timeMin" when fetching events)
export const getCurrentDateTimeRFC3339 = () => {
    return new Date().toISOString();
};
