import { useState, useEffect } from 'react'
import { Database, Play, Loader, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import axios from 'axios'

function OjetQueries() {
  // Load saved values from localStorage or use defaults
  const [dbConfig, setDbConfig] = useState(() => {
    const saved = localStorage.getItem('ojet_queries_dbConfig')
    return saved ? JSON.parse(saved) : { host: '', port: '1521', sid: '', username: '', password: '' }
  })
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [connectMessage, setConnectMessage] = useState('')
  const [queryResults, setQueryResults] = useState({})
  const [queryLoading, setQueryLoading] = useState({})
  const [queryErrors, setQueryErrors] = useState({})

  // Save values to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ojet_queries_dbConfig', JSON.stringify(dbConfig))
  }, [dbConfig])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setDbConfig(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleConnect = async () => {
    setLoading(true)
    setConnectMessage('')
    
    try {
      const response = await axios.post('/api/test-connection', dbConfig)
      
      if (response.data.success) {
        setIsConnected(true)
        setConnectMessage('Connection successful!')
      } else {
        setIsConnected(false)
        setConnectMessage(response.data.message || 'Connection failed')
      }
    } catch (error) {
      setIsConnected(false)
      setConnectMessage(error.response?.data?.message || error.message || 'Connection failed')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading && dbConfig.host && dbConfig.username && dbConfig.password) {
      handleConnect()
    }
  }

  const executeQuery = async (queryId, endpoint) => {
    if (!isConnected) {
      setQueryErrors(prev => ({ ...prev, [queryId]: 'Please connect to database first' }))
      return
    }

    setQueryLoading(prev => ({ ...prev, [queryId]: true }))
    setQueryErrors(prev => ({ ...prev, [queryId]: '' }))
    setQueryResults(prev => ({ ...prev, [queryId]: null }))

    try {
      const response = await axios.post(endpoint, dbConfig)
      
      if (response.data.success) {
        setQueryResults(prev => ({ ...prev, [queryId]: response.data.results }))
      } else {
        setQueryErrors(prev => ({ ...prev, [queryId]: response.data.message || 'Query failed' }))
      }
    } catch (error) {
      setQueryErrors(prev => ({ 
        ...prev, 
        [queryId]: error.response?.data?.message || error.message || 'Query failed' 
      }))
    } finally {
      setQueryLoading(prev => ({ ...prev, [queryId]: false }))
    }
  }

  const queries = [
    {
      id: 'capture-status',
      title: 'Check Capture Process Status',
      description: 'View detailed status of OJET capture processes including SCN positions and configuration',
      endpoint: '/api/ojet-queries/capture-status',
      query: `SELECT CAPTURE_NAME, QUEUE_OWNER, CAPTURE_USER,
       START_SCN, CAPTURED_SCN, APPLIED_SCN, SOURCE_DATABASE, CAPTURE_TYPE, ERROR_MESSAGE,
       FIRST_SCN, REQUIRED_CHECKPOINT_SCN, STATUS
FROM DBA_CAPTURE`
    },
    {
      id: 'propagation-receiver',
      title: 'Check Propagation Receiver',
      description: 'Monitor data transport and propagation status',
      endpoint: '/api/ojet-queries/propagation-receiver',
      query: `SELECT TOTAL_MSGS, 
       TO_CHAR(HIGH_WATER_MARK) AS HIGHEST_MESS_SCN_RECEIVED,
       TO_CHAR(ACKNOWLEDGEMENT) AS HIGHEST_MESS_ACKNOWLEDGE_TO_SENDER,
       STATE
FROM GV$PROPAGATION_RECEIVER`
    },
    {
      id: 'capture-memory',
      title: 'Check Capture Process Memory Usage',
      description: 'Monitor memory allocation and utilization for capture processes',
      endpoint: '/api/ojet-queries/capture-memory',
      query: `SELECT CAPTURE_NAME, STATE,
       TOTAL_MESSAGES_CAPTURED,
       ROUND(SGA_USED / 1024 / 1024, 2) AS USED_MB,
       ROUND(SGA_ALLOCATED / 1024 / 1024, 2) AS ALLOCATED_MB,
       ROUND((SGA_USED / NULLIF(SGA_ALLOCATED, 0)) * 100, 2) AS MEM_UTIL_PCT,
       ROUND((SYSDATE - CAPTURE_TIME) * 86400, 0) AS LAG_SEC
FROM V$XSTREAM_CAPTURE`
    },
    {
      id: 'apply-memory',
      title: 'Check Apply Process Memory Usage',
      description: 'Monitor memory usage for apply/reader processes',
      endpoint: '/api/ojet-queries/apply-memory',
      query: `SELECT r.INST_ID, ap.APPLY_NAME, r.STATE,
       r.TOTAL_MESSAGES_DEQUEUED AS MSGS_TO_STRIIM,
       ROUND(r.SGA_USED / 1024 / 1024, 2) AS USED_MB,
       ROUND(r.SGA_ALLOCATED / 1024 / 1024, 2) AS ALLOC_MB,
       ROUND((r.SGA_USED / NULLIF(r.SGA_ALLOCATED, 0)) * 100, 2) AS MEM_UTIL_PCT
FROM GV$XSTREAM_APPLY_READER r
JOIN GV$SESSION s ON (r.SID = s.SID AND r.SERIAL# = s.SERIAL# AND r.INST_ID = s.INST_ID)
JOIN DBA_APPLY ap ON (r.APPLY_NAME = ap.APPLY_NAME)
ORDER BY r.INST_ID, ap.APPLY_NAME`
    },
    {
      id: 'streams-pool',
      title: 'Check Streams Pool Memory Usage',
      description: 'Monitor overall streams pool allocation and usage',
      endpoint: '/api/ojet-queries/streams-pool',
      query: `SELECT ROUND(CURRENT_SIZE / 1024 / 1024, 2) AS STREAM_POOL_TOTAL_MB,
       ROUND((CURRENT_SIZE - TOTAL_MEMORY_ALLOCATED) / 1024 / 1024, 2) AS STREAM_POOL_FREE_MB,
       ROUND((TOTAL_MEMORY_ALLOCATED / NULLIF(CURRENT_SIZE, 0)) * 100, 2) AS STREAM_POOL_USAGE_PCT
FROM V$STREAMS_POOL_STATISTICS`
    },
    {
      id: 'db-memory-params',
      title: 'Check Database Memory Parameters',
      description: 'View key Oracle memory configuration parameters',
      endpoint: '/api/ojet-queries/db-memory-params',
      query: `SELECT NAME, VALUE
FROM V$PARAMETER
WHERE NAME IN ('sga_target','sga_max_size','shared_pool_size','large_pool_size',
               'java_pool_size','streams_pool_size','memory_max_target','memory_target','db_cache_size')
ORDER BY NAME`
    },
    {
      id: 'transactions-processing',
      title: 'Check Transactions Being Processed',
      description: 'View transactions currently being processed by Capture/Apply processes',
      endpoint: '/api/ojet-queries/transactions-processing',
      query: `SELECT COMPONENT_NAME, COMPONENT_TYPE,
       (XIDUSN || '.' || XIDSLT || '.' || XIDSQN) AS TRAN_ID,
       CUMULATIVE_MESSAGE_COUNT,
       TOTAL_MESSAGE_COUNT,
       FIRST_MESSAGE_POSITION
FROM V$XSTREAM_TRANSACTION`
    }
  ]

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar for credentials */}
      <div style={{
        width: '320px',
        backgroundColor: '#f9fafb',
        borderRight: '1px solid #e5e7eb',
        padding: '24px',
        overflowY: 'auto'
      }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#111827' }}>
            Connection to DB Running OJET
          </h2>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            Enter Oracle credentials (CDB if used)
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label htmlFor="host" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: '#374151' }}>
              Host
            </label>
            <input
              type="text"
              id="host"
              name="host"
              value={dbConfig.host}
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
                transition: 'border-color 0.2s'
              }}
            />
          </div>

          <div>
            <label htmlFor="port" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: '#374151' }}>
              Port
            </label>
            <input
              type="text"
              id="port"
              name="port"
              value={dbConfig.port}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="1521"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
          </div>

          <div>
            <label htmlFor="sid" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: '#374151' }}>
              SID / Service Name
            </label>
            <input
              type="text"
              id="sid"
              name="sid"
              value={dbConfig.sid}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="ORCL"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
          </div>

          <div>
            <label htmlFor="username" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: '#374151' }}>
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={dbConfig.username}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="OJET_USER"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
          </div>

          <div>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: '#374151' }}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={dbConfig.password}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
          </div>

          <button
            onClick={handleConnect}
            disabled={loading || !dbConfig.host || !dbConfig.username || !dbConfig.password}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: loading || !dbConfig.host || !dbConfig.username || !dbConfig.password ? '#9ca3af' : '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: loading || !dbConfig.host || !dbConfig.username || !dbConfig.password ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? (
              <>
                <Loader size={18} className="animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Database size={18} />
                Connect to Database
              </>
            )}
          </button>

          {connectMessage && (
            <div style={{
              padding: '12px',
              borderRadius: '6px',
              backgroundColor: isConnected ? '#d1fae5' : '#fee2e2',
              border: `1px solid ${isConnected ? '#10b981' : '#ef4444'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: isConnected ? '#065f46' : '#991b1b'
            }}>
              {isConnected ? <CheckCircle size={16} /> : <XCircle size={16} />}
              {connectMessage}
            </div>
          )}

          {isConnected && (
            <div style={{
              padding: '12px',
              borderRadius: '6px',
              backgroundColor: '#d1fae5',
              border: '1px solid #10b981',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: '#065f46',
              marginTop: '12px'
            }}>
              <CheckCircle size={16} />
              Connected to {dbConfig.host}:{dbConfig.port}/{dbConfig.sid}
            </div>
          )}
        </div>
      </div>

      {/* Main content area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: '#111827' }}>
              OJET Queries
            </h1>
            <p style={{ fontSize: '16px', color: '#6b7280' }}>
              Execute useful Oracle queries for monitoring OJET capture and apply processes
            </p>
          </div>

          {/* Query Cards */}
          <div style={{ display: 'grid', gap: '24px' }}>
            {queries.map((query) => (
              <div
                key={query.id}
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '24px',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}
              >
                <div style={{ marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#111827' }}>
                    {query.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                    {query.description}
                  </p>

                  {/* Column Descriptions & Health Metrics */}
                  {query.id === 'capture-status' && (
                    <details style={{ marginBottom: '16px' }}>
                      <summary style={{
                        cursor: 'pointer',
                        fontSize: '13px',
                        color: '#2563eb',
                        fontWeight: '500',
                        userSelect: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        📖 Column Descriptions & Health Metrics
                      </summary>
                      <div style={{
                        marginTop: '12px',
                        padding: '16px',
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '13px',
                        color: '#374151'
                      }}>
                        <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#111827' }}>
                          Column Descriptions
                        </h4>
                        <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
                          <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            fontSize: '12px',
                            backgroundColor: 'white'
                          }}>
                            <thead>
                              <tr style={{ borderBottom: '2px solid #d1d5db' }}>
                                <th style={{ textAlign: 'left', padding: '8px', fontWeight: '600', backgroundColor: '#f3f4f6', width: '25%' }}>Column</th>
                                <th style={{ textAlign: 'left', padding: '8px', fontWeight: '600', backgroundColor: '#f3f4f6' }}>Significance</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '8px', fontWeight: '500', fontFamily: 'monospace', fontSize: '11px' }}>CAPTURE_NAME</td>
                                <td style={{ padding: '8px' }}>The unique name of the capture process.</td>
                              </tr>
                              <tr style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                                <td style={{ padding: '8px', fontWeight: '500', fontFamily: 'monospace', fontSize: '11px' }}>QUEUE_OWNER</td>
                                <td style={{ padding: '8px' }}>The schema user running the process (must have specific privileges to mine logs).</td>
                              </tr>
                              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '8px', fontWeight: '500', fontFamily: 'monospace', fontSize: '11px' }}>CAPTURE_USER</td>
                                <td style={{ padding: '8px' }}>The schema user running the process (must have specific privileges to mine logs).</td>
                              </tr>
                              <tr style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                                <td style={{ padding: '8px', fontWeight: '500', fontFamily: 'monospace', fontSize: '11px' }}>START_SCN</td>
                                <td style={{ padding: '8px' }}>The System Change Number where the process first started capturing data.</td>
                              </tr>
                              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '8px', fontWeight: '500', fontFamily: 'monospace', fontSize: '11px' }}>CAPTURED_SCN</td>
                                <td style={{ padding: '8px' }}>The SCN of the last change successfully scanned from the redo logs.</td>
                              </tr>
                              <tr style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                                <td style={{ padding: '8px', fontWeight: '500', fontFamily: 'monospace', fontSize: '11px' }}>APPLIED_SCN</td>
                                <td style={{ padding: '8px' }}>The SCN of the last message that was successfully dequeued and applied by the destination. This is crucial for knowing how much redo log data the database still needs to keep.</td>
                              </tr>
                              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '8px', fontWeight: '500', fontFamily: 'monospace', fontSize: '11px' }}>SOURCE_DATABASE</td>
                                <td style={{ padding: '8px' }}>The global name of the database where the changes originated.</td>
                              </tr>
                              <tr style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                                <td style={{ padding: '8px', fontWeight: '500', fontFamily: 'monospace', fontSize: '11px' }}>CAPTURE_TYPE</td>
                                <td style={{ padding: '8px' }}>Usually LOCAL (reading its own logs) or DOWNSTREAM (reading logs shipped from another DB).</td>
                              </tr>
                              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '8px', fontWeight: '500', fontFamily: 'monospace', fontSize: '11px' }}>ERROR_MESSAGE</td>
                                <td style={{ padding: '8px' }}>If the capture process crashes or stops, the reason (e.g., "Log file not found") appears here.</td>
                              </tr>
                              <tr style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                                <td style={{ padding: '8px', fontWeight: '500', fontFamily: 'monospace', fontSize: '11px' }}>FIRST_SCN</td>
                                <td style={{ padding: '8px' }}>This is the lowest SCN at which the capture process can be restarted. It represents the point in time where the LogMiner dictionary was originally built for this process.</td>
                              </tr>
                              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '8px', fontWeight: '500', fontFamily: 'monospace', fontSize: '11px' }}>REQUIRED_CHECKPOINT_SCN</td>
                                <td style={{ padding: '8px' }}>It represents the oldest SCN for which the capture process still needs access to the redo/archive logs. Any log file containing an SCN equal to or greater than this value must NOT be deleted.</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '8px', fontWeight: '500', fontFamily: 'monospace', fontSize: '11px' }}>STATUS</td>
                                <td style={{ padding: '8px' }}>
                                  The current administrative state of the process:
                                  <ul style={{ marginTop: '4px', marginBottom: '0', paddingLeft: '20px' }}>
                                    <li><strong>ENABLED:</strong> Running (or attempting to run).</li>
                                    <li><strong>DISABLED:</strong> Manually stopped by an administrator.</li>
                                    <li><strong>ABORTED:</strong> Crashed due to an error (check ERROR_MESSAGE).</li>
                                  </ul>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#111827' }}>
                          Key Health Metrics to Watch
                        </h4>
                        <div style={{ fontSize: '12px', lineHeight: '1.6' }}>
                          <p style={{ marginBottom: '12px' }}>
                            You can use these columns to calculate the "Lag" or "Latency" of your replication system:
                          </p>

                          <div style={{ marginBottom: '10px' }}>
                            <strong style={{ color: '#111827' }}>Mining Lag:</strong> The difference between the current Database SCN and the CAPTURED_SCN. If this is large, the capture process is falling behind in reading the logs.
                          </div>

                          <div style={{ marginBottom: '10px' }}>
                            <strong style={{ color: '#111827' }}>Total Backlog:</strong> The difference between CAPTURED_SCN and APPLIED_SCN. This tells you how many changes are sitting in the queue waiting to be processed at the destination.
                          </div>

                          <div style={{ marginBottom: '10px' }}>
                            <strong style={{ color: '#111827' }}>Log Retention:</strong> Oracle cannot delete archive logs until the REQUIRED_CHECKPOINT_SCN and CAPTURED_SCN have moved past them. If CAPTURED_SCN stops moving, your disk might fill up with logs. If your REQUIRED_CHECKPOINT_SCN stops moving forward, it means the capture process is "stuck" on an old transaction. If your RMAN backup scripts or archiver deletion policies don't respect this SCN, they might delete a log that the capture process still needs to read. If that happens, the capture will ABORT with an "Archive log not found" error.
                          </div>

                          <div style={{ marginBottom: '10px' }}>
                            <strong style={{ color: '#111827' }}>Recovery:</strong> If you need to "reset" your replication, you can do so anywhere between the FIRST_SCN and the current SCN. If you need to go back further than the FIRST_SCN, you usually have to drop and recreate the capture process entirely.
                          </div>

                          <div>
                            <strong style={{ color: '#111827' }}>Checkpointing:</strong> The capture process periodically takes "snapshots" of its state (checkpoints). As it successfully processes and finishes old transactions, it moves the REQUIRED_CHECKPOINT_SCN forward, allowing you to finally purge old archive logs.
                          </div>
                        </div>
                      </div>
                    </details>
                  )}

                  {/* Propagation Receiver Documentation */}
                  {query.id === 'propagation-receiver' && (
                    <details style={{ marginBottom: '16px' }}>
                      <summary style={{
                        cursor: 'pointer',
                        fontSize: '13px',
                        color: '#2563eb',
                        fontWeight: '500',
                        userSelect: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        📖 Column Descriptions & Health Metrics
                      </summary>
                      <div style={{
                        marginTop: '12px',
                        padding: '16px',
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '13px',
                        color: '#374151'
                      }}>
                        <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#111827' }}>
                          Column Descriptions
                        </h4>
                        <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
                          <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            fontSize: '12px',
                            backgroundColor: 'white'
                          }}>
                            <thead>
                              <tr style={{ borderBottom: '2px solid #d1d5db' }}>
                                <th style={{ textAlign: 'left', padding: '8px', fontWeight: '600', backgroundColor: '#f3f4f6', width: '25%' }}>Column</th>
                                <th style={{ textAlign: 'left', padding: '8px', fontWeight: '600', backgroundColor: '#f3f4f6' }}>Explanation</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '8px', fontWeight: '500', fontFamily: 'monospace', fontSize: '11px' }}>TOTAL_MSGS</td>
                                <td style={{ padding: '8px' }}>The cumulative number of messages received by this process since it started.</td>
                              </tr>
                              <tr style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                                <td style={{ padding: '8px', fontWeight: '500', fontFamily: 'monospace', fontSize: '11px' }}>HIGH_WATER_MARK</td>
                                <td style={{ padding: '8px' }}>The highest Message ID (or SCN) that has been received. Using to_char is common here because these identifiers are often large numbers or RAW data types.</td>
                              </tr>
                              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '8px', fontWeight: '500', fontFamily: 'monospace', fontSize: '11px' }}>ACKNOWLEDGEMENT</td>
                                <td style={{ padding: '8px' }}>The Message ID/SCN that the receiver has successfully acknowledged back to the sender. This tells the sender it's safe to purge these messages.</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '8px', fontWeight: '500', fontFamily: 'monospace', fontSize: '11px' }}>STATE</td>
                                <td style={{ padding: '8px' }}>
                                  The current status of the receiver process (e.g., Waiting for message, Processing message, or Closing).
                                  <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '4px' }}>
                                    <strong>⚠️ Note:</strong> If you see "Waiting for More Memory" consider increasing the streams_pool_size
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#111827' }}>
                          Health Check Analysis
                        </h4>
                        <div style={{ fontSize: '12px', lineHeight: '1.6' }}>
                          <p style={{ marginBottom: '12px' }}>
                            This query is essentially a "heartbeat" check for data replication. By comparing the HIGH_WATER_MARK and the ACKNOWLEDGEMENT, you can determine if there is a bottleneck.
                          </p>

                          <div style={{ marginBottom: '10px' }}>
                            <strong style={{ color: '#111827' }}>Healthy State:</strong> The HIGH_WATER_MARK and ACKNOWLEDGEMENT should be close to each other.
                          </div>

                          <div style={{ marginBottom: '10px' }}>
                            <strong style={{ color: '#111827' }}>The Lag:</strong> If the HIGH_WATER_MARK is much higher than the ACKNOWLEDGEMENT, it means the receiver has the data but hasn't finished processing or confirming it yet.
                          </div>

                          <div>
                            <strong style={{ color: '#111827' }}>The Stalls:</strong> If TOTAL_MSGS isn't increasing over time despite data being sent, the propagation might be hung.
                          </div>
                        </div>
                      </div>
                    </details>
                  )}

                  {/* Capture Process Memory Usage Documentation */}
                  {query.id === 'capture-memory' && (
                    <details style={{ marginBottom: '16px' }}>
                      <summary style={{
                        cursor: 'pointer',
                        fontSize: '13px',
                        color: '#2563eb',
                        fontWeight: '500',
                        userSelect: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        📖 Column Descriptions & Health Metrics
                      </summary>
                      <div style={{
                        marginTop: '12px',
                        padding: '16px',
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '13px',
                        color: '#374151'
                      }}>
                        <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#111827' }}>
                          Column Descriptions
                        </h4>
                        <div style={{ overflowX: 'auto' }}>
                          <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            fontSize: '12px',
                            backgroundColor: 'white'
                          }}>
                            <thead>
                              <tr style={{ borderBottom: '2px solid #d1d5db' }}>
                                <th style={{ textAlign: 'left', padding: '8px', fontWeight: '600', backgroundColor: '#f3f4f6', width: '30%' }}>Column</th>
                                <th style={{ textAlign: 'left', padding: '8px', fontWeight: '600', backgroundColor: '#f3f4f6' }}>Explanation</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '8px', fontWeight: '500', fontFamily: 'monospace', fontSize: '11px' }}>CAPTURE_NAME</td>
                                <td style={{ padding: '8px' }}>The name of the specific capture process being monitored.</td>
                              </tr>
                              <tr style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                                <td style={{ padding: '8px', fontWeight: '500', fontFamily: 'monospace', fontSize: '11px' }}>STATE</td>
                                <td style={{ padding: '8px' }}>
                                  The current activity (e.g., CAPTURING CHANGES, FLOW CONTROL, WAITING FOR REDO).
                                  <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#dbeafe', border: '1px solid #3b82f6', borderRadius: '4px' }}>
                                    <strong>ℹ️ Note:</strong> If you see WAITING FOR REDO: FILE /home/oracle/FROMP…. and the Source DB is Quiet: This is Normal if no one is performing INSERTS, UPDATES, or DELETES, there is no "Redo" to capture. The process is simply idling, waiting for work.
                                  </div>
                                </td>
                              </tr>
                              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '8px', fontWeight: '500', fontFamily: 'monospace', fontSize: '11px' }}>TOTAL_MESSAGES_CAPTURED</td>
                                <td style={{ padding: '8px' }}>The total number of Logical Change Records (LCRs) the process has found in the logs since it started.</td>
                              </tr>
                              <tr style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                                <td style={{ padding: '8px', fontWeight: '500', fontFamily: 'monospace', fontSize: '11px' }}>USED_MB</td>
                                <td style={{ padding: '8px' }}>The actual amount of memory (in MB) currently holding captured data in the Streams Pool.</td>
                              </tr>
                              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '8px', fontWeight: '500', fontFamily: 'monospace', fontSize: '11px' }}>ALLOCATED_MB</td>
                                <td style={{ padding: '8px' }}>The total memory (in MB) currently reserved for this specific capture process.</td>
                              </tr>
                              <tr style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                                <td style={{ padding: '8px', fontWeight: '500', fontFamily: 'monospace', fontSize: '11px' }}>MEM_UTIL_PCT</td>
                                <td style={{ padding: '8px' }}>Memory Efficiency: Shows how much of your allocated buffer is actually being used. If this is consistently near 100%, the process may start "spilling" to disk.</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '8px', fontWeight: '500', fontFamily: 'monospace', fontSize: '11px' }}>LAG_SEC</td>
                                <td style={{ padding: '8px' }}>The "Latency": The number of seconds between the time the change happened in the DB and the time it was captured.</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </details>
                  )}

                  {/* Apply Process Memory Usage Documentation */}
                  {query.id === 'apply-memory' && (
                    <details style={{ marginBottom: '16px' }}>
                      <summary style={{
                        cursor: 'pointer',
                        fontSize: '13px',
                        color: '#2563eb',
                        fontWeight: '500',
                        userSelect: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        📖 Column Descriptions & Health Metrics
                      </summary>
                      <div style={{
                        marginTop: '12px',
                        padding: '16px',
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '13px',
                        color: '#374151'
                      }}>
                        <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#111827' }}>
                          Column Descriptions
                        </h4>
                        <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
                          <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            fontSize: '12px',
                            backgroundColor: 'white'
                          }}>
                            <thead>
                              <tr style={{ borderBottom: '2px solid #d1d5db' }}>
                                <th style={{ textAlign: 'left', padding: '8px', fontWeight: '600', backgroundColor: '#f3f4f6', width: '25%' }}>Column</th>
                                <th style={{ textAlign: 'left', padding: '8px', fontWeight: '600', backgroundColor: '#f3f4f6' }}>Explanation</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '8px', fontWeight: '500', fontFamily: 'monospace', fontSize: '11px' }}>INST_ID</td>
                                <td style={{ padding: '8px' }}>The RAC instance ID. This identifies which physical server in a cluster is handling the reading work.</td>
                              </tr>
                              <tr style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                                <td style={{ padding: '8px', fontWeight: '500', fontFamily: 'monospace', fontSize: '11px' }}>APPLY_NAME</td>
                                <td style={{ padding: '8px' }}>The name of the Apply process (usually matches your Striim or replication task name).</td>
                              </tr>
                              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '8px', fontWeight: '500', fontFamily: 'monospace', fontSize: '11px' }}>STATE</td>
                                <td style={{ padding: '8px' }}>
                                  What the reader is doing right now (e.g., DEQUEUING MESSAGES, INITIALIZING, or IDLE).
                                  <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '4px' }}>
                                    <strong>⚠️ FLOW CONTROL:</strong> Backpressure. The Apply Servers or the target (Striim) can't keep up.
                                  </div>
                                </td>
                              </tr>
                              <tr style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                                <td style={{ padding: '8px', fontWeight: '500', fontFamily: 'monospace', fontSize: '11px' }}>MSGS_TO_STRIIM</td>
                                <td style={{ padding: '8px' }}>The total count of messages this reader has pulled out of the queue to hand over to the application (or Striim).</td>
                              </tr>
                              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '8px', fontWeight: '500', fontFamily: 'monospace', fontSize: '11px' }}>USED_MB / ALLOC_MB</td>
                                <td style={{ padding: '8px' }}>Shows memory usage within the Streams Pool. If ALLOC_MB is much higher than USED_MB, you have plenty of headroom.</td>
                              </tr>
                              <tr style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                                <td style={{ padding: '8px', fontWeight: '500', fontFamily: 'monospace', fontSize: '11px' }}>MEM_UTIL_PCT</td>
                                <td style={{ padding: '8px' }}>The percentage of the allocated memory currently in use. Consistently hitting 100% can cause the sender to "pause" (Flow Control).</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '8px', fontWeight: '500', fontFamily: 'monospace', fontSize: '11px' }}>SOURCE_TYPE</td>
                                <td style={{ padding: '8px' }}>Tells you if the data was automatically captured from redo logs (Captured LCRs) or manually put into the queue by a user/application (User-Enqueued).</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#111827' }}>
                          Troubleshooting Tips
                        </h4>
                        <div style={{ fontSize: '12px', lineHeight: '1.6' }}>
                          <div style={{ marginBottom: '10px' }}>
                            <strong style={{ color: '#111827' }}>IDLE State with No Movement:</strong> If the STATE is IDLE or DEQUEUING MESSAGES but MSGS_TO_STRIIM isn't moving, the problem is likely at the Source (nothing is being sent).
                          </div>

                          <div style={{ marginBottom: '10px' }}>
                            <strong style={{ color: '#111827' }}>Check MEM_UTIL_PCT:</strong> If it's near 100%, increase the STREAMS_POOL_SIZE.
                          </div>

                          <div style={{ marginBottom: '10px' }}>
                            <strong style={{ color: '#111827' }}>High USED_MB / High MSGS:</strong> Large volume or large "in-flight" transactions are being reassembled.
                          </div>

                          <div>
                            <strong style={{ color: '#111827' }}>Check Transaction Size:</strong> One massive transaction (like a huge batch update) will hold up the Coordinator until it's finished, causing the lag to spike until that one transaction clears.
                          </div>
                        </div>
                      </div>
                    </details>
                  )}

                  {/* SQL Query Display */}
                  <details style={{ marginBottom: '16px' }}>
                    <summary style={{
                      cursor: 'pointer',
                      fontSize: '13px',
                      color: '#2563eb',
                      fontWeight: '500',
                      userSelect: 'none'
                    }}>
                      📋 View SQL Query
                    </summary>
                    <pre style={{
                      marginTop: '12px',
                      padding: '12px',
                      backgroundColor: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '12px',
                      overflowX: 'auto',
                      color: '#374151',
                      fontFamily: 'monospace'
                    }}>
                      {query.query}
                    </pre>
                  </details>

                  <button
                    onClick={() => executeQuery(query.id, query.endpoint)}
                    disabled={!isConnected || queryLoading[query.id]}
                    style={{
                      padding: '10px 16px',
                      backgroundColor: !isConnected || queryLoading[query.id] ? '#9ca3af' : '#2563eb',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: !isConnected || queryLoading[query.id] ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    {queryLoading[query.id] ? (
                      <>
                        <Loader size={16} className="animate-spin" />
                        Executing...
                      </>
                    ) : (
                      <>
                        <Play size={16} />
                        Execute Query
                      </>
                    )}
                  </button>
                </div>

                {/* Error Display */}
                {queryErrors[query.id] && (
                  <div style={{
                    padding: '12px',
                    backgroundColor: '#fee2e2',
                    border: '1px solid #ef4444',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    marginTop: '16px'
                  }}>
                    <AlertCircle size={16} style={{ color: '#dc2626', marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ fontSize: '14px', color: '#991b1b' }}>{queryErrors[query.id]}</span>
                  </div>
                )}

                {/* Results Display */}
                {queryResults[query.id] && (
                  <div style={{ marginTop: '16px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
                      Results:
                    </h4>
                    <div style={{
                      backgroundColor: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      padding: '16px',
                      overflowX: 'auto'
                    }}>
                      {queryResults[query.id].length === 0 ? (
                        <p style={{ fontSize: '14px', color: '#6b7280', fontStyle: 'italic' }}>
                          No results found
                        </p>
                      ) : (
                        <div style={{ overflowX: 'auto' }}>
                          <table style={{
                            borderCollapse: 'collapse',
                            fontSize: '12px',
                            width: '100%',
                            tableLayout: 'auto'
                          }}>
                            <thead>
                              <tr style={{ borderBottom: '2px solid #d1d5db' }}>
                                {Object.keys(queryResults[query.id][0]).map((key) => (
                                  <th
                                    key={key}
                                    style={{
                                      textAlign: 'left',
                                      padding: '6px 8px',
                                      fontWeight: '600',
                                      color: '#374151',
                                      backgroundColor: '#f3f4f6',
                                      whiteSpace: 'nowrap',
                                      fontSize: '10px',
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.3px',
                                      width: '1%'
                                    }}
                                  >
                                    {key}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {queryResults[query.id].map((row, idx) => (
                                <tr
                                  key={idx}
                                  style={{
                                    borderBottom: '1px solid #e5e7eb',
                                    backgroundColor: idx % 2 === 0 ? 'white' : '#f9fafb'
                                  }}
                                >
                                  {Object.values(row).map((value, vidx) => (
                                    <td
                                      key={vidx}
                                      style={{
                                        padding: '6px 8px',
                                        color: '#111827',
                                        whiteSpace: 'nowrap',
                                        width: '1%'
                                      }}
                                      title={value !== null && value !== undefined ? String(value) : '-'}
                                    >
                                      {value !== null && value !== undefined ? String(value) : '-'}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OjetQueries

