import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Troubleshooting from './components/Troubleshooting'
import ShowCommands from './components/ShowCommands'
import AddRemoveTables from './components/AddRemoveTables'
import Navigation from './components/Navigation'

function App() {
  const [dbConfig, setDbConfig] = useState({
    host: '',
    port: '1521',
    sid: '',
    username: '',
    password: ''
  })
  const [isConnected, setIsConnected] = useState(false)
  const [currentPage, setCurrentPage] = useState('validation')

  const renderPage = () => {
    switch (currentPage) {
      case 'validation':
        return <Dashboard isConnected={isConnected} />
      case 'troubleshooting':
        return <Troubleshooting />
      case 'commands':
        return <ShowCommands />
      case 'add-remove-tables':
        return <AddRemoveTables />
      default:
        return <Dashboard isConnected={isConnected} />
    }
  }

  return (
    <div className="app">
      <Sidebar
        dbConfig={dbConfig}
        setDbConfig={setDbConfig}
        isConnected={isConnected}
        setIsConnected={setIsConnected}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
        {renderPage()}
      </div>
    </div>
  )
}

export default App

