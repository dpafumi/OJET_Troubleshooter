import { FileText, Database, Activity, GitBranch, Settings } from 'lucide-react'
import CheckCard from './CheckCard'

function Dashboard({ isConnected }) {
  const checks = [
    {
      id: 'dictionary-dumps',
      title: 'Existing Dictionary Dumps',
      description: 'Verify LogMiner dictionary builds are present and valid.',
      icon: FileText,
      iconBg: '#dbeafe',
      iconColor: '#2563eb',
      endpoint: '/api/check/dictionary-dumps',
      requiresParams: false,
      query: `-- If Arch Log Files are "crossed" (BEGIN = Y in 1 row and END=Y on the previous row),
-- that is fine, perhaps BUILD was not able to fit in 1 ARCH LOG FILE

SELECT name, thread#, sequence# as SEQ, status, first_time, next_time,
       FIRST_CHANGE#, NEXT_CHANGE#, DICTIONARY_BEGIN, DICTIONARY_END, deleted
FROM v$archived_log
WHERE standby_dest = 'NO'
  AND COMPLETION_TIME > sysdate - 3
  AND (DICTIONARY_BEGIN = 'YES' OR DICTIONARY_END = 'YES')
ORDER BY SEQUENCE# DESC;`
    },
    {
      id: 'take-dictionary-dump',
      title: 'Take Dictionary Dump',
      description: 'Execute DBMS_LOGMNR_D.BUILD to create a new dictionary dump, if needed.',
      icon: FileText,
      iconBg: '#e0e7ff',
      iconColor: '#6366f1',
      endpoint: '/api/action/build-dictionary',
      requiresParams: false,
      isAction: true,
      query: `-- This will be executed:
EXECUTE DBMS_LOGMNR_D.BUILD(
  options => DBMS_LOGMNR_D.STORE_IN_REDO_LOGS
);`,
      actions: [
        {
          type: 'build-dictionary',
          label: 'Execute Dictionary Build'
        }
      ]
    },
    {
      id: 'table-instantiation',
      title: 'Table Instantiation',
      description: 'Check if tables are properly instantiated and ready for CDC.',
      icon: Database,
      iconBg: '#d1fae5',
      iconColor: '#10b981',
      endpoint: '/api/check/table-instantiation',
      requiresParams: true,
      params: [
        { name: 'tableOwner', label: 'Table Owner', placeholder: 'SCHEMA_NAME' },
        { name: 'tableNames', label: 'Table Names (comma-separated)', placeholder: 'TABLE1,TABLE2' }
      ],
      query: `SELECT TABLE_OWNER, TABLE_NAME, TIMESTAMP, scn as SCN_TO_START_TABLE
FROM dba_capture_prepared_tables
WHERE table_owner = :tableOwner
  AND table_name IN (:tableNames);`,
      actions: [
        {
          type: 'prepare-tables',
          label: 'Prepare Tables'
        }
      ]
    },
    {
      id: 'scn-validation',
      title: 'SCN Validation',
      description: 'Validate SCN consistency for dictionary dumps and table instantiation.',
      icon: GitBranch,
      iconBg: '#fef3c7',
      iconColor: '#f59e0b',
      endpoint: '/api/check/scn-validation',
      requiresParams: true,
      params: [
        { name: 'tableOwner', label: 'Table Owner', placeholder: 'SCHEMA_NAME' },
        { name: 'tableNames', label: 'Table Names (comma-separated)', placeholder: 'TABLE1,TABLE2' }
      ],
      query: `SELECT MAX(SCN) as MAX_SCN
FROM DBA_CAPTURE_PREPARED_TABLES
WHERE TABLE_OWNER = :tableOwner
  AND TABLE_NAME IN (:tableNames);`
    },
    {
      id: 'open-transactions',
      title: 'Open Transactions',
      description: 'Identify long-running open transactions that can block OJET operations',
      icon: Activity,
      iconBg: '#fee2e2',
      iconColor: '#ef4444',
      endpoint: '/api/check/open-transactions',
      requiresParams: false,
      query: `SELECT MIN(START_TIME) as MIN_START_TIME,
       MIN(START_SCN) as MIN_START_SCN,
       COUNT(*) as OPEN_TXN_COUNT
FROM GV$TRANSACTION;`
    },
    {
      id: 'check-db-values',
      title: 'Check Other DB Values',
      description: 'Review critical database parameters and configuration values for OJET',
      icon: Settings,
      iconBg: '#f3e8ff',
      iconColor: '#9333ea',
      endpoint: '/api/check/db-values',
      requiresParams: false,
      query: `SELECT name,value from v$parameter
where name in ('db_name','db_unique_name','log_archive_dest_1','enable_goldengate_replication', 'log_archive_dest_2','log_archive_dest_state_1','log_archive_dest_state_2','fal_client','fal_server','standby_file_management','dg_broker_start','dg_broker_config_file1','dg_broker_config_file2','log_archive_config','service_names','streams_pool_size')
and value is not null
union
select 'global_name' as name, GLOBAL_NAME  FROM global_name
order by name;`
    }
  ]

  return (
    <div className="main-content">
      <div className="header">
        <h1>OJET Validation</h1>
        <p>Technical Validation & Diagnostics Dashboard</p>
      </div>

      {!isConnected && (
        <div className="error-message">
          Please connect to the Oracle database using the sidebar to run checks.
        </div>
      )}

      <div className="dashboard-grid">
        {checks.map(check => (
          <CheckCard 
            key={check.id}
            check={check}
            isConnected={isConnected}
          />
        ))}
      </div>
    </div>
  )
}

export default Dashboard

