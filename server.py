from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from starlette.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from fastapi.requests import Request
import uvicorn

app = FastAPI()


# Set to store connected WebSocket clients
connected_clients = set()

# Function to broadcast messages to all connected clients
async def broadcast_message(message: str):
    for client in connected_clients:
        await client.send_text(message)

# Function to send a targeted notification to a specific client
async def send_notification_to_client(client: WebSocket, message: str):
    await client.send_text(message)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    # Accept the WebSocket connection
    await websocket.accept()
    connected_clients.add(websocket)
    try:
        while True:
            # Receive a message from the client
            data = await websocket.receive_text()
            print(f"Message from client: {data}")
            
            # For example, broadcast the message to all connected clients
            await broadcast_message(f"Broadcast message: {data}")
            
            # If you want to send a specific message back to the client
            await send_notification_to_client(websocket, f"Your message: {data}")
    
    except WebSocketDisconnect:
        # Handle disconnection
        print("Client disconnected")
    finally:
        # Ensure the client is removed from the set
        connected_clients.remove(websocket)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
