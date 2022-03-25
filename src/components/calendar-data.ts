// export interface ICalendarDataMonth {

// }

/**
 * @property dayNo The Number of the day in the month
 * @property dayOfWeek The Number of the day in the week [0-based index] (0 - Sunday, 6 - Saturday )
 * @property dayShortName The Short Name of the day
 * @property dayShortName The full Name of the day
 */
export interface ICalendarDataDay {
  dayOfMonth: number | null;
  dayOfWeek: number | null;
  dayShortName: string | null;
  dayName: string | null;
  localeDate: Date | null;
  dateIso: string | null;
  timestamp: number | null;
  year: number | null;
  month: number | null;
  monthShortName: string;
  monthFullName: string;
}

interface ICalendarDataDictionary<T> {
  [key: number]: T;
}

export interface ICalendarDataWeekdayName {
  shortName: string;
  fullName: string;
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

export const CALENDAR_DATA_WEEKDAYS_NAMES_DICTIONARY: ICalendarDataWeekdaysDictionary = {
  0: {shortName: 'Sun', fullName: 'Sunday'},
  1: {shortName: 'Mon', fullName: 'Monday'},
  2: {shortName: 'Tue', fullName: 'Tuesday'},
  3: {shortName: 'Wed', fullName: 'Wednesday'},
  4: {shortName: 'Thu', fullName: 'Thursday'},
  5: {shortName: 'Fri', fullName: 'Friday'},
  6: {shortName: 'Sat', fullName: 'Saturday'},
};

export interface ICalendarDataMonthName {
  shortName: string;
  fullName: string;
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

export const CALENDAR_DATA_MONTHS_NAMES_DICTIONARY: ICalendarDataMonthsNamesDictionary = {
  0: {shortName: 'Jan', fullName: 'January'},
  1: {shortName: 'Feb', fullName: 'February'},
  2: {shortName: 'Mar', fullName: 'March'},
  3: {shortName: 'Apr', fullName: 'April'},
  4: {shortName: 'May', fullName: 'May'},
  5: {shortName: 'Jun', fullName: 'June'},
  6: {shortName: 'Jul', fullName: 'July'},
  7: {shortName: 'Aug', fullName: 'August'},
  8: {shortName: 'Sep', fullName: 'September'},
  9: {shortName: 'Oct', fullName: 'October'},
  10: {shortName: 'Nov', fullName: 'November'},
  11: {shortName: 'Dec', fullName: 'December'},
};


// export interface ICalendarDataMonth

/**
 * CalendarDate generates data for the calendars needs
 */
export class CalendarData {
  public weekdaysDictionary: ICalendarDataWeekdaysDictionary = CALENDAR_DATA_WEEKDAYS_NAMES_DICTIONARY;
  public monthsDictionary: ICalendarDataMonthsNamesDictionary = CALENDAR_DATA_MONTHS_NAMES_DICTIONARY;

  constructor() {
    this.createMonthByIndex();
  }

  public createMonthByIndex(monthIndex: number = new Date().getMonth(), year: number = new Date().getFullYear()): ICalendarDataDay[] {
    console.log('monthIndex: ', monthIndex, 'year', year);
    const result: ICalendarDataDay[] = [];
    const daysCount: number = this.daysInMonth(monthIndex, year);
    const tmpDate: Date = new Date(year, monthIndex, 1);

    for (let dayNumber: number = 1; dayNumber <= daysCount; dayNumber++) {
      tmpDate.setDate(dayNumber);
      const dayOfWeek: number = tmpDate.getDay();

      result.push({
        dayOfMonth: dayNumber,
        dayOfWeek,
        dayShortName: this.getWeekdayShortName(dayOfWeek),
        dayName: this.getWeekdayFullName(dayOfWeek),
        localeDate: new Date(tmpDate),
        dateIso: tmpDate.toISOString(),
        timestamp: tmpDate.getTime(),
        year,
        month: monthIndex + 1,
        monthShortName: this.getMonthShortName(monthIndex),
        monthFullName: this.getMonthFullName(monthIndex),
      });
    }

    console.log('result', result);
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

  // Helpers
  // ---------------------------------------------------------------------------
  private getWeekdayShortName(weekdayIndex: number): string {
    return this.weekdaysDictionary[weekdayIndex].shortName;
  }

  private getWeekdayFullName(weekdayIndex: number): string {
    return this.weekdaysDictionary[weekdayIndex].fullName;
  }

  private getMonthShortName(monthIndex: number): string {
    return this.monthsDictionary[monthIndex].shortName;
  }

  private getMonthFullName(monthIndex: number): string {
    return this.monthsDictionary[monthIndex].fullName;
  }
}
