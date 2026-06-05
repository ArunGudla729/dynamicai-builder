import { AppConfig, FieldConfig } from "@/types";
import { validateConfig } from "@/validations/config.validation";
import { entityRepository } from "@/repositories/entity.repository";
import { configurationRepository } from "@/repositories/configuration.repository";

export class DynamicFormService {
  /**
   * Generate form configuration from JSON
   */
  async generateForm(config: AppConfig, configurationId: string) {
    try {
      // Validate configuration
      const validatedConfig = validateConfig("form", config);

      // Create or update entity
      const existingEntity = await entityRepository.findByName(
        configurationId,
        config.entity
      );

      const entityData = {
        configurationId,
        name: config.entity,
        displayName: config.displayName || config.entity,
        schema: this.generateSchema(config.fields),
      };

      const entity = existingEntity
        ? await entityRepository.update(existingEntity.id, entityData)
        : await entityRepository.create(entityData);

      return {
        entity,
        formConfig: this.buildFormConfig(config),
        validationRules: this.buildValidationRules(config.fields),
      };
    } catch (error: any) {
      throw new Error(`Failed to generate form: ${error.message}`);
    }
  }

  /**
   * Build form configuration for rendering
   */
  private buildFormConfig(config: AppConfig) {
    return {
      entity: config.entity,
      displayName: config.displayName || config.entity,
      fields: config.fields.map((field) => this.normalizeField(field)),
      actions: config.actions || ["create", "update", "delete"],
    };
  }

  /**
   * Normalize field configuration with defaults
   */
  private normalizeField(field: FieldConfig): FieldConfig {
    return {
      ...field,
      label: field.label || this.toTitleCase(field.name),
      placeholder: field.placeholder || `Enter ${field.name}`,
      required: field.required ?? false,
      hidden: field.hidden ?? false,
      disabled: field.disabled ?? false,
    };
  }

  /**
   * Generate database schema from fields
   */
  private generateSchema(fields: FieldConfig[]) {
    return fields.map((field) => ({
      name: field.name,
      type: this.mapFieldTypeToDbType(field.type),
      required: field.required || false,
      default: field.defaultValue,
    }));
  }

  /**
   * Build validation rules for form fields
   */
  private buildValidationRules(fields: FieldConfig[]) {
    const rules: Record<string, any> = {};

    fields.forEach((field) => {
      const fieldRules: any = {};

      if (field.required) {
        fieldRules.required = `${field.label || field.name} is required`;
      }

      // Type-specific validation
      switch (field.type) {
        case "email":
          fieldRules.pattern = {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Invalid email address",
          };
          break;
        case "url":
          fieldRules.pattern = {
            value: /^https?:\/\/.+/,
            message: "Invalid URL",
          };
          break;
        case "tel":
          fieldRules.pattern = {
            value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
            message: "Invalid phone number",
          };
          break;
        case "number":
          fieldRules.valueAsNumber = true;
          break;
      }

      // Custom validation rules
      if (field.validation) {
        field.validation.forEach((rule) => {
          switch (rule.type) {
            case "min":
              fieldRules.min = {
                value: rule.value,
                message: rule.message || `Minimum value is ${rule.value}`,
              };
              break;
            case "max":
              fieldRules.max = {
                value: rule.value,
                message: rule.message || `Maximum value is ${rule.value}`,
              };
              break;
            case "minLength":
              fieldRules.minLength = {
                value: rule.value,
                message: rule.message || `Minimum length is ${rule.value}`,
              };
              break;
            case "maxLength":
              fieldRules.maxLength = {
                value: rule.value,
                message: rule.message || `Maximum length is ${rule.value}`,
              };
              break;
            case "pattern":
              fieldRules.pattern = {
                value: new RegExp(rule.value),
                message: rule.message || "Invalid format",
              };
              break;
          }
        });
      }

      rules[field.name] = fieldRules;
    });

    return rules;
  }

  /**
   * Map field type to database type
   */
  private mapFieldTypeToDbType(fieldType: string): string {
    const typeMap: Record<string, string> = {
      text: "String",
      email: "String",
      password: "String",
      number: "Int",
      date: "DateTime",
      datetime: "DateTime",
      textarea: "String",
      select: "String",
      multiselect: "Json",
      checkbox: "Boolean",
      switch: "Boolean",
      url: "String",
      tel: "String",
      json: "Json",
    };

    return typeMap[fieldType] || "String";
  }

  /**
   * Convert string to title case
   */
  private toTitleCase(str: string): string {
    return str
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (s) => s.toUpperCase())
      .trim();
  }

  /**
   * Submit form data
   */
  async submitForm(entityId: string, data: any) {
    try {
      const entity = await entityRepository.findById(entityId);
      if (!entity) {
        throw new Error("Entity not found");
      }

      // Validate data against schema
      this.validateFormData(entity.schema, data);

      // Create record
      const record = await entityRepository.createRecord({
        entityId,
        data,
      });

      return record;
    } catch (error: any) {
      throw new Error(`Failed to submit form: ${error.message}`);
    }
  }

  /**
   * Update form data
   */
  async updateForm(recordId: string, data: any) {
    try {
      const record = await entityRepository.findRecordById(recordId);
      if (!record) {
        throw new Error("Record not found");
      }

      // Validate data against schema
      this.validateFormData(record.entity.schema, data);

      // Update record
      const updatedRecord = await entityRepository.updateRecord(recordId, data);

      return updatedRecord;
    } catch (error: any) {
      throw new Error(`Failed to update form: ${error.message}`);
    }
  }

  /**
   * Validate form data against schema
   */
  private validateFormData(schema: any[], data: any) {
    schema.forEach((field) => {
      if (field.required && !data[field.name]) {
        throw new Error(`${field.name} is required`);
      }
    });
  }
}

export const dynamicFormService = new DynamicFormService();
