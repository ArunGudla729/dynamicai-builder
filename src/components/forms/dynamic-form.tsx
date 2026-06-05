"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { AppConfig, FieldConfig } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface DynamicFormProps {
  config: AppConfig;
  configId: string;
  initialData?: any;
  onSuccess?: () => void;
}

function buildZodSchema(fields: FieldConfig[]) {
  const shape: any = {};

  fields.forEach((field) => {
    let fieldSchema: any;

    switch (field.type) {
      case "checkbox":
        fieldSchema = z.boolean().optional();
        break;
      case "email":
        fieldSchema = z.string().email("Invalid email");
        break;
      case "number":
        fieldSchema = z.coerce.number();
        break;
      case "url":
        fieldSchema = z.string().url("Invalid URL");
        break;
      case "date":
      case "datetime":
        fieldSchema = z.string();
        break;
      default:
        fieldSchema = z.string();
    }

    // Don't apply string-specific validations to checkboxes
    if (field.type !== "checkbox") {
      if (field.required) {
        fieldSchema = fieldSchema.min(1, `${field.label || field.name} is required`);
      } else {
        fieldSchema = fieldSchema.optional();
      }

      if (field.validation) {
        field.validation.forEach((rule) => {
          if (rule.type === "minLength") {
            fieldSchema = fieldSchema.min(rule.value, rule.message);
          }
          if (rule.type === "maxLength") {
            fieldSchema = fieldSchema.max(rule.value, rule.message);
          }
        });
      }
    }

    shape[field.name] = fieldSchema;
  });

  return z.object(shape);
}

export function DynamicForm({ config, configId, initialData, onSuccess }: DynamicFormProps) {
  const queryClient = useQueryClient();
  const schema = buildZodSchema(config.fields);
  const entityId = config.entity;

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData || {},
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const url = initialData
        ? `/api/records/${initialData.id}`
        : `/api/entities/${entityId}/records`;
      const method = initialData ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });

      if (!response.ok) throw new Error("Failed to save record");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "✓ Success",
        description: initialData ? "Record updated successfully" : "Record created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["records", entityId] });
      form.reset();
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "✗ Error",
        description: error.message || "Failed to save record",
        variant: "destructive",
      });
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data);
  });

  const renderField = (field: FieldConfig) => {
    const error = form.formState.errors[field.name];

    switch (field.type) {
      case "textarea":
        return (
          <Textarea
            {...form.register(field.name)}
            placeholder={field.placeholder}
            disabled={mutation.isPending}
          />
        );

      case "select":
        return (
          <Select
            value={form.watch(field.name)}
            onValueChange={(value) => form.setValue(field.name, value)}
            disabled={mutation.isPending}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || "Select..."} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...form.register(field.name)}
              className="rounded border-gray-300"
              disabled={mutation.isPending}
            />
          </div>
        );

      default:
        return (
          <Input
            {...form.register(field.name)}
            type={field.type}
            placeholder={field.placeholder}
            disabled={mutation.isPending}
          />
        );
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {config.fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name}>
            {field.label || field.name}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {renderField(field)}
          {form.formState.errors[field.name] && (
            <p className="text-sm text-red-500">
              {String(form.formState.errors[field.name]?.message)}
            </p>
          )}
          {field.description && (
            <p className="text-sm text-muted-foreground">{field.description}</p>
          )}
        </div>
      ))}

      <div className="flex gap-2">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending
            ? "Saving..."
            : initialData
            ? "Update"
            : "Create"}
        </Button>
        {initialData && (
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={mutation.isPending}
          >
            Reset
          </Button>
        )}
      </div>
    </form>
  );
}
