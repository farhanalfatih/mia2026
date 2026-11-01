"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  CircleDot,
  Clock,
  Download,
  ExternalLink,
  FileText,
  History,
  MapPin,
  Pencil,
  Plus,
  QrCode,
  ShieldCheck,
  Trash2,
  Upload,
  Wallet,
  X,
  XCircle,
  AlertTriangle,
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

type ProjectStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "REJECTED"
  | "CANCELLED"

type ProjectDocument = {
  id: string
  name: string
  type: string
  size: string
  file?: File
}

type Activity = {
  id: string
  title: string
  description: string
  date: string
}

const initialProject = {
  id: "PRJ-001",
  name: "Road Rehabilitation Project",
  description:
    "Road rehabilitation to improve accessibility and safety for residents in the surrounding area.",
  location: "Bandar Lampung, Lampung",
  institution: "Public Works Department",
  contractor: "PT Example Construction",
  budget: 2_000_000_000,
  progress: 65,
  status: "IN_PROGRESS" as ProjectStatus,
  startDate: "2026-01-10",
  endDate: "2026-12-30",
  updatedAt: "26 October 2026",
}

const initialDocuments: ProjectDocument[] = [
  {
    id: "DOC-001",
    name: "Project Information.pdf",
    type: "Project Information",
    size: "—",
  },
  {
    id: "DOC-002",
    name: "Budget Documentation.pdf",
    type: "Budget Document",
    size: "—",
  },
]

