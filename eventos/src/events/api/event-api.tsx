import { Event } from '@/shared/interfaces/event';
import { User } from '@/shared/interfaces/user';
import { BASE_URL } from '@/shared/config';
import axios from 'axios';

export const getEvents = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/events/`);
    console.log(response.data)
    return response.data;
  } catch (error:any) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const createEvent = async (eventData : Event) => {
  try {
    const response = await axios.post(`${BASE_URL}/events`, eventData);
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const editEvent = async (eventData : Event) => {
  try {
    const response = await axios.put(`${BASE_URL}/events/${eventData.id}`, eventData);
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const deleteEvent = async (eventId : number) => {
  try {
    await axios.delete(`${BASE_URL}/events/${eventId}`);
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

export const joinEvent = async (eventId : number, userId : number) => {
  try {
    const response = await axios.post(`${BASE_URL}/events/${eventId}/join?user_id=${userId}`);    
    return response.data;
  } catch (error) {
    console.error('Failed to join event. Please try again later.', error);
    throw error;
  }
};

export const removeEvent = async (eventId : number, userId : number) => {
  try {
    const response = await axios.post(`${BASE_URL}/events/${eventId}/remove?user_id=${userId}`); 
    return response.data;
  } catch (error) {
    console.error('Failed to remove event. Please try again later.', error);
    throw error;
  }
};