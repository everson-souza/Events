import { User } from "./user";

export type Event = {
  id: number;
  title: string;
  description: string;
  organizer_id?: number; 
  organizer: User;  
  date: Date;
  duration: number;  
  location: string;  
  joiners: User[];
  status: number;
};