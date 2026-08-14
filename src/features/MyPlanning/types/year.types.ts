export type Year = {
  id: string;
  year: number;
  // outros campos do seu schema
};

export type SortOrder = "asc" | "desc";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface BulkOperationFailure {
  id: string;
  reason: string;
}

export interface BulkOperationResult {
  succeeded: string[];
  failed: BulkOperationFailure[];
}

export type YearMemberRole = "ADMIN" | "EDITOR" | "PARTICIPANTE";

export interface YearMemberUser {
  id: string;
  name: string;
  email: string;
}

export interface YearMember {
  id: string;
  yearId: string;
  userId: string;
  role: YearMemberRole;
  invitedAt: string;
  acceptedAt: string | null;
  user: YearMemberUser;
}

export interface YearDetail extends Year {
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  members: YearMember[];
}
