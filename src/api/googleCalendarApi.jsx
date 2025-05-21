const createCalendarEvent = async (eventData) => {
    if (!window.gapi.client) {
        throw new Error("Google API client not loaded");
    }
    await window.gapi.client.load('calendar', 'v3');
    try {
        const response = await window.gapi.client.calendar.events.insert({
            calendarId: 'primary',
            resource: eventData,
        });
        return response.result;
    } catch (error) {
        console.error("Error creating event:", error);
        throw error;
    }
};

const listCalendarEvents = async () => {
    if (!window.gapi.client) {
        throw new Error("Google API client not loaded");
    }
    try {
        await window.gapi.client.load('calendar', 'v3');
        const response = await window.gapi.client.calendar.events.list({
            calendarId: 'primary',
            timeMin: new Date().toISOString(),
            showDeleted: false,
            singleEvents: true,
            maxResults: 10,
            orderBy: 'startTime',
        });
        return response.result.items;
    } catch (error) {
        console.error("Error fetching events:", error);
        throw error;
    }
};
const deleteCalendarEvent = async (eventId) => {
  try {
    // Ensure the Calendar API is loaded
    await window.gapi.client.load('calendar', 'v3');

    // Delete the event by ID
    await window.gapi.client.calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId,
    });

    console.log(`Event with ID ${eventId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};
export { createCalendarEvent, listCalendarEvents ,deleteCalendarEvent};
