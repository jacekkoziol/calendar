/**
 * @property dayNo The Number of the day in the month
 * @property dayOfWeek The Number of the day in the week [0-based index] (0 - Sunday, 6 - Saturday )
 * @property dayShortName The Short Name of the day
 * @property dayShortName The full Name of the day
 */
export interface ICalendarDataDay {
  dayOfMonth: number | null;
  dayOfWeek: number | null;
  dayNameShort: string | null;
  dayName: string | null;
  localeDate: Date | null;
  dateIso: string | null;
  timestamp: number | null;
  year: number | null;
  monthNumber: number | null;
  monthIndex: number;
  monthNameShort: string;
  monthNameFull: string;
}

export interface ICalendarDataWeek {
  weekNumber: number;
  weekDays: Array<ICalendarDataDay | null>
}

export interface ICalendarDataMonth {
  nameShort: string;
  nameFull: string;
  monthNumber: number;
  monthIndex: number;
  year: number;
  weeks: ICalendarDataWeek[];
  days: ICalendarDataDay[];
  weekdaysOrder: ICalendarDataWeekdayName[]
}

/**
 * @property {number} startWeekWithDay Set the day from which the week should start (0-based index, `0`- Sunday, `6`- Saturday)
 * @property {nuICalendarDataMonthsNamesDictionary} dictionaryMonths The dictionary/translation of Months names
 * @property {ICalendarDataWeekdaysDictionary} dictionaryWeekdays The dictionary/translation of Weekdays names
 * @property {boolean} fillWeekMissingDaysWithDaysFromAdjacentMonths Fill the first and last week of the month with days
 * from previous and next month, otherwise with `null` (Default `false`)
 * @property {boolean} weekNumberAdjust
 */
export interface ICalendarDataConfiguration {
  [key: string]: unknown;
  startWeekWithDay?: number;
  dictionaryMonths?: ICalendarDataMonthsNamesDictionary;
  dictionaryWeekdays?: ICalendarDataWeekdaysDictionary;
  fillWeekMissingDaysWithDaysFromAdjacentMonths?: boolean;
  weekNumberAdjust?: boolean;
}

export interface ICalendarDataMonthsListItem {
  [key: string]: unknown;
  monthIndex: number;
  nameShort: string;
  nameFull: string;
  orgNameShort: string;
  orgNameFull: string;
}

// Dictionaries
// -----------------------------------------------------------------------------
interface ICalendarDataDictionary<T> {
  [key: number]: T;
}

export interface ICalendarDataWeekdayName {
  nameShort: string;
  nameFull: string;
}

export interface ICalendarDataWeekdaysDictionary extends ICalendarDataDictionary<ICalendarDataWeekdayName> {
  0: ICalendarDataWeekdayName
  1: ICalendarDataWeekdayName
  2: ICalendarDataWeekdayName
  3: ICalendarDataWeekdayName
  4: ICalendarDataWeekdayName
  5: ICalendarDataWeekdayName
  6: ICalendarDataWeekdayName
}

const CALENDAR_DATA_WEEKDAYS_NAMES_DICTIONARY: ICalendarDataWeekdaysDictionary = {
  0: {nameShort: 'Sun', nameFull: 'Sunday'},
  1: {nameShort: 'Mon', nameFull: 'Monday'},
  2: {nameShort: 'Tue', nameFull: 'Tuesday'},
  3: {nameShort: 'Wed', nameFull: 'Wednesday'},
  4: {nameShort: 'Thu', nameFull: 'Thursday'},
  5: {nameShort: 'Fri', nameFull: 'Friday'},
  6: {nameShort: 'Sat', nameFull: 'Saturday'},
};

export interface ICalendarDataMonthName {
  nameShort: string;
  nameFull: string;
}


export interface ICalendarDataMonthsNamesDictionary extends ICalendarDataDictionary<ICalendarDataMonthName> {
  0: ICalendarDataMonthName;
  1: ICalendarDataMonthName;
  2: ICalendarDataMonthName;
  3: ICalendarDataMonthName;
  4: ICalendarDataMonthName;
  5: ICalendarDataMonthName;
  6: ICalendarDataMonthName;
  7: ICalendarDataMonthName;
  8: ICalendarDataMonthName;
  9: ICalendarDataMonthName;
  10: ICalendarDataMonthName;
  11: ICalendarDataMonthName;
}

