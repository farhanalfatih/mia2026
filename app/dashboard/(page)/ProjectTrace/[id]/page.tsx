import Link from "next/link"
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  Building2,
  Wallet,
  FileText,
  Download,
  ExternalLink,
  Clock,
  CheckCircle2,
  CircleDot,
  AlertCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const project = {
  id: "PRJ-001",
  name: "Road Rehabilitation Project",
  description:
    "Road rehabilitation project to improve road conditions, accessibility, and safety for residents in the surrounding area.",
  location: "Bandar Lampung, Lampung",
  institution: "Public Works Department",
  contractor: "PT Example Construction",
  budget: 2_000_000_000,
  progress: 65,
  status: "In Progress",
  startDate: "10 January 2026",
  endDate: "30 December 2026",
  updatedAt: "20 October 2026",
  source: "Demo data — replace with an official source",
}

const updates = [
  {
    date: "20 October 2026",
    title: "Project progress updated",
    description:
      "Progress reported at 65%. This entry is sample data.",
    status: "Current",
  },
  {
    date: "15 September 2026",
    title: "Construction phase",
    description:
      "Construction activity update. This entry is sample data.",
    status: "Completed",
  },
  {
    date: "10 January 2026",
    title: "Project started",
    description:
      "Project start date recorded. This entry is sample data.",
    status: "Completed",
  },
]

const documents = [
  {
    name: "Project Information",
    type: "Project document",
    size: "—",
  },
  {
    name: "Budget Documentation",
    type: "Budget reference",
    size: "—",
  },
]

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function ProjectViewPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-6 text-[#111318] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link
            href="/projects"
            className="flex items-center gap-1 transition hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            ProjectTrace
          </Link>
          <span>/</span>
          <span className="text-foreground">Project Details</span>
        </div>

        {/* Project Header */}
        <section className="flex flex-col justify-between gap-4 rounded-2xl border bg-white p-5 sm:p-7 lg:flex-row lg:items-start">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50">
                {project.id}
              </Badge>
              <Badge className="border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50">
                <CircleDot className="mr-1 h-3 w-3" />
                {project.status}
              </Badge>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {project.name}
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                {project.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
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

          <div className="flex shrink-0 gap-2">
            <Button variant="outline" asChild>
              <Link href="/projects">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>

            <Button className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link href={`/projects/${project.id}/report`}>
                <AlertCircle className="mr-2 h-4 w-4" />
                Report an Issue
              </Link>
            </Button>
          </div>
        </section>

        {/* Summary Cards */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Project Budget</p>
                <Wallet className="h-5 w-5 text-blue-600" />
              </div>
              <p className="mt-3 text-xl font-bold">
                {formatRupiah(project.budget)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Budget ceiling, not actual expenditure
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Progress</p>
                <CircleDot className="h-5 w-5 text-blue-600" />
              </div>
              <p className="mt-3 text-2xl font-bold">
                {project.progress}%
              </p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Start Date</p>
                <CalendarDays className="h-5 w-5 text-blue-600" />
              </div>
              <p className="mt-3 text-base font-bold">
                {project.startDate}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Recorded project start
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Target Completion</p>
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
              </div>
              <p className="mt-3 text-base font-bold">
                {project.endDate}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Planned completion date
              </p>
            </CardContent>
          </Card>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Project Information */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">
                  Project Information
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Basic information about this public project.
                </p>
              </CardHeader>

              <CardContent>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Project ID
                    </p>
                    <p className="mt-1 font-medium">{project.id}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Project Owner
                    </p>
                    <p className="mt-1 font-medium">
                      {project.institution}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Contractor
                    </p>
                    <p className="mt-1 font-medium">
                      {project.contractor}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Last Updated
                    </p>
                    <p className="mt-1 flex items-center gap-2 font-medium">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {project.updatedAt}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress History */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">
                  Project Progress
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  A timeline of recorded project updates.
                </p>
              </CardHeader>

              <CardContent>
                <div className="space-y-6">
                  {updates.map((update, index) => (
                    <div key={`${update.date}-${update.title}`} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                            index === 0
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {index === 0 ? (
                            <CircleDot className="h-4 w-4" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4" />
                          )}
                        </div>
                        {index !== updates.length - 1 && (
                          <div className="mt-2 h-full min-h-8 w-px bg-gray-200" />
                        )}
                      </div>

                      <div className="flex-1 pb-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="font-semibold">{update.title}</h3>
                          <span className="text-xs text-muted-foreground">
                            {update.date}
                          </span>
                        </div>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {update.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Project Documents</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Documents published for public reference.
                </p>
              </CardHeader>

              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {documents.map((document) => (
                      <TableRow key={document.name}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                              <FileText className="h-4 w-4" />
                            </div>
                            <span className="font-medium">
                              {document.name}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          {document.type}
                        </TableCell>

                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" disabled>
                            <Download className="mr-2 h-4 w-4" />
                            Unavailable
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <p className="mt-4 text-xs leading-5 text-muted-foreground">
                  Sample document entries only. Actual documents should be
                  linked to verified public files.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Project Transparency</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="rounded-xl bg-blue-50 p-4">
                  <p className="text-sm font-semibold text-blue-900">
                    Data source
                  </p>
                  <p className="mt-1 text-sm leading-5 text-blue-800">
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
                    Actual spending has not been verified in this demo.
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Progress information
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    Sample progress data
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Confirm progress updates with a traceable source before
                    publishing them as official facts.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Public Reports</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Help document issues related to this project.
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-violet-50 p-2 text-violet-600">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      Notice an issue?
                    </p>
                    <p className="mt-1 text-sm leading-5 text-muted-foreground">
                      Submit a report with a description and supporting photo.
                    </p>
                  </div>
                </div>

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  asChild
                >
                  <Link href={`/projects/${project.id}/report`}>
                    Submit a Report
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  asChild
                >
                  <Link href="/reports">
                    View Public Reports
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>

        <footer className="border-t pt-5 text-center text-xs text-muted-foreground">
          Openara · Every Project. Open to Everyone.
        </footer>
      </div>
    </main>
  )
}