"use client"

import Link from "next/link"
import { useState } from "react"
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  MapPin,
  Search,
  ShieldCheck,
  Wallet,
  Building2,
  ExternalLink,
  AlertCircle,
  ChartNoAxesColumnIncreasing,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const project = {
  id: "PRJ-001",
  name: "Road Rehabilitation Project",
  description:
    "Road rehabilitation to improve accessibility, road quality, and safety for residents in the surrounding area.",
  location: "Bandar Lampung, Lampung",
  institution: "Public Works Department",
  contractor: "PT Example Construction",
  budget: 2_000_000_000,
  progress: 65,
  status: "In Progress",
  startDate: "10 January 2026",
  endDate: "30 December 2026",
  updatedAt: "26 October 2026",
  source: "Demo data — official source not connected",
}

const documents = [
  {
    id: "DOC-001",
    name: "Project Information",
    type: "PDF Document",
    date: "20 October 2026",
    href: null as string | null,
  },
  {
    id: "DOC-002",
    name: "Budget Documentation",
    type: "PDF Document",
    date: "20 October 2026",
    href: null as string | null,
  },
]

const updates = [
  {
    date: "26 October 2026",
    title: "Latest progress update",
    description:
      "Project progress is recorded at 65%. This is sample data, not a verified official update.",
    progress: 65,
  },
  {
    date: "15 September 2026",
    title: "Construction phase",
    description:
      "Construction activity update. This is sample data.",
    progress: 40,
  },
  {
    date: "10 January 2026",
    title: "Project started",
    description:
      "The project start date was recorded. This is sample data.",
    progress: 0,
  },
]

function rupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value)
}

