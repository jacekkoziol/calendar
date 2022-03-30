import {CalendarData, ICalendarDataConfiguration, ICalendarDataDay, ICalendarDataMonth, ICalendarDataWeek, ICalendarDataWeekdayName} from '../classes/calendar-data';

export interface ICalendarConfiguration {
  [key: string]: any;
  showWeekNumbers?: boolean
}

export class Calendar extends CalendarData {
  private calendarDataMonth: ICalendarDataMonth;
  private currentDate: Date = new Date();

  private calendarContainer: HTMLDivElement;
  private calendarNavigation: HTMLDivElement;
  private calendarMonth: HTMLDivElement;
  private calendarMonthTable: HTMLTableElement;

  private config: ICalendarConfiguration = {
    showWeekNumbers: false,
  };

  constructor(
    calendarMainContainerSelector: string,
    configCalendar?: ICalendarConfiguration,
    configCalendarData?: ICalendarDataConfiguration) {
    super(configCalendarData);
    this.overrideConfiguration(configCalendar);

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
    mainCalendarContainer.appendChild(this.calendarContainer);
    this.createMonthTemplate();
  }

  private createCalendarTemplate(): void {
    this.calendarContainer = document.createElement('div');
    this.calendarContainer.className = 'cal__Container';

    this.calendarNavigation = document.createElement('div');
    this.calendarNavigation.className = 'cal__Navigation';

    this.calendarMonth = document.createElement('div');
    this.calendarMonth.className = 'cal__Month';

    this.calendarContainer.append(this.calendarNavigation, this.calendarMonth);
  }

  private createMonthTemplate(showWeekNumber: boolean = this.config.showWeekNumbers): void {
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
      tmpSpan.textContent = item.shortName;

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
    monthTableHead.className = 'cal__MonthTableBody';

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
        const tmpTd: HTMLTableCellElement = document.createElement('td');
        tmpTd.className = 'cal__MonthTableBody__td cal__MonthTableBody__td--weekday';

        if (day) {
          tmpTd.classList.add(`cal__MonthTableBody__td--weekday-${day.dayOfWeek}`);
          const isDayOtherMonth: boolean = day.monthIndex !== this.calendarDataMonth.monthIndex;
          const isDayPrevMonth: boolean = this.calendarDataMonth.monthIndex >=1 && day.monthIndex < this.calendarDataMonth.monthIndex;
          const isDayNextMonth: boolean = this.calendarDataMonth.monthIndex <=10 && day.monthIndex > this.calendarDataMonth.monthIndex;

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
    this.calendarMonthTable = monthTable;
    this.calendarMonth.appendChild(this.calendarMonthTable);
  }

  private overrideConfiguration(newConfig: ICalendarConfiguration): void {
    for (const prop in newConfig) {
      if (prop in this.config && this.config.hasOwnProperty(prop)) {
        this.config[prop] = newConfig[prop];
      }
    }
  }
}
