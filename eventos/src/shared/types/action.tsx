import { Event } from "@/shared/interfaces/event";

export type Action =
    | { type: 'getEventsStart' }
    | { type: 'getEventsSuccess'; payload: { events: Event[]; organizedEvents: Event[]; joinedEvents: Event[] } }
    | { type: 'getEventsError'; payload: string };