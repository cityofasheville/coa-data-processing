const Task = require('./task');

class MasterV4Workflow {
  constructor(elements) {
    this.permitId = elements[0].B1_ALT_ID;
    this.elements = elements;
    this.tasks = [];
    this.currentState = {};
  }

  applicationProcess(process, row) {
    const currentProcessState = this.currentState[process];
    const statusDate = row['Status Date'];
    const task = row.Task;
    const status = row.Status;

    if (!('processStartDate' in currentProcessState)) { // First time here
      currentProcessState.processStartDate = statusDate; // This is the start of the whole process
      currentProcessState.processRoundStartDate = null; // Start of the current round
      this.tasks.push(new Task(process, process, 'Start', statusDate, statusDate, null, '-', 0, row));
    }
  }

  process(elements) {

    this.elements.forEach((row) => {
      // We track the state of each process separately.
      const process = row.Process;
      if (!(process in this.currentState)) this.currentState[process] = {};

      // There are 5 possible processes:
      //  Application Process, Review Process, Issuance, Close Out Process, and Ad Hoc Tasks.
      const task = row.Task;
      const status = row.Status;
      const statusDate = row['Status Date'];


      switch (process) {
        case 'Application Process':
        {
          applicationProcess(tasks, process, row, currentState[process]);
        }
        break;

        case 'Review Process':
          reviewProcess(tasks, process, row, currentState[process]);
          break;

        case 'Issuance':
          issuanceProcess(tasks, process, row, currentState[process]);
          break;

        case 'Close Out Process':
          closeoutProcess(tasks, process, row, currentState[process]);
          break;

        default: // Ad Hoc and other
          {
            if (!('processRoundStartDate' in currentState[process]) && process != 'Ad Hoc Tasks') {
              currentState[process].processRoundStartDate = null;
              currentState[process].startDate = statusDate;
              tasks.push(createTask(process, process, 'Start', currentState[process].startDate, statusDate, null, '-', 0, row));
            }
            tasks.push(createTask(process, task, status, statusDate, statusDate, null, '-', 1, row));
          }
          break;
      }
    });
    return tasks;
    }
}

module.exports = MasterV4Workflow;
