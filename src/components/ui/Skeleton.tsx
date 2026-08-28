export function Skeleton({
  width,
  height,
  className,
}: {
  width?: string | number
  height?: string | number
  className?: string
}) {
  return (
    <span
      className={`skeleton${className ? ` ${className}` : ''}`}
      style={{ width, height }}
    />
  )
}