const CALENDAR_DATA_MONTHS_NAMES_DICTIONARY: ICalendarDataMonthsNamesDictionary = {
  0: {nameShort: 'Jan', nameFull: 'January'},
  1: {nameShort: 'Feb', nameFull: 'February'},
  2: {nameShort: 'Mar', nameFull: 'March'},
  3: {nameShort: 'Apr', nameFull: 'April'},
  4: {nameShort: 'May', nameFull: 'May'},
  5: {nameShort: 'Jun', nameFull: 'June'},
  6: {nameShort: 'Jul', nameFull: 'July'},
  7: {nameShort: 'Aug', nameFull: 'August'},
  8: {nameShort: 'Sep', nameFull: 'September'},
  9: {nameShort: 'Oct', nameFull: 'October'},
  10: {nameShort: 'Nov', nameFull: 'November'},
  11: {nameShort: 'Dec', nameFull: 'December'},
};


/**
 * CalendarDate generates data for the calendars needs
 */
export class CalendarData {
  private calendarDataConfig: ICalendarDataConfiguration = {
    dictionaryMonths: JSON.parse(JSON.stringify(CALENDAR_DATA_MONTHS_NAMES_DICTIONARY)),
    dictionaryWeekdays: JSON.parse(JSON.stringify(CALENDAR_DATA_WEEKDAYS_NAMES_DICTIONARY)),
    startWeekWithDay: 0,
    fillWeekMissingDaysWithDaysFromAdjacentMonths: false,
    weekNumberAdjust: false,
  };

  private monthsList: ICalendarDataMonthsListItem[] = [];

  constructor(config?: ICalendarDataConfiguration) {
    this.overrideCalendarDataConfiguration(config);
    this.monthsList = this.generateMonthsList();
    console.log('THIS', this);
  }

  /**
   *
   * @param {number} monthIndex The number of the month (0-based index, so: `0` => `January`, `11` => `December`)
   * @param {number} year The particular year, by default if not passed the Current Year will be used
   * @param {number} weekStartsFromDayIndex The day from which the week should be started (0-based index, by default `0` => `Sunday`)
   * @param {boolean} fillMissingDaysWithDaysFromAdjacentMonths Fill the first and last week of the month with days
   * from previous and next month, otherwise with `null` (Default `false`)
   * @return {ICalendarDataMonth}
   */
  public createMonthAsWeeks(
    monthIndex: number,
    year: number,
    weekStartsFromDayIndex: number = this.calendarDataConfig.startWeekWithDay,
    fillMissingDaysWithDaysFromAdjacentMonths: boolean = this.calendarDataConfig.fillWeekMissingDaysWithDaysFromAdjacentMonths,
  ): ICalendarDataMonth {
    const tmpDate: Date = new Date(year, monthIndex, 1);
    // We need to get month index and year from the date
    // to be sure that the data is correct in case the input monthIndex is out o the range 0-11
    const verifiedMonthIndex: number = tmpDate.getMonth();
    const verifiedYear: number = tmpDate.getFullYear();

    const monthDays: ICalendarDataDay[] = this.createMonthByIndex(monthIndex, year);
    const paddingStartDaysCheck: number = monthDays[0].dayOfWeek - weekStartsFromDayIndex;
    const paddingStartDaysCountNeeded: number = paddingStartDaysCheck < 0 ? 7 + paddingStartDaysCheck : paddingStartDaysCheck;
    const paddingEndDaysCountCheck: number = 7 - ((paddingStartDaysCountNeeded + monthDays.length) % 7);
    const paddingEndDaysCountNeeded: number = paddingEndDaysCountCheck >= 7 ? 0 : paddingEndDaysCountCheck;
    let paddingStartDays: Array<ICalendarDataDay | null> = Array.from(new Array(paddingStartDaysCountNeeded), () => null);
    let paddingEndDays: Array<ICalendarDataDay | null> = Array.from(new Array(paddingEndDaysCountNeeded), () => null);

    // Fill the first and last week of the month with days from previous and next month
    if (fillMissingDaysWithDaysFromAdjacentMonths) {
      const monthDaysPrevious: ICalendarDataDay[] = this.createMonthByIndex(monthIndex - 1, year);
      const monthDaysNext: ICalendarDataDay[] = this.createMonthByIndex(monthIndex + 1, year);

      paddingStartDays = paddingStartDaysCountNeeded > 0 ? monthDaysPrevious.slice(-paddingStartDaysCountNeeded) : [];
      paddingEndDays = paddingEndDaysCountNeeded > 0 ? monthDaysNext.slice(0, paddingEndDaysCountNeeded) : [];
    }

    const monthDaysWithPadding: Array<ICalendarDataDay | null> = [...paddingStartDays, ...monthDays, ...paddingEndDays];

    const result: ICalendarDataMonth = {
      nameShort: this.getMonthNameShort(verifiedMonthIndex),
      nameFull: this.getMonthNameFull(verifiedMonthIndex),
      monthNumber: verifiedMonthIndex + 1,
      monthIndex: verifiedMonthIndex,
      year: verifiedYear,
      weeks: this.splitMonthToWeeks(monthDaysWithPadding, verifiedMonthIndex),
      days: monthDays,
      weekdaysOrder: this.getWeekdaysOrder(weekStartsFromDayIndex),
    };

    console.log('createMonthAsWeeks', result);

    return result;
  }

