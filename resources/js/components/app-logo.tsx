export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center overflow-hidden rounded-xl border border-sidebar-border/60 bg-white shadow-sm">
                <img
                    src="/images/logobpn2026.png"
                    alt="Logo Kementerian ATR/BPN"
                    className="size-full object-contain"
                />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-bold">
                    <span className="text-sidebar-foreground">SmartLoket</span>
                </span>
                <span className="text-xs text-sidebar-foreground/60">Cepat, Efisien, dan Modern</span>
            </div>
        </>
    );
}
