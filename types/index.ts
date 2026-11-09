export type UserRole = "patient" | "doctor" | "admin";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";

export type WarningSignSeverity = "normal" | "mild" | "moderate" | "severe" | "critical";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

