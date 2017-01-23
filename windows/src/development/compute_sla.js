/* eslint-disable no-console */
const MasterV4Workflow = require('./wf_masterv4');
let permitId = -1;

function cleanRecord(input) {
  const output = {};
  Object.keys(input).forEach((key) => {
    output[key] = input[key];
  });

  const est = '-05:00';

  output['Status Date'] = (input['Status Date'] === 'NULL') ? null : input['Status Date'] + est;
  output['Due Date'] = (input['Due Date'] === 'NULL') ? null : input['Due Date'] + est;
  output['Application Date'] = (input['Application Date'] === 'NULL') ? null : input['Application Date'] + est;
  output['Application Status Date'] = (input['Application Date'] === 'NULL') ? null : input['Application Status Date'] + est;
  return output;
}

function outputPermit(tasks) {
  const permit = { tasks };

  return permit;
}

function computeSla(records, logger) {
  let done = false;
  let cur = 0;
  let id = null;
  let count = 0;
  let elements = [];
  let workflow = null;

  while (!done) {
    if (id == null) id = records[cur].B1_ALT_ID;
    if (cur >= records.length) done = true;
    if (done || records[cur].B1_ALT_ID !== id) {
      // We have all the records, process this permit
      count += 1;
      let tasks = [];
      permitId = elements[0].B1_ALT_ID;
      if (elements[0].Workflow === 'MASTER V4') {
        workflow = new MasterV4Workflow(elements);
      }
      else {
        console.log(`Unknown workflow ${elements[0].Workflow}`);
      }

      outputPermit(tasks);
      elements = [];
      id = null;
    } else {
      elements.push(cleanRecord(records[cur]));
      cur += 1;
    }
  }

  console.log(`Final permits count = ${count}`);
}

module.exports = computeSla;
