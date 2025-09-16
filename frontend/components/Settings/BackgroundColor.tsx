import GradientButton from "./Components/GradientButton";
import SquareLabel from "./Components/SquareLabel";
import SquareSpacer from "./Components/SquareSpacer";

export default function BackgroundColor() {
    return (
        <div className="w-[97%] flex-1 border-b-1 border-[#5f5f5f] flex items-center gap-1.5">
            <SquareLabel text="bg_colors"/>
            <GradientButton topColor="#B9CBEE" bottomColor="#87D69D"/>
            <SquareLabel text="bg_options"/>
        </div>
    )
}