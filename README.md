# Drawing App with Real-Time Collaboration

## Overview

This project is a drawing application that allows users to draw on a canvas with real-time collaboration features. Users can draw freehand, create shapes, and see the updates made by others in real-time. The application uses Socket.io for WebSocket communication, allowing multiple users to interact with the canvas simultaneously.

## Features

- **Real-Time Collaboration**: Multiple users can draw on the same canvas and see each other's drawings in real-time.
- **Shape Drawing**: Draw rectangles, circles, and freehand shapes.
- **Color and Line Thickness**: Choose colors and adjust line thickness.
- **Undo/Redo**: Undo and redo drawing actions.
- **Eraser Tool**: Erase parts of the drawing.
- **Text Tool**: Add text to the canvas.
- **Image Upload and Drawing Over Image**: Upload images to draw on top of them.
- **Opacity Control**: Adjust the opacity of drawing tools.
- **Shape Rotation**: Rotate shapes before drawing.
- **Customizable Background**: Set a background color or image.

## Project Structure
/drawing-app ├── /public │ ├── index.html │ ├── style.css │ └── script.js └── server.js

### `/public/index.html`

The main HTML file that includes the canvas element and links to the CSS and JavaScript files.

### `/public/style.css`

CSS file for styling the canvas and other UI elements.

### `/public/script.js`

JavaScript file handling the drawing logic, real-time updates, and interaction with the Socket.io server.

### `server.js`

Node.js server setup for handling WebSocket connections using Socket.io.

### Install Dependencies
Install Node.js dependencies:
`npm install`

### Run the Server
Start the server with:
`node server.js`.
* The server will start on port 3000 by default. Open http://localhost:3000 in your browser to access the drawing app.

## How It Works
* Server-Side (server.js)
* Setup: Creates an Express server and integrates Socket.io for real-time communication.
* Serve Static Files: Serves static files from the public directory.
* WebSocket Events:
* connection: Logs when a user connects and sets up listeners for drawing events.
* drawing: Broadcasts drawing data to all other clients.
* disconnect: Logs when a user disconnects.
* Client-Side (/public/script.js)
* Socket.io Connection: Connects to the Socket.io server.
* Drawing Functions:
* startDrawing: Initializes drawing.
* draw: Handles freehand drawing and shape drawing.
* sendDrawingData: Sends drawing data to the server.
* socket.on('drawing'): Listens for drawing data from the server and updates the canvas.
* Event Listeners: For mouse events to handle drawing on the canvas.
* Front-End (/public/index.html and /public/style.css)
* HTML: Includes a canvas element and links to the CSS and JavaScript files.
* CSS: Styles the canvas and other UI elements.
* Socket.io Integration
* Server-Side: socket.io library is used to create WebSocket connections and handle real-time communication.
* Client-Side: socket.io-client library is used to connect to the WebSocket server and handle incoming and outgoing messages.

### `License`

This is a brief overview and directs to the `LICENSE` file for detailed information.
