
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted border border-border/40 shadow-md outline outline-1 outline-border/10",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
