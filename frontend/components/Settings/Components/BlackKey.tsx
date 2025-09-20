'use client';
interface keyProps {
    color: string,
    onClick?: () => void
}

export default function BlackKey({color, onClick}: keyProps) {
    return(
        <button onClick={onClick} className="flex-1 h-[65%] drop-shadow-2xl flex justify-center pointer-events-auto">
            <div className="bg-[#373737] w-[75%] flex justify-center items-start">
                <div style={{ backgroundColor: color }} className="w-[65%] h-[80%] hover:brightness-70 transition flex justify-center items-center">
                </div>
            </div>
        </button>
    )
}