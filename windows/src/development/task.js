const Utilities = require('./utilities');

class Task {
  constructor(process, task, status, start, end, due, owner, level, row, trip = 0) {
    let days = -1;
    if (due && start) {
      const d1 = new Date(start);
      const d2 = new Date(due);
      // days = Utilities.workingDaysBetweenDates(d1, d2);
      days = Utilities.workingDaysDifference(d1, d2, false);
    }
    return {
      B1_ALT_ID: this.permitId,
      process,
      task,
      status,
      start,
      end,
      due,
      days,
      owner,
      level,
      trip,
      type: row.B1_PER_TYPE,
      subtype: row.B1_PER_SUB_TYPE,
      category: row.B1_PER_CATEGORY,
      appdate: row['Application Date'],
      appstatus: row['Application Status'],
      appstatusdate: row['Application Status Date'],
      agencycode: row.SD_AGENCY_CODE,
      comment: row.SD_COMMENT
    };
  }
}

module.exports = Task;

