/**
 * @property dayNo The Number of the day in the month
 * @property dayOfWeek The Number of the day in the week [0-based index] (0 - Sunday, 6 - Saturday )
 * @property dayShortName The Short Name of the day
 * @property dayShortName The full Name of the day
 * @property localeDateWithTime The Date with time of current localization at the moment of calling the getDateWithCurrentTime() method
 * otherwise `null`
 * @property dateIsoWithTime The ISO Date with time of current localization at the moment of calling the getDateWithCurrentTime() method
 * otherwise `null`
 * @property getDateWithCurrentTime The method that is setting Date with current time of calling the getDateWithCurrentTime() method,
 * it sets value for fields `localeDateWithTime` and `dateIsoWithTime`.
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
  localeDateWithTime?: Date | null;
  dateIsoWithTime?: string | null;
  getDateWithCurrentTime: () => ICalendarDataDayDateWithTime;
}

export interface ICalendarDataDayDateWithTime {
  localeDateWithTime: Date | null;
  dateIsoWithTime: string | null;
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
 * @property {ICalendarDataMonthsNamesDictionary} dictionaryMonths The dictionary/translation of Months names
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
  // weekNumberAdjust?: boolean;
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
    // weekNumberAdjust: false,
  };

  protected monthsList: ICalendarDataMonthsListItem[] = [];

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
    let paddingStartDays: Array<ICalendarDataDay | null> = Array.from(new Array(paddingStartDaysCountNeeded), (): null => null);
    let paddingEndDays: Array<ICalendarDataDay | null> = Array.from(new Array(paddingEndDaysCountNeeded), (): null => null);

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
      weeks: this.splitMonthToWeeks(monthDaysWithPadding),
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
        localeDateWithTime: null,
        dateIsoWithTime: null,
        getDateWithCurrentTime: function() {
          const localeDateWithTime: Date = new Date();
          localeDateWithTime.setFullYear(verifiedYear);
          localeDateWithTime.setMonth(verifiedMonthIndex);
          localeDateWithTime.setDate(dayNumber);

          this.localeDateWithTime = localeDateWithTime;
          this.dateIsoWithTime = localeDateWithTime.toISOString();

          return {
            localeDateWithTime,
            dateIsoWithTime: localeDateWithTime.toISOString(),
          };
        },
      });
    }

    return result;
  }

  /**
   * Split the month into weeks
   * @param {ICalendarDataDay[]} monthDaysWithPadding An array days data which should contain padding days
   * @return {ICalendarDataWeek[]} An Array of weeks data
   */
  private splitMonthToWeeks(monthDaysWithPadding: ICalendarDataDay[]): ICalendarDataWeek[] {
    const weekDaysCount: number = 7;
    const result: ICalendarDataWeek[] = [];
    const weeksCount: number = Math.ceil(monthDaysWithPadding.length / weekDaysCount);

    for (let i=1; i <= weeksCount; i++) {
      // It's used to properly calculate the week number
      const daysChunk: ICalendarDataDay[] = monthDaysWithPadding.slice(i * weekDaysCount - weekDaysCount, i * weekDaysCount);
      // const weekFirstAvailableDay: ICalendarDataDay = daysChunk.find((day: ICalendarDataDay) => !!day);

      result.push({
        // weekNumber: this.getWeekNumberFromDate(
        //   weekFirstAvailableDay.localeDate,
        // ),
        weekNumber: this.getWeekNumberForWeekDays(daysChunk),
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

  // -----------------------
  private getWeekNumberForWeekDays(days: ICalendarDataDay[]): number {
    const firstDayIndicatingWeekNumber = days.find((day: ICalendarDataDay) => !!day && day?.dayOfWeek === 4);
    const dayUsedForWeekNumber = firstDayIndicatingWeekNumber || days.find((day: ICalendarDataDay) => !!day);
    return this.getWeekNumberFromDate(dayUsedForWeekNumber.localeDate);
  }

  // TODO:: It seems like the function needs to be adjusted, check dates:
  //  01-12-2020 number of week for the last week
  //  01-01-2021 number of week for the first week
  // https://weeknumber.com/how-to/javascript
  // ISO 8601:2004
  // private getWeekNumberFromDate(date: Date): number {
  //   const tmpDate = new Date(date.getTime());
  //   tmpDate.setHours(0, 0, 0, 0);
  //   // Thursday in current week decides the year.
  //   tmpDate.setDate(tmpDate.getDate() + 3 - (tmpDate.getDay() + 6) % 7);
  //   // January 4 is always in week 1.
  //   const week1: Date = new Date(tmpDate.getFullYear(), 0, 4);
  //   // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  //   return 1 + Math.round(((tmpDate.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  // }


  /**
   * Calculates the week number in the year for a given date according to ISO 8601 standard.
   *
   * @param {Date} date - Input date
   * @return {number} Week number (1-53)
   */
  private getWeekNumberFromDate(date: Date): number {
    // Create a copy of the input date
    const dateCopy = new Date(date.getTime());

    // Reset time to midnight
    dateCopy.setHours(0, 0, 0, 0);

    // Convert day of week to format where Monday = 0, Sunday = 6
    const dayOfWeek = (dateCopy.getDay() + 6) % 7;

    // Set date to Thursday of the current week
    // (Monday + 3 = Thursday)
    dateCopy.setDate(dateCopy.getDate() - dayOfWeek + 3);

    // Create January 4th date for the year from our date
    const january4th = new Date(dateCopy.getFullYear(), 0, 4);

    // Convert day of week for January 4th to format where Monday = 0
    const january4thDayOfWeek = (january4th.getDay() + 6) % 7;

    // Set date to Thursday of the first week of the year
    // (Monday + 3 = Thursday)
    const firstThursday = new Date(january4th.getTime());
    firstThursday.setDate(january4th.getDate() - january4thDayOfWeek + 3);

    // Calculate difference in days
    const daysDiff = (dateCopy.getTime() - firstThursday.getTime()) / (24 * 60 * 60 * 1000);

    // Calculate difference in weeks and add 1
    // (because the first week is number 1, not 0)
    return Math.round(daysDiff / 7) + 1;
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
