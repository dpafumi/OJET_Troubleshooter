import { useState, useEffect } from 'react'
import axios from 'axios'
import Dashboard from './components/Dashboard'
import DashboardDownstream from './components/DashboardDownstream'
import Troubleshooting from './components/Troubleshooting'
import ShowCommands from './components/ShowCommands'
import AddRemoveTables from './components/AddRemoveTables'
import Monitor from './components/Monitor'
import OjetQueries from './components/OjetQueries'
import Navigation from './components/Navigation'

function App() {
  // PROD database connection
  const [dbConfig, setDbConfig] = useState({
    host: '',
    port: '',
    sid: '',
    username: '',
    password: ''
  })
  const [isConnected, setIsConnected] = useState(false)

  // Downstream page - Primary DB connection (first form)
  const [dbConfigDownstreamPrimary, setDbConfigDownstreamPrimary] = useState({
    host: '',
    port: '',
    sid: '',
    username: '',
    password: ''
  })
  const [isConnectedDownstreamPrimary, setIsConnectedDownstreamPrimary] = useState(false)

  // Downstream page - Downstream DB connection (second form)
  const [dbConfigDownstream, setDbConfigDownstream] = useState({
    host: '',
    port: '',
    sid: '',
    username: '',
    password: ''
  })
  const [isConnectedDownstream, setIsConnectedDownstream] = useState(false)

  const [currentPage, setCurrentPage] = useState('validation')

  // Cleanup function to notify backend when app is closing
  useEffect(() => {
    const handleBeforeUnload = async (e) => {
      // Send a beacon to notify backend to close connections
      // Using sendBeacon because it works even when the page is unloading
      const data = JSON.stringify({ action: 'cleanup' });

      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/cleanup', data);
      } else {
        // Fallback for browsers that don't support sendBeacon
        try {
          await axios.post('/api/cleanup', { action: 'cleanup' });
        } catch (err) {
          console.error('Error during cleanup:', err);
        }
      }
    };

    // Add event listener for page unload
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'validation':
        return <Dashboard
          dbConfig={dbConfig}
          setDbConfig={setDbConfig}
          isConnected={isConnected}
          setIsConnected={setIsConnected}
        />
      case 'validation-downstream':
        return <DashboardDownstream
          dbConfigPrimary={dbConfigDownstreamPrimary}
          setDbConfigPrimary={setDbConfigDownstreamPrimary}
          isConnectedPrimary={isConnectedDownstreamPrimary}
          setIsConnectedPrimary={setIsConnectedDownstreamPrimary}
          dbConfigDownstream={dbConfigDownstream}
          setDbConfigDownstream={setDbConfigDownstream}
          isConnectedDownstream={isConnectedDownstream}
          setIsConnectedDownstream={setIsConnectedDownstream}
        />
      case 'troubleshooting':
        return <Troubleshooting />
      case 'commands':
        return <ShowCommands />
      case 'add-remove-tables':
        return <AddRemoveTables />
      case 'monitor':
        return <Monitor />
      case 'ojet-queries':
        return <OjetQueries />
      default:
        return <Dashboard
          dbConfig={dbConfig}
          setDbConfig={setDbConfig}
          isConnected={isConnected}
          setIsConnected={setIsConnected}
        />
    }
  }

  return (
    <div className="app">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
        {renderPage()}
      </div>
    </div>
  )
}

export default App

