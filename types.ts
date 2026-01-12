
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  date: string;
  article: string;
  steps?: string;
}

export interface PlannerRoute {
  location: string;
  duration: number;
}
