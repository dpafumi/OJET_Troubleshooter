import { AlertTriangle, Wrench, Terminal, TrendingUp, Database, Activity, XCircle } from 'lucide-react'

function Troubleshooting() {
  const issues = [
    {
      id: 1,
      title: 'Read lag is increasing',
      icon: TrendingUp,
      iconBg: '#fee2e2',
      iconColor: '#ef4444',
      reason: `OJET uses database server 'STREAMS_POOL_SIZE' area of SGA to buffer the uncommitted changes. In case of huge transactions or lots of open transactions of significant numbers, this memory could be under pressure and results in frequent disk spillover.`,
      diagnosis: {
        command: `show <Ojet_Source> memory <details> ;`,
        description: 'The command will return:',
        results: [
          { status: 'Normal', description: 'when OJET is not waiting for memory' },
          { status: 'Under pressure', description: 'when current usage exceeds 90% of allocated size' }
        ],
        note: 'The current used and allocated size of memory will be shown'
      },
      solution: {
        title: 'How to fix?',
        description: 'Increase the STREAMS_POOL_SIZE value.',
        command: `alter system set streams_pool_size={SIZE}G;`,
        example: `alter system set streams_pool_size=2G;`
      }
    },
    {
      id: 2,
      title: 'SpillCount is Increasing',
      icon: Database,
      iconBg: '#fef3c7',
      iconColor: '#f59e0b',
      reason: `Messages are being saved to disk (SYSAUX Tablespace) instead of memory. This indicates that the STREAMS_POOL_SIZE is insufficient for the current workload, or there are large transactions causing spillover.`,
      diagnosis: {
        command: `show <Ojet_Source> status;`,
        description: 'Check the SpillCount value:',
        results: [
          { status: 'Increasing', description: 'SpillCount is growing, indicating disk spillover' },
          { status: 'Stable', description: 'SpillCount is not changing, memory is sufficient' }
        ],
        note: 'Monitor SpillCount over time to identify trends'
      },
      solution: {
        title: 'How to fix?',
        description: 'Increase memory allocation and buffer settings.',
        command: `-- Increase streams_pool_size on source database
alter system set streams_pool_size={SIZE}G;

-- Increase MAX_SGA_SIZE for the application
-- Increase TransactionBufferSpilloverCount to 300k`,
        example: `alter system set streams_pool_size=4G;`
      }
    },
    {
      id: 3,
      title: 'No events are captured',
      icon: XCircle,
      iconBg: '#fee2e2',
      iconColor: '#dc2626',
      reason: `OJET processes committed transactions only. Long-running transactions will not be available to Striim before the actual database commit. This can also occur if table instantiation was not completed successfully.`,
      diagnosis: {
        command: `show <Ojet_Source> status <details>;`,
        description: 'Check the following metrics:',
        results: [
          { status: 'REDO_MINED', description: 'Should show increasing values (bytes mined since capture started)' },
          { status: 'CAPTURE_TIME', description: 'Should show increasing values (time scanning redo logs)' },
          { status: 'SPILL_COUNT', description: 'Verify if spilling is happening (large transactions)' }
        ],
        note: 'Also check: show <source> opentransactions for huge transactions'
      },
      solution: {
        title: 'How to fix?',
        description: 'Verify table instantiation was completed successfully.',
        command: `SELECT table_Name
FROM DBA_CAPTURE_PREPARED_TABLES
WHERE TABLE_OWNER = '<owner_name>';

-- If table is missing, prepare it:
BEGIN
  DBMS_CAPTURE_ADM.PREPARE_TABLE_INSTANTIATION(
    table_name => '<schema>.<table>',
    supplemental_logging => 'NONE',
    container => 'CURRENT'
  );
END;`,
        example: `SELECT table_Name FROM DBA_CAPTURE_PREPARED_TABLES WHERE TABLE_OWNER = 'HR';`
      }
    },
    {
      id: 4,
      title: 'Initial changes captured after big delay',
      icon: Activity,
      iconBg: '#dbeafe',
      iconColor: '#2563eb',
      reason: `Unexpected large number of archive logs are being mined. This can happen when there are stale/old deployments, or the dictionary dump is not recent.`,
      diagnosis: {
        command: `show <Ojet_Source> status <details> ;`,
        description: 'Check the capture state:',
        results: [
          { status: 'CAPTURE_STATE', description: 'Shows if waiting for event or processing archive log' },
          { status: 'Processing old logs', description: 'OJET is scanning through old archive logs' }
        ],
        note: 'Check if there are multiple OJET deployments using setupOJet.sh'
      },
      solution: {
        title: 'How to fix?',
        description: 'Clean up old deployments and ensure recent dictionary build.',
        command: `-- Use setupOJet.sh to check deployments
-- Remove/cleanup stale deployments via setupOjet.sh
-- Ensure there is a recent dictionary build
-- For local capture, start without START_SCN to auto-build dictionary`,
        example: `./setupOJet.sh --list
./setupOJet.sh --cleanup <old_deployment>`
      }
    },
    {
      id: 5,
      title: 'MISSING multi-version data dictionary in Alert,log File',
      icon: AlertTriangle,
      iconBg: '#fee2e2',
      iconColor: '#ef4444',
      reason: `Table Instantiation was not executed, or was executed before BUILD, or after the table was added to the OJET App. This can cause missing records on the target.`,
      diagnosis: {
        command: `-- Check Oracle alert.log for errors
-- Get table names from object IDs
SELECT owner||'.'||object_name
FROM dba_objects
WHERE object_id IN (<object_ids>);

--Now use above object id to run second query and get its output. 
select o.LOGMNR_UID,global_name,ownername,lvl0name,baseobj#, start_scn 
from system.logmnrc_gtlo o,system.logmnrc_dbname_uid_map m 
where m.logmnr_uid=o.logmnr_uid 
  AND baseobj# in (<object_ids>);
  
--Now see whether those tables were some of the tables for which data was not captured( as per Mon outputs)
--Please make sure they have dictionary dump created under CDB . 
--Then undeploy -> redeploy -> start the app and see if it will capture data from all the tables.`,
        description: 'Identify problematic tables from alert.log:',
        results: [
          { status: 'Error in alert.log', description: 'knllgobjinfo: MISSING multi-version data dictionary!!!' },
          { status: 'Missing records', description: 'Data not captured for specific tables' }
        ],
        note: 'Check if dictionary dump was created under CDB'
      },
      solution: {
        title: 'How to fix?',
        description: 'Undeploy, redeploy, and restart the app. If issue persists, use previous dictionary build.',
        command: `-- Undeploy -> Redeploy -> Start app
-- If still failing, configure use_previous_dict_build
OJetConfig: '{"OJET":["use_previous_dict_build:1"]}'`,
        example: `-- This will use previous dictionary dump instead of latest
-- Example: Start SCN 2050 will use dump at 1AM instead of 5AM`
      }
    },
    {
      id: 6,
      title: 'ORA-26914: Unable to communicate with OJet',
      icon: XCircle,
      iconBg: '#fef3c7',
      iconColor: '#f59e0b',
      reason: `Unable to communicate with OJetServer capture process. Possible reasons: 
      - Insufficient memory 
      - Network issues 
      - SYSAUX tablespace full.
      - OJET may be unable to find the required dictionary build.`,
      diagnosis: {
        command: `-- Check if dictionary build exists at SCN
SELECT MAX(FIRST_CHANGE#)
FROM V$ARCHIVED_LOG
WHERE DICTIONARY_BEGIN = 'YES'
  AND STATUS = 'A'
  AND STANDBY_DEST = 'NO'
  AND FIRST_CHANGE# <= <SCN>;`,
        description: 'Verify dictionary build availability:',
        results: [
          { status: 'No rows returned', description: 'Dictionary build not found at specified SCN' },
          { status: 'SCN returned', description: 'Dictionary build exists' }
        ],
        note: 'Check SYSAUX tablespace usage and network connectivity'
      },
      solution: {
        title: 'How to fix?',
        description: 'Ensure dictionary build exists and system resources are available.',
        command: `-- Check SYSAUX tablespace
SELECT tablespace_name,
       ROUND(used_space*8192/1024/1024/1024,2) used_gb,
       ROUND(tablespace_size*8192/1024/1024/1024,2) size_gb
FROM dba_tablespace_usage_metrics
WHERE tablespace_name = 'SYSAUX';`,
        example: `-- If SYSAUX is full, add datafile or resize existing`
      }
    },
    {
      id: 7,
      title: 'DBMS_LOGMNR_D.BUILD hangs',
      icon: AlertTriangle,
      iconBg: '#fee2e2',
      iconColor: '#dc2626',
      reason: `Dictionary build process is hanging, usually due to blocking sessions or locks on system tables.`,
      diagnosis: {
        command: `SELECT CAPTURE_NAME, STATUS
FROM DBA_CAPTURE;`,
        description: 'Check for blocking sessions:',
        results: [
          { status: 'Capture exists', description: 'Old capture process may be blocking' },
          { status: 'No capture', description: 'Safe to proceed with build' }
        ],
        note: 'Check for locks on SYSTEM tables'
      },
      solution: {
        title: 'How to fix?',
        description: 'Drop blocking capture process and rebuild dictionary.',
        command: `-- 1. Kill the Capture blocking session
BEGIN
  dbms_capture_adm.drop_capture('<capture_name>', TRUE);
END;
/

-- 2. Start dictionary build again (on CDB)
exec DBMS_LOGMNR_D.BUILD(OPTIONS => DBMS_LOGMNR_D.STORE_IN_REDO_LOGS);

-- 3. Get dump SCN and start new OJET from this SCN`,
        example: `BEGIN
  dbms_capture_adm.drop_capture('STRIIM$C$OLD_CAPTURE', TRUE);
END;
/`
      }
    }



  ]

  return (
    <div className="main-content">
      <div className="header">
        <h1>OJET Troubleshooting</h1>
        <p>Common Issues and Solutions</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {issues.map(issue => {
          const Icon = issue.icon
          return (
            <div key={issue.id} className="card" style={{ maxWidth: '100%' }}>
              {/* Header */}
              <div className="card-header">
                <div className="card-icon" style={{ background: issue.iconBg }}>
                  <Icon size={24} color={issue.iconColor} />
                </div>
                <div>
                  <h3 className="card-title">{issue.title}</h3>
                </div>
              </div>

              {/* Reason */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  <AlertTriangle size={16} color="#f59e0b" />
                  Reason
                </div>
                <p style={{ 
                  fontSize: '14px', 
                  lineHeight: '1.6', 
                  color: '#6b7280',
                  margin: 0,
                  paddingLeft: '24px'
                }}>
                  {issue.reason}
                </p>
              </div>

              {/* Diagnosis */}
              <div style={{ 
                marginBottom: '20px',
                padding: '16px',
                background: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  marginBottom: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  <Terminal size={16} color="#2563eb" />
                  Diagnosis
                </div>
                
                <div style={{ paddingLeft: '24px' }}>
                  <div style={{
                    background: '#1f2937',
                    padding: '12px',
                    borderRadius: '6px',
                    marginBottom: '12px'
                  }}>
                    <code style={{
                      color: '#10b981',
                      fontSize: '13px',
                      fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {issue.diagnosis.command}
                    </code>
                  </div>

                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
                    {issue.diagnosis.description}
                  </p>

                  <ul style={{ 
                    margin: '0 0 12px 0',
                    paddingLeft: '20px',
                    fontSize: '13px',
                    color: '#6b7280'
                  }}>
                    {issue.diagnosis.results.map((result, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>
                        <strong>{result.status}</strong> - {result.description}
                      </li>
                    ))}
                  </ul>

                  <p style={{ 
                    fontSize: '12px', 
                    color: '#9ca3af',
                    fontStyle: 'italic',
                    margin: 0
                  }}>
                    {issue.diagnosis.note}
                  </p>
                </div>
              </div>

              {/* Solution */}
              <div style={{ 
                padding: '16px',
                background: '#d1fae5',
                borderRadius: '8px',
                border: '1px solid #10b981'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  marginBottom: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#065f46'
                }}>
                  <Wrench size={16} color="#10b981" />
                  {issue.solution.title}
                </div>

                <div style={{ paddingLeft: '24px' }}>
                  <p style={{ fontSize: '13px', color: '#065f46', marginBottom: '8px' }}>
                    {issue.solution.description}
                  </p>

                  <div style={{
                    background: '#1f2937',
                    padding: '12px',
                    borderRadius: '6px',
                    marginBottom: '8px'
                  }}>
                    <code style={{
                      color: '#10b981',
                      fontSize: '13px',
                      fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {issue.solution.command}
                    </code>
                  </div>

                  <div style={{ fontSize: '12px', color: '#065f46' }}>
                    <strong>Example:</strong>
                    <div style={{
                      background: '#1f2937',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      marginTop: '4px'
                    }}>
                      <code style={{
                        color: '#34d399',
                        fontSize: '12px',
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {issue.solution.example}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Troubleshooting

