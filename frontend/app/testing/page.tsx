import FileInput from "@/components/FileInput"
import Settings from "@/components/Settings/Settings"
import VideoControls from "@/components/VideoControls"
import Visual from "@/components/Visual"

export default function HomeTest() {
    return (
        <div className="bg-[#2C2C2C] w-screen h-full flex justify-center">
            <div className="w-[min(90vh,95%)] h-full my-3 flex flex-col items-center gap-3">
                <FileInput/>
                <Visual/>
                <VideoControls/>
                <Settings/>
            </div>
        </div>
    )
}