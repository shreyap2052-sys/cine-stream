# Cine-Stream

Cine-Stream is a movie discovery web application built with React. It uses the OMDb API to display movie information and includes search, infinite scrolling, favorites, and an AI-powered mood matcher.

## Features

- Browse popular movie results
- Search movies with debounced input
- Infinite scrolling for additional results
- Movie posters with lazy loading
- Movie ratings, release years, and titles
- Add and remove movies from Favorites
- Favorites saved using localStorage
- Dedicated Favorites page
- AI Mood Matcher using Gemini
- Mood Matcher connects AI recommendations with OMDb results
- Responsive movie grid
- Graceful handling of missing posters and API errors

## Workflow

1. Movies are fetched from the OMDb API.
2. Movies are displayed in a responsive grid.
3. Search requests are delayed by 500ms using debouncing.
4. Infinite scrolling loads additional movie results when the user reaches the bottom.
5. Favorite movies are stored in localStorage.
6. The Mood Matcher sends the user's description to Gemini.
7. Gemini returns a movie title.
8. The title is searched through OMDb and the recommended movie is displayed.

## Tech Stack

- React
- Vite
- JavaScript
- CSS
- OMDb API
- Google Gemini API
- Vercel
- localStorage
- IntersectionObserver

## Sprint 12 — Real-Time Systems

This project includes a real-time communication feature built with Socket.io.

### Features

- Real-time bidirectional messaging
- User identification
- Typing indicators
- General room
- Tech Support room
- Room-specific message isolation
- Connection status
- Responsive Live Room UI

### Architecture

The React frontend connects to the Socket.io server running in the Data Hub backend.

Backend repository:

https://github.com/shreyap2052-sys/data-hub

### Socket Events

| Event | Purpose |
|---|---|
| `join-room` | Joins a user to a selected room |
| `chat-message` | Sends and broadcasts messages |
| `typing` | Notifies other users that someone is typing |
| `stop-typing` | Clears the typing indicator |
| `room-joined` | Confirms successful room joining |

### Available Rooms

- General
- Tech Support

Messages are isolated by room, so users only receive messages from their selected room.

### Testing

The real-time functionality was tested using two browser instances.

Verified:

- Bidirectional messaging
- User names displayed with messages
- Typing indicators
- General room communication
- Tech Support room communication
- Room isolation
- Socket connection/disconnection handling