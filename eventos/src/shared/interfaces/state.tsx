import { Event } from "./event";

export interface State {
    events: Event[];
    organizedEvents: Event[];
    joinedEvents: Event[];
    loading: boolean;
    error: string | null;
  }