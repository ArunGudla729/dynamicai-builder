import { parse } from "csv-parse/sync";
import { CSVImportResult, CSVError } from "@/types";
import { entityRepository } from "@/repositories/entity.repository";

export class CSVImportService {
  /**
   * Import CSV file
   */
  async importCSV(
    entityId: string,
    file: File | Buffer,
    options?: {
      skipFirstRow?: boolean;
      mappings?: Record<string, string>;
    }
  ): Promise<CSVImportResult> {
    try {
      // Read file content
      const content = file instanceof Buffer ? file.toString() : await file.text();

      // Parse CSV
      const records = parse(content, {
        columns: !options?.skipFirstRow,
        skip_empty_lines: true,
        trim: true,
      });

      const errors: CSVError[] = [];
      const validRecords: any[] = [];

      // Validate and transform records
      records.forEach((record: any, index: number) => {
        try {
          const transformedRecord = this.transformRecord(record, options?.mappings);
          validRecords.push(transformedRecord);
        } catch (error: any) {
          errors.push({
            row: index + 1,
            message: error.message,
            data: record,
          });
        }
      });

      // Import valid records
      if (validRecords.length > 0) {
        await entityRepository.bulkCreateRecords(entityId, validRecords);
      }

      return {
        success: errors.length === 0,
        imported: validRecords.length,
        failed: errors.length,
        errors,
      };
    } catch (error: any) {
      throw new Error(`CSV import failed: ${error.message}`);
    }
  }

  /**
   * Transform record using mappings
   */
  private transformRecord(record: any, mappings?: Record<string, string>): any {
    if (!mappings) {
      return record;
    }

    const transformed: any = {};
    for (const [csvColumn, entityField] of Object.entries(mappings)) {
      if (record[csvColumn] !== undefined) {
        transformed[entityField] = record[csvColumn];
      }
    }

    return transformed;
  }

  /**
   * Validate CSV structure
   */
  async validateCSV(content: string, expectedColumns?: string[]) {
    try {
      const records = parse(content, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });

      if (records.length === 0) {
        throw new Error("CSV file is empty");
      }

      const actualColumns = Object.keys(records[0]);

      if (expectedColumns) {
        const missing = expectedColumns.filter((col) => !actualColumns.includes(col));
        if (missing.length > 0) {
          throw new Error(`Missing required columns: ${missing.join(", ")}`);
        }
      }

      return {
        valid: true,
        rowCount: records.length,
        columns: actualColumns,
      };
    } catch (error: any) {
      return {
        valid: false,
        error: error.message,
      };
    }
  }
}

export const csvImportService = new CSVImportService();
