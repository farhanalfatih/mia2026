"use client";

import {
  Plus,
  Search,
  SlidersHorizontal,
  ArrowUpRight,
  FolderKanban,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Badge,
} from "@/components/ui/badge";

const projects = [
  {
    id: "PRJ-001",
    name: "Road Rehabilitation Project",
    location: "Bandar Lampung",
    budget: "Rp2.000.000.000",
    progress: 65,
    status: "In Progress",
  },
  {
    id: "PRJ-002",
    name: "Public Park Development",
    location: "Metro, Lampung",
    budget: "Rp850.000.000",
    progress: 100,
    status: "Completed",
  },
  {
    id: "PRJ-003",
    name: "Drainage Improvement",
    location: "Lampung Selatan",
    budget: "Rp1.200.000.000",
    progress: 25,
    status: "In Progress",
  },
];

export default function ProjectTracePage() {
  return (
    <div className="min-h-screen space-y-8 bg-white p-6 text-[#111318] md:p-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FolderKanban className="size-4" />
            Openara / Projects
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">
            ProjectTrace
          </h1>

          <p className="text-sm text-muted-foreground">
            Explore and monitor public project information.
          </p>
        </div>

        <Button className="bg-blue-600 text-white hover:bg-blue-700">
          <Plus className="mr-2 size-4" />
          Create Project
        </Button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-muted-foreground">
            Total Projects
          </p>
          <p className="mt-2 text-2xl font-semibold">03</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Projects in this demo
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-muted-foreground">
            Total Project Budget
          </p>
          <p className="mt-2 text-2xl font-semibold">
            Rp4,05 M
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Based on displayed project data
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-muted-foreground">
            In Progress
          </p>
          <p className="mt-2 text-2xl font-semibold">02</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Projects currently being developed
          </p>
        </div>
      </div>

      {/* Project List */}
      <div className="space-y-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold">All Projects</h2>
            <p className="text-sm text-muted-foreground">
              Browse project details, budgets, and progress.
            </p>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                className="pl-9"
              />
            </div>

            <Button variant="outline" size="icon" aria-label="Filter projects">
              <SlidersHorizontal className="size-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200">
          <Table>
            <TableCaption className="pb-4">
              Demo project data. Replace with verified project records.
            </TableCaption>

            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="pl-5">Project</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-5 text-right">
                  Details
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="py-4 pl-5">
                    <div className="space-y-1">
                      <p className="font-medium">{project.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {project.id}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {project.location}
                  </TableCell>

                  <TableCell className="font-medium">
                    {project.budget}
                  </TableCell>

                  <TableCell className="min-w-32">
                    <div className="space-y-2">
                      <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {project.progress}%
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        project.status === "Completed"
                          ? "border-green-200 bg-green-50 text-green-700"
                          : "border-blue-200 bg-blue-50 text-blue-700"
                      }
                    >
                      {project.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="pr-5 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700"
                      aria-label={`View ${project.name}`}
                    >
                      View
                      <ArrowUpRight className="ml-1 size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}