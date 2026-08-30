import { cn } from "@/lib/utils";

interface GradientPurpleBackgroundProps {
    className?: string;
}

export function GradientPurpleBackground({ className }: GradientPurpleBackgroundProps) {
    return (
        <div className="absolute inset-0 -z-10 h-full w-full bg-white ">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#fff,transparent)]"></div>
        </div>
    );
}

export const Component = GradientPurpleBackground;
export default GradientPurpleBackground;




