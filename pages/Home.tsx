
import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const features = [
    {
      title: 'PLANNER',
      path: '/planner',
      image: 'https://picsum.photos/seed/walker-planner/600/400',
      description: "A map, a location and a time. Let Walker's Planner do the preparation for you, so you can focus on what matters: enjoying your walk."
    },
    {
      title: 'JOURNAL',
      path: '/journal',
      image: 'https://picsum.photos/seed/walker-journal/600/400',
      description: "Personal fitness milestones. Precious memories. Let Walker's Journal help you easily and seamlessly record your walking journey."
    },
    {
      title: 'HABIT',
      path: '/habit',
      image: 'https://picsum.photos/seed/walker-habit/600/400',
      description: "Motivation. Quality. Consistency. Let Walker's Habit build a solid walking routine to fit your goals, time and busy schedule."
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 min-h-[700px] fade-in">
      {features.map((feature) => (
        <Link 
          key={feature.title} 
          to={feature.path}
          className="group relative flex flex-col items-center justify-center p-8 bg-[#FFF6D2] hover:bg-[#5FB37A] text-[#532D02] hover:text-[#F4F0E4] transition-all duration-500 text-center border-x border-[#5E4C06]/10"
        >
          <h3 className="text-3xl font-bold mb-6 tracking-widest">{feature.title}</h3>
          <div className="w-full max-w-[280px] aspect-video mb-8 rounded-3xl overflow-hidden shadow-lg border-2 border-[#5E4C06]/20">
            <img src={feature.image} alt={feature.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          </div>
          <p className="text-xl leading-relaxed max-w-xs">
            {feature.description.split('<b>').map((part, i) => {
              const segments = part.split('</b>');
              return (
                <span key={i}>
                  {segments[0]}
                  {segments[1] && <span className="font-bold">{segments[1]}</span>}
                </span>
              );
            })}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default Home;