const initialActivities: Activity[] = [
  {
    id: "ACT-001",
    title: "Project progress updated",
    description: "Recorded project progress: 65%.",
    date: "26 October 2026",
  },
  {
    id: "ACT-002",
    title: "Project created",
    description: "Project registered in Openara.",
    date: "10 January 2026",
  },
]

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(date: string) {
  if (!date) return "Not specified"

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function statusLabel(status: ProjectStatus) {
  const labels: Record<ProjectStatus, string> = {
    PENDING: "Pending Review",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
    REJECTED: "Rejected",
    CANCELLED: "Cancelled",
  }

  return labels[status]
}

function statusClass(status: ProjectStatus) {
  const classes: Record<ProjectStatus, string> = {
    PENDING: "border-amber-200 bg-amber-50 text-amber-700",
    IN_PROGRESS: "border-blue-200 bg-blue-50 text-blue-700",
    COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-700",
    REJECTED: "border-red-200 bg-red-50 text-red-700",
    CANCELLED: "border-red-200 bg-red-50 text-red-700",
  }

  return classes[status]
}

export default function AdminProjectViewPage() {
  const [project, setProject] = useState(initialProject)
  const [documents, setDocuments] = useState(initialDocuments)
  const [activities, setActivities] = useState(initialActivities)

  const [progressInput, setProgressInput] = useState("65")
  const [progressNote, setProgressNote] = useState("")
  const [cancelReason, setCancelReason] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const [showCancelForm, setShowCancelForm] = useState(false)
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [showProgressForm, setShowProgressForm] = useState(false)
  const [notice, setNotice] = useState("")

  const fileInputRef = useRef<HTMLInputElement>(null)

  const isFinal =
    project.status === "CANCELLED" ||
    project.status === "REJECTED" ||
    project.status === "COMPLETED"

  function addActivity(title: string, description: string) {
    setActivities((previous) => [
      {
        id: crypto.randomUUID(),
        title,
        description,
        date: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
      },
      ...previous,
    ])
  }

  function handleUpload(files: FileList | null) {
    if (!files?.length) return

    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ]

    const maxSize = 10 * 1024 * 1024

    const validFiles = Array.from(files).filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        setNotice(`${file.name}: unsupported file type.`)
        return false
      }

      if (file.size > maxSize) {
        setNotice(`${file.name}: maximum file size is 10 MB.`)
        return false
      }

      return true
    })

    if (!validFiles.length) return

    const uploaded: ProjectDocument[] = validFiles.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      type: file.name.split(".").pop()?.toUpperCase() ?? "DOCUMENT",
      size:
        file.size < 1024 * 1024
          ? `${(file.size / 1024).toFixed(0)} KB`
          : `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      file,
    }))

    setDocuments((previous) => [...uploaded, ...previous])
    addActivity(
      "Documents added",
      `${uploaded.length} document(s) added in this browser session.`,
    )
    setNotice(
      "Files added to the current UI session only. Connect file storage to save them permanently.",
    )

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  function handleDeleteDocument(documentId: string) {
    const document = documents.find((item) => item.id === documentId)
    if (!document) return

    if (!window.confirm(`Remove "${document.name}" from this view?`)) {
      return
    }

    setDocuments((previous) =>
      previous.filter((item) => item.id !== documentId),
    )

    addActivity("Document removed", document.name)
    setNotice("Document removed from the current UI session.")
  }

  function handleProgressUpdate() {
    const progress = Number(progressInput)

    if (
      !Number.isFinite(progress) ||
      progress < 0 ||
      progress > 100 ||
      progressInput.trim() === ""
    ) {
      setNotice("Progress must be a number between 0 and 100.")
      return
    }

    if (!progressNote.trim()) {
      setNotice("Please provide a note for this progress update.")
      return
    }

    setProject((previous) => ({
      ...previous,
      progress,
      status:
        progress === 100 ? "COMPLETED" : "IN_PROGRESS",
      updatedAt: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    }))

    addActivity(
      "Progress updated",
      `${progress}% — ${progressNote.trim()}`,
    )

    setProgressNote("")
    setShowProgressForm(false)
    setNotice("Progress updated in the current UI session.")
  }

  function handleApprove() {
    if (
      !window.confirm(
        "Approve this project? Ensure its information and supporting documents have been reviewed.",
      )
    ) {
      return
    }

    setProject((previous) => ({
      ...previous,
      status: "IN_PROGRESS",
    }))

    addActivity(
      "Project approved",
      "Project approved in the current UI session.",
    )
    setNotice("Project approved in the current UI session.")
  }

  function handleReject() {
    if (!rejectionReason.trim()) {
      setNotice("Please provide a reason for rejecting this project.")
      return
    }

    if (!window.confirm("Reject this project submission?")) return

    setProject((previous) => ({
      ...previous,
      status: "REJECTED",
    }))

    addActivity("Project rejected", rejectionReason.trim())
    setRejectionReason("")
    setShowRejectForm(false)
    setNotice("Project rejected in the current UI session.")
  }

  function handleCancelProject() {
    if (!cancelReason.trim()) {
      setNotice("Please provide a cancellation reason.")
      return
    }

    if (
      !window.confirm(
        "Cancel this project? This changes its status but does not delete its records.",
      )
    ) {
      return
    }

    setProject((previous) => ({
      ...previous,
      status: "CANCELLED",
    }))

    addActivity("Project cancelled", cancelReason.trim())
    setCancelReason("")
    setShowCancelForm(false)
    setNotice("Project cancelled in the current UI session.")
  }

  async function handleCopyProjectLink() {
    const url = `${window.location.origin}/projects/${project.id}`

    try {
      await navigator.clipboard.writeText(url)
      setNotice("Public project link copied.")
    } catch {
      setNotice(`Copy this public project URL: ${url}`)
    }
  }

  function handleDownloadDocument(document: ProjectDocument) {
    if (!document.file) {
      setNotice(
        "This sample document has no actual file attached. Upload a real file first.",
      )
      return
    }

    const url = URL.createObjectURL(document.file)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = document.name
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="min-h-screen px-4 py-6 text-[#111318] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link
            href="/admin/projects"
            className="flex items-center gap-2 hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Admin Projects
          </Link>
          <span>/</span>
          <span className="text-foreground">{project.id}</span>
        </div>

        {/* Notice */}
        {notice && (
          <div className="flex items-start justify-between gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
            <p>{notice}</p>
            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Header */}
        <section className="rounded-2xl border bg-white p-5 sm:p-7">
          <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-start">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{project.id}</Badge>
                <Badge
                  variant="outline"
                  className={statusClass(project.status)}
                >
                  {statusLabel(project.status)}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-violet-200 bg-violet-50 text-violet-700"
                >
                  <ShieldCheck className="mr-1 h-3 w-3" />
                  Admin View
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

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={handleCopyProjectLink}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Copy Public Link
              </Button>
             
            </div>
          </div>

          {/* Admin actions */}
          <div className="mt-6 flex flex-wrap gap-2 border-t pt-5">
            {project.status === "PENDING" && (
              <>
                <Button
                  onClick={handleApprove}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Approve Project
                </Button>

                <Button
                  variant="outline"
                  className="border-red-200 text-red-700 hover:bg-red-50"
                  onClick={() => setShowRejectForm((value) => !value)}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject Project
                </Button>
              </>
            )}

            {!isFinal && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowProgressForm((value) => !value)}
                >
                  <CircleDot className="mr-2 h-4 w-4" />
                  Update Progress
                </Button>

                <Button
                  variant="outline"
                  className="border-red-200 text-red-700 hover:bg-red-50"
                  onClick={() => setShowCancelForm((value) => !value)}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel Project
                </Button>
              </>
            )}
          </div>

          {/* Reject form */}
          {showRejectForm && (
            <div className="mt-5 space-y-3 rounded-xl border border-red-200 bg-red-50/50 p-4">
              <h3 className="font-semibold">Reject project submission</h3>
              <label
                htmlFor="rejection-reason"
                className="text-sm text-muted-foreground"
              >
                Reason for rejection
              </label>
              <textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(event) => setRejectionReason(event.target.value)}
                placeholder="Explain what needs to be corrected..."
                className="min-h-24 w-full rounded-lg border bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-red-200"
              />
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={handleReject}
                >
                  Confirm Rejection
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowRejectForm(false)}
                >
                  Keep Project
                </Button>
              </div>
            </div>
          )}

          {/* Progress form */}
          {showProgressForm && (
            <div className="mt-5 space-y-4 rounded-xl border bg-slate-50 p-4">
              <h3 className="font-semibold">Update project progress</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="progress" className="text-sm font-medium">
                    Progress percentage
                  </label>
                  <input
                    id="progress"
                    type="number"
                    min={0}
                    max={100}
                    value={progressInput}
                    onChange={(event) => setProgressInput(event.target.value)}
                    className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="progress-note" className="text-sm font-medium">
                    Update notes
                  </label>
                  <input
                    id="progress-note"
                    value={progressNote}
                    onChange={(event) => setProgressNote(event.target.value)}
                    placeholder="Describe the latest progress"
                    className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleProgressUpdate}>
                  Save Progress
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowProgressForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Cancellation form */}
          {showCancelForm && (
            <div className="mt-5 space-y-3 rounded-xl border border-red-200 bg-red-50/50 p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <h3 className="font-semibold">Cancel this project</h3>
              </div>

              <p className="text-sm text-muted-foreground">
                The project will be marked as cancelled. Its records and
                activity history should be retained for transparency.
              </p>

              <label htmlFor="cancel-reason" className="text-sm font-medium">
                Cancellation reason
              </label>
              <textarea
                id="cancel-reason"
                value={cancelReason}
                onChange={(event) => setCancelReason(event.target.value)}
                placeholder="Enter the reason for cancellation..."
                className="min-h-24 w-full rounded-lg border bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-red-200"
              />

              <div className="flex flex-wrap gap-2">
                <Button variant="destructive" onClick={handleCancelProject}>
                  Confirm Cancellation
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCancelForm(false)}
                >
                  Go Back
                </Button>
              </div>
            </div>
          )}
        </section>

        {/* Summary */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Project Budget"
            value={formatRupiah(project.budget)}
            description="Recorded budget ceiling"
            icon={<Wallet className="h-5 w-5 text-blue-600" />}
          />

          <SummaryCard
            title="Project Progress"
            value={`${project.progress}%`}
            description="Latest recorded progress"
            icon={<CircleDot className="h-5 w-5 text-blue-600" />}
          >
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </SummaryCard>

          <SummaryCard
            title="Start Date"
            value={formatDate(project.startDate)}
            description="Recorded project start"
            icon={<CalendarDays className="h-5 w-5 text-blue-600" />}
          />

          <SummaryCard
            title="Target Completion"
            value={formatDate(project.endDate)}
            description="Planned completion date"
            icon={<Clock className="h-5 w-5 text-blue-600" />}
          />
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Project information */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-5 sm:grid-cols-2">
                  <InfoItem label="Project ID" value={project.id} />
                  <InfoItem
                    label="Project Owner"
                    value={project.institution}
                  />
                  <InfoItem
                    label="Contractor"
                    value={project.contractor}
                  />
                  <InfoItem label="Location" value={project.location} />
                  <InfoItem
                    label="Last Updated"
                    value={project.updatedAt}
                  />
                  <InfoItem
                    label="Current Status"
                    value={statusLabel(project.status)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <CardTitle>Project Documents</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Upload, review, and manage project files.
                    </p>
                  </div>

                  <Button
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Documents
                  </Button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx"
                    className="hidden"
                    onChange={(event) =>
                      handleUpload(event.target.files)
                    }
                  />
                </div>
              </CardHeader>

              <CardContent>
                <div className="mb-4 rounded-lg border border-dashed p-4 text-center">
                  <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                  <p className="mt-2 text-sm font-medium">
                    Add supporting documents
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    PDF, images, Word, or Excel · Maximum 10 MB per file
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 text-sm font-medium text-blue-600 hover:underline"
                  >
                    Browse files
                  </button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {documents.map((document) => (
                      <TableRow key={document.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                              <FileText className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium">{document.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {document.type}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          {document.size}
                        </TableCell>

                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Download ${document.name}`}
                              onClick={() =>
                                handleDownloadDocument(document)
                              }
                            >
                              <Download className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Delete ${document.name}`}
                              className="text-red-600 hover:bg-red-50 hover:text-red-700"
                              onClick={() =>
                                handleDeleteDocument(document.id)
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}

                    {documents.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="py-8 text-center text-muted-foreground"
                        >
                          No documents uploaded yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                <p className="mt-3 text-xs leading-5 text-muted-foreground">
                  Uploaded files currently remain in browser memory only.
                  Connect a storage provider and server endpoint for permanent
                  storage and public document access.
                </p>
              </CardContent>
            </Card>

            {/* Activity log */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-blue-600" />
                  Activity Log
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Recent project management actions.
                </p>
              </CardHeader>

              <CardContent>
                <div className="space-y-5">
                  {activities.map((activity, index) => (
                    <div key={activity.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
                          <History className="h-4 w-4 text-slate-600" />
                        </div>
                        {index !== activities.length - 1 && (
                          <div className="mt-2 min-h-6 w-px flex-1 bg-slate-200" />
                        )}
                      </div>

                      <div className="flex-1 pb-2">
                        <div className="flex flex-wrap justify-between gap-2">
                          <p className="font-medium">{activity.title}</p>
                          <span className="text-xs text-muted-foreground">
                            {activity.date}
                          </span>
                        </div>
                        <p className="mt-1 text-sm leading-5 text-muted-foreground">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* QR code */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-blue-600" />
                  Project QR Code
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Share the public project page.
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex flex-col items-center rounded-xl border bg-white p-5 text-center">
                  <div className="rounded-lg bg-slate-50 p-4">
                    <QrCode className="h-28 w-28 text-slate-800" />
                  </div>
                  <p className="mt-3 text-sm font-semibold">
                    {project.id}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    QR preview placeholder
                  </p>
                </div>

                <Button
                  className="w-full"
                  variant="outline"
                  onClick={handleCopyProjectLink}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Copy Public Link
                </Button>

                <p className="text-xs leading-5 text-muted-foreground">
                  Replace the placeholder with a QR generated from the actual
                  public project URL.
                </p>
              </CardContent>
            </Card>

            {/* Review checklist */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Review Checklist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "Project information reviewed",
                  "Budget source verified",
                  "Supporting documents reviewed",
                  "Dates and contractor checked",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-slate-100 p-1">
                      <CheckCircle2 className="h-4 w-4 text-slate-500" />
                    </div>
                    <p className="text-sm leading-5">{item}</p>
                  </div>
                ))}

                <p className="border-t pt-3 text-xs leading-5 text-muted-foreground">
                  Checklist items are reminders only; they are not saved or
                  automatically verified.
                </p>
              </CardContent>
            </Card>

            {/* Danger zone */}
            <Card className="border-red-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-red-700">Danger Zone</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Actions that affect project status.
                </p>
              </CardHeader>

              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Cancel project</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Retain project records and the cancellation reason.
                  </p>
                </div>

                <Button
                  variant="outline"
                  className="w-full border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                  disabled={isFinal}
                  onClick={() => setShowCancelForm(true)}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel Project
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>

        <footer className="border-t py-5 text-center text-xs text-muted-foreground">
          Openara · Admin Project Management
        </footer>
      </div>
    </main>
  )
}

function SummaryCard({
  title,
  value,
  description,
  icon,
  children,
}: {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          {icon}
        </div>
        <p className="mt-3 text-xl font-bold">{value}</p>
        {children}
        <p className="mt-2 text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function InfoItem({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 break-words font-medium">{value}</p>
    </div>
  )
}