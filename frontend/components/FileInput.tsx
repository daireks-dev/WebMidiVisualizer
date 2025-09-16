import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function FileInput() {
    return (
        <div className="border-[#626262] border-1 border-dashed w-[min(25%,12rem)] aspect-[12/3] flex justify-center items-center">
            <h1 className={`${inter.className} absolute font-medium text-[min(2.9vw,1.3rem)] hover:text-blue-400 transition`}>[drag_here.mid]</h1>
            <input type="file" accept=".mid,.midi" className="w-full h-full text-[#2C2C2C]"/>
        </div>
   )
}8