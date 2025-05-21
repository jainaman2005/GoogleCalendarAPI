import React, { useState, useEffect } from 'react';
import { listCalendarEvents, deleteCalendarEvent } from "../api/googleCalendarApi";

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarDay = ({ day, isToday, events, onEventClick }) => {
    return (
        <div className={`relative py-2 border rounded-md min-h-16 ${
            isToday ? 'bg-indigo-500 text-white font-bold' : 'hover:bg-gray-100'
        }`}>
            <div className="flex justify-between items-center px-1">
                <span>{day}</span>
                {events.length > 0 && (
                    <span className="bg-green-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {events.length}
                    </span>
                )}
            </div>

            <div className="mt-1 space-y-1">
                {events.slice(0, 2).map((event) => (
                    <div
                        key={event.id}
                        onClick={(e) => {
                            e.stopPropagation();
                            onEventClick(event);
                        }}
                        className="text-sm p-1 rounded truncate cursor-pointer hover:bg-gray-200 flex items-start"
                        title={`${event.summary}\nClick for options`}
                    >
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-1 flex-shrink-0"></span>
                        <span className="truncate">{event.summary}</span>
                    </div>
                ))}
                {events.length > 2 && (
                    <div className="text-xs text-gray-500">+{events.length - 2} more</div>
                )}
            </div>
        </div>
    );
};

export default function Calendar() {
    const today = new Date();
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEventOptions, setShowEventOptions] = useState(false);

    // Calculate calendar data
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const emptySlots = Array.from({ length: firstDayOfMonth });
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Fetch events when month changes
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const response = await listCalendarEvents();
                setEvents(response || []);
            } catch (error) {
                console.error("Error fetching events:", error);
                setError("Failed to load calendar events");
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [currentMonth, currentYear]);

    const getEventsForDay = (day) => {
        const dateStr = new Date(currentYear, currentMonth, day)
            .toISOString()
            .split('T')[0];
        return events.filter(event => {
            const startDate = event.start?.date || event.start?.dateTime;
            return startDate?.startsWith(dateStr);
        });
    };

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setShowEventOptions(true);
    };

    const handleDeleteEvent = async () => {
        try {
            await deleteCalendarEvent(selectedEvent.id);
            setEvents(prev => prev.filter(e => e.id !== selectedEvent.id));
            setShowDeleteModal(false);
            setShowEventOptions(false);
        } catch (error) {
            console.error("Error deleting event:", error);
            setError("Failed to delete event");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen p-4">
                <div className="bg-red-100 text-red-700 p-4 rounded-md max-w-md">
                    <h3 className="font-bold">Error</h3>
                    <p className="mb-2">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-screen mx-auto bg-white rounded-lg p-4">
            {/* Month navigation */}
            <div className="mb-6 flex justify-center items-center">
                <button 
                    className="text-2xl font-bold text-center text-gray-400 cursor-pointer hover:text-gray-600" 
                    onClick={handlePrevMonth}
                >
                    {'<'}
                </button>
                <h2 className="text-2xl font-bold text-center text-gray-800 mx-10">
                    {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}
                </h2>
                <button 
                    className="text-2xl font-bold text-center text-gray-400 cursor-pointer hover:text-gray-600" 
                    onClick={handleNextMonth}
                >
                    {'>'}
                </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {daysOfWeek.map(day => (
                    <div key={day} className="text-center font-medium text-gray-500 py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
                {emptySlots.map((_, idx) => (
                    <div key={`empty-${idx}`} className="h-16"></div>
                ))}

                {days.map(day => (
                    <div key={day} onClick={() => setSelectedDay(day)}>
                        <CalendarDay
                            day={day}
                            isToday={day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()}
                            events={getEventsForDay(day)}
                            onEventClick={handleEventClick}
                        />
                    </div>
                ))}
            </div>

            {/* Event Options Modal */}
            {showEventOptions && selectedEvent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Event Options</h3>
                            <button
                                onClick={() => setShowEventOptions(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="mb-4">
                            <h4 className="font-semibold">{selectedEvent.summary}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                                {selectedEvent.start.dateTime
                                    ? new Date(selectedEvent.start.dateTime).toLocaleString()
                                    : 'All day event'}
                            </p>
                            {selectedEvent.location && (
                                <p className="text-sm text-gray-500 mt-1">
                                    Location: {selectedEvent.location}
                                </p>
                            )}
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setShowEventOptions(false);
                                    setShowDeleteModal(true);
                                }}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            >
                                Delete Event
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedEvent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
                        <p className="mb-4">Are you sure you want to delete "{selectedEvent.summary}"?</p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteEvent}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Day Events Modal */}
            {selectedDay && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">
                                Events for {selectedDay} {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'short' })}
                            </h3>
                            <button
                                onClick={() => setSelectedDay(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        {getEventsForDay(selectedDay).length > 0 ? (
                            <div className="space-y-3">
                                {getEventsForDay(selectedDay).map((event) => (
                                    <div 
                                        key={event.id} 
                                        className="border-b pb-3 last:border-0 cursor-pointer hover:bg-gray-50 p-2 rounded"
                                        onClick={() => handleEventClick(event)}
                                    >
                                        <h4 className="font-semibold">{event.summary}</h4>
                                        <p className="text-sm text-gray-600">
                                            {event.start.dateTime
                                                ? new Date(event.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                : 'All day'}
                                        </p>
                                        {event.location && (
                                            <p className="text-sm text-gray-500 mt-1">
                                                Location: {event.location}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No events scheduled</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}