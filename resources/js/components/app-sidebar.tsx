import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type User } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    Database,
    UserRound,
    Scale,
    FileSearch,
    FolderOpen,
    MonitorUp,
    ScanLine,
    LayoutDashboard,
    BarChart3,
} from 'lucide-react';
import AppLogo from './app-logo';
import { type SharedData } from '@/types';

function navForRole(role: string | undefined): NavItem[] {
    const dashboardItem: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
    ];

    const laporanItem: NavItem[] = [
        {
            title: 'Laporan & Rekap',
            href: '/reports',
            icon: BarChart3,
        },
    ];

    switch (role) {
        case 'admin':
            return [
                ...dashboardItem,
                {
                    title: 'Kendali Admin',
                    href: '/admin',
                    icon: Database,
                    items: [
                        { title: 'Database Tiket', href: '/admin' },
                        { title: 'Arsip Berkas Selesai', href: '/admin/selesai' },
                        { title: 'Revisi Berkas', href: '/admin/revisi' },
                        { title: 'Arsip (Penataan)', href: '/admin/arsip' },
                        { title: 'Form Pendaftaran', href: '/admin/form-pendaftaran' },
                    ],
                },
                ...laporanItem,
            ];
        case 'pemimpin':
            return [
                ...dashboardItem,
                {
                    title: 'Monitoring',
                    href: '/pemimpin',
                    icon: LayoutDashboard,
                },
                ...laporanItem,
            ];
        case 'loket':
            return [
                ...dashboardItem,
                {
                    title: 'Loket Penerimaan',
                    href: '/loket',
                    icon: UserRound,
                },
                ...laporanItem,
            ];
        case 'verifikator':
            return [
                ...dashboardItem,
                {
                    title: 'Verifikasi Berkas',
                    href: '/verifikator',
                    icon: FileSearch,
                },
                ...laporanItem,
            ];
        case 'warkah':
            return [
                ...dashboardItem,
                {
                    title: 'Pencarian & Data Warkah',
                    href: '/warkah',
                    icon: FolderOpen,
                },
                ...laporanItem,
            ];
        case 'validator_btel':
            return [
                ...dashboardItem,
                {
                    title: 'Validasi Pra-BTel',
                    href: '/validator-bt',
                    icon: Scale,
                },
                ...laporanItem,
            ];
        case 'validator_suel':
            return [
                ...dashboardItem,
                {
                    title: 'Validasi Pra-SuEl',
                    href: '/validator-su',
                    icon: Scale,
                },
                ...laporanItem,
            ];
        case 'alih_media_btel':
            return [
                ...dashboardItem,
                {
                    title: 'Alih Media Pra-BTel',
                    href: '/alih-media-bt',
                    icon: MonitorUp,
                },
                ...laporanItem,
            ];
        case 'alih_media_suel':
            return [
                ...dashboardItem,
                {
                    title: 'Alih Media Pra-SuEl',
                    href: '/alih-media-su',
                    icon: ScanLine,
                },
                ...laporanItem,
            ];
        default:
            return dashboardItem;
    }
}

const footerNavItems: NavItem[] = [
    {
        title: 'Beranda',
        href: '/',
        icon: LayoutGrid,
    },
    {
        title: 'Tracking Publik',
        href: '/tracking',
        icon: FolderOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user as User;
    const mainNavItems = navForRole(user.role);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="border-b border-sidebar-border/50">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="py-2">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border/50">
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
