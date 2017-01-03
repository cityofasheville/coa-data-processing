function run(options, logger) {
  let testOption = 'no option';
  if (options.testoption) testOption = options.testoption;
  console.log(`Running test, testoption: ${testOption}`); // eslint-disable-line no-console
  logger.info(`Running test, testoption: ${testOption}`);
}

module.exports = {
  options: '--testoption=testValue',
  run,
};