export default function PublicProjectPage() {
  const [search, setSearch] = useState("")

  const filteredDocuments = documents.filter((document) =>
    document.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <main className="min-h-screen text-[#111318]">
      {/* Public Navbar */}
      <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div>
              <span className="text-lg font-bold tracking-tight">
                Openara
              </span>
              <p className="text-[10px] tracking-wide text-muted-foreground">
                PUBLIC PROJECT TRANSPARENCY
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <Link href="/projects" className="transition hover:text-blue-600">
              Projects
            </Link>
            <Link href="/budget" className="transition hover:text-blue-600">
              BudgetLens
            </Link>
            <Link href="/reports" className="transition hover:text-blue-600">
              Public Reports
            </Link>
          </nav>

          <Button variant="outline" size="sm" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link href="/projects" className="hover:text-blue-600">
            Projects
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{project.id}</span>
        </div>

        {/* Project heading */}
        <section className="rounded-2xl border bg-white p-5 sm:p-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-blue-200 bg-blue-50 text-blue-700"
                >
                  {project.id}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-emerald-200 bg-emerald-50 text-emerald-700"
                >
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  {project.status}
                </Badge>
              </div>

              <div className="space-y-3">
                <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
                  {project.name}
                </h1>
                <p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
                  {project.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  {project.location}
                </span>
                <span className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-blue-600" />
                  {project.institution}
                </span>
              </div>
            </div>

            <Button className="shrink-0 bg-blue-600 hover:bg-blue-700" asChild>
              <Link href="/login">
                <AlertCircle className="mr-2 h-4 w-4" />
                Report an Issue
              </Link>
            </Button>
          </div>
        </section>

        {/* Summary */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Summary
            icon={<Wallet className="h-5 w-5 text-blue-600" />}
            label="Project Budget"
            value={rupiah(project.budget)}
            note="Recorded budget ceiling"
          />
          <Summary
            icon={
              <ChartNoAxesColumnIncreasing className="h-5 w-5 text-blue-600" />
            }
            label="Physical Progress"
            value={`${project.progress}%`}
            note="Latest recorded progress"
          >
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </Summary>
          <Summary
            icon={<CalendarDays className="h-5 w-5 text-blue-600" />}
            label="Start Date"
            value="10 Jan 2026"
            note="Planned project start"
          />
          <Summary
            icon={<Clock3 className="h-5 w-5 text-blue-600" />}
            label="Target Completion"
            value="30 Dec 2026"
            note="Planned completion"
          />
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Overview */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Project Overview</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Key information about this public project.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                  <Info label="Project ID" value={project.id} />
                  <Info label="Project Owner" value={project.institution} />
                  <Info label="Contractor" value={project.contractor} />
                  <Info label="Location" value={project.location} />
                  <Info label="Start Date" value={project.startDate} />
                  <Info label="Target Completion" value={project.endDate} />
                  <Info
                    label="Last Updated"
                    value={project.updatedAt}
                  />
                  <Info
                    label="Current Status"
                    value={project.status}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Progress timeline */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Project Progress</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Updates recorded for this project.
                </p>
              </CardHeader>

              <CardContent>
                <div className="space-y-6">
                  {updates.map((update, index) => (
                    <div
                      key={update.title}
                      className="flex gap-4"
                    >
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                            index === 0
                              ? "bg-blue-50 text-blue-600"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {index === 0 ? (
                            <ChartNoAxesColumnIncreasing className="h-5 w-5" />
                          ) : (
                            <CheckCircle2 className="h-5 w-5" />
                          )}
                        </div>
                        {index !== updates.length - 1 && (
                          <div className="mt-2 min-h-8 w-px flex-1 bg-slate-200" />
                        )}
                      </div>

                      <div className="flex-1 pb-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="font-semibold">{update.title}</h3>
                          <span className="text-xs text-muted-foreground">
                            {update.date}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {update.description}
                        </p>
                        <div className="mt-3 inline-flex rounded-md bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                          Recorded progress: {update.progress}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Public documents */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Public Documents</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Supporting documents made available for public reference.
                </p>
              </CardHeader>

              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search documents..."
                    className="h-10 w-full rounded-lg border bg-white pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="space-y-3">
                  {filteredDocuments.map((document) => (
                    <div
                      key={document.id}
                      className="flex flex-col justify-between gap-3 rounded-xl border p-4 sm:flex-row sm:items-center"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{document.name}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {document.type} · Updated {document.date}
                          </p>
                        </div>
                      </div>

                      {document.href ? (
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={document.href}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <ArrowDownToLine className="mr-2 h-4 w-4" />
                            View Document
                          </a>
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled
                        >
                          <ArrowDownToLine className="mr-2 h-4 w-4" />
                          Unavailable
                        </Button>
                      )}
                    </div>
                  ))}

                  {filteredDocuments.length === 0 && (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      No matching documents found.
                    </p>
                  )}
                </div>

                <p className="mt-4 text-xs leading-5 text-muted-foreground">
                  Demo documents are placeholders. Only publish files that
                  have been reviewed and approved for public access.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Transparency */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Transparency Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                  <div className="flex items-center gap-2 font-semibold text-blue-900">
                    <ShieldCheck className="h-5 w-5" />
                    Data source
                  </div>
                  <p className="mt-2 text-sm leading-6 text-blue-800">
                    {project.source}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Budget information
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    Budget ceiling recorded
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Actual expenditure is not available in this demo.
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Progress information
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    Last updated {project.updatedAt}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Verify the source before treating this progress as an
                    official measurement.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Report card */}
            {/* Project metadata */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Building2 className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Responsible Institution
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {project.institution}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Planned Duration
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {project.startDate} – {project.endDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Wallet className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Recorded Budget
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {rupiah(project.budget)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>

        {/* Footer */}
        <footer className="flex flex-col justify-between gap-3 border-t py-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <Link href="/projects" className="flex items-center gap-2 hover:text-blue-600">
            <ArrowLeft className="h-4 w-4" />
            Back to all projects
          </Link>
          <p>Openara · Every Project. Open to Everyone.</p>
        </footer>
      </div>
    </main>
  )
}

function Summary({
  icon,
  label,
  value,
  note,
  children,
}: {
  icon: React.ReactNode
  label: string
  value: string
  note: string
  children?: React.ReactNode
}) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">{label}</p>
          {icon}
        </div>
        <p className="mt-3 text-xl font-bold">{value}</p>
        {children}
        <p className="mt-2 text-xs text-muted-foreground">{note}</p>
      </CardContent>
    </Card>
  )
}

function Info({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 break-words text-sm font-medium">{value}</p>
    </div>
  )
}