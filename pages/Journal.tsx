
import React, { useState, useEffect } from 'react';
import { JournalEntry } from '../types';

const Journal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    article: ''
  });

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation: prevent empty entries
    if (!formData.title || !formData.date || !formData.article) return;

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      ...formData
    };

    // Correct logic: Add to list of entries instead of manually appending to DOM
    setEntries([newEntry, ...entries]);

    // Reset form
    setFormData({ title: '', date: '', article: '' });
    setIsFormVisible(false);
  };

  return (
    <div className="fade-in max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-6 text-[#5E4C06]">JOURNAL</h2>
        <div className="space-y-4 text-lg max-w-3xl mx-auto mb-8">
          <p>The great outdoors. The great adventure. The sights and sounds. Day or night.</p>
          <p>Wherever or whenever your walk may be, trust <strong>Journal</strong> to record your precious walking memories.</p>
        </div>
      </div>

      <div className="bg-white/50 p-6 md:p-10 rounded-[40px] border border-black/10 shadow-2xl min-h-[400px]">
        <div className="flex justify-center mb-10">
          <div className="w-full md:w-2/3 p-8 bg-[#F4F0E4] rounded-3xl shadow-lg border border-black/10">
            <div 
              className="text-6xl text-center py-4 cursor-pointer hover:bg-[#5E4C06] hover:text-[#FFF6D2] rounded-3xl transition-all duration-300 active:opacity-50"
              onClick={() => setIsFormVisible(!isFormVisible)}
            >
              <button className="w-full text-center">&#43;</button>
            </div>

            {isFormVisible && (
              <form onSubmit={handleSubmit} className="mt-8 space-y-6 fade-in">
                <div>
                  <label className="block text-xl font-semibold mb-2">Entry Title:</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Your Entry Title Here"
                    className="w-full p-4 rounded-xl border border-black/20 text-lg focus:outline-none focus:ring-2 focus:ring-[#5FB37A] bg-[#5E4C06] text-[#F4F0E4] placeholder:text-[#F4F0E4]/60 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-xl font-semibold mb-2">Entry Date:</label>
                  <input 
                    type="date" 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full p-4 rounded-xl border border-black/20 text-lg focus:outline-none focus:ring-2 focus:ring-[#5FB37A] bg-[#5E4C06] text-[#F4F0E4] [color-scheme:dark] transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-xl font-semibold mb-2">Enter Your Journal Entry:</label>
                  <textarea 
                    rows={4}
                    value={formData.article}
                    onChange={(e) => setFormData({...formData, article: e.target.value})}
                    placeholder="Your Journal Entry Here"
                    className="w-full p-4 rounded-xl border border-black/20 text-lg focus:outline-none focus:ring-2 focus:ring-[#5FB37A] bg-[#5E4C06] text-[#F4F0E4] placeholder:text-[#F4F0E4]/60 transition-all duration-300"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-[#5E4C06] text-[#F4F0E4] py-4 rounded-xl text-2xl font-bold border-2 border-[#FFF6D2] hover:bg-[#5FB37A] transition-colors shadow-md"
                >
                  Save Entry!
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Entries Display: Each entry is its own component instance */}
        <div className="space-y-12">
          {entries.length === 0 ? (
            <p className="text-center text-gray-500 italic py-10">No entries yet. Click the plus button to start your journey.</p>
          ) : (
            entries.map((entry) => (
              <div 
                key={entry.id} 
                className="bg-[#F4F0E4] rounded-3xl border border-black/20 shadow-[10px_10px_10px_rgba(0,0,0,0.1)] p-8 fade-in"
              >
                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-4 border-b border-black/10 pb-2">
                  <h3 className="text-3xl font-bold text-[#5E4C06]">{entry.title}</h3>
                  <span className="text-xl text-[#5E4C06]/70 font-semibold">{new Date(entry.date).toLocaleDateString()}</span>
                </div>
                <p className="text-xl leading-relaxed whitespace-pre-wrap">{entry.article}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Journal;
