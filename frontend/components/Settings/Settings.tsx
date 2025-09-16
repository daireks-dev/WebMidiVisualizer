import BackgroundColor from "../Settings/BackgroundColor";
import ToggleSettings from "./ToggleSettings";
import TrackColors from "./TrackColors";

export default function Settings() {
    return (
        <div className="bg-[#373737] w-full aspect-[5/3] flex flex-col items-center drop-shadow-2xl">
            <TrackColors/>
            <BackgroundColor/>
            <ToggleSettings/>
        </div>
    )
}