import { LOCALE_STRING } from "../config";

/**
 * Formats a Date object into "Month Day, Year at HH:MM" format.
 * 
 * @param {Date} date - The Date object to format.
 * @returns {string} - The formatted date string.
 */
export function formatDate(date: Date): string {
  if (date){
    date = new Date(date)
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error('Invalid Date object');
    }
  
    // Format the date part
    const formattedDate: string = date.toLocaleDateString(LOCALE_STRING, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  
    // Format the time part (24-hour format without seconds)
    const formattedTime: string = date.toLocaleTimeString(LOCALE_STRING, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  
    // Return the combined formatted string
    return `${formattedDate} at ${formattedTime}`;
  } else
  return 'Date not set';

}