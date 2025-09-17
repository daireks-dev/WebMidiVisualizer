'use client';
interface keyProps {
    color: string
}

export default function WhiteKey({color}: keyProps) {
    return(
        <button style={{ backgroundColor: color }} className="flex-1 drop-shadow-2xl hover:brightness-70 transition">
        </button>
    )
}