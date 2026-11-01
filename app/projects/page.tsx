"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownUp,
  Eye,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ProjectStatus =
  | "PLANNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "DELAYED"
  | "CANCELLED";

type Project = {
  id: string;
  name: string;
  location: string;
  budget: number;
  progress: number;
  status: ProjectStatus;
  updatedAt: string;
};

const projects: Project[] = [
  {
    id: "PRJ-001",
    name: "Rehabilitasi Jalan Utama",
    location: "Bandar Lampung",
    budget: 2_000_000_000,
    progress: 65,
    status: "IN_PROGRESS",
    updatedAt: "2026-10-26",
  },
  {
    id: "PRJ-002",
    name: "Pembangunan Drainase",
    location: "Metro",
    budget: 850_000_000,
    progress: 35,
    status: "IN_PROGRESS",
    updatedAt: "2026-10-20",
  },
  {
    id: "PRJ-003",
    name: "Renovasi Fasilitas Sekolah",
    location: "Pringsewu",
    budget: 1_200_000_000,
    progress: 100,
    status: "COMPLETED",
    updatedAt: "2026-10-18",
  },
  {
    id: "PRJ-004",
    name: "Pembangunan Puskesmas",
    location: "Lampung Selatan",
    budget: 3_500_000_000,
    progress: 0,
    status: "PLANNED",
    updatedAt: "2026-10-15",
  },
];

const statusConfig: Record<
  ProjectStatus,
  { label: string; className: string }
> = {
  PLANNED: {
    label: "Direncanakan",
    className: "border-violet-200 bg-violet-50 text-violet-700",
  },
  IN_PROGRESS: {
    label: "Berjalan",
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
  COMPLETED: {
    label: "Selesai",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  DELAYED: {
    label: "Terlambat",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  CANCELLED: {
    label: "Dibatalkan",
    className: "border-red-200 bg-red-50 text-red-700",
  },
};

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export default function AdminProjectsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("LATEST");

  const filteredProjects = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    const result = projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(keyword) ||
        project.id.toLowerCase().includes(keyword) ||
        project.location.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "ALL" ||
        project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    return [...result].sort((a, b) => {
      if (sortOrder === "BUDGET_HIGH") {
        return b.budget - a.budget;
      }

      if (sortOrder === "BUDGET_LOW") {
        return a.budget - b.budget;
      }

      return (
        new Date(b.updatedAt).getTime() -
        new Date(a.updatedAt).getTime()
      );
    });
  }, [search, statusFilter, sortOrder]);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setSortOrder("LATEST");
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Manajemen Proyek
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Cari, filter, dan kelola data proyek publik.
        </p>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col gap-3 rounded-xl border bg-background p-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari nama, ID, atau lokasi proyek..."
            className="pl-9"
          />
        </div>

        <div className="relative">
          <SlidersHorizontal
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="h-10 w-full appearance-none rounded-md border bg-background pl-9 pr-8 text-sm outline-none focus:ring-2 focus:ring-ring lg:w-48"
            aria-label="Filter status proyek"
          >
            <option value="ALL">Semua status</option>
            <option value="PLANNED">Direncanakan</option>
            <option value="IN_PROGRESS">Berjalan</option>
            <option value="COMPLETED">Selesai</option>
            <option value="DELAYED">Terlambat</option>
            <option value="CANCELLED">Dibatalkan</option>
          </select>
        </div>

        <div className="relative">
          <ArrowDownUp
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <select
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
            className="h-10 w-full appearance-none rounded-md border bg-background pl-9 pr-8 text-sm outline-none focus:ring-2 focus:ring-ring lg:w-48"
            aria-label="Urutkan proyek"
          >
            <option value="LATEST">Pembaruan terbaru</option>
            <option value="BUDGET_HIGH">Anggaran tertinggi</option>
            <option value="BUDGET_LOW">Anggaran terendah</option>
          </select>
        </div>

        <Button
          variant="outline"
          onClick={resetFilters}
          type="button"
        >
          Reset
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border bg-background">
        <div className="flex flex-col gap-1 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-semibold">Daftar Proyek</h2>
          <p className="text-sm text-muted-foreground">
            {filteredProjects.length} proyek ditemukan
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">Proyek</TableHead>
              <TableHead>Lokasi</TableHead>
              <TableHead>Anggaran</TableHead>
              <TableHead>Progres</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right pr-5">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="pl-5">
                    <div className="font-medium">
                      {project.name}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {project.id}
                    </div>
                  </TableCell>

                  <TableCell className="text-sm">
                    {project.location}
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-sm">
                    {formatRupiah(project.budget)}
                  </TableCell>

                  <TableCell className="min-w-32">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{
                            width: `${project.progress}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {project.progress}%
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className={statusConfig[project.status].className}
                    >
                      {statusConfig[project.status].label}
                    </Badge>
                  </TableCell>

                  <TableCell className="pr-5 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link href={`/admin/projects/${project.id}`}>
                        <Eye size={15} className="mr-2" />
                        Kelola
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center"
                >
                  <Search
                    size={22}
                    className="mx-auto mb-2 text-muted-foreground"
                  />
                  <p className="font-medium">
                    Proyek tidak ditemukan
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Ubah kata kunci atau filter pencarian.
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}