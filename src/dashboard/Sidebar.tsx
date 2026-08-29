import { useEffect, useRef, useState } from 'react'
import type { Category } from '../lib/types'

const GLOW_OUT_DURATION_MS = 300

export function Sidebar({
  categories,
  activeTab,
  onSelectTab,
}: {
  categories: Category[]
  activeTab: string
  onSelectTab: (tab: string) => void
}) {
  const [leavingTab, setLeavingTab] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const prevTabRef = useRef(activeTab)

  useEffect(() => {
    if (prevTabRef.current === activeTab) return
    const previousTab = prevTabRef.current
    prevTabRef.current = activeTab
    setLeavingTab(previousTab)
    const timer = setTimeout(() => {
      setLeavingTab((current) => (current === previousTab ? null : current))
    }, GLOW_OUT_DURATION_MS)
    return () => clearTimeout(timer)
  }, [activeTab])

  const navItemClassName = (tabId: string) => {
    let className = 'sidebar-nav-item'
    if (tabId === activeTab) className += ' active'
    else if (tabId === leavingTab) className += ' leaving'
    return className
  }

  const handleSelectTab = (tab: string) => {
    onSelectTab(tab)
    setMenuOpen(false)
  }

  return (
    <nav className="sidebar">
      <div className="sidebar-topbar">
        <div className="sidebar-brand">
          <span className="sidebar-brand-mark">◆</span>
          <span className="sidebar-brand-name">Reps</span>
        </div>
        <button
          type="button"
          className="sidebar-menu-toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="sidebar-menu-toggle-bar" />
          <span className="sidebar-menu-toggle-bar" />
          <span className="sidebar-menu-toggle-bar" />
        </button>
      </div>
      <ul className={`sidebar-nav${menuOpen ? ' open' : ''}`}>
        <li>
          <button
            type="button"
            className={navItemClassName('general')}
            onClick={() => handleSelectTab('general')}
          >
            <span className="sidebar-nav-item-label">General</span>
          </button>
        </li>
        {categories.map((category) => (
          <li key={category.id}>
            <button
              type="button"
              className={navItemClassName(category.id)}
              onClick={() => handleSelectTab(category.id)}
            >
              <span className="sidebar-nav-item-label">{category.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
