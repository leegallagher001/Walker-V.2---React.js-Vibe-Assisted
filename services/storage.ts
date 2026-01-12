
import { JournalEntry } from '../types';

const DELAY = 400; // Simulate network latency

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getActiveUser = () => {
  const saved = localStorage.getItem('walker_active_user');
  return saved ? JSON.parse(saved) : null;
};

// Returns a key unique to the current logged-in user
const getUserKey = (baseKey: string) => {
  const user = getActiveUser();
  if (!user) return `guest_${baseKey}`;
  return `${user.id}_${baseKey}`;
};

export const StorageService = {
  // Journal Methods
  async getJournalEntries(): Promise<JournalEntry[]> {
    await sleep(DELAY);
    const key = getUserKey('journal_entries');
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  },

  async saveJournalEntry(entry: JournalEntry): Promise<JournalEntry[]> {
    await sleep(DELAY);
    const entries = await this.getJournalEntries();
    const updated = [entry, ...entries].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const key = getUserKey('journal_entries');
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  },

  async deleteJournalEntry(id: string): Promise<JournalEntry[]> {
    await sleep(DELAY);
    const entries = await this.getJournalEntries();
    const updated = entries.filter(e => e.id !== id);
    const key = getUserKey('journal_entries');
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  },

  // Habit Methods
  async getHabitGoal(): Promise<any | null> {
    await sleep(DELAY);
    const key = getUserKey('habit_goal');
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : null;
  },

  async saveHabitGoal(goal: any): Promise<void> {
    await sleep(DELAY);
    const key = getUserKey('habit_goal');
    localStorage.setItem(key, JSON.stringify(goal));
  },

  async clearHabitGoal(): Promise<void> {
    await sleep(DELAY);
    const key = getUserKey('habit_goal');
    localStorage.removeItem(key);
  }
};
