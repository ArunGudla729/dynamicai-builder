"use client";

import { use, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, FileText, Trash2, Edit } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { ConfigurationDialog } from "@/components/configurations/configuration-dialog";
import { DynamicForm } from "@/components/forms/dynamic-form";
import { DynamicTable } from "@/components/tables/dynamic-table";

async function fetchProject(id: string) {
  const response = await fetch(`/api/projects/${id}`);
  if (!response.ok) throw new Error("Failed to fetch project");
  return response.json();
}

async function deleteProject(id: string) {
  const response = await fetch(`/api/projects/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete project");
  return response.json();
}

async function updateProject(id: string, data: any) {
  const response = await fetch(`/api/projects/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update project");
  return response.json();
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: () => fetchProject(id),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      toast({
        title: "✓ Success",
        description: "Project deleted successfully",
      });
      router.push("/dashboard/projects");
    },
    onError: (error: any) => {
      toast({
        title: "✗ Error",
        description: error.message || "Failed to delete project",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => updateProject(id, data),
    onSuccess: () => {
      toast({
        title: "✓ Success",
        description: "Project updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["project", id] });
      setShowEditDialog(false);
    },
    onError: (error: any) => {
      toast({
        title: "✗ Error",
        description: error.message || "Failed to update project",
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateMutation.mutate({
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      isPublic: formData.get("isPublic") === "on",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/projects">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="animate-pulse space-y-2">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="h-4 bg-gray-200 rounded w-48"></div>
          </div>
        </div>
      </div>
    );
  }

  const project = data?.data;

  if (!project) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Project not found</p>
      </div>
    );
  }

  // Separate configurations by type
  const formConfigs = project.configurations?.filter((c: any) => c.type === "form") || [];
  const tableConfigs = project.configurations?.filter((c: any) => c.type === "table") || [];
  const dashboardConfigs = project.configurations?.filter((c: any) => c.type === "dashboard") || [];
  const workflowConfigs = project.configurations?.filter((c: any) => c.type === "workflow") || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/projects">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{project.name}</h2>
            <p className="text-muted-foreground">
              {project.description || "No description"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowConfigDialog(true)}
            className="mr-2"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Configuration
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setShowEditDialog(true)}
            title="Edit Project"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="destructive" 
            size="icon"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            title="Delete Project"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatDate(project.createdAt)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Configurations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{project.configurations?.length || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {project.isPublic ? "Public" : "Private"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatDate(project.updatedAt)}</p>
          </CardContent>
        </Card>
      </div>

      {!project.configurations || project.configurations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No configurations yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first configuration to get started
            </p>
            <Button onClick={() => setShowConfigDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Configuration
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="forms" className="space-y-4">
          <TabsList>
            <TabsTrigger value="forms">Forms ({formConfigs.length})</TabsTrigger>
            <TabsTrigger value="tables">Tables ({tableConfigs.length})</TabsTrigger>
            <TabsTrigger value="dashboards">Dashboards ({dashboardConfigs.length})</TabsTrigger>
            <TabsTrigger value="workflows">Workflows ({workflowConfigs.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="forms" className="space-y-4">
            {formConfigs.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground">No form configurations yet</p>
                </CardContent>
              </Card>
            ) : (
              formConfigs.map((config: any) => (
                <Card key={config.id}>
                  <CardHeader>
                    <CardTitle>{config.name}</CardTitle>
                    <CardDescription>
                      Dynamic form for {config.config.entity || 'data entry'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DynamicForm config={config.config} configId={config.id} />
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="tables" className="space-y-4">
            {tableConfigs.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground">No table configurations yet</p>
                </CardContent>
              </Card>
            ) : (
              tableConfigs.map((config: any) => (
                <Card key={config.id}>
                  <CardHeader>
                    <CardTitle>{config.name}</CardTitle>
                    <CardDescription>
                      Dynamic table for {config.config.entity || 'data display'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DynamicTable 
                      entityId={config.entityId || config.config.entity} 
                      config={config.config} 
                    />
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="dashboards" className="space-y-4">
            {dashboardConfigs.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground">No dashboard configurations yet</p>
                </CardContent>
              </Card>
            ) : (
              dashboardConfigs.map((config: any) => (
                <Card key={config.id}>
                  <CardHeader>
                    <CardTitle>{config.name}</CardTitle>
                    <CardDescription>Dashboard configuration</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Dashboard widgets: {config.config.widgets?.length || 0}
                    </p>
                    <pre className="mt-4 p-4 bg-muted rounded text-xs overflow-auto max-h-60">
                      {JSON.stringify(config.config, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="workflows" className="space-y-4">
            {workflowConfigs.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground">No workflow configurations yet</p>
                </CardContent>
              </Card>
            ) : (
              workflowConfigs.map((config: any) => (
                <Card key={config.id}>
                  <CardHeader>
                    <CardTitle>{config.name}</CardTitle>
                    <CardDescription>
                      Event: {config.config.event || 'N/A'} • Actions: {config.config.actions?.length || 0}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm"><strong>Description:</strong> {config.config.description}</p>
                      <p className="text-sm"><strong>Trigger:</strong> {config.config.event}</p>
                      <div className="text-sm">
                        <strong>Actions:</strong>
                        <ul className="list-disc list-inside ml-4 mt-1">
                          {config.config.actions?.map((action: any, idx: number) => (
                            <li key={idx}>{action.type}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Edit Project Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update your project details
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">
                Project Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-name"
                name="name"
                defaultValue={project.name}
                required
                disabled={updateMutation.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                defaultValue={project.description || ""}
                rows={4}
                disabled={updateMutation.isPending}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-isPublic"
                name="isPublic"
                defaultChecked={project.isPublic}
                disabled={updateMutation.isPending}
                className="h-4 w-4"
              />
              <Label htmlFor="edit-isPublic" className="font-normal">
                Make project public
              </Label>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditDialog(false)}
                disabled={updateMutation.isPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create Configuration Dialog */}
      {showConfigDialog && (
        <ConfigurationDialog
          projectId={id}
          open={showConfigDialog}
          onOpenChange={setShowConfigDialog}
        />
      )}
    </div>
  );
}
