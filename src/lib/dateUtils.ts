// Utility functions for date handling to avoid timezone issues

/**
 * Get the local date string in YYYY-MM-DD format without timezone conversion
 */
export const getLocalDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get today's date in YYYY-MM-DD format (local timezone)
 */
export const getTodayString = (): string => {
  return getLocalDateString(new Date());
};

/**
 * Parse a YYYY-MM-DD date string to a Date object (local timezone)
 */
export const parseLocalDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Check if a date string represents today
 */
export const isToday = (dateString: string): boolean => {
  return dateString === getTodayString();
};

/**
 * Check if a date string represents a past date
 */
export const isPastDate = (dateString: string): boolean => {
  const today = getTodayString();
  return dateString < today;
};

/**
 * Get an array of date options starting from today
 */
export const getDateOptions = (daysCount: number = 14): { value: string; label: string }[] => {
  const options: { value: string; label: string }[] = [];
  const today = new Date();
  
  for (let i = 0; i < daysCount; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const value = getLocalDateString(date);
    const label = i === 0 
      ? 'Today' 
      : i === 1 
        ? 'Tomorrow' 
        : date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          });
    
    options.push({ value, label });
  }
  
  return options;
};
