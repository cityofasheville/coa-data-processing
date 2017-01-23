const sql = require('msSql');
require('msnodesqlv8');
const sqlQuery = require('./permitsQuery.sql');
const computeSla = require('./compute_sla');

const config = {
  driver: 'msnodesqlv8',
  server: 'coa-dscdb',
  database: 'AccelaProd',
  options: {
    trustedConnection: true,
  },
};

function run(options, logger) {
  const conn = new sql.Connection(config);

  conn.connect().then(() => {
    new sql.Request(conn).query(sqlQuery).then((recordset) => {
      logger.info(`I got the result of length ${recordset.length}`);
      conn.close();
      computeSla(recordset, logger);
    }).catch((err) => {
      logger.error({ err }, 'Query error');
      conn.close();
    });
  }).catch((err) => {
    logger.error({ err }, 'Error connecting to the database');
  });
}

module.exports = {
  options: '',
  run,
};

