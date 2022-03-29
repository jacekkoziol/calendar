import {CalendarData, ICalendarDataConfiguration, ICalendarDataMonth} from '../classes/calendar-data';

export class Calendar extends CalendarData {
  private calendarDataMonth: ICalendarDataMonth;
  private currentDate: Date = new Date();

  private calendarContainer: HTMLDivElement;
  private calendarNavigation: HTMLDivElement;
  private calendarMonth: HTMLDivElement;
  // private calendarTable: HTML;

  constructor(calendarMainContainerSelector: string, config?: ICalendarDataConfiguration) {
    super(config);

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

  private createMothTemplate(): void {
    // const table
    const monthTable: HTMLTableElement = document.createElement('table');
    monthTable.className = 'cal__MonthTable';
  }
}
