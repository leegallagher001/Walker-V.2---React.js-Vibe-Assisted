
import React, { useState, useEffect } from 'react';
import { JournalEntry } from '../types';
import { StorageService } from '../services/storage';

const JournalEntryCard: React.FC<{ entry: JournalEntry; onDelete: (id: string) => void }> = ({ entry, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className="bg-[#F4F0E4] rounded-[30px] border border-black/5 shadow-sm p-5 md:p-6 transition-all duration-300 hover:shadow-md group mb-4 last:mb-0"
    >
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-col md:flex-row md:items-baseline md:gap-4">
          <h3 className="text-xl md:text-2xl font-bold text-[#5E4C06] group-hover:text-[#5FB37A] transition-colors text-balance">
            {entry.title}
          </h3>
          <span className="text-sm md:text-base text-[#5E4C06]/60 font-semibold italic">
            {new Date(entry.date).toLocaleDateString(undefined, { day: 'numeric', month: 'long' })}
          </span>
        </div>
        
        <button 
          className={`text-2xl md:text-3xl font-bold w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-300 flex-shrink-0 ${isExpanded ? 'bg-[#5E4C06] text-[#F4F0E4] border-[#5E4C06] rotate-45' : 'bg-white text-[#5E4C06] border-[#5E4C06]/20 group-hover:border-[#5FB37A] group-hover:text-[#5FB37A]'}`}
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
        <div className="mt-4 pt-4 border-t border-black/5 fade-in">
          <p className="text-lg leading-relaxed whitespace-pre-wrap text-[#532D02] italic mb-6">
            {entry.article}
          </p>
          
          <div className="flex items-end justify-between">
            {entry.steps && (
              <div className="inline-flex flex-col bg-[#5E4C06] text-[#F4F0E4] px-5 py-2.5 rounded-xl shadow-md">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mb-0.5">Steps Logged</span>
                <span className="text-xl font-bold">{parseInt(entry.steps).toLocaleString()} <span className="text-[10px] font-medium opacity-60">Total</span></span>
              </div>
            )}
            
            <button 
              onClick={() => onDelete(entry.id)}
              className="text-[10px] font-black uppercase tracking-widest text-red-700/40 hover:text-red-600 transition-colors px-4 py-2 hover:bg-red-50 rounded-lg"
            >
              Delete Entry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Journal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [expandedMonths, setExpandedMonths] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    article: '',
    steps: ''
  });

  useEffect(() => {
    const loadData = async () => {
      const data = await StorageService.getJournalEntries();
      setEntries(data);
      if (data.length > 0) {
        const firstEntryDate = new Date(data[0].date);
        const monthKey = `${firstEntryDate.getFullYear()}-${firstEntryDate.getMonth()}`;
        setExpandedMonths([monthKey]);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.article) return;

    setLoading(true);
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      ...formData
    };

    const updated = await StorageService.saveJournalEntry(newEntry);
    setEntries(updated);
    
    const newEntryDate = new Date(formData.date);
    const monthKey = `${newEntryDate.getFullYear()}-${newEntryDate.getMonth()}`;
    if (!expandedMonths.includes(monthKey)) {
      setExpandedMonths([...expandedMonths, monthKey]);
    }

    setFormData({ title: '', date: '', article: '', steps: '' });
    setIsFormVisible(false);
    setLoading(false);
  };

  const handleDeleteEntry = async (id: string) => {
    if (window.confirm("Are you sure you want to permanently delete this memory? This cannot be undone.")) {
      setLoading(true);
      const updated = await StorageService.deleteJournalEntry(id);
      setEntries(updated);
      setLoading(false);
    }
  };

  const toggleMonth = (monthKey: string) => {
    setExpandedMonths(prev => 
      prev.includes(monthKey) ? prev.filter(m => m !== monthKey) : [...prev, monthKey]
    );
  };

  const groupedEntries = entries.reduce((acc: { [key: string]: JournalEntry[] }, entry) => {
    const date = new Date(entry.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(entry);
    return acc;
  }, {});

  const sortedMonthKeys = Object.keys(groupedEntries).sort((a, b) => {
    const [yearA, monthA] = a.split('-').map(Number);
    const [yearB, monthB] = b.split('-').map(Number);
    return (yearB * 12 + monthB) - (yearA * 12 + monthA);
  });

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
            <p>Wherever or whenever your walk may be, trust <b>Journal</b> to record your precious walking memories.</p>
        </div>
      </div>

      <div className="bg-white/50 p-6 md:p-10 rounded-[40px] border border-black/10 shadow-2xl min-h-[500px] relative">
        {loading && (
          <div className="absolute top-6 right-6 flex items-center gap-2 text-[#5E4C06]/40 font-bold text-xs uppercase tracking-widest bg-white/40 px-4 py-2 rounded-full">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Syncing...
          </div>
        )}

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
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="E.g. Afternoon Stroll through the Woods"
                      className="w-full p-4 rounded-xl border border-black/20 text-lg focus:outline-none focus:ring-2 focus:ring-[#5FB37A] bg-[#5E4C06] text-[#F4F0E4] placeholder:text-[#F4F0E4]/40 transition-all duration-300 shadow-inner font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-[#5E4C06]/40 uppercase tracking-[0.2em] mb-2 ml-1">Entry Date</label>
                    <input 
                      type="date" 
                      required
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
                      placeholder="e.g. 8000"
                      className="w-full p-4 rounded-xl border border-black/20 text-lg focus:outline-none focus:ring-2 focus:ring-[#5FB37A] bg-[#5E4C06] text-[#F4F0E4] placeholder:text-[#F4F0E4]/40 transition-all duration-300 shadow-inner font-semibold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[#5E4C06]/40 uppercase tracking-[0.2em] mb-2 ml-1">The Story</label>
                  <textarea 
                    rows={6}
                    required
                    value={formData.article}
                    onChange={(e) => setFormData({...formData, article: e.target.value})}
                    placeholder="Tell us about your adventure..."
                    className="w-full p-4 rounded-xl border border-black/20 text-lg focus:outline-none focus:ring-2 focus:ring-[#5FB37A] bg-[#5E4C06] text-[#F4F0E4] placeholder:text-[#F4F0E4]/40 transition-all duration-300 shadow-inner italic"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-[#5E4C06] text-[#F4F0E4] py-4 rounded-2xl text-2xl font-bold border-2 border-[#FFF6D2] hover:bg-[#5FB37A] transition-all shadow-lg active:scale-95 mt-4 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Save to Journal'}
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="space-y-12 mb-20">
          <div className="flex items-center gap-6 mb-8">
            <div className="h-[2px] flex-grow bg-[#5E4C06]/10"></div>
            <h3 className="text-sm font-black uppercase tracking-[0.4em] text-[#5E4C06]/30">Your Expedition Archives</h3>
            <div className="h-[2px] flex-grow bg-[#5E4C06]/10"></div>
          </div>
          
          {entries.length === 0 && !loading ? (
            <div className="text-center py-24 bg-black/5 rounded-[40px] border-2 border-dashed border-[#5E4C06]/10">
              <p className="text-2xl text-[#5E4C06]/30 italic font-medium">Your journal is currently empty.</p>
            </div>
          ) : (
            sortedMonthKeys.map((monthKey) => {
              const [year, month] = monthKey.split('-').map(Number);
              const monthName = new Date(year, month).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
              const monthEntries = groupedEntries[monthKey];
              const isMonthExpanded = expandedMonths.includes(monthKey);
              const monthSteps = monthEntries.reduce((sum, e) => sum + (parseInt(e.steps || '0') || 0), 0);

              return (
                <div key={monthKey} className="fade-in">
                  <button 
                    onClick={() => toggleMonth(monthKey)}
                    className="w-full flex items-center justify-between p-6 bg-[#5E4C06] text-[#F4F0E4] rounded-[30px] shadow-lg mb-4 hover:bg-[#5FB37A] transition-colors group"
                  >
                    <div className="flex flex-col items-start">
                      <h4 className="text-2xl font-bold tracking-tight uppercase italic">{monthName}</h4>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
                        {monthEntries.length} {monthEntries.length === 1 ? 'Entry' : 'Entries'} &bull; {monthSteps.toLocaleString()} Total Steps
                      </p>
                    </div>
                    <div className={`text-3xl transition-transform duration-300 ${isMonthExpanded ? 'rotate-180' : ''}`}>
                      &#9662;
                    </div>
                  </button>

                  {isMonthExpanded && (
                    <div className="pl-4 md:pl-8 border-l-4 border-[#5FB37A]/20 space-y-4 fade-in py-2">
                      {monthEntries.map((entry) => (
                        <JournalEntryCard 
                          key={entry.id} 
                          entry={entry} 
                          onDelete={handleDeleteEntry}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {entries.length > 0 && (
          <div className="fade-in pt-12 border-t border-black/10">
            <div className="flex items-center gap-6 mb-10">
              <div className="h-[2px] flex-grow bg-[#5E4C06]/10"></div>
              <h3 className="text-sm font-black uppercase tracking-[0.4em] text-[#5E4C06]/30">Lifetime Expedition Summary</h3>
              <div className="h-[2px] flex-grow bg-[#5E4C06]/10"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#5E4C06] rounded-[30px] p-6 text-[#F4F0E4] shadow-xl relative overflow-hidden group">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-1">Total Volume</p>
                <p className="text-4xl font-bold tracking-tighter mb-1">{totalSteps.toLocaleString()}</p>
                <p className="text-xs font-bold text-[#5FB37A] uppercase tracking-widest">Steps Walked</p>
              </div>

              <div className="bg-white rounded-[30px] p-6 border border-[#5E4C06]/10 shadow-xl group">
                <p className="text-[10px] font-black text-[#5E4C06]/40 uppercase tracking-[0.3em] mb-1">Total Coverage</p>
                <p className="text-4xl font-bold text-[#5E4C06] tracking-tighter mb-1">{totalKm} <span className="text-lg opacity-40">KM</span></p>
                <p className="text-xs font-bold text-[#5E4C06]/40 uppercase tracking-widest italic">Equivalent Range</p>
              </div>

              <div className="bg-white rounded-[30px] p-6 border border-[#5E4C06]/10 shadow-xl group">
                <p className="text-[10px] font-black text-[#5E4C06]/40 uppercase tracking-[0.3em] mb-1">Personal Best</p>
                <p className="text-4xl font-bold text-[#5FB37A] tracking-tighter mb-1">{personalBest.toLocaleString()}</p>
                <p className="text-xs font-bold text-[#5E4C06]/40 uppercase tracking-widest italic">Single Walk Record</p>
              </div>

              <div className="bg-white rounded-[30px] p-6 border border-[#5E4C06]/10 shadow-xl group">
                <p className="text-[10px] font-black text-[#5E4C06]/40 uppercase tracking-[0.3em] mb-1">Average Stride</p>
                <p className="text-4xl font-bold text-[#5E4C06] tracking-tighter mb-1">{averageSteps.toLocaleString()}</p>
                <p className="text-xs font-bold text-[#5E4C06]/40 uppercase tracking-widest italic">Steps Per Entry</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;
