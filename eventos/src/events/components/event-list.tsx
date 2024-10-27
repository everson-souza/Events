import { useEffect, useState, useReducer } from "react";
import { Backdrop, CircularProgress, Divider, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EventCard from "./event-card";
import { Event } from "@/shared/interfaces/event";
import EventDialog from "./event-dialog";
import { Action } from '@/shared/types/action';
import { State } from '@/shared/interfaces/state'
import { getEvents } from "../api/event-api";
import { useWebSocket } from "@/shared/components/WebSocketContext";

export default function EventList() {

  const initialState: State = {
    events: [],
    organizedEvents: [],
    joinedEvents: [],
    loading: false,
    error: null,
  };

  const reducer = (state: State, action: Action) => {
    switch (action.type) {
      case "getEventsStart": {
        return {
          ...state,
          loading: true,
        };
      }
      case "getEventsSuccess": {
        return {
          ...state,
          loading: false,
          events: action.payload.events,
          organizedEvents: action.payload.organizedEvents,
          joinedEvents: action.payload.joinedEvents,
        };
      }
      case "getEventsError": {
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      }
      default: {
        return state;
      }
    }
  };

  const socket = useWebSocket();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchEvents = async () => {
      dispatch({ type: 'getEventsStart' });
      try {
        const eventsData = await getEvents();

        // Get the user id from localStorage
        const userId = localStorage.getItem('user_id');
        
        let events: Event[] = [];
        let organizedEvents: Event[] = [];
        let joinedEvents: Event[] = [];

        if (userId) {
          organizedEvents = eventsData.filter((event:Event) => event.organizer.id === parseInt(userId));
          joinedEvents = eventsData.filter((event:Event) => 
            event.joiners.some(joiner => joiner.id === parseInt(userId)) && 
            event.organizer.id !== parseInt(userId)
          );
        }

        const organizedAndJoinedIds = new Set([...organizedEvents.map(e => e.id), ...joinedEvents.map(e => e.id)]);
        events = eventsData.filter((event:Event) => !organizedAndJoinedIds.has(event.id));

        dispatch({
          type: 'getEventsSuccess',
          payload: {
            events,
            organizedEvents,
            joinedEvents,
          },
        });
      } catch (error:any) {
        dispatch({ type: 'getEventsError', payload: error.message });
      }
    };

    fetchEvents();

    if(socket){
      socket.onopen = () => {
        console.log("WebSocket connected");
        socket.send(JSON.stringify({ message: "Hello Server!" })); // Sending a test message
      };
    
      socket.onmessage = (event) => {
        fetchEvents();
        console.log("Message from server:", event.data);
      };
    
      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    
      socket.onclose = () => {
        console.log("WebSocket connection closed");
      };

    return () => {
      socket.close();
    };
    }
    
  }, [socket]);

  // Dialog functions
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  return (
    <div>
      <div className="principal">
        <EventDialog isOpen={isDialogOpen} closeDialog={closeDialog} />
        <div className="top">
          <h1>EVENTS</h1>
          <Fab  color="primary" onClick={openDialog}>
              <AddIcon />
          </Fab>
        </div>
        {state.loading ? (
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={state.loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        ) :
          <div>
            <Divider><h2>All Events</h2></Divider>
            <div className="events">
              {state.events.map((evento) => (
                <EventCard key={evento.id} evento={evento} type={'others'} />
              ))}
            </div>
            <Divider><h2>Organized Events</h2></Divider>
            <div className="events">
              {state.organizedEvents.map((evento) => (
                <EventCard key={evento.id} evento={evento} type={'organized'}  />
              ))}
            </div>
            <Divider><h2>Joined Events</h2></Divider>
            <div className="events">
              {state.joinedEvents.map((evento) => (
                <EventCard key={evento.id} evento={evento} type={'joined'}  />
              ))}
            </div>
          </div>
        }
          
      </div>
    </div>
  );
}
