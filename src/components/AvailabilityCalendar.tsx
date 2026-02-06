import { useState, useMemo } from 'react';
import { format, isSameDay, isWithinInterval, addDays, startOfDay, isBefore, isAfter } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { mockBookings } from '@/data/mockData';

interface AvailabilityCalendarProps {
  carId: string;
  selectedRange: { start: Date | null; end: Date | null };
  onRangeSelect: (range: { start: Date | null; end: Date | null }) => void;
}

export function AvailabilityCalendar({ carId, selectedRange, onRangeSelect }: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectingEnd, setSelectingEnd] = useState(false);

  const bookedDates = useMemo(() => {
    const carBookings = mockBookings.filter(b => b.carId === carId && b.status === 'confirmed');
    const dates: Date[] = [];
    
    carBookings.forEach(booking => {
      let current = startOfDay(new Date(booking.startDate));
      const end = startOfDay(new Date(booking.endDate));
      
      while (current <= end) {
        dates.push(new Date(current));
        current = addDays(current, 1);
      }
    });
    
    return dates;
  }, [carId]);

  const isDateBooked = (date: Date) => {
    return bookedDates.some(bookedDate => isSameDay(bookedDate, date));
  };

  const isDateInSelectedRange = (date: Date) => {
    if (!selectedRange.start || !selectedRange.end) return false;
    return isWithinInterval(date, { start: selectedRange.start, end: selectedRange.end });
  };

  const isDateSelectable = (date: Date) => {
    const today = startOfDay(new Date());
    if (isBefore(date, today)) return false;
    if (isDateBooked(date)) return false;
    
    // If selecting end date, check if any booked dates are between start and this date
    if (selectingEnd && selectedRange.start) {
      const start = selectedRange.start;
      for (const bookedDate of bookedDates) {
        if (isAfter(bookedDate, start) && isBefore(bookedDate, date)) {
          return false;
        }
      }
    }
    
    return true;
  };

  const handleDateClick = (date: Date) => {
    if (!isDateSelectable(date)) return;

    if (!selectingEnd || !selectedRange.start) {
      // Selecting start date
      onRangeSelect({ start: date, end: null });
      setSelectingEnd(true);
    } else {
      // Selecting end date
      if (isBefore(date, selectedRange.start)) {
        // If clicked date is before start, make it the new start
        onRangeSelect({ start: date, end: null });
      } else {
        onRangeSelect({ start: selectedRange.start, end: date });
        setSelectingEnd(false);
      }
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days: (Date | null)[] = [];
    
    // Add empty slots for days before the first day of month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const today = startOfDay(new Date());

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="font-semibold text-foreground">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-accent" />
          <span className="text-muted-foreground">Selected</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-destructive" />
          <span className="text-muted-foreground">Booked</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-secondary" />
          <span className="text-muted-foreground">Available</span>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const isPast = isBefore(date, today);
          const isBooked = isDateBooked(date);
          const isSelected = selectedRange.start && isSameDay(date, selectedRange.start) ||
                            selectedRange.end && isSameDay(date, selectedRange.end);
          const isInRange = isDateInSelectedRange(date);
          const isSelectable = isDateSelectable(date);
          const isToday = isSameDay(date, today);

          return (
            <button
              key={date.toISOString()}
              onClick={() => handleDateClick(date)}
              disabled={!isSelectable}
              className={cn(
                "aspect-square flex items-center justify-center text-sm rounded-md transition-colors",
                // Base styles
                "hover:bg-secondary/80",
                // Past dates
                isPast && "text-muted-foreground/50 cursor-not-allowed",
                // Booked dates - red background
                isBooked && "bg-destructive text-destructive-foreground cursor-not-allowed hover:bg-destructive",
                // Selected dates - accent color
                isSelected && "bg-accent text-accent-foreground font-semibold",
                // In range dates
                isInRange && !isSelected && "bg-accent/30",
                // Today indicator
                isToday && !isSelected && !isBooked && "ring-1 ring-accent",
                // Available and selectable
                !isPast && !isBooked && !isSelected && !isInRange && "bg-secondary/50 hover:bg-secondary"
              )}
            >
              {format(date, 'd')}
            </button>
          );
        })}
      </div>

      {/* Selection info */}
      <div className="mt-4 text-sm text-muted-foreground">
        {!selectedRange.start && (
          <p>Click to select your start date</p>
        )}
        {selectedRange.start && !selectedRange.end && (
          <p>Start: {format(selectedRange.start, 'MMM d, yyyy')} — Now select end date</p>
        )}
        {selectedRange.start && selectedRange.end && (
          <p className="text-foreground font-medium">
            {format(selectedRange.start, 'MMM d')} — {format(selectedRange.end, 'MMM d, yyyy')}
          </p>
        )}
      </div>
    </div>
  );
}
