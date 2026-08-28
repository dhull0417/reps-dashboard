export function Loading() {
  return (
    <div className="inline-status">
      <span className="spinner" />
    </div>
  )
}

export function ErrorState({ message }: { message: string }) {
  return <div className="inline-status error-state">{message}</div>
}
