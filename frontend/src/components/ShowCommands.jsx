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
          field: 'SpillCount',
          description: 'Shows the number of changes spilled to disk (SYSAUX Tablespace). Higher count here may result into slowness for reading changes.'
        },
        {
          field: 'CaptureState',
          description: 'Shows the current progress of the capture process. Here are some examples:\n      - INITIALIZING: Starting up. The process is reading the LogMiner dictionary from the redo logs to understand the table structures\n      - CAPTURING CHANGES: Scanning the redo log for changes that satisfy the capture process rule sets.\n      - WAITING FOR REDO: Waiting for new redo log files to be added to the capture process session. The capture process has finished processing all of the redo log files added to its session. This state is possible if there is no activity at a source database. For a downstream capture process, this state is possible if the capture process is waiting for new log files to be added to its session.\n      - WAITING FOR TRANSACTION: Waiting for LogMiner to provide more transactions.'
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
          description: 'The lowest SCN in the redo log from which the capture process can be restarted. Any logs containing SCNs older than this can technically be deleted from the OS level.'
        },
        {
          field: 'START_SCN',
          description: 'The SCN at which the capture process was originally instructed to start. If Ojet is taking a long time to publish first event: Check the difference between Start_SCN (starting point of my OJET App) and First_SCN (associated to BUILD).'
        },
        {
          field: 'APPLIED_SCN',
          description: 'All changes below this SCN have been captured. The SCN of the last message that was successfully sent to and acknowledged by Striim'
        },
        {
          field: 'CAPTURED_SCN',
          description: 'The SCN of the most recent change the capture process has read from the redo logs. Slowness: Difference between the last published event\'s SCN by Ojet and CAPTURED_SCN value, can help us identify that there is some slowness due to txn caching in Oracle'
        },
        {
          field: 'OLDEST_SCN',
          description: 'The SCN of the oldest currently active (uncommitted) transaction that the capture process is tracking'
        },
        {
          field: 'FILTERED_SCN',
          description: 'The SCN of the last message that was filtered out (skipped) because it didn\'t match your Striim selection rules (e.g., a table you aren\'t tracking)'
        },
        {
          field: 'MESSAGES_CAPTURED',
          description: 'The total number of Logical Change Records (LCRs) the process found in the redo logs since the capture process last started'
        },
        {
          field: 'MESSAGES_ENQUEUED',
          description: 'The number of messages actually passed to the outbound server'
        },
        {
          field: 'CAPTURE_TIME',
          description: 'The timestamp when the last message was captured from the redo log.'
        },
        {
          field: 'RULE_TIME',
          description: 'Total time (in hundredths of a second) spent evaluating rules to see if a change should be kept or filtered out.'
        },
        {
          field: 'ENQUEUE_TIME',
          description: 'The timestamp when the last message was sent to the Striim queue'
        },
        {
          field: 'LCR_TIME',
          description: 'Total time spent converting a raw redo log entry into a structured LCR format that Striim understands'
        },
        {
          field: 'REDO_WAIT_TIME',
          description: 'Total time the capture process spent doing nothing because it was waiting for the database to write more redo logs'
        },
        {
          field: 'REDO_MINED',
          description: 'The total amount of redo data mined (in bytes) since the capture process last started'
        },
        {
          field: 'RESTART_SCN',
          description: 'It is the oldest SCN the capture process needs to successfully restart if the database or Striim process crashes'
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
└───────────┴───────────┴───────────┴───────────┴───────────┴───────────┴───────────┴───────────┴───────────┴───────────┴───────────┴──────────────────────────┘`,
      fieldExplanations: [
        {
          field: 'LOG_MINER_USED',
          description: 'Amount of Memory used by Log Miner. This memory is used for "Log File Reassembly." If you have very large transactions, LogMiner needs this RAM to piece together the fragments of those transactions spread across multiple redo logs.'
        },
        {
          field: 'LOG_MINER_MAX',
          description: 'Amount of Memory Allocated for Log Miner'
        },
        {
          field: 'CAPTURE_USED',
          description: 'Amount of Memory used by the Capture Process. Once LogMiner reads the logs, the Capture process transforms that data into LCRs (Logical Change Records). It also applies your "Filtering Rules" here.'
        },
        {
          field: 'CAPTURE_ALLOCATED',
          description: 'Amount of Memory Allocated by the Capture Process.'
        },
        {
          field: 'APPLY_USED',
          description: 'Amount of Memory used by the Apply Process. This is the "Waiting Room." Once an LCR is created, it sits here until the Striim application sends an acknowledgement (ACK) saying, "I have received this record and written it to my target."'
        },
        {
          field: 'APPLY_ALLOCATED',
          description: 'Amount of Memory Allocated by the Apply Process'
        },
        {
          field: 'STREAMS_USED',
          description: 'Amount of Streams Used. If this value hits STREAMS_ALLOCATED, the database literally stops the Capture process until memory is freed up'
        },
        {
          field: 'STREAMS_ALLOCATED',
          description: 'Amount of Streams Allocated'
        },
        {
          field: 'MSGS_IN_MEM',
          description: 'Messages in Memory. This is your Backlog. Under perfect conditions, this number should be low (e.g., 0 to 100). If it climbs into the thousands or millions, it means the database is capturing data much faster than the network or the Striim server can handle it.'
        },
        {
          field: 'MSGS_SPILLED',
          description: 'Number of messages moved from RAM to the SYSAUX tablespace on disk. Ideally you want 0 here'
        },
        {
          field: 'TXNS_ROLLBACK',
          description: 'The number of transactions the Capture process found in the logs that were eventually canceled (ROLLBACK).'
        },
        {
          field: 'PROPAGATION_STATE',
          description: 'Current Status. Here are some examples:\n      - INITIALIZING: The propagation receiver process is starting up and preparing to receive Logical Change Records (LCRs).\n      - SENDING UNAPPLIED TXNS: The receiver is sending transactions that have not yet been applied.\n      - WAITING FOR MESSAGE FROM CLIENT: The receiver is idle and waiting for incoming messages or LCRs from the client process.\n      - RECEIVING LCRS: The receiver is actively receiving Logical Change Records (LCRs) from the sender.\n      - EVALUATING RULES: The receiver is processing received LCRs and applying rule-based filtering to determine how they should be handled.\n      - ENQUEUEING LCRS: Enqueuing an LCR that satisfies the capture process rule sets into the capture process queue.\n      - WAITING FOR MEMORY: Waiting for memory to be freed\n      - WAITING FOR APPLY TO READ: Apply process is yet to read the data\n      - WAITING FOR MESSAGE FROM PROPAGATION SENDER: OJET is currently reading SCN and moving forward until arrives to the current SCN'
        }
      ]
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
        marginTop: '20px',
        marginBottom: '24px',
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
                            lineHeight: '1.6',
                            whiteSpace: 'pre-wrap'
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
    </div>
  )
}

export default ShowCommands

