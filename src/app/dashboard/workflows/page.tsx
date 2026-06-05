"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Workflow as WorkflowIcon, Play, Pause, Settings } from "lucide-react";
import { formatDate } from "@/lib/utils";

async function fetchWorkflows() {
  const response = await fetch("/api/configurations");
  if (!response.ok) throw new Error("Failed to fetch configurations");
  const data = await response.json();
  // Filter only workflow type configurations
  return {
    data: (data.data || []).filter((config: any) => config.type === "workflow"),
  };
}

export default function WorkflowsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["workflows"],
    queryFn: fetchWorkflows,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Workflows</h2>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const workflows = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Workflows</h2>
          <p className="text-muted-foreground">
            Automate your application with event-driven workflows
          </p>
        </div>
        <Link href="/dashboard/projects">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create in Project
          </Button>
        </Link>
      </div>

      {workflows.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12">
          <WorkflowIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No workflows yet</h3>
          <p className="text-muted-foreground mb-4 text-center max-w-md">
            Create automated workflows to respond to events in your application.
            Workflows are created as part of project configurations.
          </p>
          <Link href="/dashboard/projects">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Go to Projects
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4">
          {workflows.map((workflow: any) => (
            <Card key={workflow.id} className="hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <WorkflowIcon className="h-5 w-5" />
                      {workflow.name}
                    </CardTitle>
                    <CardDescription>
                      Event: <span className="font-medium">{workflow.config?.event || "N/A"}</span>
                      {" • "}
                      Actions: <span className="font-medium">{workflow.config?.actions?.length || 0}</span>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/projects/${workflow.projectId}`}>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        View Project
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          workflow.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                        }`}
                      >
                        {workflow.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <span className="text-muted-foreground">
                      Created {formatDate(workflow.createdAt)}
                    </span>
                  </div>

                  {workflow.config?.actions && workflow.config.actions.length > 0 && (
                    <div className="text-sm">
                      <p className="font-medium mb-2">Actions:</p>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {workflow.config.actions.map((action: any, idx: number) => (
                          <li key={idx}>
                            {action.type || "Unknown action"}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {workflow.config?.conditions && workflow.config.conditions.length > 0 && (
                    <div className="text-sm">
                      <p className="font-medium mb-2">Conditions:</p>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {workflow.config.conditions.map((condition: any, idx: number) => (
                          <li key={idx}>
                            {condition.field} {condition.operator} {JSON.stringify(condition.value)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
