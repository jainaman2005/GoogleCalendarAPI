# React + Vite
/src
  ├── /api
  │     └── googleCalendarApi.js     // All Google Calendar API calls (insert, update, delete events)
  │
  ├── /components
  │     ├── AuthButton.jsx            // Login / Logout buttons
  │     ├── CreateEventForm.jsx       // Form to create a new event
  │     └── EventList.jsx             // (Optional) List all events
  │
  ├── /services
  │     └── gapiService.js            // Handles gapi client init, auth, sign-in, sign-out
  │
  ├── /hooks
  │     └── useGoogleAuth.js          // Custom hook to manage auth state (isSignedIn, user info)
  │
  ├── /utils
  │     └── dateUtils.js              // (Optional) Handle datetime formatting for calendar
  │
  ├── /context
  │     └── AuthContext.jsx           // (Optional) Global state for auth (React Context API)
  │
  ├── App.jsx                         // Main App component (renders login/logout, event form)
  ├── index.js                        // ReactDOM entry point
  └── config.js                       // Your Client ID, API Key, SCOPES (use env vars here)

