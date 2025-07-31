import React from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, format, isSameMonth, isSameDay } from 'date-fns';

interface CalendarProps {
  appointments: { date: string; time: string; status: string }[];
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date;
}

export const DoctorCalendar: React.FC<CalendarProps> = ({ appointments, onDateSelect, selectedDate }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = '';

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, 'yyyy-MM-dd');
      const hasAppointment = appointments.some(a => a.date === formattedDate);
      days.push(
        <div
          className={`flex flex-col items-center justify-center h-12 w-12 rounded-lg cursor-pointer select-none mb-1
            ${!isSameMonth(day, monthStart) ? 'text-gray-300' : isSameDay(day, today) ? 'bg-cyan-100 text-cyan-700' : 'text-gray-900'}
            ${hasAppointment ? 'border-2 border-cyan-400' : ''}
            ${selectedDate && isSameDay(day, selectedDate) ? 'bg-cyan-400 text-white' : ''}
          `}
          key={day.toString()}
          onClick={() => isSameMonth(day, monthStart) && onDateSelect?.(new Date(day))}
        >
          <span>{format(day, 'd')}</span>
          {hasAppointment && <span className="w-2 h-2 bg-cyan-400 rounded-full mt-1"></span>}
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="flex justify-between" key={day.toString()}>
        {days}
      </div>
    );
    days = [];
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => setCurrentMonth(addDays(monthStart, -1))} className="text-cyan-500 font-bold">{'<'}</button>
        <span className="font-semibold text-lg">{format(currentMonth, 'MMMM yyyy')}</span>
        <button onClick={() => setCurrentMonth(addDays(monthEnd, 1))} className="text-cyan-500 font-bold">{'>'}</button>
      </div>
      <div className="grid grid-cols-7 mb-2 text-xs text-center text-gray-500">
        <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
      </div>
      <div className="grid grid-rows-6 grid-cols-7 gap-1">
        {rows}
      </div>
    </div>
  );
};
