import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
    items?: Omit<NavItem, 'items'>[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    flash?: {
        success?: string | null;
        error?: string | null;
    };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    role?: string;
    [key: string]: unknown; // This allows for additional properties...
}

// ══ SmartLoket domain types (diserialisasi dari model Eloquent via Inertia) ══

export interface SmartPersyaratanDokumen {
    id: number;
    nama_dokumen: string;
    keterangan?: string | null;
    wajib?: boolean;
}

export interface SmartJenisPermohonan {
    id: number;
    kode: string;
    nama: string;
    kategori: string;
    is_active: boolean;
    persyaratan_dokumens?: SmartPersyaratanDokumen[];
}

export interface SmartBidangTanah {
    id: number;
    urutan: number;
    nib: string | null;
    no_sertifikat_lama: string | null;
    no_sertifikat_elektronik: string | null;
    jenis_hak: string | null;
    nama_pemegang_hak: string | null;
    desa_kelurahan: string | null;
    kecamatan: string | null;
}

export interface SmartRiwayatStatus {
    id: number;
    stage_dari: string;
    stage_ke: string;
    keterangan: string;
    user?: { id: number; name: string } | null;
    created_at: string;
}

export interface SmartCatatanRevisi {
    id: number;
    isi_revisi: string;
    dari_stage: string;
    ke_stage: string | null;
    sudah_diproses: boolean;
    revisi_ke?: number;
    pengirim?: { id: number; name: string } | null;
    user?: { id: number; name: string } | null;
    created_at: string;
}

export interface SmartPenugasan {
    id: number;
    stage: string;
    stage_label?: string;
    status: 'proses' | 'selesai';
    tanggal_add?: string | null;
    user_id?: number | null;
    user?: { id: number; name: string } | null;
}

export interface SmartTiket {
    id: number;
    kode_tiket: string;
    nomor_antrian?: string | null;
    nomor_urut_berkas?: number | null;
    arsips?: Array<{ id: number; nama_arsip: string; folder_id: number; tanggal_arsip?: string | null }>;
    monitor_warkah?: string | null;
    monitor_sertipikat?: string | null;
    nama_petugas_loket?: string | null;
    status: string;
    status_pembetulan: string;
    status_badge: string;
    status_label: string;
    status_pra_btel: string | null;
    status_pra_suel: string | null;
    revisi_ke: number;
    tanggal_masuk: string | null;
    tanggal_selesai: string | null;
    diserahkan_ke_validator: boolean;
    jenis_permohonan_id: number | null;
    jenis_permohonan?: SmartJenisPermohonan | null;
    nama_pemohon: string;
    nik_pemohon: string | null;
    no_hp_pemohon: string;
    email_pemohon: string | null;
    no_hak_sekarang: string | null;
    no_hak_sebelumnya: string | null;
    kelurahan_desa: string | null;
    kecamatan: string | null;
    jumlah_bidang: number;
    keterangan: string | null;
    petugas_loket_id: number | null;
    petugas_loket?: { id: number; name: string } | null;
    created_by: number | null;
    locked?: boolean;
    bidang_tanahs?: SmartBidangTanah[];
    riwayat_statuses?: SmartRiwayatStatus[];
    catatan_revisis?: SmartCatatanRevisi[];
    penugasans?: SmartPenugasan[];
}

export type SmartRole =
    | 'admin'
    | 'pemimpin'
    | 'loket'
    | 'verifikator'
    | 'warkah'
    | 'validator_btel'
    | 'validator_suel'
    | 'alih_media_btel'
    | 'alih_media_suel';
