
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted border border-border/30 shadow-sm", className)}
      {...props}
    />
  )
}

export { Skeleton }
