import {CalendarData, ICalendarDataConfiguration, ICalendarDataMonth, ICalendarDataWeekdayName} from '../classes/calendar-data';

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

  constructor(calendarMainContainerSelector: string, configCalendarData?: ICalendarDataConfiguration) {
    super(configCalendarData);

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

  private createMonthTemplate(showWeekNumber: boolean = false): void {
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

    // const monthRowsWeeksNames: HTMLTableRowElement = document.createElement('tr');
    // monthRowsWeeksNames.className = 'cal__MonthTable__tr'
    // const monthRowsWeeks: HTMLTableRowElement[] = [];

    // this.calendarDataMonth.weekdaysOrder

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
