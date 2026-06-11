import React from 'react';

interface Habit {
  id: string;
  name: string;
  offset: number;
  completed: boolean;
}

interface HabitTrackerProps {
  habits: Habit[];
  onToggle: (id: string) => void;
}

export default function HabitTracker({ habits, onToggle }: HabitTrackerProps) {
  return (
    <div className="habit-checklist">
      <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
        Daily Eco Offsets & Actions
      </h4>
      {habits.map((habit) => (
        <div key={habit.id} className="habit-item">
          <div className="habit-check-left">
            <input
              type="checkbox"
              className="habit-checkbox"
              checked={habit.completed}
              onChange={() => onToggle(habit.id)}
            />
            <span style={{ textDecoration: habit.completed ? 'line-through' : 'none', opacity: habit.completed ? 0.5 : 1 }}>
              {habit.name}
            </span>
          </div>
          <span className="habit-offset-value">
            -{habit.offset} kg CO2
          </span>
        </div>
      ))}
    </div>
  );
}
