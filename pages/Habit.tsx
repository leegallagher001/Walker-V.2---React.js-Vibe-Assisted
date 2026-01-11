
import React, { useState, useEffect } from 'react';

interface HabitGoal {
  steps: number;
  days: number;
  completedDays: number[]; // Indices of the days relative to startDate
  startDate: string; // ISO string of the day the goal was started
}

const Habit: React.FC = () => {
  const [stepInput, setStepInput] = useState<string>('10000');
  const [daysInput, setDaysInput] = useState<string>('30');
  const [goal, setGoal] = useState<HabitGoal | null>(null);

  // Load goal from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('walker_habit_goal');
    if (saved) {
      setGoal(JSON.parse(saved));
    }
  }, []);

  const handleSetGoal = (e: React.FormEvent) => {
    e.preventDefault();
    // Normalize start date to midnight to make date comparisons easier
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    const newGoal: HabitGoal = {
      steps: parseInt(stepInput) || 10000,
      days: parseInt(daysInput) || 30,
      completedDays: [],
      startDate: now.toISOString()
    };
    setGoal(newGoal);
    localStorage.setItem('walker_habit_goal', JSON.stringify(newGoal));
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const getDateForIndex = (index: number, startDateStr: string) => {
    const date = new Date(startDateStr);
    date.setDate(date.getDate() + index);
    return date;
  };

  const toggleDay = (dayIndex: number) => {
    if (!goal) return;
    
    const targetDate = getDateForIndex(dayIndex, goal.startDate);
    
    // Check if it's actually today
    if (!isToday(targetDate)) {
      return; // Only today can be toggled
    }
    
    const newCompletedDays = goal.completedDays.includes(dayIndex)
      ? goal.completedDays.filter(d => d !== dayIndex)
      : [...goal.completedDays, dayIndex];
    
    const updatedGoal = { ...goal, completedDays: newCompletedDays };
    setGoal(updatedGoal);
    localStorage.setItem('walker_habit_goal', JSON.stringify(updatedGoal));
  };

  const resetGoal = () => {
    if (window.confirm("Are you sure you want to reset your current journey?")) {
      setGoal(null);
      localStorage.removeItem('walker_habit_goal');
    }
  };

  return (
    <div className="fade-in max-w-6xl mx-auto pb-24">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-6 text-[#5E4C06]">HABIT</h2>
        <div className="space-y-4 text-lg max-w-3xl mx-auto mb-8">
            <p>A clear head. Structure. A plan. A lifestyle.</p>
            <p>In the modern day, these things can seem like a virtual impossibility. We all have busy lives, filled with work, family commitments, looking after the home and ourselves.</p>
            <p>And that is to say nothing of hobbies. Of course, walking can be one of the best hobbies out there - free, healthy, low-pressure and accessible. However, in our busy lives, even setting aside a little time can seem like a daunting task.</p>
            <p>Not to worry - let <b>Habit</b> be your new walking coach. Set your goals - or your availability - and let it set up a plan you can stick to.</p>
        </div>
      </div>

      <div className="bg-white/50 p-6 md:p-10 rounded-[40px] border border-black/10 shadow-2xl min-h-[500px]">
        {!goal ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-[#F4F0E4] p-8 md:p-12 rounded-[40px] shadow-xl border border-black/10 fade-in">
              <h3 className="text-2xl font-bold mb-8 text-[#5E4C06] italic text-center uppercase tracking-widest">Define Your Journey</h3>
              <form onSubmit={handleSetGoal} className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-[#5E4C06]/40 uppercase tracking-[0.2em] mb-3 ml-1">Daily Step Goal</label>
                  <input 
                    type="number" 
                    value={stepInput}
                    onChange={(e) => setStepInput(e.target.value)}
                    placeholder="e.g. 10000"
                    className="w-full p-5 rounded-2xl border border-black/10 text-2xl focus:outline-none focus:ring-2 focus:ring-[#5FB37A] bg-[#5E4C06] text-[#F4F0E4] transition-all shadow-inner font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[#5E4C06]/40 uppercase tracking-[0.2em] mb-3 ml-1">Commitment Period (Days)</label>
                  <input 
                    type="number" 
                    value={daysInput}
                    onChange={(e) => setDaysInput(e.target.value)}
                    placeholder="e.g. 30"
                    className="w-full p-5 rounded-2xl border border-black/10 text-2xl focus:outline-none focus:ring-2 focus:ring-[#5FB37A] bg-[#5E4C06] text-[#F4F0E4] transition-all shadow-inner font-bold"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-[#5FB37A] text-white py-5 rounded-2xl text-2xl font-bold border-4 border-white hover:bg-[#5E4C06] transition-all shadow-xl active:scale-95 uppercase tracking-widest"
                >
                  Commence Journey
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
              <div className="text-center md:text-left">
                <h3 className="text-sm font-black text-[#5E4C06]/40 uppercase tracking-[0.4em] mb-2">Current Objective</h3>
                <p className="text-4xl font-bold text-[#5E4C06]">{goal.steps.toLocaleString()} <span className="text-xl font-medium opacity-60 italic">Steps Daily</span></p>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-[#5FB37A] text-white px-8 py-4 rounded-3xl shadow-lg text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Progress</p>
                  <p className="text-3xl font-bold">{goal.completedDays.length} / {goal.days}</p>
                </div>
                <button 
                  onClick={resetGoal}
                  className="bg-white/50 hover:bg-red-50 text-[#5E4C06]/40 hover:text-red-600 px-6 py-4 rounded-3xl transition-all border border-black/5 text-xs font-bold uppercase tracking-widest"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="mb-12">
               <div className="flex items-center gap-6 mb-8">
                <div className="h-[2px] flex-grow bg-[#5E4C06]/10"></div>
                <h3 className="text-sm font-black uppercase tracking-[0.4em] text-[#5E4C06]/30 text-center">Your Visual Roadmap</h3>
                <div className="h-[2px] flex-grow bg-[#5E4C06]/10"></div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-4">
                {Array.from({ length: goal.days }).map((_, i) => {
                  const date = getDateForIndex(i, goal.startDate);
                  const isComp = goal.completedDays.includes(i);
                  const current = isToday(date);
                  const isPast = date < new Date() && !current;
                  const isFuture = date > new Date() && !current;

                  return (
                    <button
                      key={i}
                      disabled={!current}
                      onClick={() => toggleDay(i)}
                      className={`relative min-h-[100px] p-4 rounded-3xl flex flex-col items-start justify-between transition-all duration-300 border-2 ${
                        isComp 
                        ? 'bg-[#5FB37A] border-[#5FB37A] text-white shadow-lg' 
                        : current 
                          ? 'bg-white border-[#5FB37A] text-[#5E4C06] shadow-md ring-4 ring-[#5FB37A]/10' 
                          : 'bg-[#F4F0E4]/50 border-[#5E4C06]/5 text-[#5E4C06]/30'
                      } ${!current ? 'cursor-default grayscale-[0.5]' : 'hover:scale-105 active:scale-95 cursor-pointer'}`}
                    >
                      <div className="flex flex-col items-start">
                        <span className={`text-[10px] font-black uppercase tracking-tighter ${isComp ? 'text-white/70' : 'text-[#5E4C06]/40'}`}>
                          {date.toLocaleDateString(undefined, { weekday: 'short' })}
                        </span>
                        <span className="text-2xl font-bold leading-none">
                          {date.getDate()}
                        </span>
                        <span className={`text-[10px] font-bold uppercase ${isComp ? 'text-white/70' : 'text-[#5E4C06]/40'}`}>
                          {date.toLocaleDateString(undefined, { month: 'short' })}
                        </span>
                      </div>
                      
                      <div className="w-full mt-2 flex justify-between items-center">
                        {isComp ? (
                          <span className="text-[8px] font-black bg-white/20 px-2 py-0.5 rounded-full">ACHIEVED</span>
                        ) : current ? (
                          <span className="text-[8px] font-black bg-[#5FB37A]/10 text-[#5FB37A] px-2 py-0.5 rounded-full animate-pulse">ACTIVE</span>
                        ) : isPast ? (
                          <span className="text-[8px] font-black opacity-30 italic">MISSED</span>
                        ) : (
                          <span className="text-[8px] font-black opacity-30 italic">LOCKED</span>
                        )}
                      </div>

                      {current && !isComp && (
                        <div className="absolute top-2 right-2 w-2 h-2 bg-[#5FB37A] rounded-full"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-16 p-8 bg-[#5E4C06] rounded-[30px] text-[#F4F0E4] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                <div className="text-center md:text-left">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-1">Total Expedition Distance</p>
                    <p className="text-3xl font-bold italic">Approx. {((goal.steps * goal.days * 0.000762).toFixed(1))} Kilometres</p>
                </div>
                <div className="text-center md:text-right">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-1">Status</p>
                    <p className="text-xl font-semibold">
                      {goal.completedDays.length === goal.days 
                        ? "Expedition Complete! Well done." 
                        : `${goal.days - goal.completedDays.length} days remaining to reach your goal.`}
                    </p>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Habit;
