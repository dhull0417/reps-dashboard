import type { Category } from '../lib/types'

export function Sidebar({
  categories,
  activeTab,
  onSelectTab,
}: {
  categories: Category[]
  activeTab: string
  onSelectTab: (tab: string) => void
}) {
  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-mark">◆</span>
        <span className="sidebar-brand-name">Reps</span>
      </div>
      <ul className="sidebar-nav">
        <li>
          <button
            type="button"
            className={`sidebar-nav-item${activeTab === 'general' ? ' active' : ''}`}
            onClick={() => onSelectTab('general')}
          >
            General
          </button>
        </li>
        {categories.map((category) => (
          <li key={category.id}>
            <button
              type="button"
              className={`sidebar-nav-item${activeTab === category.id ? ' active' : ''}`}
              onClick={() => onSelectTab(category.id)}
            >
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
