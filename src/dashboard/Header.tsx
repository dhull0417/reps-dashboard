export function Header({
  playerName,
  onSignOut,
}: {
  playerName: string
  onSignOut: () => void
}) {
  return (
    <header className="dashboard-header">
      <div>
        <span className="dashboard-header-eyebrow">Athlete</span>
        <h1 className="dashboard-header-name">{playerName}</h1>
      </div>
      <button type="button" className="sign-out-button" onClick={onSignOut}>
        Sign Out
      </button>
    </header>
  )
}