  /**
   * Creates month data for particular month
   * @param {number} monthIndex The number of the month (0-based index, so: `0` => `January`, `11` => `December`)
   * @param {number} year The particular year, by default if not passed the Current Year will be used
   * @return {array} An array of ICalendarDataDay for particular month
   */
  private createMonthByIndex(monthIndex: number = new Date().getMonth(), year: number = new Date().getFullYear()): ICalendarDataDay[] {
    const result: ICalendarDataDay[] = [];
    const tmpDate: Date = new Date(year, monthIndex, 1);
    const daysCount: number = this.daysInMonth(monthIndex, year);

    // We need to get month index and year from the date
    // to be sure that the data is correct in case the input monthIndex is out o the range 0-11
    const verifiedMonthIndex: number = tmpDate.getMonth();
    const verifiedYear: number = tmpDate.getFullYear();

    for (let dayNumber: number = 1; dayNumber <= daysCount; dayNumber++) {
      tmpDate.setDate(dayNumber);
      const dayOfWeek: number = tmpDate.getDay();

      result.push({
        dayOfMonth: dayNumber,
        dayOfWeek,
        dayNameShort: this.getWeekdayNameShort(dayOfWeek),
        dayName: this.getWeekdayNameFull(dayOfWeek),
        localeDate: new Date(tmpDate),
        dateIso: tmpDate.toISOString(),
        timestamp: tmpDate.getTime(),
        year: verifiedYear,
        monthNumber: verifiedMonthIndex + 1,
        monthIndex: verifiedMonthIndex,
        monthNameShort: this.getMonthNameShort(verifiedMonthIndex),
        monthNameFull: this.getMonthNameFull(verifiedMonthIndex),
      });
    }

    return result;
  }

  /**
   * Split the month into weeks
   * @param {ICalendarDataDay[]} monthDaysWithPadding An array days data which should contain padding days
   * @param {number} monthIndex The month index required to calculate the week number
   * @return {ICalendarDataWeek[]} An Array of weeks data
   */
  private splitMonthToWeeks(monthDaysWithPadding: ICalendarDataDay[], monthIndex: number): ICalendarDataWeek[] {
    const weekDaysCount: number = 7;
    const result: ICalendarDataWeek[] = [];

    const weeksCount: number = Math.ceil(monthDaysWithPadding.length / weekDaysCount);

    for (let i=1; i<=weeksCount; i++) {
      // It's used to properly calculate the week number
      let daysOffset: number = 0;
      const daysChunk: ICalendarDataDay[] = monthDaysWithPadding.slice(i * weekDaysCount - weekDaysCount, i * weekDaysCount);
      const weeksFirstDay: ICalendarDataDay = daysChunk.find((day: ICalendarDataDay, index: number) => {
        daysOffset = index;
        return !!day && day.monthIndex === monthIndex;
      });

      result.push({
        weekNumber: this.weekNumber(weeksFirstDay.localeDate, daysOffset),
        weekDays: daysChunk,
      });
    }

    return result;
  }

  /**
   * @param {number} monthIndex The JavaScript month index
   * @param {number} year The Year
   * @return {number} The number of days in the particular month
   */
  private daysInMonth(monthIndex: number, year: number): number {
    return new Date(year, monthIndex + 1, 0).getDate();
  }

  /**
   *
   * @param {Date} date The Date for which the week number should by calculated
   * @param {number} dayOffset Since not always there is available first day of the week,
   * or first day of the week belongs to the previous month, we need to consider the offset during calculation
   * @param {number} weekNumberAdjust It allow to increase the week number
   * @return {number} The number of the week for a given date
   */
  private weekNumber(date: Date, dayOffset: number = 0, weekNumberAdjust: boolean = this.calendarDataConfig.weekNumberAdjust): number {
    const calculatedDateFirstJanuary: Date = new Date(date.getFullYear(), 0, 1);
    const calculatedDateNumberOfDaysFromBeginning: number =
      Math.floor((date.getTime() - calculatedDateFirstJanuary.getTime()) / (24 * 60 * 60 * 1000)) - dayOffset;
    let calculatedDateWeekNumber: number = Math.ceil((date.getDay() + 1 + calculatedDateNumberOfDaysFromBeginning - dayOffset) / 7);

    if (dayOffset > 0 && calculatedDateNumberOfDaysFromBeginning - dayOffset <=0 ) {
      // Prior Year weeks count
      const priorYearDateFirstJanuary: Date = new Date(date.getFullYear() - 1, 0, 1);
      const priorYearDateLastDec: Date = new Date(date.getFullYear() - 1, 11, 31);
      const priorYearDateNumberOfDaysFromBeginning: number =
        Math.floor((priorYearDateLastDec.getTime() - priorYearDateFirstJanuary.getTime()) / (24 * 60 * 60 * 1000));
      const priorYearWeeksCount: number = Math.ceil(priorYearDateNumberOfDaysFromBeginning / 7);
      calculatedDateWeekNumber = priorYearWeeksCount;

      if (weekNumberAdjust) {
        calculatedDateWeekNumber = 0;
      }
    }

    if (weekNumberAdjust) {
      calculatedDateWeekNumber = calculatedDateWeekNumber + 1;
    }

    return calculatedDateWeekNumber;
  }

