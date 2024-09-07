// Get canvas element and context
const canvas = document.getElementById('drawCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.7;

// History for undo/redo
let drawingHistory = [];
let undoHistory = [];

// Variables for drawing states
let isDrawing = false;
let startX, startY;
let shapeMode = 'free';
let isFilled = false;
let currentOpacity = 1;
let isEraser = false;
let currentText = '';
let imageObj = new Image();
let rotationAngle = 0;

// Variables for toolbar
const colorPicker = document.getElementById('colorPicker');
const lineWidthSlider = document.getElementById('lineWidth');
const shapeSelector = document.getElementById('shape');
const fillShapeCheckbox = document.getElementById('fillShape');
const clearButton = document.getElementById('clearCanvas');
const undoButton = document.getElementById('undo');
const redoButton = document.getElementById('redo');
const eraserButton = document.getElementById('eraserTool');
const textButton = document.getElementById('addText');
const uploadImage = document.getElementById('uploadImage');
const saveButton = document.getElementById('saveDrawing');
const opacitySlider = document.getElementById('opacity');

// Update the drawing properties
shapeSelector.addEventListener('change', (e) => shapeMode = e.target.value);
fillShapeCheckbox.addEventListener('change', (e) => isFilled = e.target.checked);
opacitySlider.addEventListener('input', (e) => currentOpacity = e.target.value);

// Change stroke color and fill
colorPicker.addEventListener('input', (e) => {
    ctx.strokeStyle = e.target.value;
    ctx.fillStyle = e.target.value;
});

// Adjust line width
lineWidthSlider.addEventListener('input', (e) => ctx.lineWidth = e.target.value);

// Start drawing (free drawing, shapes, text, etc.)
function startDrawing(e) {
    isDrawing = true;
    startX = e.clientX - canvas.offsetLeft;
    startY = e.clientY - canvas.offsetTop;

    if (shapeMode === 'free') {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
    }
}

function draw(e) {
    if (!isDrawing) return;

    const currentX = e.clientX - canvas.offsetLeft;
    const currentY = e.clientY - canvas.offsetTop;

    if (isEraser) {
        ctx.globalCompositeOperation = 'destination-out'; // Erasing
        ctx.lineTo(currentX, currentY);
        ctx.stroke();
    } else {
        ctx.globalCompositeOperation = 'source-over'; // Normal drawing
        ctx.globalAlpha = currentOpacity;

        if (shapeMode === 'free') {
            ctx.lineTo(currentX, currentY);
            ctx.stroke();
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(imageObj, 0, 0); // Re-draw image if uploaded
            restoreHistory();
            ctx.beginPath();

            if (shapeMode === 'rect') {
                drawRectangle(startX, startY, currentX - startX, currentY - startY);
            } else if (shapeMode === 'circle') {
                drawCircle(startX, startY, Math.hypot(currentX - startX, currentY - startY));
            }
        }
    }
}

function stopDrawing() {
    if (!isDrawing) return;
    isDrawing = false;
    saveHistory();
}

function drawRectangle(x, y, width, height) {
    ctx.rect(x, y, width, height);
    isFilled ? ctx.fill() : ctx.stroke();
}

function drawCircle(x, y, radius) {
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    isFilled ? ctx.fill() : ctx.stroke();
}

// Undo and Redo
function saveHistory() {
    drawingHistory.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    undoHistory = [];
}

function undoDrawing() {
    if (drawingHistory.length > 0) {
        undoHistory.push(drawingHistory.pop());
        restoreHistory();
    }
}

function redoDrawing() {
    if (undoHistory.length > 0) {
        drawingHistory.push(undoHistory.pop());
        restoreHistory();
    }
}

function restoreHistory() {
    if (drawingHistory.length > 0) {
        ctx.putImageData(drawingHistory[drawingHistory.length - 1], 0, 0);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

// Eraser tool
eraserButton.addEventListener('click', () => {
    isEraser = !isEraser;
    eraserButton.textContent = isEraser ? 'Disable Eraser' : 'Eraser';
});

// Text tool
textButton.addEventListener('click', () => {
    const text = prompt('Enter text to add:');
    if (text) {
        ctx.globalAlpha = currentOpacity;
        ctx.font = `${ctx.lineWidth * 10}px sans-serif`;
        ctx.fillText(text, startX, startY);
        saveHistory();
    }
});

// Image upload and drawing over image
uploadImage.addEventListener('change', (e) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        imageObj.src = event.target.result;
        imageObj.onload = () => ctx.drawImage(imageObj, 0, 0, canvas.width, canvas.height);
    };
    reader.readAsDataURL(e.target.files[0]);
});

// Clear canvas
clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawingHistory = [];
    undoHistory = [];
});

// Save drawing as an image
saveButton.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});

// Undo/Redo event listeners
undoButton.addEventListener('click', undoDrawing);
redoButton.addEventListener('click', redoDrawing);

// Canvas event listeners
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);


// Connect to the WebSocket server
const socket = io();

// Start drawing (client-side only)
function startDrawing(e) {
    isDrawing = true;
    startX = e.clientX - canvas.offsetLeft;
    startY = e.clientY - canvas.offsetTop;

    if (shapeMode === 'free') {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
    }
}

// Function to send drawing data to other clients
function sendDrawingData(type, x1, y1, x2, y2, color, lineWidth, shapeMode, isFilled) {
    const drawingData = {
        type,
        x1, y1, x2, y2, color, lineWidth, shapeMode, isFilled
    };
    socket.emit('drawing', drawingData);
}

// Draw shapes and freehand
function draw(e) {
    if (!isDrawing) return;

    const currentX = e.clientX - canvas.offsetLeft;
    const currentY = e.clientY - canvas.offsetTop;

    ctx.globalAlpha = currentOpacity;

    if (shapeMode === 'free') {
        // Free drawing
        ctx.lineTo(currentX, currentY);
        ctx.stroke();

        // Send free drawing data to server
        sendDrawingData('free', startX, startY, currentX, currentY, ctx.strokeStyle, ctx.lineWidth, shapeMode, isFilled);
    } else {
        // Clear the canvas for drawing shapes
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Restore previous drawings from history
        restoreHistory();

        ctx.beginPath();

        if (shapeMode === 'rect') {
            drawRectangle(startX, startY, currentX - startX, currentY - startY);
        } else if (shapeMode === 'circle') {
            drawCircle(startX, startY, Math.hypot(currentX - startX, currentY - startY));
        }

        // Send shape data to server
        sendDrawingData('shape', startX, startY, currentX, currentY, ctx.strokeStyle, ctx.lineWidth, shapeMode, isFilled);
    }
}

// Listen for incoming drawing data from other clients
socket.on('drawing', (data) => {
    const { type, x1, y1, x2, y2, color, lineWidth, shapeMode, isFilled } = data;

    // Set drawing properties
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;

    if (type === 'free') {
        // Free drawing
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    } else if (type === 'shape') {
        // Drawing shapes
        if (shapeMode === 'rect') {
            ctx.rect(x1, y1, x2 - x1, y2 - y1);
        } else if (shapeMode === 'circle') {
            ctx.arc(x1, y1, Math.hypot(x2 - x1, y2 - y1), 0, Math.PI * 2);
        }
        isFilled ? ctx.fill() : ctx.stroke();
    }
});

// Event listeners for drawing actions
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);