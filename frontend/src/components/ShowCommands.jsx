import { Terminal, Code, BookOpen, Copy, Check } from 'lucide-react'
import { useState } from 'react'

function ShowCommands() {
  const [copiedId, setCopiedId] = useState(null)

  const commands = [
    {
      id: 1,
      category: 'General Information',
      title: 'Show OJET Status',
      command: 'show <Ojet_Source> status;',
      description: 'Display general status and information about the OJET instance',
      example: 'show GET_DATA status;',
      output: `╒═════════════════╤═════════════════╤═════════════════╤═════════════════╤════════════════════════════════╤════════════╤═════════════════╤══════════╕
│ ServerStatus    │ Enqueue         │ Dequeue         │ CaptureStatus   │ CaptureState                   │ SpillCount │ Progress        │ Error    │
├─────────────────┼─────────────────┼─────────────────┼─────────────────┼────────────────────────────────┼────────────┼─────────────────┼──────────┤
│ STRIIM$OJET$ADM │ STRIIM$Q$ADMIN$ │ STRIIM$Q$ADMIN$ │ STRIIM$C$ADMIN$ │ STRIIM$C$ADMIN$OJE_TEST is     │ None       │ 01/14/2026 17:1 │ None     │
│ IN$OJE_TEST is  │ OJE_TEST is ena │ OJE_TEST is ena │ OJE_TEST is ena │ waiting for more transactions  │            │ 8:48            │          │
│ atached         │ bled            │ bled            │ bled            │                                │            │                 │          │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┴────────────────────────────────┴────────────┴─────────────────┴──────────┘`,
      fieldExplanations: [
        {
          field: 'CaptureState',
          description: 'Shows the current progress of the capture process.'
        },
        {
          field: 'SpillCount',
          description: 'Shows the number of changes spilled to disk (SYSAUX Tablespace). Higher count here may result into slowness for reading changes.'
        }
      ],
      warnings: [
        {
          field: 'CaptureState',
          condition: 'WAITING FOR REDO: FILE thread_2_seq_105877.5874.1196878511, THREAD 2, SEQUENCE 105877, SCN 0x00000977a672db57',
          action: 'ARCH Log Files are missing'
        },
        {
          field: 'CaptureState',
          condition: 'C$SOE$PROD_OJET_READER is unable to enqueue LCRS either because of low memory or because propagations and apply processes are consuming messages slower than the capture process is creating them',
          action: 'Memory problems, you need to increase the streams_pool_size'
        },
        {
          field: 'SpillCount',
          condition: 'Number > 0',
          action: 'Some tuning is needed (add more memory or use Striim parameters to manage memory)'
        }
      ]
    },
    {
      id: 2,
      category: 'General Information',
      title: 'Show OJET Status Details',
      command: 'show <Ojet_Source> status details;',
      description: 'Display detailed status including REDO_MINED, CAPTURE_TIME, SPILL_COUNT, and PROGRESS',
      example: 'show GET_DATA status details;',
      output: `
╒════════╤════════╤════════╤══════════╤════════╤══════════╤════════════╤════════════╤══════════╤════════╤════════╤════════╤════════════╤════════╤══════════════╕
│ FIRST_ │ START_ │ APPLIE │ CAPTURED │ OLDEST │ FILTERED │ MESSAGES_C │ MESSAGES_E │ CAPTURE_ │ RULE_T │ ENQUEU │ LCR_TI │ REDO_WAIT_ │ REDO_M │ RESTART_SCN  │
├────────┼────────┼────────┼──────────┼────────┼──────────┼────────────┼────────────┼──────────┼────────┼────────┼────────┼────────────┼────────┼──────────────┤
│ 456795 │ 456803 │ 456824 │ 46723839 │ 456824 │ 0        │ 232767     │ 14817      │ 1227477  │ 0      │ 0      │ 0      │ 0          │ 1.25G  │ 45679579     │
│ 79     │ 42     │ 60     │          │ 60     │          │            │            │          │        │        │        │            │        │              │
└────────┴────────┴────────┴──────────┴────────┴──────────┴────────────┴────────────┴──────────┴────────┴────────┴────────┴────────────┴────────┴──────────────┘`,
      fieldExplanations: [
        {
          field: 'FIRST_SCN',
          description: 'Indicates the lowest SCN to which the capture can be repositioned.'
        },
        {
          field: 'START_SCN',
          description: 'From which the capture process starts to capture changes. If Ojet is taking a long time to publish first event: Check the difference between Start_SCN (starting point of my OJET App) and First_SCN (associated to BUILD).'
        },
        {
          field: 'APPLIED_SCN',
          description: 'All changes below this SCN have been captured'
        },
        {
          field: 'CAPTURED_SCN',
          description: 'SCN of the last redo log record scanned. Slowness: Difference between the last published event\'s SCN by Ojet and CAPTURED_SCN value, can help us identify that there is some slowness due to txn caching in Oracle'
        },
        {
          field: 'OLDEST_SCN',
          description: 'Oldest SCN of the transactions currently being processed'
        },
        {
          field: 'FILTERED_SCN',
          description: 'SCN of the low watermark transaction processed'
        },
        {
          field: 'MESSAGES_CAPTURED',
          description: 'Total number of redo entries passed by LogMiner to the capture process for rule evaluation since the capture process last started'
        },
        {
          field: 'MESSAGES_ENQUEUED',
          description: 'Total number of messages enqueued since the capture process was last started'
        },
        {
          field: 'CAPTURE_TIME',
          description: 'Elapsed time (in hundredths of a second) scanning for changes in the redo log since the capture process was last started'
        },
        {
          field: 'RULE_TIME',
          description: 'Elapsed time (in hundredths of a second) evaluating rules since the capture process was last started'
        },
        {
          field: 'ENQUEUE_TIME',
          description: 'Time when the last message was enqueued'
        },
        {
          field: 'LCR_TIME',
          description: 'Elapsed time (in hundredths of a second) creating LCRs since the capture process was last started'
        },
        {
          field: 'REDO_WAIT_TIME',
          description: 'Elapsed time (in hundredths of a second) spent by the capture process in the WAITING FOR REDO state'
        },
        {
          field: 'REDO_MINED',
          description: 'The total amount of redo data mined (in bytes) since the capture process last started'
        },
        {
          field: 'RESTART_SCN',
          description: 'The SCN from which the capture process started mining redo data when it was last started'
        }
      ]
    },
    {
      id: 3,
      category: 'Memory',
      title: 'Show Memory Usage',
      command: 'show <Ojet_Source> memory;',
      description: 'Display memory usage and STREAMS_POOL_SIZE information',
      example: 'show GET_DATA memory;',
      output: `╒════════════════════╤═════════════════════╤═════════════════╤════════════════╕
│ LogMinerSession    │ CaptureSession      │ ApplySession    │ StreamsPool    │
├────────────────────┼─────────────────────┼─────────────────┼────────────────┤
│ Normal             │ Normal              │ Normal          │ Under pressure │
└────────────────────┴─────────────────────┴─────────────────┴────────────────┘`,
      fieldExplanations: [
        {
          field: 'Under pressure',
          description: 'This is displayed when usage exceeds 90% of allocated size. Could be caused by memory issues.'
        }
      ]
    },
    {
      id: 4,
      category: 'Memory',
      title: 'Show Memory Details',
      command: 'show <Ojet_Source> memory details;',
      description: 'Display detailed memory usage including pressure status',
      example: 'show GET_DATA memory details;',
      output: `╒═══════════╤═══════════╤═══════════╤═══════════╤═══════════╤═══════════╤═══════════╤═══════════╤═══════════╤═══════════╤═══════════╤══════════════════════════╕
│ LOG_MINER │ LOG_MINER │ CAPTURE_U │ CAPTURE_A │ APPLY_USE │ APPLY_ALL │ STREAMS_U │ STREAMS_A │ MSGS_IN_M │ MSGS_SPIL │ TXNS_ROLL │ PROPAGATION_STATE        │
├───────────┼───────────┼───────────┼───────────┼───────────┼───────────┼───────────┼───────────┼───────────┼───────────┼───────────┼──────────────────────────┤
│ 5.75M     │ 30M       │ 8.2M      │ 32.29M    │ 8.87M     │ 9.87M     │ 28.17M    │ 64M       │ 1         │ 0         │ 0         │ Waiting for message from │
│           │           │           │           │           │           │           │           │           │           │           │ propagation sender       │
└───────────┴───────────┴───────────┴───────────┴───────────┴───────────┴───────────┴───────────┴───────────┴───────────┴───────────┴──────────────────────────┘`
    }
  ]

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const groupedCommands = commands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) {
      acc[cmd.category] = []
    }
    acc[cmd.category].push(cmd)
    return acc
  }, {})

  return (
    <div className="main-content">
      <div className="header">
        <h1>OJET Show Commands</h1>
        <p>Reference Guide for OJET Commands and Queries</p>
      </div>

      <div style={{ 
        marginBottom: '24px',
        padding: '16px',
        background: '#dbeafe',
        borderRadius: '8px',
        border: '1px solid #2563eb'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <BookOpen size={20} color="#2563eb" />
          <strong style={{ color: '#1e40af' }}>About Show Commands</strong>
        </div>
        <p style={{ margin: 0, fontSize: '14px', color: '#1e40af' }}>
          These commands help you monitor and troubleshoot OJET instances. 
          Replace <code style={{ background: '#bfdbfe', padding: '2px 6px', borderRadius: '4px' }}>&lt;Ojet_Source&gt;</code> with your actual OJET SOURCE name.
        </p>
      </div>

      {Object.entries(groupedCommands).map(([category, cmds]) => (
        <div key={category} style={{ marginBottom: '32px' }}>
          <h2 style={{ 
            fontSize: '20px',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '16px',
            paddingBottom: '8px',
            borderBottom: '2px solid #e5e7eb'
          }}>
            {category}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cmds.map(cmd => (
              <div key={cmd.id} className="card">
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 style={{ 
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1f2937',
                      margin: 0
                    }}>
                      {cmd.title}
                    </h3>
                    <Terminal size={18} color="#6b7280" />
                  </div>
                  <p style={{ 
                    fontSize: '13px',
                    color: '#6b7280',
                    margin: '4px 0 0 0'
                  }}>
                    {cmd.description}
                  </p>
                </div>

                {/* Command */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#1f2937',
                    padding: '12px',
                    borderRadius: '6px'
                  }}>
                    <code style={{ 
                      color: '#10b981',
                      fontSize: '14px',
                      fontFamily: 'monospace',
                      flex: 1
                    }}>
                      {cmd.command}
                    </code>
                    <button
                      onClick={() => handleCopy(cmd.id, cmd.command)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        color: copiedId === cmd.id ? '#10b981' : '#9ca3af'
                      }}
                      title="Copy command"
                    >
                      {copiedId === cmd.id ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                {/* Example */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '4px' }}>
                    Example:
                  </div>
                  <div style={{
                    background: '#f3f4f6',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <code style={{ 
                      color: '#374151',
                      fontSize: '13px',
                      fontFamily: 'monospace'
                    }}>
                      {cmd.example}
                    </code>
                  </div>
                </div>

                {/* Output */}
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '4px' }}>
                    Sample Output:
                  </div>
                  <div style={{
                    background: '#1f2937',
                    padding: '12px',
                    borderRadius: '6px',
                    overflow: 'auto'
                  }}>
                    <pre style={{
                      margin: 0,
                      color: '#e5e7eb',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {cmd.output}
                    </pre>
                  </div>
                </div>

                {/* Field Explanations */}
                {cmd.fieldExplanations && (
                  <div style={{ marginTop: '16px' }}>
                    <div style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '12px',
                      paddingBottom: '8px',
                      borderBottom: '2px solid #e5e7eb'
                    }}>
                      📖 Field Explanations
                    </div>
                    <div style={{
                      background: '#f9fafb',
                      padding: '12px',
                      borderRadius: '6px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <p style={{
                        fontSize: '12px',
                        color: '#374151',
                        marginBottom: '12px',
                        fontWeight: '600'
                      }}>
                        The STATUS output includes:
                      </p>
                      <ul style={{
                        margin: 0,
                        paddingLeft: '20px',
                        listStyle: 'none'
                      }}>
                        {cmd.fieldExplanations.map((field, idx) => (
                          <li key={idx} style={{
                            marginBottom: '10px',
                            fontSize: '12px',
                            color: '#374151',
                            lineHeight: '1.6'
                          }}>
                            <strong style={{ color: '#1f2937' }}>• {field.field}</strong> - {field.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Warnings */}
                {cmd.warnings && (
                  <div style={{ marginTop: '16px' }}>
                    <div style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#dc2626',
                      marginBottom: '12px',
                      paddingBottom: '8px',
                      borderBottom: '2px solid #fecaca'
                    }}>
                      ⚠️ Warning
                    </div>
                    <div style={{
                      background: '#fef2f2',
                      padding: '12px',
                      borderRadius: '6px',
                      border: '1px solid #fecaca'
                    }}>
                      <ul style={{
                        margin: 0,
                        paddingLeft: '20px',
                        listStyle: 'none'
                      }}>
                        {cmd.warnings.map((warning, idx) => (
                          <li key={idx} style={{
                            marginBottom: '12px',
                            fontSize: '12px',
                            color: '#374151',
                            lineHeight: '1.6'
                          }}>
                            <div style={{ marginBottom: '4px' }}>
                              <strong style={{ color: '#991b1b' }}>• {warning.field}:</strong>
                              <span style={{ color: '#000000', fontWeight: 'normal' }}> {warning.condition}</span>
                            </div>
                            <div style={{
                              paddingLeft: '12px',
                              color: '#dc2626',
                              fontWeight: '600'
                            }}>
                              → ACTION: {warning.action}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ 
        marginTop: '32px',
        padding: '16px',
        background: '#fef3c7',
        borderRadius: '8px',
        border: '1px solid #f59e0b'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Code size={20} color="#f59e0b" />
          <strong style={{ color: '#92400e' }}>Note</strong>
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: '#92400e' }}>
          For more detailed information and additional commands, please refer to the{' '}
          <a
            href="https://www.striim.com/docs/platform/en/oracle-database-operational-considerations.html#using-the-show-command"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#92400e', textDecoration: 'underline', fontWeight: '600' }}
          >
            official OJET documentation
          </a>
          {' '}or contact your database administrator.
        </p>
      </div>
    </div>
  )
}

export default ShowCommands

