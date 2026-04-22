import { http } from "./http";
import type {
  AssignTechnicianPayload,
  CreateTicketPayload,
  Ticket,
  TicketComment,
  TicketSummary,
  UpdateTicketStatusPayload
} from "../types/ticket";

type ApiResponse<T> = {
  message: string;
  data: T;
};

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api";
const apiOrigin = apiBaseUrl.replace(/\/api\/?$/, "");

function normalizeTicket(ticket: Ticket): Ticket {
  return {
    ...ticket,
    attachments: ticket.attachments.map((attachment) => ({
      ...attachment,
      previewUrl: attachment.previewUrl.startsWith("http")
        ? attachment.previewUrl
        : `${apiOrigin}${attachment.previewUrl}`
    }))
  };
}

export async function fetchTickets() {
  const response = await http.get<ApiResponse<TicketSummary[]>>("/tickets");
  return response.data.data;
}

export async function fetchTicketById(ticketId: number) {
  const response = await http.get<ApiResponse<Ticket>>(`/tickets/${ticketId}`);
  return normalizeTicket(response.data.data);
}

export async function createTicket(payload: CreateTicketPayload, attachments: File[]) {
  const formData = new FormData();
  formData.append("ticket", new Blob([JSON.stringify(payload)], { type: "application/json" }));
  attachments.forEach((file) => formData.append("attachments", file));

  const response = await http.post<ApiResponse<Ticket>>("/tickets", formData);
  return normalizeTicket(response.data.data);
}

export async function assignTechnician(ticketId: number, payload: AssignTechnicianPayload) {
  const response = await http.patch<ApiResponse<Ticket>>(`/tickets/${ticketId}/assign`, payload);
  return normalizeTicket(response.data.data);
}

export async function updateTicketStatus(ticketId: number, payload: UpdateTicketStatusPayload) {
  const response = await http.patch<ApiResponse<Ticket>>(`/tickets/${ticketId}/status`, payload);
  return normalizeTicket(response.data.data);
}

export async function addTicketComment(ticketId: number, payload: { content: string }) {
  const response = await http.post<ApiResponse<TicketComment>>(`/tickets/${ticketId}/comments`, payload);
  return response.data.data;
}

export async function updateTicketComment(commentId: number, payload: { content: string }) {
  const response = await http.put<ApiResponse<TicketComment>>(`/comments/${commentId}`, payload);
  return response.data.data;
}

export async function deleteTicketComment(commentId: number) {
  await http.delete(`/comments/${commentId}`);
}
