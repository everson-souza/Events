# app/main.py
from fastapi import FastAPI, WebSocket, Depends
from app.users import routes as user_routes
from app.events import routes as event_routes
from app.database import engine, Base
from app.websockets import websocket_manager
from app.users.models import User
from app.events.models import Event
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

# Include routers for users and events
app.include_router(user_routes.router, prefix="/api")
app.include_router(event_routes.router, prefix="/api")

# WebSocket endpoint
@app.websocket("/ws/events")
async def websocket_endpoint(websocket: WebSocket):
    await websocket_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await websocket_manager.broadcast(f"Message received: {data}")
    except WebSocketDisconnect:
        await websocket_manager.disconnect(websocket)
