class Utilities {
  constructor() {
    this.millisecondsPerDay = 60 * 60 * 24 * 1000;
  }

  static compareDates(d1, d2) {
    if (d1 && d2) {
      const t1 = new Date(d1);
      const t2 = new Date(d2);
      return t1.getTime() - t2.getTime();
    }
    throw Error(`compareDates called on null date: ${d1} vs ${d2}`);
  }

  static getDateAsNumber(d0) {
    const d = new Date(d0);
    let month = `${d.getMonth()}`;
    let day = `${d.getDate()}`;
    if (day.length === 1) day = `0${day}`;
    if (month.length === 1) month = `0${month}`;
    return parseInt(`${d.getFullYear()}${month}${day}`, 10);
  }

  static workingDaysBetweenDates(startDate, endDate) {
    if (!startDate || !endDate) return 0;
    // Validate input
    if (endDate < startDate) return 0;

    // Calculate days between dates
    const millisecondsPerDay = 86400 * 1000; // Day in milliseconds
    startDate.setHours(0, 0, 0, 1);  // Start just after midnight
    endDate.setHours(23, 59, 59, 999);  // End just before midnight
    const diff = endDate - startDate;  // Milliseconds between datetime objects
    let days = Math.floor(diff / millisecondsPerDay);

    // Subtract two weekend days for every week in between
    const weeks = Math.floor(days / 7);
    days -= (weeks * 2);

    // Handle special cases
    const startDay = startDate.getDay();
    const endDay = endDate.getDay();

    // Remove weekend not previously removed.
    if (startDay - endDay > 0) days -= 2;

    // Remove start day if span starts on Sunday but ends before Saturday
    if (startDay === 0 && endDay !== 6) days -= 1;

    // Remove end day if span ends on Saturday but starts after Sunday
    if (endDay === 6 && startDay !== 0) days -= 1;

    return days;
  }


  workingDaysDifference(startDate0, endDate0, debug = false) {
    if (!startDate0 || !endDate0 || endDate0.getTime() < startDate0.getTime()) return 0;
    let startDate = new Date(startDate0.getTime());
    startDate.setHours(12, 0, 0, 0); // Noon on the start date
    const endDate = new Date(endDate0.getTime());
    endDate.setHours(13, 0, 0, 0); // 1pm on the end date

    const startDay = startDate.getDay();
    const endDay = endDate.getDay();
    if (startDay === 0 || startDay === 6) {
      console.log(`Start day on a weekend: ${startDate}`);
      if (startDay === 0) startDate = new Date(startDate.getTime() - (2 * this.millisecondsPerDay));
      if (startDay === 6) startDate = new Date(startDate.getTime() - this.millisecondsPerDay);
    }
    let businessDays = 0;
    const diff = endDate.getTime() - startDate.getTime();
    const weeks = Math.floor(diff / (7 * this.millisecondsPerDay)); // Whole weeks between the two days

    if (startDay === endDay) {
      businessDays = 5 * weeks;
    } else if (startDay < endDay) {
      businessDays = (5 * weeks) + (endDay - startDay);
    } else {
      businessDays = (5 * weeks) + (5 - (startDay - endDay));
    }
    return businessDays;
  }
}

module.exports = new Utilities();
