import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface GlassCardProps extends React.ComponentProps<typeof Card> {
    gradient?: boolean
}

export function GlassCard({ className, gradient, ...props }: GlassCardProps) {
    return (
        <Card
            className={cn(
                "bg-opacity-20 bg-white/5 backdrop-blur-lg border-white/10 shadow-xl",
                gradient && "bg-gradient-to-br from-white/10 to-white/5",
                className
            )}
            {...props}
        />
    )
}

export { CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
