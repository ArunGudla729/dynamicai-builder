"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { TableConfig } from "@/types";
import { ChevronLeft, ChevronRight, Download, Trash2, Eye, Edit } from "lucide-react";

interface DynamicTableProps {
  entityId: string;
  config: TableConfig;
  onView?: (record: any) => void;
  onEdit?: (record: any) => void;
}

async function fetchRecords(entityId: string, params: any) {
  const query = new URLSearchParams(params);
  const response = await fetch(`/api/entities/${entityId}/records?${query}`);
  if (!response.ok) throw new Error("Failed to fetch records");
  return response.json();
}

async function deleteRecord(recordId: string) {
  const response = await fetch(`/api/records/${recordId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete record");
  return response.json();
}

async function exportToCSV(entityId: string) {
  const response = await fetch(`/api/entities/${entityId}/export`);
  if (!response.ok) throw new Error("Failed to export");
  return response.blob();
}

export function DynamicTable({ entityId, config, onView, onEdit }: DynamicTableProps) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(config.pagination?.pageSize || 10);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { data, isLoading } = useQuery({
    queryKey: ["records", entityId, page, pageSize, search, sortBy, sortOrder],
    queryFn: () =>
      fetchRecords(entityId, {
        page,
        pageSize,
        search,
        sortBy,
        sortOrder,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRecord,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Record deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["records", entityId] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete record",
        variant: "destructive",
      });
    },
  });

  const handleExport = async () => {
    try {
      const blob = await exportToCSV(entityId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `export-${entityId}-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        title: "Success",
        description: "Export completed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export",
        variant: "destructive",
      });
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const records = data?.data || [];
  const metadata = data?.metadata || {};

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {config.searchable && (
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        )}
        {config.exportable && (
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {config.columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={column.sortable !== false ? "cursor-pointer hover:bg-accent" : ""}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                >
                  {column.label}
                  {sortBy === column.key && (
                    <span className="ml-2">{sortOrder === "asc" ? "↑" : "↓"}</span>
                  )}
                </TableHead>
              ))}
              {config.actions && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={config.columns.length + 1} className="text-center">
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              records.map((record: any) => (
                <TableRow key={record.id}>
                  {config.columns.map((column) => (
                    <TableCell key={column.key}>
                      {record.data[column.key]?.toString() || "-"}
                    </TableCell>
                  ))}
                  {config.actions && (
                    <TableCell>
                      <div className="flex gap-2">
                        {onView && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onView(record)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(record)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this record?")) {
                              deleteMutation.mutate(record.id);
                            }
                          }}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {records.length} of {metadata.total || 0} records
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="flex items-center px-3 text-sm">
            Page {page} of {metadata.totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= (metadata.totalPages || 1)}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