  // Helpers
  // ---------------------------------------------------------------------------
  private getWeekdayNameShort(weekdayIndex: number): string {
    return this.calendarDataConfig.dictionaryWeekdays[weekdayIndex].nameShort;
  }

  private getWeekdayNameFull(weekdayIndex: number): string {
    return this.calendarDataConfig.dictionaryWeekdays[weekdayIndex].nameFull;
  }

  private getMonthNameShort(monthIndex: number): string {
    return this.calendarDataConfig.dictionaryMonths[monthIndex].nameShort;
  }

  private getMonthNameFull(monthIndex: number): string {
    return this.calendarDataConfig.dictionaryMonths[monthIndex].nameFull;
  }

  private overrideWeekdaysDictionary(dictionaryOfWeekdays: ICalendarDataWeekdaysDictionary): void {
    if (!dictionaryOfWeekdays) {
      return;
    }

    for (const weekIndex in this.calendarDataConfig.dictionaryWeekdays) {
      if (this.calendarDataConfig.dictionaryWeekdays.hasOwnProperty(weekIndex) && weekIndex in dictionaryOfWeekdays) {
        this.calendarDataConfig.dictionaryWeekdays[weekIndex] = dictionaryOfWeekdays[weekIndex];
      }
    }
  }

  private overrideMonthsDictionary(dictionaryOfMonths?: ICalendarDataMonthsNamesDictionary): void {
    if (!dictionaryOfMonths) {
      return;
    }

    for (const monthIndex in this.calendarDataConfig.dictionaryMonths) {
      if (this.calendarDataConfig.dictionaryMonths.hasOwnProperty(monthIndex) && monthIndex in dictionaryOfMonths) {
        this.calendarDataConfig.dictionaryMonths[monthIndex] = dictionaryOfMonths[monthIndex];
      }
    }
  }

  private overrideCalendarDataConfiguration(newConfig: ICalendarDataConfiguration): void {
    if (!newConfig) {
      return;
    }

    this.overrideMonthsDictionary(newConfig?.dictionaryMonths);
    this.overrideWeekdaysDictionary(newConfig?.dictionaryWeekdays);

    for (const prop in newConfig) {
      if (prop in this.calendarDataConfig && this.calendarDataConfig.hasOwnProperty(prop)) {
        if (prop !== 'dictionaryMonths' && prop !== 'dictionaryWeekdays') {
          this.calendarDataConfig[prop] = newConfig[prop];
        }
      }
    }
  }

  private getWeekdaysOrder(weekStartsFromDayIndex: number): ICalendarDataWeekdayName[] {
    const startFromDayIndex: number = weekStartsFromDayIndex % 7;
    const start: ICalendarDataWeekdayName[] = [];
    const end: ICalendarDataWeekdayName[] = [];
    Object.keys(this.calendarDataConfig.dictionaryWeekdays).forEach((key: string) => {
      const numKey: number = Number(key);
      if (numKey >= startFromDayIndex) {
        start.push(this.calendarDataConfig.dictionaryWeekdays[numKey]);
      } else {
        end.push(this.calendarDataConfig.dictionaryWeekdays[numKey]);
      }
    });
    return [...start, ...end];
  }

  private generateMonthsList(): ICalendarDataMonthsListItem[] {
    const result: ICalendarDataMonthsListItem[] = [];

    Object.keys(this.calendarDataConfig.dictionaryMonths).forEach((keyStr: string) => {
      const key: number = Number(keyStr);
      const tmpItem: ICalendarDataMonthsListItem = {
        monthIndex: key,
        nameShort: this.calendarDataConfig.dictionaryMonths[key].nameShort,
        nameFull: this.calendarDataConfig.dictionaryMonths[key].nameFull,
        orgNameShort: CALENDAR_DATA_MONTHS_NAMES_DICTIONARY[key].nameShort,
        orgNameFull: CALENDAR_DATA_MONTHS_NAMES_DICTIONARY[key].nameFull,
      };

      result.push(tmpItem);
    });

    return result;
  }
}
