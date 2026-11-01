"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  FileText,
  MapPin,
  Wallet,
  Loader2,
  Save,
  Globe,
  LockKeyhole,
} from "lucide-react";

import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function CreateProjectPage() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    location: "",
    address: "",
    funding_source: "",
    budget: "",
    contractor: "",
    owner_agency: "",
    start_date: "",
    end_date: "",
    progress: "0",
    status: "planned",
  });

  function updateField(
    field: keyof typeof form,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push("/login");
        return;
      }

      if (
        form.end_date &&
        form.start_date &&
        form.end_date < form.start_date
      ) {
        setErrorMessage(
          "Tanggal selesai tidak boleh sebelum tanggal mulai."
        );
        return;
      }

      const progress = Number(form.progress);
      const budget = Number(form.budget);

      if (
        !Number.isFinite(budget) ||
        budget < 0 ||
        !Number.isFinite(progress) ||
        progress < 0 ||
        progress > 100
      ) {
        setErrorMessage(
          "Anggaran atau progres tidak valid."
        );
        return;
      }

      const { data, error } = await supabase
        .from("projects")
        .insert({
          name: form.name.trim(),
          description: form.description.trim() || null,
          category: form.category,
          location: form.location.trim(),
          address: form.address.trim() || null,
          funding_source: form.funding_source.trim() || null,
          budget,
          contractor: form.contractor.trim() || null,
          owner_agency: form.owner_agency.trim(),
          start_date: form.start_date || null,
          end_date: form.end_date || null,
          progress,
          status: form.status,
          visibility: isPublic ? "public" : "draft",
          created_by: user.id,
        })
        .select("id")
        .single();

      if (error) {
        throw error;
      }

      router.push(`/dashboard/ProjectTrace`);
      router.refresh();
    } catch (error) {
      console.error("Gagal membuat proyek:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat membuat proyek."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Link
              href="/admin/projects"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke daftar proyek
            </Link>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-[#18181B] md:text-3xl">
                Tambah Proyek
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Masukkan informasi proyek pemerintah untuk
                dokumentasi dan pemantauan publik.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4" />
            Dashboard Pemerintah
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informasi dasar */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Informasi Proyek</CardTitle>
                  <CardDescription>
                    Informasi utama mengenai proyek yang akan
                    dikelola.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">Nama Proyek *</Label>
                <Input
                  id="name"
                  required
                  minLength={3}
                  maxLength={200}
                  placeholder="Contoh: Pembangunan Jalan Kecamatan"
                  value={form.name}
                  onChange={(e) =>
                    updateField("name", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Kategori Proyek *</Label>
                <Select
                  required
                  value={form.category}
                  onValueChange={(value) =>
                    updateField("category", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="infrastructure">
                      Infrastruktur
                    </SelectItem>
                    <SelectItem value="education">
                      Pendidikan
                    </SelectItem>
                    <SelectItem value="health">
                      Kesehatan
                    </SelectItem>
                    <SelectItem value="environment">
                      Lingkungan
                    </SelectItem>
                    <SelectItem value="public_facility">
                      Fasilitas Umum
                    </SelectItem>
                    <SelectItem value="other">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="owner_agency">
                  Instansi Penanggung Jawab *
                </Label>
                <Input
                  id="owner_agency"
                  required
                  placeholder="Contoh: Dinas Pekerjaan Umum"
                  value={form.owner_agency}
                  onChange={(e) =>
                    updateField("owner_agency", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">
                  Deskripsi Proyek
                </Label>
                <Textarea
                  id="description"
                  rows={4}
                  maxLength={5000}
                  placeholder="Jelaskan tujuan, ruang lingkup, dan manfaat proyek..."
                  value={form.description}
                  onChange={(e) =>
                    updateField("description", e.target.value)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Lokasi */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-50 p-2 text-purple-700">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Lokasi Proyek</CardTitle>
                  <CardDescription>
                    Tentukan wilayah dan alamat pelaksanaan proyek.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location">Wilayah *</Label>
                <Input
                  id="location"
                  required
                  placeholder="Contoh: Bandar Lampung, Lampung"
                  value={form.location}
                  onChange={(e) =>
                    updateField("location", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Alamat Lengkap</Label>
                <Input
                  id="address"
                  placeholder="Nama jalan atau lokasi spesifik"
                  value={form.address}
                  onChange={(e) =>
                    updateField("address", e.target.value)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Anggaran */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Anggaran dan Pelaksana</CardTitle>
                  <CardDescription>
                    Cantumkan nilai anggaran dan pihak pelaksana
                    sesuai dokumen resmi.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="budget">
                  Anggaran (Rupiah) *
                </Label>
                <Input
                  id="budget"
                  type="number"
                  required
                  min="0"
                  step="1"
                  placeholder="Contoh: 1500000000"
                  value={form.budget}
                  onChange={(e) =>
                    updateField("budget", e.target.value)
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Masukkan nominal dalam rupiah tanpa tanda titik.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="funding_source">
                  Sumber Pendanaan
                </Label>
                <Input
                  id="funding_source"
                  placeholder="Contoh: APBD Tahun Anggaran 2026"
                  value={form.funding_source}
                  onChange={(e) =>
                    updateField("funding_source", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="contractor">
                  Kontraktor / Pelaksana
                </Label>
                <Input
                  id="contractor"
                  placeholder="Nama perusahaan atau pelaksana"
                  value={form.contractor}
                  onChange={(e) =>
                    updateField("contractor", e.target.value)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Jadwal dan progres */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-amber-50 p-2 text-amber-700">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Jadwal dan Progres</CardTitle>
                  <CardDescription>
                    Isi jadwal rencana dan status awal proyek.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="start_date">Tanggal Mulai</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={form.start_date}
                  onChange={(e) =>
                    updateField("start_date", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">Target Selesai</Label>
                <Input
                  id="end_date"
                  type="date"
                  min={form.start_date || undefined}
                  value={form.end_date}
                  onChange={(e) =>
                    updateField("end_date", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Status Awal</Label>
                <Select
                  value={form.status}
                  onValueChange={(value) =>
                    updateField("status", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planned">
                      Direncanakan
                    </SelectItem>
                    <SelectItem value="in_progress">
                      Sedang Berjalan
                    </SelectItem>
                    <SelectItem value="completed">
                      Selesai
                    </SelectItem>
                    <SelectItem value="delayed">
                      Terlambat
                    </SelectItem>
                    <SelectItem value="cancelled">
                      Dibatalkan
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="progress">
                  Progres Awal (%)
                </Label>
                <Input
                  id="progress"
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={form.progress}
                  onChange={(e) =>
                    updateField("progress", e.target.value)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Visibilitas */}
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-gray-100 p-2">
                  {isPublic ? (
                    <Globe className="h-5 w-5" />
                  ) : (
                    <LockKeyhole className="h-5 w-5" />
                  )}
                </div>

                <div>
                  <p className="font-medium">
                    {isPublic
                      ? "Publikasikan proyek"
                      : "Simpan sebagai draft"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {isPublic
                      ? "Proyek dapat dilihat publik jika kebijakan akses database mengizinkan."
                      : "Proyek belum ditampilkan kepada masyarakat."}
                  </p>
                </div>
              </div>

              <Switch
                checked={isPublic}
                onCheckedChange={setIsPublic}
                aria-label="Publikasikan proyek"
              />
            </CardContent>
          </Card>

          {errorMessage && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {errorMessage}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              asChild
              disabled={loading}
            >
              <Link href="/admin/projects">Batal</Link>
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {loading ? "Menyimpan..." : "Simpan Proyek"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}