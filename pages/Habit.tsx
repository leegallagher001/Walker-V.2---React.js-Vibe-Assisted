
import React from 'react';

const Habit: React.FC = () => {
  return (
    <div className="fade-in max-w-4xl mx-auto text-center">
      <h2 className="text-4xl font-bold mb-8 text-[#5E4C06]">HABIT</h2>
      <div className="space-y-6 text-xl leading-relaxed">
        <p>A clear head. Structure. A plan. A lifestyle.</p>
        <p>In the modern day, these things can seem like a virtual impossibility. We all have busy lives, filled with work, family commitments, looking after the home and ourselves.</p>
        <p>And that is to say nothing of hobbies. Of course, walking can be one of the best hobbies out there - free, healthy, low-pressure and accessible. However, in our busy lives, even setting aside a little time can seem like a daunting task.</p>
        <p>Not to worry - let <strong>Habit</strong> be your new walking coach. Set your goals - or your availability - and let it set up a plan you can stick to.</p>
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-10 bg-[#FFF6D2] rounded-3xl border border-[#5E4C06]/20 shadow-lg">
          <h4 className="text-2xl font-bold mb-4">Daily Goal</h4>
          <p className="text-5xl font-bold text-[#5FB37A]">10,000</p>
          <p className="mt-2 text-gray-600">Steps</p>
        </div>
        <div className="p-10 bg-[#FFF6D2] rounded-3xl border border-[#5E4C06]/20 shadow-lg">
          <h4 className="text-2xl font-bold mb-4">Current Streak</h4>
          <p className="text-5xl font-bold text-[#5E4C06]">12</p>
          <p className="mt-2 text-gray-600">Days</p>
        </div>
      </div>
    </div>
  );
};

export default Habit;
