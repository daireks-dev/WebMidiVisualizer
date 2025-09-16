interface ButtonProps {
  color: string
}

export default function ColorButton({color}: ButtonProps) {
    return (
        <button style={{ backgroundColor: color }} className="h-[75%] aspect-square drop-shadow-2xl">
            <div className="bg-black w-full h-full opacity-0 hover:opacity-30 transition flex justify-center items-center">
                <h1 className="font-bold text-[min(2.2vw,1rem)]">{color}</h1>
            </div>
        </button>
    )
}