
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

interface RouteSuggestion {
  name: string;
  turnaroundPoint: string;
  duration: string;
  distance: string;
  description: string;
  url: string;
}

const Planner: React.FC = () => {
  const [location, setLocation] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState<RouteSuggestion[]>([]);
  const [overview, setOverview] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleGenerateRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    const durNum = parseInt(duration);
    if (!location && !duration) return;
    if (isNaN(durNum) || durNum <= 0) {
      setError("Please enter a valid duration in minutes.");
      return;
    }

    setLoading(true);
    setError(null);
    setRoutes([]);
    setOverview('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      let userCoords = null;
      if (location.toLowerCase() === 'nearby' || !location) {
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
          });
          userCoords = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          };
        } catch (err) {
          console.warn("Geolocation failed or denied", err);
        }
      }

      const halfDuration = Math.floor(durNum / 2);
      
      const prompt = `I am starting my walk at "${location || 'my current location'}". 
      I want a walk that lasts exactly ${duration} minutes in total. 
      Please find 3 distinct destinations (could be a park, a cafe, a landmark, or just a specific street corner) that are roughly a ${halfDuration}-minute walk away from my starting point. 
      
      Response Format:
      First, provide a brief 2-sentence summary/intro about the area for walking.
      Then, list 3 suggestions strictly formatted like this:
      1. [Route Name]
      Turnaround: [Specific Place]
      Distance: [X.X km round trip]
      Description: [Brief description of what I'll see]
      Link: [Google Maps Link]`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: userCoords ? {
            retrievalConfig: {
              latLng: userCoords
            }
          } : undefined
        },
      });

      const text = response.text || "";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

      // 1. Extract the overview (everything before "1. ")
      const firstIndex = text.indexOf("1. ");
      if (firstIndex !== -1) {
        setOverview(text.substring(0, firstIndex).trim());
        
        // 2. Extract route items
        const routesText = text.substring(firstIndex);
        const routeSections = routesText.split(/\d\.\s+/).filter(s => s.trim().length > 10);
        
        const suggestions: RouteSuggestion[] = routeSections.map((section, index) => {
          const foundLink = chunks.find((c) => c.maps && section.toLowerCase().includes(c.maps.title?.toLowerCase() || ''));
          const lines = section.split('\n').filter(l => l.trim().length > 0);
          const name = lines[0]?.replace(/[*#]/g, '').trim();
          
          return {
            name: name || `Route Option ${index + 1}`,
            turnaroundPoint: section.match(/Turnaround:?\s*([^.\n]+)/i)?.[1]?.trim() || "Local Landmark",
            description: section.match(/Description:?\s*([^.\n]+[^]*?)(?=Link:|$)/i)?.[1]?.trim() || section.substring(0, 150).replace(/[*#]/g, '') + '...',
            duration: `${duration} mins total`,
            distance: section.match(/(\d+(\.\d+)?\s*km)/i)?.[0] || "Varies",
            url: foundLink?.maps?.uri || section.match(/Link:?\s*(https[^\s\n]+)/i)?.[1] || `https://www.google.com/maps/dir/${encodeURIComponent(location || 'My Location')}/${encodeURIComponent(name || 'Destination')}`
          };
        });

        setRoutes(suggestions.slice(0, 3));
      } else {
        // Fallback if formatting is weird
        setOverview("Here are some suggestions for your walk:");
        setRoutes([]);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message?.includes("Maps") ? "Route generation is currently being updated. Please try again in a moment." : "We couldn't map out those routes. Try a more specific starting point.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in max-w-6xl mx-auto pb-24 text-[#532D02]">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-6 text-[#5E4C06]">PLANNER</h2>
        <div className="space-y-4 text-lg max-w-3xl mx-auto">
            <p>A fast-paced job. A busy family. Bills to pay, mouths to feed, a car to fix. In the modern day, time is a luxury.</p>
            <p>But health is wealth. Studies show that even a short amount of walking each day can be incredibly beneficial to one's health, cutting the risk of all causes of mortality significantly.</p>
            <p>However, it is sometimes a challenge to come up with a good walking route in your local area, or perhaps you have walked the same trail many times and want something different.</p>
            <p>Not to worry. Let <b>Planner</b> do the hard work for you.</p>
        </div>
      </div>

      <div className="bg-white/50 p-6 md:p-10 rounded-[40px] border border-black/10 shadow-2xl flex flex-col md:flex-row gap-8 mb-12">
        <div className="w-full md:w-5/12 p-8 bg-[#F4F0E4] rounded-3xl shadow-lg border border-black/10">
          <form className="space-y-6" onSubmit={handleGenerateRoute}>
            <div>
              <label className="block text-xl font-semibold mb-2">Starting Location:</label>
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter Address or 'Nearby'"
                className="w-full p-4 rounded-xl border border-black/20 text-lg focus:outline-none focus:ring-2 focus:ring-[#5FB37A] bg-[#5E4C06] text-[#F4F0E4] placeholder:text-[#F4F0E4]/60 transition-all duration-300 shadow-inner"
              />
            </div>
            <div>
              <label className="block text-xl font-semibold mb-2">Total Duration (minutes):</label>
              <input 
                type="number" 
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 20, 45, 60"
                className="w-full p-4 rounded-xl border border-black/20 text-lg focus:outline-none focus:ring-2 focus:ring-[#5FB37A] bg-[#5E4C06] text-[#F4F0E4] placeholder:text-[#F4F0E4]/60 transition-all duration-300 shadow-inner"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full bg-[#5E4C06] text-[#F4F0E4] py-4 rounded-xl text-2xl font-bold border-2 border-[#FFF6D2] hover:bg-[#5FB37A] transition-all shadow-lg flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-6 w-6 text-[#F4F0E4]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Calculating...
                </span>
              ) : 'Map Out My Walk'}
            </button>
          </form>
          {error && <p className="mt-4 text-red-700 text-center font-semibold bg-red-100/50 p-3 rounded-xl border border-red-200">{error}</p>}
        </div>

        <div className="w-full md:w-7/12 rounded-3xl overflow-hidden shadow-2xl border border-black/10 bg-[#5E4C06]/10 flex items-center justify-center min-h-[400px]">
          <iframe 
            src={`https://www.google.com/maps?q=${encodeURIComponent(location || 'walking trails')}&output=embed`}
            width="100%" 
            height="100%" 
            style={{ border: 0, minHeight: '400px' }} 
            allowFullScreen 
            loading="lazy"
          ></iframe>
        </div>
      </div>

      {/* Overview and Suggested Routes Section */}
      {(routes.length > 0 || loading) && (
        <div className="fade-in px-4">
          
          {/* New Overview Section */}
          {overview && !loading && (
            <div className="max-w-3xl mx-auto mb-12 bg-white/40 p-6 rounded-[30px] border border-[#5E4C06]/10 shadow-inner text-center">
               <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#5E4C06]/40 mb-3">Plan Overview</h4>
               <p className="text-xl italic font-medium text-[#5E4C06] leading-relaxed">
                 "{overview.replace(/[*#]/g, '')}"
               </p>
            </div>
          )}

          <div className="flex flex-col items-center mb-10">
            <h3 className="text-3xl font-bold text-[#5E4C06] italic">Tailored Round-Trips</h3>
            <p className="text-[#5E4C06]/60 mt-2 font-medium">Walk to the turnaround point, then head back.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="animate-pulse bg-[#5E4C06]/5 h-80 rounded-[40px] border border-black/5 shadow-inner"></div>
              ))
            ) : (
              routes.map((route, i) => (
                <div key={i} className="bg-[#F4F0E4] p-8 rounded-[40px] border-2 border-[#5FB37A]/20 shadow-xl flex flex-col justify-between hover:border-[#5FB37A] transition-all group hover:shadow-2xl hover:-translate-y-1">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-2xl font-bold text-[#5E4C06] leading-tight group-hover:text-[#5FB37A] transition-colors">{route.name}</h4>
                    </div>
                    <div className="mb-4 flex flex-wrap gap-2">
                      <span className="bg-[#5E4C06] text-[#F4F0E4] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">{route.duration}</span>
                      <span className="bg-[#5FB37A] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">{route.distance}</span>
                    </div>
                    <div className="mb-6 bg-white/30 p-4 rounded-2xl border border-black/5">
                      <p className="text-[10px] font-black text-[#5E4C06]/40 uppercase mb-1 tracking-tighter">Turnaround Point</p>
                      <p className="text-lg font-bold text-[#5E4C06]">{route.turnaroundPoint}</p>
                    </div>
                    <p className="text-[#5E4C06]/80 mb-8 leading-relaxed italic text-sm">{route.description}</p>
                  </div>
                  <a 
                    href={route.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full text-center py-4 bg-[#5E4C06] text-[#F4F0E4] rounded-2xl font-bold hover:bg-[#5FB37A] hover:scale-105 transition-all shadow-lg active:scale-95"
                  >
                    Get Directions
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Planner;
