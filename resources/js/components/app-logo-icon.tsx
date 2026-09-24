import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon({ className, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/images/logobpn2026.svg"
            alt="Logo Kementerian ATR/BPN"
            className={className}
            draggable={false}
            {...props}
        />
    );
}
