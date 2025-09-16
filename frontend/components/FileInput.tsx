export default function FileInput() {
    return (
        <div className="border-white border-1 border-dashed w-[10rem] h-[3rem] flex justify-center items-center">
            <h1 className="absolute pointer-events-none font-bold">[drag_here.mid]</h1>
            <input type="file" accept=".mid,.midi" className="w-full h-full text-[#2C2C2C]"/>
        </div>
   )
}