'use client';
interface keyProps {
    color: string,
    onClick?: () => void
}

export default function WhiteKey({ color, onClick }: keyProps) {
    return (
        <div className="relative flex-1 h-full pointer-events-auto">
            <button
                onClick={onClick}
                style={{ backgroundColor: color }}
                className="absolute inset-0 transition hover:brightness-70"
            />
        </div>
    );
}
