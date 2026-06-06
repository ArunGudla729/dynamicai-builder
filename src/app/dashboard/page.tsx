"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, Workflow, FileText, Users, TrendingUp, ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function fetchDashboardStats() {
  const [projectsRes, configurationsRes] = await Promise.all([
    fetch("/api/projects"),
    fetch("/api/configurations"),
  ]);

  const projects = projectsRes.ok ? await projectsRes.json() : { data: [] };
  const configurations = configurationsRes.ok ? await configurationsRes.json() : { data: [] };

  return {
    projects: projects.data || [],
    configurations: configurations.data || [],
  };
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchDashboardStats,
    refetchInterval: 5000, // Refetch every 5 seconds
    refetchOnWindowFocus: true, // Refetch when window regains focus
    staleTime: 0, // Always consider data stale
  });

  const projectCount = data?.projects?.length || 0;
  const configCount = data?.configurations?.length || 0;
  const workflowCount = data?.configurations?.filter((c: any) => c.type === "workflow").length || 0;

  const stats = [
    {
      title: "Total Projects",
      value: projectCount,
      icon: FolderKanban,
      description: projectCount > 0 ? "Active projects" : "No projects yet",
      link: "/dashboard/projects",
      trend: "+12%",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Active Workflows",
      value: workflowCount,
      icon: Workflow,
      description: workflowCount > 0 ? "Workflow configurations" : "No workflows",
      link: "/dashboard/workflows",
      trend: "+8%",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Configurations",
      value: configCount,
      icon: FileText,
      description: configCount > 0 ? "Total configurations" : "No configurations",
      link: "/dashboard/projects",
      trend: "+23%",
      gradient: "from-orange-500 to-red-500",
    },
    {
      title: "Team Members",
      value: "1",
      icon: Users,
      description: "Active user",
      link: "/dashboard/settings",
      trend: "0%",
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-muted rounded w-96"></div>
          <div className="h-6 bg-muted rounded w-64"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-muted rounded-xl shimmer"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Welcome back!
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Here's what's happening with your projects today
          </p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90">
          <Sparkles className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Link key={stat.title} href={stat.link}>
            <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-muted/50">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient}`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                  <div className="flex items-center text-xs text-green-600 font-medium">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.trend}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Projects */}
        <Card className="col-span-4 border-0 shadow-xl bg-gradient-to-br from-card to-muted/30">
          <CardHeader className="border-b border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Recent Projects</CardTitle>
                <CardDescription>Your recently created projects</CardDescription>
              </div>
              <Link href="/dashboard/projects">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowUpRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {data?.projects && data.projects.length > 0 ? (
              <div className="space-y-3">
                {data.projects.slice(0, 5).map((project: any) => (
                  <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
                    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-all duration-200 group border border-transparent hover:border-primary/20">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-purple-500/20 group-hover:from-primary/30 group-hover:to-purple-500/30 transition-colors">
                          <FolderKanban className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium group-hover:text-primary transition-colors">{project.name}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {project.description || "No description"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-medium">{project._count?.configurations || 0}</p>
                          <p className="text-xs text-muted-foreground">configs</p>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <FolderKanban className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground font-medium">No projects yet</p>
                <p className="text-sm text-muted-foreground mt-1">Create your first project to get started</p>
                <Link href="/dashboard/projects/new">
                  <Button className="mt-4">Create Project</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-3 border-0 shadow-xl bg-gradient-to-br from-card to-muted/30">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="text-xl">Quick Actions</CardTitle>
            <CardDescription>Get started quickly</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <Link href="/dashboard/projects/new">
                <div className="flex items-center gap-3 p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-cyan-500/10 border border-transparent hover:border-blue-500/20 transition-all duration-200 group">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                    <FolderKanban className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium group-hover:text-blue-600 transition-colors">Create Project</p>
                    <p className="text-sm text-muted-foreground">Start a new project</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 transition-colors" />
                </div>
              </Link>

              <Link href="/dashboard/projects">
                <div className="flex items-center gap-3 p-4 rounded-xl hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 border border-transparent hover:border-purple-500/20 transition-all duration-200 group">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium group-hover:text-purple-600 transition-colors">View Projects</p>
                    <p className="text-sm text-muted-foreground">Browse all projects</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-purple-600 transition-colors" />
                </div>
              </Link>

              <Link href="/dashboard/docs">
                <div className="flex items-center gap-3 p-4 rounded-xl hover:bg-gradient-to-r hover:from-orange-500/10 hover:to-red-500/10 border border-transparent hover:border-orange-500/20 transition-all duration-200 group">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20">
                    <FileText className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium group-hover:text-orange-600 transition-colors">Documentation</p>
                    <p className="text-sm text-muted-foreground">Learn how to use</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-orange-600 transition-colors" />
                </div>
              </Link>

              <Link href="/dashboard/settings">
                <div className="flex items-center gap-3 p-4 rounded-xl hover:bg-gradient-to-r hover:from-green-500/10 hover:to-emerald-500/10 border border-transparent hover:border-green-500/20 transition-all duration-200 group">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium group-hover:text-green-600 transition-colors">Settings</p>
                    <p className="text-sm text-muted-foreground">Manage your account</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-green-600 transition-colors" />
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
