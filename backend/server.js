import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import oracledb from 'oracledb';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Oracle connection pool
let pool = null;

// Initialize Oracle connection pool
async function initializePool(config) {
  try {
    if (pool) {
      await pool.close(0);
    }
    
    pool = await oracledb.createPool({
      user: config.username,
      password: config.password,
      connectString: `${config.host}:${config.port}/${config.sid}`,
      poolMin: 1,
      poolMax: 5,
      poolIncrement: 1
    });
    
    return { success: true, message: 'Connection pool created successfully' };
  } catch (error) {
    console.error('Error creating connection pool:', error);
    return { success: false, message: error.message };
  }
}

// Test database connection
app.post('/api/test-connection', async (req, res) => {
  try {
    const { host, port, sid, username, password } = req.body;
    
    const result = await initializePool({ host, port, sid, username, password });
    
    if (result.success) {
      // Test the connection
      const connection = await pool.getConnection();
      await connection.execute('SELECT 1 FROM DUAL');
      await connection.close();
      
      res.json({ success: true, message: 'Connection successful' });
    } else {
      res.status(500).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error('Connection test failed:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Execute query endpoint
app.post('/api/execute-query', async (req, res) => {
  let connection;
  try {
    const { query, params = {} } = req.body;
    
    if (!pool) {
      return res.status(400).json({ 
        success: false, 
        message: 'Database connection not initialized. Please connect first.' 
      });
    }
    
    connection = await pool.getConnection();
    const result = await connection.execute(query, params, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      maxRows: 1000
    });
    
    res.json({ 
      success: true, 
      data: result.rows,
      columns: result.metaData?.map(col => col.name) || []
    });
  } catch (error) {
    console.error('Query execution failed:', error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

// Existing Dictionary Dumps check - Page 8 from PDF
app.post('/api/check/dictionary-dumps', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    // If Arch Log Files are "crossed" (BEGIN = Y in 1 row and END=Y on the previous row),
    // that is fine, perhaps BUILD was not able to fit in 1 ARCH LOG FILE
    const query = `
      SELECT name, thread#, sequence# as SEQ, status, first_time, next_time,
             FIRST_CHANGE#, NEXT_CHANGE#, DICTIONARY_BEGIN, DICTIONARY_END, deleted
      FROM v$archived_log
      WHERE standby_dest = 'NO'
        AND COMPLETION_TIME > sysdate - 3
        AND (DICTIONARY_BEGIN = 'YES' OR DICTIONARY_END = 'YES')
      ORDER BY SEQUENCE# DESC
    `;

    const result = await connection.execute(query, {}, {
      outFormat: oracledb.OUT_FORMAT_OBJECT
    });

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Dictionary dumps check failed:', error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

// Table Instantiation check - Page 11 from PDF
app.post('/api/check/table-instantiation', async (req, res) => {
  let connection;
  try {
    const { tableOwner, tableNames } = req.body;
    
    if (!pool) {
      return res.status(400).json({ 
        success: false, 
        message: 'Database connection not initialized' 
      });
    }
    
    const tableList = tableNames.split(',').map(t => `'${t.trim()}'`).join(',');
    
    const query = `
      SELECT TABLE_OWNER, TABLE_NAME, TIMESTAMP, scn as SCN_TO_START_TABLE
      FROM dba_capture_prepared_tables 
      WHERE table_owner = :tableOwner 
        AND table_name IN (${tableList})
    `;
    
    connection = await pool.getConnection();
    const result = await connection.execute(query, { tableOwner }, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      maxRows: 1000
    });
    
    res.json({ 
      success: true, 
      data: result.rows,
      columns: result.metaData?.map(col => col.name) || []
    });
  } catch (error) {
    console.error('Table instantiation check failed:', error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

// SCN Validation check - Page 13 from PDF
app.post('/api/check/scn-validation', async (req, res) => {
  let connection;
  try {
    const { tableOwner, tableNames } = req.body;

    if (!pool) {
      return res.status(400).json({
        success: false,
        message: 'Database connection not initialized'
      });
    }

    const tableList = tableNames.split(',').map(t => `'${t.trim()}'`).join(',');

    const query = `
      SELECT MAX(SCN) as MAX_SCN
      FROM DBA_CAPTURE_PREPARED_TABLES
      WHERE TABLE_OWNER = :tableOwner
        AND TABLE_NAME IN (${tableList})
    `;

    connection = await pool.getConnection();
    const result = await connection.execute(query, { tableOwner }, {
      outFormat: oracledb.OUT_FORMAT_OBJECT
    });

    // Also get MIN_REQUIRED_CAPTURE_CHANGE#
    const minScnQuery = `SELECT "MIN_REQUIRED_CAPTURE_CHANGE#" FROM V$DATABASE`;
    const minScnResult = await connection.execute(minScnQuery, {}, {
      outFormat: oracledb.OUT_FORMAT_OBJECT
    });

    res.json({
      success: true,
      data: {
        maxInstantiationScn: result.rows[0]?.MAX_SCN || null,
        minRequiredCaptureScn: minScnResult.rows[0]?.["MIN_REQUIRED_CAPTURE_CHANGE#"] || null
      }
    });
  } catch (error) {
    console.error('SCN validation check failed:', error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

// Open Transactions check
app.post('/api/check/open-transactions', async (req, res) => {
  let connection;
  try {
    if (!pool) {
      return res.status(400).json({
        success: false,
        message: 'Database connection not initialized'
      });
    }

    const query = `
      SELECT MIN(START_TIME) as MIN_START_TIME,
             MIN(START_SCN) as MIN_START_SCN,
             COUNT(*) as OPEN_TXN_COUNT
      FROM GV$TRANSACTION
    `;

    connection = await pool.getConnection();
    const result = await connection.execute(query, {}, {
      outFormat: oracledb.OUT_FORMAT_OBJECT
    });

    res.json({
      success: true,
      data: result.rows,
      columns: result.metaData?.map(col => col.name) || []
    });
  } catch (error) {
    console.error('Open transactions check failed:', error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

// Check Other DB Values
app.post('/api/check/db-values', async (req, res) => {
  let connection;
  try {
    if (!pool) {
      return res.status(400).json({
        success: false,
        message: 'Database connection not initialized'
      });
    }

    const query = `
      SELECT name, value
      FROM v$parameter
      WHERE name IN (
        'db_name',
        'db_unique_name',
        'log_archive_dest_1',
        'enable_goldengate_replication',
        'log_archive_dest_2',
        'log_archive_dest_state_1',
        'log_archive_dest_state_2',
        'fal_client',
        'fal_server',
        'standby_file_management',
        'dg_broker_start',
        'dg_broker_config_file1',
        'dg_broker_config_file2',
        'log_archive_config',
        'service_names',
        'streams_pool_size'
      )
      AND value IS NOT NULL
      UNION
      SELECT 'global_name' as name, GLOBAL_NAME as value
      FROM global_name
      ORDER BY name
    `;

    connection = await pool.getConnection();
    const result = await connection.execute(query, {}, {
      outFormat: oracledb.OUT_FORMAT_OBJECT
    });

    res.json({
      success: true,
      data: result.rows,
      columns: result.metaData?.map(col => col.name) || []
    });
  } catch (error) {
    console.error('DB values check failed:', error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

// Action: Build Dictionary Dumps
app.post('/api/action/build-dictionary', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();

    // Execute the dictionary build procedure
    await connection.execute(
      `BEGIN DBMS_LOGMNR_D.BUILD(OPTIONS => DBMS_LOGMNR_D.STORE_IN_REDO_LOGS); END;`
    );

    res.json({
      success: true,
      message: 'Dictionary build executed successfully'
    });
  } catch (error) {
    console.error('Dictionary build failed:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

// Action: Prepare Table Instantiation
app.post('/api/action/prepare-tables', async (req, res) => {
  let connection;
  const { tables } = req.body; // Expected format: [{ schema: 'SCHEMA1', table: 'TABLE1' }, ...]

  if (!tables || !Array.isArray(tables) || tables.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Tables array is required'
    });
  }

  try {
    connection = await pool.getConnection();
    const results = [];

    // Execute PREPARE_TABLE_INSTANTIATION for each table
    for (const tableInfo of tables) {
      const { schema, table } = tableInfo;
      const fullTableName = `${schema}.${table}`;

      try {
        await connection.execute(
          `BEGIN
             DBMS_CAPTURE_ADM.PREPARE_TABLE_INSTANTIATION(
               table_name           => :tableName,
               supplemental_logging => 'NONE',
               container            => 'CURRENT'
             );
           END;`,
          { tableName: fullTableName }
        );

        results.push({
          table: fullTableName,
          success: true,
          message: 'Table prepared successfully'
        });
      } catch (tableError) {
        results.push({
          table: fullTableName,
          success: false,
          message: tableError.message
        });
      }
    }

    const allSuccess = results.every(r => r.success);

    res.json({
      success: allSuccess,
      message: allSuccess
        ? 'All tables prepared successfully'
        : 'Some tables failed to prepare',
      results
    });
  } catch (error) {
    console.error('Table preparation failed:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    connected: pool !== null,
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`OJET Troubleshooter API running on port ${PORT}`);
  console.log(`Listening on 0.0.0.0:${PORT} (accessible externally)`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing connection pool...');
  if (pool) {
    await pool.close(10);
  }
  process.exit(0);
});


