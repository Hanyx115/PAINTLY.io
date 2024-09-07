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

### `/public/index.html`

The main HTML file that includes the canvas element and links to the CSS and JavaScript files.

### `/public/style.css`

CSS file for styling the canvas and other UI elements.

### `/public/script.js`

JavaScript file handling the drawing logic, real-time updates, and interaction with the Socket.io server.

### `server.js`

Node.js server setup for handling WebSocket connections using Socket.io.

