import { TableConfig } from "@/types";
import { validateConfig } from "@/validations/config.validation";
import { entityRepository } from "@/repositories/entity.repository";
import { QueryRecordsDto } from "@/dto/entity.dto";

export class DynamicTableService {
  /**
   * Generate table configuration from JSON
   */
  async generateTable(config: TableConfig, configurationId: string) {
    try {
      // Validate configuration
      const validatedConfig = validateConfig("table", config);

      // Get or create entity
      const entity = await entityRepository.findByName(configurationId, config.entity);
      if (!entity) {
        throw new Error(`Entity ${config.entity} not found`);
      }

      return {
        entity,
        tableConfig: this.buildTableConfig(config),
      };
    } catch (error: any) {
      throw new Error(`Failed to generate table: ${error.message}`);
    }
  }

  /**
   * Build table configuration for rendering
   */
  private buildTableConfig(config: TableConfig) {
    return {
      entity: config.entity,
      columns: config.columns.map((col) => ({
        ...col,
        sortable: col.sortable ?? config.sortable ?? true,
        filterable: col.filterable ?? false,
        hidden: col.hidden ?? false,
      })),
      actions: config.actions || [
        { type: "view", label: "View", icon: "eye" },
        { type: "edit", label: "Edit", icon: "edit" },
        { type: "delete", label: "Delete", icon: "trash" },
      ],
      filters: config.filters || [],
      searchable: config.searchable ?? true,
      sortable: config.sortable ?? true,
      pagination: config.pagination || { pageSize: 10, pageSizeOptions: [10, 25, 50, 100] },
      exportable: config.exportable ?? true,
    };
  }

  /**
   * Query table data with filters, sorting, and pagination
   */
  async queryTable(entityId: string, query: QueryRecordsDto) {
    try {
      const { records, total } = await entityRepository.queryRecords(entityId, query);

      const totalPages = Math.ceil(total / (query.pageSize || 10));

      return {
        records,
        metadata: {
          page: query.page || 1,
          pageSize: query.pageSize || 10,
          total,
          totalPages,
        },
      };
    } catch (error: any) {
      throw new Error(`Failed to query table: ${error.message}`);
    }
  }

  /**
   * Export table data to CSV
   */
  async exportToCSV(entityId: string, query: QueryRecordsDto) {
    try {
      // Get all records without pagination
      const { records } = await entityRepository.queryRecords(entityId, {
        ...query,
        page: 1,
        pageSize: 10000, // Max export size
      });

      if (records.length === 0) {
        return null;
      }

      // Extract column names from first record
      const firstRecord = records[0].data;
      const columns = Object.keys(firstRecord);

      // Generate CSV header
      const csvHeader = columns.join(",");

      // Generate CSV rows
      const csvRows = records.map((record) => {
        return columns
          .map((col) => {
            const value = record.data[col];
            // Handle values with commas, quotes, or newlines
            if (
              typeof value === "string" &&
              (value.includes(",") || value.includes('"') || value.includes("\n"))
            ) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value ?? "";
          })
          .join(",");
      });

      const csv = [csvHeader, ...csvRows].join("\n");

      return {
        data: csv,
        filename: `export-${entityId}-${Date.now()}.csv`,
      };
    } catch (error: any) {
      throw new Error(`Failed to export CSV: ${error.message}`);
    }
  }

  /**
   * Apply filters to query
   */
  private applyFilters(query: any, filters: Record<string, any>) {
    // This would be more complex in a real implementation
    // For now, just return the filters
    return filters;
  }

  /**
   * Delete record
   */
  async deleteRecord(recordId: string) {
    try {
      await entityRepository.deleteRecord(recordId);
      return { success: true };
    } catch (error: any) {
      throw new Error(`Failed to delete record: ${error.message}`);
    }
  }
}

export const dynamicTableService = new DynamicTableService();
