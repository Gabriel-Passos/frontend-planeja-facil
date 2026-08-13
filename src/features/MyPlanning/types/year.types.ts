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
