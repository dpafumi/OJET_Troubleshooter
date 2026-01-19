import { useState } from 'react'
import { Database, CheckCircle, XCircle } from 'lucide-react'
import axios from 'axios'

function Sidebar({ dbConfig, setDbConfig, isConnected, setIsConnected }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setDbConfig(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleConnect = async () => {
    setLoading(true)
    setMessage('')
    
    try {
      const response = await axios.post('/api/test-connection', dbConfig)
      
      if (response.data.success) {
        setIsConnected(true)
        setMessage('Connection successful!')
      } else {
        setIsConnected(false)
        setMessage(response.data.message || 'Connection failed')
      }
    } catch (error) {
      setIsConnected(false)
      setMessage(error.response?.data?.message || error.message || 'Connection failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Database Connection</h2>
        <p>Enter Oracle database credentials</p>
      </div>

      <div className="form-group">
        <label htmlFor="host">Host</label>
        <input
          type="text"
          id="host"
          name="host"
          value={dbConfig.host}
          onChange={handleInputChange}
          placeholder="localhost"
        />
      </div>

      <div className="form-group">
        <label htmlFor="port">Port</label>
        <input
          type="text"
          id="port"
          name="port"
          value={dbConfig.port}
          onChange={handleInputChange}
          placeholder="1521"
        />
      </div>

      <div className="form-group">
        <label htmlFor="sid">SID / Service Name</label>
        <input
          type="text"
          id="sid"
          name="sid"
          value={dbConfig.sid}
          onChange={handleInputChange}
          placeholder="ORCL"
        />
      </div>

      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={dbConfig.username}
          onChange={handleInputChange}
          placeholder="OJET_USER"
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={dbConfig.password}
          onChange={handleInputChange}
          placeholder="••••••••"
        />
      </div>

      <button 
        className="btn btn-primary btn-full"
        onClick={handleConnect}
        disabled={loading || !dbConfig.host || !dbConfig.username || !dbConfig.password}
      >
        {loading ? (
          <>
            <span className="loading-spinner"></span>
            Connecting...
          </>
        ) : (
          <>
            <Database size={18} />
            Connect to Database
          </>
        )}
      </button>

      {message && (
        <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? <CheckCircle size={16} /> : <XCircle size={16} />}
          {message}
        </div>
      )}

      {isConnected && (
        <div className="connection-status connected" style={{ marginTop: '12px' }}>
          <CheckCircle size={16} />
          Connected to {dbConfig.host}:{dbConfig.port}/{dbConfig.sid}
        </div>
      )}
    </div>
  )
}

export default Sidebar

