interface SpacerProps {
  isVisible: boolean
}

export default function SquareSpacer({ isVisible }: SpacerProps) {
  return (
    <div className={`h-[75%] aspect-square drop-shadow-2xl border-[#626262] border border-dashed pointer-events-none flex justify-center items-center transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}>
    </div>
  )
}
