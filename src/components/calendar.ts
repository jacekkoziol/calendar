import {
  CalendarData,
  ICalendarDataConfiguration,
  ICalendarDataDay,
  ICalendarDataMonth,
  ICalendarDataWeek,
  ICalendarDataWeekdayName,
} from '../classes/calendar-data';

export interface ICalendarConfiguration {
  [key: string]: any;
  showWeekNumbers?: boolean
}

interface HTMLTableCellElementCustom extends HTMLTableCellElement {
  calendarDataDay?: ICalendarDataDay,
}

// declare global {
//   // eslint-disable-next-line no-unused-vars
//   interface HTMLTableCellElement {
//     calendarDataDay: ICalendarDataDay,
//   }
// }


export class Calendar extends CalendarData {
  private calendarDataMonth: ICalendarDataMonth;
  private currentDate: Date = new Date();

  // private calendarMothsOptions: ICalendarOptionMonth[] = [];

  private htmlCalendarContainer: HTMLDivElement;
  private htmlCalendarNavigation: HTMLDivElement;
  private htmlCalendarMonth: HTMLDivElement;
  private htmlCalendarMonthTable: HTMLTableElement;

  private calendarConfig: ICalendarConfiguration = {
    showWeekNumbers: false,
  };

  constructor(
    calendarMainContainerSelector: string,
    configCalendar?: ICalendarConfiguration,
    configCalendarData?: ICalendarDataConfiguration) {
    super(configCalendarData);
    this.overrideConfiguration(configCalendar);

    // this.calendarMothsOptions = this.generateMothsOptionsList();
    this.calendarDataMonth = this.createMonthAsWeeks(this.currentDate.getMonth(), this.currentDate.getFullYear());
    this.initializeCalendar(calendarMainContainerSelector);
  }

  private initializeCalendar(calendarMainContainerSelector: string): void {
    if (!calendarMainContainerSelector) {
      throw new Error('Main calendar container selector not defined!');
    }

    const mainCalendarContainer: HTMLElement = document.querySelector(calendarMainContainerSelector);

    if (!mainCalendarContainer) {
      throw new Error('Main calendar container Not Found!');
    }

    this.createCalendarTemplate();
    mainCalendarContainer.appendChild(this.htmlCalendarContainer);
    this.createMonthTemplate();
  }

  private createCalendarTemplate(): void {
    this.htmlCalendarContainer = document.createElement('div');
    this.htmlCalendarContainer.className = 'cal__Container';

    this.htmlCalendarNavigation = document.createElement('div');
    this.htmlCalendarNavigation.className = 'cal__Navigation';

    this.htmlCalendarMonth = document.createElement('div');
    this.htmlCalendarMonth.className = 'cal__Month';

    this.htmlCalendarContainer.append(this.htmlCalendarNavigation, this.htmlCalendarMonth);
  }

  private createMonthTemplate(showWeekNumber: boolean = this.calendarConfig.showWeekNumbers): void {
    // Table
    const monthTable: HTMLTableElement = document.createElement('table');
    monthTable.className = 'cal__MonthTable';

    // Table Head
    const monthTableHead: HTMLTableSectionElement = document.createElement('thead');
    monthTableHead.className = 'cal__MonthTableHead';

    this.calendarDataMonth.weekdaysOrder.forEach((item: ICalendarDataWeekdayName) => {
      const tmpTh: HTMLTableCellElement = document.createElement('th');
      tmpTh.className = 'cal__MonthTableHead__th';

      const tmpSpan: HTMLSpanElement = document.createElement('span');
      tmpSpan.className = 'cal__MonthTableHead__th-span';
      tmpSpan.textContent = item.nameShort;

      tmpTh.appendChild(tmpSpan);
      monthTableHead.appendChild(tmpTh);
    });

    if (showWeekNumber) {
      const tmpTh: HTMLTableCellElement = document.createElement('th');
      tmpTh.className = 'cal__MonthTableHead__th cal__MonthTableHead__th--empty';

      monthTableHead.prepend(tmpTh);
    }

    // Table Body
    const monthTableBody: HTMLTableSectionElement = document.createElement('tbody');
    monthTableBody.className = 'cal__MonthTableBody';

    this.calendarDataMonth.weeks.forEach((week: ICalendarDataWeek) => {
      const row: HTMLTableRowElement = document.createElement('tr');
      row.className = 'cal__MonthTableBody__tr';

      // Create Week Number Cell
      if (showWeekNumber) {
        const tmpTd: HTMLTableCellElement = document.createElement('td');
        tmpTd.className = 'cal__MonthTableBody__td cal__MonthTableBody__td--week-no';

        const tmpSpan: HTMLSpanElement = document.createElement('span');
        tmpSpan.className = 'cal__MonthTableBody__td-span cal__MonthTableBody__td-span--week-no';
        tmpSpan.textContent = `${week.weekNumber}`;
        // tmpTd.
        tmpTd.appendChild(tmpSpan);
        row.appendChild(tmpTd);
      }

      // Create days of the week
      week.weekDays.forEach((day: ICalendarDataDay | null) => {
        // const tmpTd: HTMLTableCellElement = document.createElement('td');
        const tmpTd: HTMLTableCellElementCustom = document.createElement('td');
        tmpTd.calendarDataDay = day;
        tmpTd.className = 'cal__MonthTableBody__td cal__MonthTableBody__td--weekday';

        if (day) {
          tmpTd.classList.add(`cal__MonthTableBody__td--weekday-${day.dayOfWeek}`);
          const isDayOtherMonth: boolean = day.monthIndex !== this.calendarDataMonth.monthIndex;
          const isDayPrevMonth: boolean = this.calendarDataMonth.monthIndex >=1 && day.monthIndex < this.calendarDataMonth.monthIndex;
          const isDayNextMonth: boolean = this.calendarDataMonth.monthIndex <=10 && day.monthIndex > this.calendarDataMonth.monthIndex;
          // tmpTd.prototype.calendarDataDay = day;

          if (isDayOtherMonth) {
            tmpTd.classList.add('is-for-other-month');

            if (isDayPrevMonth) {
              tmpTd.classList.add('is-for-prev-month');
            }

            if (isDayNextMonth) {
              tmpTd.classList.add('is-for-next-month');
            }
          }

          const tmpSpan: HTMLSpanElement = document.createElement('span');
          tmpSpan.className = 'cal__MonthTableBody__td-span cal__MonthTableBody__td-span--weekday';
          tmpSpan.textContent = `${day.dayOfMonth}`;
          tmpTd.appendChild(tmpSpan);
        }

        row.appendChild(tmpTd);
      });


      monthTableBody.append(row);
    });


    monthTable.append(monthTableHead, monthTableBody);

    // this.calendarMonth.removeChild(this.calendarMonthTable);
    // this.calendarMonth.appendChild(monthTable);
    // this.calendarMonthTable = monthTable;
    this.htmlCalendarMonthTable = monthTable;
    this.htmlCalendarMonth.appendChild(this.htmlCalendarMonthTable);
  }

  private overrideConfiguration(newConfig: ICalendarConfiguration): void {
    if (!newConfig) {
      return;
    }

    for (const prop in newConfig) {
      if (prop in this.calendarConfig && this.calendarConfig.hasOwnProperty(prop)) {
        this.calendarConfig[prop] = newConfig[prop];
      }
    }
  }
}
