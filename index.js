const bunyan = require('bunyan');
const commands = require('./commands');
const commandLine = require('./command_line');

function listCommands() {
  let docString = '';
  Object.keys(commands).forEach((key) => { docString += `   ${key} ${commands[key].options}\n`; });
  return docString;
}

function listOptions() {
  let docString = '\n Common Options:\n\n';
  docString += '    --log=logFileName\n';
  docString += '    --server=serverName\n';
  docString += '    --db=databaseName\n';
  return docString;
}

function usage() {
  const usageString = `Usage: ${commandLine.stripPath(process.argv[1])} command\n\nAvailable Commands:\n\n`;
  console.info(usageString + listCommands() + listOptions()); // eslint-disable-line no-console
}

const args = commandLine.extractOptions(process.argv.slice(2));
if (args.args.length < 1) {
  usage();
  process.exit(1);
}

let logger;
if ('log' in args.options) {
  logger = bunyan.createLogger({ name: 'COAProcessing', streams: [{ level: 'info', path: args.options.log }] });
} else {
  logger = bunyan.createLogger({ name: 'COAProcessing', stream: process.stdout, level: 'info' });
}

const command = args.args[0];
if (!(command in commands)) {
  console.error(`\nERROR: Unknown processing command ${command}\n`); // eslint-disable-line no-console
  usage();
  setTimeout(() => { process.exit(0); }, 2000);
}
else {
  logger.info(`Processing: ${command}.run`);
  try {
    commands[command].run(args.options, logger);
  } catch (err) {
    logger.error({ err }, `Error running the ${command} process`);
    setTimeout(() => { process.exit(0); }, 2000); // Apparently the only way to let logger flush output.
  }
}

