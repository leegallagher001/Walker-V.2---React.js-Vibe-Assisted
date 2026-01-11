
import React, { useState, useEffect } from 'react';
import { JournalEntry } from '../types';

const JournalEntryCard: React.FC<{ entry: JournalEntry }> = ({ entry }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className="bg-[#F4F0E4] rounded-[40px] border border-black/10 shadow-lg p-6 md:p-8 transition-all duration-300 hover:shadow-xl group"
    >
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-col md:flex-row md:items-baseline md:gap-4">
          <h3 className="text-2xl md:text-3xl font-bold text-[#5E4C06] group-hover:text-[#5FB37A] transition-colors text-balance">
            {entry.title}
          </h3>
          <span className="text-lg md:text-xl text-[#5E4C06]/60 font-semibold italic">
            {new Date(entry.date).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
        
        <button 
          className={`text-3xl md:text-4xl font-bold w-12 h-12 flex items-center justify-center rounded-full border-2 transition-all duration-300 flex-shrink-0 ${isExpanded ? 'bg-[#5E4C06] text-[#F4F0E4] border-[#5E4C06] rotate-45' : 'bg-white text-[#5E4C06] border-[#5E4C06]/20 group-hover:border-[#5FB37A] group-hover:text-[#5FB37A]'}`}
          aria-expanded={isExpanded}
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          &#43;
        </button>
      </div>

      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-black/10 fade-in">
          <p className="text-xl leading-relaxed whitespace-pre-wrap text-[#532D02] italic mb-8">
            {entry.article}
          </p>
          
          {entry.steps && (
            <div className="inline-flex flex-col bg-[#5E4C06] text-[#F4F0E4] px-6 py-3 rounded-2xl shadow-md">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-0.5">Steps Logged</span>
              <span className="text-2xl font-bold">{parseInt(entry.steps).toLocaleString()} <span className="text-xs font-medium opacity-60">Total</span></span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Journal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    article: '',
    steps: ''
  });

  // Load entries from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('walker_journal_entries');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.article) return;

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      ...formData
    };

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem('walker_journal_entries', JSON.stringify(updatedEntries));
    setFormData({ title: '', date: '', article: '', steps: '' });
    setIsFormVisible(false);
  };

  // Calculate statistics
  const totalSteps = entries.reduce((sum, entry) => {
    const s = parseInt(entry.steps || '0');
    return sum + (isNaN(s) ? 0 : s);
  }, 0);

  const totalKm = (totalSteps * 0.000762).toFixed(2);
  
  const personalBest = entries.length > 0 
    ? Math.max(...entries.map(e => parseInt(e.steps || '0') || 0)) 
    : 0;

  const averageSteps = entries.length > 0 
    ? Math.round(totalSteps / entries.length) 
    : 0;

  return (
    <div className="fade-in max-w-6xl mx-auto pb-24">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-6 text-[#5E4C06]">JOURNAL</h2>
        <div className="space-y-4 text-lg max-w-3xl mx-auto mb-8 text-[#532D02]">
            <p>The great outdoors. The great adventure. The sights and sounds. Day or night.</p>
            <p>Wherever or whenever your walk may be, trust <b>Journal</b> to record your precious walking memories...or perhaps just your latest personal best.</p>
        </div>
      </div>

      <div className="bg-white/50 p-6 md:p-10 rounded-[40px] border border-black/10 shadow-2xl min-h-[500px]">
        {/* Toggle Button Area */}
        <div className="flex flex-col items-center mb-16">
          <button 
            onClick={() => setIsFormVisible(!isFormVisible)}
            className={`group relative flex items-center justify-center w-24 h-24 rounded-full transition-all duration-500 shadow-lg border-4 ${isFormVisible ? 'bg-[#5E4C06] border-[#FFF6D2] rotate-45' : 'bg-[#5FB37A] border-white hover:bg-[#5E4C06] hover:scale-110'}`}
          >
            <span className="text-5xl font-bold text-white">&#43;</span>
            {!isFormVisible && (
              <span className="absolute -bottom-10 whitespace-nowrap text-sm font-bold tracking-[0.3em] text-[#5E4C06] opacity-0 group-hover:opacity-100 transition-opacity uppercase">New Entry</span>
            )}
          </button>

          {isFormVisible && (
            <div className="w-full md:w-2/3 mt-12 p-8 bg-[#F4F0E4] rounded-[40px] shadow-xl border border-black/10 fade-in">
              <h3 className="text-2xl font-bold mb-8 text-[#5E4C06] italic text-center">Record a New Memory</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-[#5E4C06]/40 uppercase tracking-[0.2em] mb-2 ml-1">Entry Title</label>
                    <input 
                      type="text" 
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="E.g. Morning Mist at the Lake"
                      className="w-full p-4 rounded-xl border border-black/20 text-lg focus:outline-none focus:ring-2 focus:ring-[#5FB37A] bg-[#5E4C06] text-[#F4F0E4] placeholder:text-[#F4F0E4]/40 transition-all duration-300 shadow-inner font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-[#5E4C06]/40 uppercase tracking-[0.2em] mb-2 ml-1">Entry Date</label>
                    <input 
                      type="date" 
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full p-4 rounded-xl border border-black/20 text-lg focus:outline-none focus:ring-2 focus:ring-[#5FB37A] bg-[#5E4C06] text-[#F4F0E4] [color-scheme:dark] transition-all duration-300 shadow-inner font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-[#5E4C06]/40 uppercase tracking-[0.2em] mb-2 ml-1">Steps Taken</label>
                    <input 
                      type="number" 
                      value={formData.steps}
                      onChange={(e) => setFormData({...formData, steps: e.target.value})}
                      placeholder="e.g. 12500"
                      className="w-full p-4 rounded-xl border border-black/20 text-lg focus:outline-none focus:ring-2 focus:ring-[#5FB37A] bg-[#5E4C06] text-[#F4F0E4] placeholder:text-[#F4F0E4]/40 transition-all duration-300 shadow-inner font-semibold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[#5E4C06]/40 uppercase tracking-[0.2em] mb-2 ml-1">The Story</label>
                  <textarea 
                    rows={6}
                    value={formData.article}
                    onChange={(e) => setFormData({...formData, article: e.target.value})}
                    placeholder="Describe your walk..."
                    className="w-full p-4 rounded-xl border border-black/20 text-lg focus:outline-none focus:ring-2 focus:ring-[#5FB37A] bg-[#5E4C06] text-[#F4F0E4] placeholder:text-[#F4F0E4]/40 transition-all duration-300 shadow-inner italic"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-[#5E4C06] text-[#F4F0E4] py-4 rounded-2xl text-2xl font-bold border-2 border-[#FFF6D2] hover:bg-[#5FB37A] transition-all shadow-lg active:scale-95 mt-4"
                >
                  Save to Journal
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="space-y-8 mb-20">
          <div className="flex items-center gap-6 mb-12">
            <div className="h-[2px] flex-grow bg-[#5E4C06]/10"></div>
            <h3 className="text-sm font-black uppercase tracking-[0.4em] text-[#5E4C06]/30">Your Previous Walking Adventures</h3>
            <div className="h-[2px] flex-grow bg-[#5E4C06]/10"></div>
          </div>
          
          {entries.length === 0 ? (
            <div className="text-center py-24 bg-black/5 rounded-[40px] border-2 border-dashed border-[#5E4C06]/10">
              <p className="text-2xl text-[#5E4C06]/30 italic font-medium">Your journal is empty. Let's record your first walk.</p>
            </div>
          ) : (
            entries.map((entry) => (
              <JournalEntryCard key={entry.id} entry={entry} />
            ))
          )}
        </div>

        {/* Statistics Dashboard Section */}
        {entries.length > 0 && (
          <div className="fade-in pt-12 border-t border-black/10">
            <div className="flex items-center gap-6 mb-10">
              <div className="h-[2px] flex-grow bg-[#5E4C06]/10"></div>
              <h3 className="text-sm font-black uppercase tracking-[0.4em] text-[#5E4C06]/30">The Expedition Report</h3>
              <div className="h-[2px] flex-grow bg-[#5E4C06]/10"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Steps Card */}
              <div className="bg-[#5E4C06] rounded-[30px] p-6 text-[#F4F0E4] shadow-xl relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-1">Total Volume</p>
                <p className="text-4xl font-bold tracking-tighter mb-1">{totalSteps.toLocaleString()}</p>
                <p className="text-xs font-bold text-[#5FB37A] uppercase tracking-widest">Steps Walked</p>
              </div>

              {/* Distance Card */}
              <div className="bg-white rounded-[30px] p-6 border border-[#5E4C06]/10 shadow-xl relative overflow-hidden group">
                <p className="text-[10px] font-black text-[#5E4C06]/40 uppercase tracking-[0.3em] mb-1">Total Coverage</p>
                <p className="text-4xl font-bold text-[#5E4C06] tracking-tighter mb-1">{totalKm} <span className="text-lg opacity-40">KM</span></p>
                <p className="text-xs font-bold text-[#5E4C06]/40 uppercase tracking-widest italic">Equivalent Range</p>
              </div>

              {/* Personal Best Card */}
              <div className="bg-white rounded-[30px] p-6 border border-[#5E4C06]/10 shadow-xl relative overflow-hidden group">
                <p className="text-[10px] font-black text-[#5E4C06]/40 uppercase tracking-[0.3em] mb-1">Personal Best</p>
                <p className="text-4xl font-bold text-[#5FB37A] tracking-tighter mb-1">{personalBest.toLocaleString()}</p>
                <p className="text-xs font-bold text-[#5E4C06]/40 uppercase tracking-widest italic">Single Walk Record</p>
              </div>

              {/* Average Steps Card */}
              <div className="bg-white rounded-[30px] p-6 border border-[#5E4C06]/10 shadow-xl relative overflow-hidden group">
                <p className="text-[10px] font-black text-[#5E4C06]/40 uppercase tracking-[0.3em] mb-1">Expedition Average</p>
                <p className="text-4xl font-bold text-[#5E4C06] tracking-tighter mb-1">{averageSteps.toLocaleString()}</p>
                <p className="text-xs font-bold text-[#5E4C06]/40 uppercase tracking-widest italic">Steps Per Entry</p>
              </div>
            </div>

            <div className="mt-10 text-center">
              <p className="text-sm font-medium text-[#5E4C06]/40 italic">
                You have recorded {entries.length} memories in your journey so far. Keep going.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;
