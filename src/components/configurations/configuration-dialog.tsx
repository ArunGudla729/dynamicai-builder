"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface ConfigurationDialogProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConfigurationDialog({ projectId, open, onOpenChange }: ConfigurationDialogProps) {
  const queryClient = useQueryClient();
  const [configType, setConfigType] = useState<string>("form");
  const [configJson, setConfigJson] = useState("");

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/configurations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        // Format validation errors if present
        if (result.details && Array.isArray(result.details)) {
          const errorMsg = result.details.map((d: any) => `${d.field}: ${d.message}`).join(", ");
          throw new Error(errorMsg);
        }
        throw new Error(result.error || "Failed to create configuration");
      }
      
      return result;
    },
    onSuccess: () => {
      toast({
        title: "✓ Success",
        description: "Configuration created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      onOpenChange(false);
      setConfigJson("");
    },
    onError: (error: any) => {
      toast({
        title: "✗ Error",
        description: error.message || "Failed to create configuration",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const config = JSON.parse(configJson);
      const data = {
        projectId,
        name: formData.get("name") as string,
        type: configType,
        config,
      };
      createMutation.mutate(data);
    } catch (error) {
      toast({
        title: "✗ Invalid JSON",
        description: "Please check your JSON configuration syntax",
        variant: "destructive",
      });
    }
  };

  const exampleConfigs: Record<string, string> = {
    form: JSON.stringify({
      entity: "employees",
      fields: [
        { name: "name", type: "text", required: true },
        { name: "email", type: "email", required: true },
        { name: "salary", type: "number" }
      ]
    }, null, 2),
    table: JSON.stringify({
      entity: "employees",
      columns: [
        { key: "name", label: "Name", sortable: true },
        { key: "email", label: "Email" },
        { key: "salary", label: "Salary", type: "number" }
      ]
    }, null, 2),
    dashboard: JSON.stringify({
      title: "Analytics Dashboard",
      widgets: [
        { id: "1", type: "kpi", title: "Total Sales", data: { value: 12500 } }
      ]
    }, null, 2),
    workflow: JSON.stringify({
      event: "user_created",
      actions: [
        { type: "send_email", config: { to: "admin@example.com" } }
      ]
    }, null, 2),
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Configuration</DialogTitle>
          <DialogDescription>
            Create a new configuration for your project
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Configuration Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Employee Form"
              required
              disabled={createMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">
              Type <span className="text-red-500">*</span>
            </Label>
            <Select value={configType} onValueChange={setConfigType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="form">Form</SelectItem>
                <SelectItem value="table">Table</SelectItem>
                <SelectItem value="dashboard">Dashboard</SelectItem>
                <SelectItem value="workflow">Workflow</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="config">
              Configuration JSON <span className="text-red-500">*</span>
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setConfigJson(exampleConfigs[configType])}
              className="mb-2"
            >
              Load Example
            </Button>
            <Textarea
              id="config"
              value={configJson}
              onChange={(e) => setConfigJson(e.target.value)}
              placeholder="Paste your JSON configuration here..."
              rows={15}
              className="font-mono text-sm"
              required
              disabled={createMutation.isPending}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create Configuration"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
