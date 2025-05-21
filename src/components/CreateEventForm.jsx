import React, { useState } from 'react';
import { createCalendarEvent } from '../api/googleCalendarApi';

const CreateEventForm = () => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const defaultEvent = {
    title: '',
    location: '',
    description: '',
    start: '',
    end: ''
  };

  const [eventDetails, setEventDetails] = useState(defaultEvent);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    // Basic validation
    if (!eventDetails.title || !eventDetails.start || !eventDetails.end) {
      setError('Title, start time, and end time are required');
      setIsSubmitting(false);
      return;
    }

    const googleEvent = {
      summary: eventDetails.title,
      location: eventDetails.location,
      description: eventDetails.description,
      start: {
        dateTime: new Date(eventDetails.start).toISOString(),
        timeZone: userTimeZone,
      },
      end: {
        dateTime: new Date(eventDetails.end).toISOString(),
        timeZone: userTimeZone,
      }
    };

    try {
      await createCalendarEvent(googleEvent);
      setSuccess(true);
      setEventDetails(defaultEvent);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to add event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setEventDetails(defaultEvent);
    setError(null);
    setSuccess(false);
  };

  return (
    <form 
      onSubmit={handleSubmit}
      onReset={handleReset}
      className="max-w-xl max-h-screen mx-auto p-2 bg-white shadow-md rounded-lg space-y-4"
    >
      <h2 className="text-2xl font-bold text-gray-800">Create New Event</h2>
      
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-3 bg-green-100 text-green-700 rounded-md">
          Event created successfully!
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title *
        </label>
        <input
          type="text"
          name="title"
          value={eventDetails.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <input
          type="text"
          name="location"
          value={eventDetails.location}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          rows="3"
          value={eventDetails.description}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="start" className="block text-sm font-medium text-gray-700">
          Start Date & Time *
        </label>
        <input
          type="datetime-local"
          name="start"
          value={eventDetails.start}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="end" className="block text-sm font-medium text-gray-700">
          End Date & Time *
        </label>
        <input
          type="datetime-local"
          name="end"
          value={eventDetails.end}
          onChange={handleChange}
          required
          min={eventDetails.start}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="flex items-center justify-between pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-[48%] px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
        >
          {isSubmitting ? 'Creating...' : 'Add Event'}
        </button>
        <button
          type="reset"
          className="w-[48%] px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
        >
          Clear All
        </button>
      </div>
    </form>
  );
};

export default CreateEventForm;