export interface Child {
  id: string;
  name: string;
  avatar: string;
  memorizationLevel: string;
}

export interface Cycle {
  id: string;
  year: string;
  name: string;
  sessionsCount: number;
  startDate: string;
  endDate: string;
  status: "completed" | "active";
}

export interface SessionRecord {
  session_id?: number;
  session_date: string;
  session_number: number;
  session_type: string;
  attendance: boolean;
  justification: string;
  hifz_details: string | null;
  revision_details: string | null;
  test_details: string | null;
}
