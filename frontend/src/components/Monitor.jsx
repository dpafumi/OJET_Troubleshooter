import { useState, useEffect } from 'react'
import { Activity, Play, Loader, AlertCircle, Lock } from 'lucide-react'
import axios from 'axios'

function Monitor() {
  // Load saved values from localStorage or use defaults
  const [striimConfig, setStriimConfig] = useState(() => {
    const saved = localStorage.getItem('monitor_striimConfig')
    return saved ? JSON.parse(saved) : { url: 'localhost', username: 'admin', password: 'admin' }
  })
  const [namespace, setNamespace] = useState(() => {
    return localStorage.getItem('monitor_namespace') || 'admin'
  })
  const [sourceName, setSourceName] = useState(() => {
    return localStorage.getItem('monitor_sourceName') || 'OJET_SOURCE'
  })
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')

  // Save values to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('monitor_striimConfig', JSON.stringify(striimConfig))
  }, [striimConfig])

  useEffect(() => {
    localStorage.setItem('monitor_namespace', namespace)
  }, [namespace])

  useEffect(() => {
    localStorage.setItem('monitor_sourceName', sourceName)
  }, [sourceName])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setStriimConfig(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCopyCommand = () => {
    const command = `curl --request POST \\
--url ${striimConfig.url || 'http://StriimServer:9080'}/api/v2/tungsten \\
--header "Authorization: STRIIM-TOKEN $AUTH_TOKEN" \\
--header 'content-type: text/plain' \\
--data 'mon ${namespace || 'namespace'}.${sourceName || 'ojet_Source_Name'};'`

    navigator.clipboard.writeText(command)
    setCopiedCommand(true)
    setTimeout(() => setCopiedCommand(false), 2000)
  }

  const handleMonitor = async () => {
    // Validation
    if (!striimConfig.url.trim()) {
      setError('Please enter Striim URL')
      return
    }
    if (!striimConfig.username.trim()) {
      setError('Please enter Striim username')
      return
    }
    if (!striimConfig.password.trim()) {
      setError('Please enter Striim password')
      return
    }
    if (!namespace.trim()) {
      setError('Please enter namespace')
      return
    }
    if (!sourceName.trim()) {
      setError('Please enter source name')
      return
    }

    setLoading(true)
    setError('')
    setResults(null)

    try {
      console.log('Sending request to backend with:', {
        striimUrl: striimConfig.url.trim(),
        username: striimConfig.username.trim(),
        namespace: namespace.trim(),
        sourceName: sourceName.trim()
      })

      const response = await axios.post('/api/monitor-source', {
        striimUrl: striimConfig.url.trim(),
        username: striimConfig.username.trim(),
        password: striimConfig.password.trim(),
        namespace: namespace.trim(),
        sourceName: sourceName.trim()
      })

      console.log('Response received:', response.data)

      if (response.data.success) {
        setResults(response.data.results)
      } else {
        setError(response.data.message || 'Failed to execute monitor commands')
      }
    } catch (err) {
      console.error('Error occurred:', err)
      console.error('Error response:', err.response)
      setError(err.response?.data?.message || err.message || 'Failed to execute monitor commands')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleMonitor()
    }
  }

  return (
    <div className="main-content">
      <div className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Activity size={32} color="#2563eb" />
          <div>
            <h1>OJET Source Monitor</h1>
            <p>Monitor OJET source status and memory usage via Striim REST API</p>
          </div>
        </div>
      </div>

      {/* Striim Connection Configuration */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{
          marginBottom: '16px',
          fontSize: '18px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Lock size={18} color="#2563eb" />
          Striim Connection
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label
              htmlFor="url"
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                fontSize: '14px',
                color: '#374151'
              }}
            >
              Striim URL
            </label>
            <input
              type="text"
              id="url"
              name="url"
              value={striimConfig.url}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="localhost"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s',
                color: striimConfig.url === 'localhost' ? '#9ca3af' : '#000000'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2563eb'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          <div>
            <label
              htmlFor="username"
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                fontSize: '14px',
                color: '#374151'
              }}
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={striimConfig.username}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="admin"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s',
                color: striimConfig.username === 'admin' ? '#9ca3af' : '#000000'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2563eb'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                fontSize: '14px',
                color: '#374151'
              }}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={striimConfig.password}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="admin"
              autoComplete="new-password"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s',
                color: striimConfig.password === 'admin' ? '#9ca3af' : '#000000'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2563eb'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>
        </div>
      </div>

      {/* Source Configuration */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
          Source Configuration
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label
              htmlFor="namespace"
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                fontSize: '14px',
                color: '#374151'
              }}
            >
              Namespace
            </label>
            <input
              type="text"
              id="namespace"
              value={namespace}
              onChange={(e) => setNamespace(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="admin"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s',
                color: namespace === 'admin' ? '#9ca3af' : '#000000'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2563eb'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          <div>
            <label
              htmlFor="sourceName"
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                fontSize: '14px',
                color: '#374151'
              }}
            >
              OJET Source Name
            </label>
            <input
              type="text"
              id="sourceName"
              value={sourceName}
              onChange={(e) => setSourceName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="OJET_SOURCE"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s',
                color: sourceName === 'OJET_SOURCE' ? '#9ca3af' : '#000000'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2563eb'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleMonitor}
          disabled={loading}
          className="btn btn-primary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            minWidth: '140px',
            justifyContent: 'center'
          }}
        >
          {loading ? (
            <>
              <Loader size={18} className="spin" />
              Monitoring...
            </>
          ) : (
            <>
              <Play size={18} />
              Monitor Source
            </>
          )}
        </button>

        {error && (
          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            color: '#dc2626',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}
      </div>

      {results && (
        <div style={{ display: 'grid', gap: '20px' }}>
          {results.map((result, index) => (
            <div key={index} className="card">
              <h3 style={{
                marginBottom: '12px',
                fontSize: '16px',
                fontWeight: '600',
                color: '#1f2937',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Activity size={18} color="#2563eb" />
                {result.command}
              </h3>

              <pre style={{
                background: '#1f2937',
                color: '#f3f4f6',
                padding: '16px',
                borderRadius: '6px',
                fontSize: '13px',
                lineHeight: '1.6',
                overflow: 'auto',
                margin: 0,
                fontFamily: 'Monaco, Consolas, "Courier New", monospace'
              }}>
                {result.output || 'No output'}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Monitor

