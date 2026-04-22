import type { UserRole } from "./auth";

export type TicketCategory =
  | "ELECTRICAL"
  | "PLUMBING"
  | "NETWORK"
  | "EQUIPMENT"
  | "CLEANING"
  | "SAFETY"
  | "FACILITY"
  | "OTHER";

export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED" | "REJECTED";

export type ActorSummary = {
  identifier: string;
  name: string;
  email?: string | null;
  role: UserRole;
};

export type TicketAttachment = {
  id: number;
  originalFileName: string;
  fileType: string;
  fileSize: number;
  previewUrl: string;
  uploadedAt: string;
};

export type TicketComment = {
  id: number;
  content: string;
  author: ActorSummary;
  createdAt: string;
  updatedAt: string;
  editableByCurrentUser: boolean;
  deletableByCurrentUser: boolean;
};

export type TicketSummary = {
  id: number;
  title: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  locationText?: string | null;
  createdBy: ActorSummary;
  assignedTechnician?: ActorSummary | null;
  createdAt: string;
  updatedAt: string;
};

export type Ticket = {
  id: number;
  title: string;
  category: TicketCategory;
  description: string;
  priority: TicketPriority;
  preferredContact: string;
  locationText?: string | null;
  resourceId?: number | null;
  resourceName?: string | null;
  status: TicketStatus;
  rejectionReason?: string | null;
  resolutionNotes?: string | null;
  createdBy: ActorSummary;
  assignedTechnician?: ActorSummary | null;
  attachments: TicketAttachment[];
  comments: TicketComment[];
  assignAllowed: boolean;
  statusUpdateAllowed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateTicketPayload = {
  title: string;
  category: TicketCategory;
  description: string;
  priority: TicketPriority;
  preferredContact: string;
  locationText?: string;
  resourceId?: number;
};

export type AssignTechnicianPayload = {
  technicianIdentifier: string;
  technicianName: string;
  technicianEmail?: string;
};

export type UpdateTicketStatusPayload = {
  status: TicketStatus;
  resolutionNotes?: string;
  rejectionReason?: string;
};

export const ticketCategoryOptions: TicketCategory[] = [
  "ELECTRICAL",
  "PLUMBING",
  "NETWORK",
  "EQUIPMENT",
  "CLEANING",
  "SAFETY",
  "FACILITY",
  "OTHER"
];

export const ticketPriorityOptions: TicketPriority[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

export const ticketStatusOptions: TicketStatus[] = [
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
  "REJECTED"
];
