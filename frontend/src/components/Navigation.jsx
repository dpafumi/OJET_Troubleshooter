import { CheckCircle, AlertTriangle, Terminal, GitBranch } from 'lucide-react'

function Navigation({ currentPage, onPageChange }) {
  const pages = [
    { id: 'validation', label: 'Validation', icon: CheckCircle },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: AlertTriangle },
    { id: 'commands', label: 'Show Commands', icon: Terminal },
    { id: 'add-remove-tables', label: 'Add/Remove Tables', icon: GitBranch }
  ]

  return (
    <nav style={{
      display: 'flex',
      gap: '8px',
      padding: '16px 24px',
      background: 'white',
      borderBottom: '1px solid #e5e7eb',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      {pages.map(page => {
        const Icon = page.icon
        const isActive = currentPage === page.id
        
        return (
          <button
            key={page.id}
            onClick={() => onPageChange(page.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              background: isActive ? '#2563eb' : 'transparent',
              color: isActive ? 'white' : '#6b7280',
              border: isActive ? 'none' : '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: isActive ? '600' : '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.target.style.background = '#f3f4f6'
                e.target.style.borderColor = '#d1d5db'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.target.style.background = 'transparent'
                e.target.style.borderColor = '#e5e7eb'
              }
            }}
          >
            <Icon size={18} />
            {page.label}
          </button>
        )
      })}
    </nav>
  )
}

export default Navigation

