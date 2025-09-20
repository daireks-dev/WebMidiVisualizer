'use client';
import { Inter } from 'next/font/google'
import { useState } from 'react';

const inter = Inter({ subsets: ['latin'] })

interface Props {
    inputRef: React.RefObject<HTMLInputElement | null>
}

export default function FileInput({inputRef}: Props) {
    const [fileName, setFileName] = useState("[upload_here.mid]");

    function handleChange() {
        const files = inputRef.current?.files
        if (files && files.length > 0) {
            setFileName("[" + files[0].name + "]")
        }
    }

    return (
        <div className="border-[#626262] border-1 border-dashed w-[min(25%,12rem)] aspect-[12/3] flex justify-center items-center group">
            <input onChange={handleChange} ref={inputRef} type="file" accept=".mid,.midi" className="w-full h-full text-[#2C2C2C]"/>
            <h1 className={`${inter.className} pointer-events-none absolute font-medium text-[min(2.6vw,1.2rem)] group-hover:text-blue-400 transition`}>{fileName}</h1>
        </div>
   )
}