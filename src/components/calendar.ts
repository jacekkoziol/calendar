import {
  CalendarData,
  ICalendarDataConfiguration,
  ICalendarDataDay,
  ICalendarDataMonth,
  ICalendarDataMonthsListItem,
  ICalendarDataWeek,
  ICalendarDataWeekdayName,
} from '../classes/calendar-data';

export interface ICalendarConfiguration {
  [key: string]: any;
  showWeekNumbers?: boolean
}

// interface HTMLTableCellElementCustom extends HTMLTableCellElement {
//   calendarDataDay?: ICalendarDataDay,
// }

declare global {
  // eslint-disable-next-line no-unused-vars
  interface HTMLTableCellElement {
    calendarDataDay: ICalendarDataDay,
    calendarInstance: () => Calendar
  }
}

// export interface ICalendarCSS {
//   calendarClassPrefix: string;
//   calendarContainer: string;
//   calendarNavigationContainer: string;
//   calendarContentContainer: string;
//   calendarContentTable: string;
//   calendarContentTableHead: string;
//   calendarContentTableBody: string;
// }

export class Calendar extends CalendarData {
  private calendarDataMonth: ICalendarDataMonth;
  private currentDate: Date = new Date();

  // private calendarMothsOptions: ICalendarOptionMonth[] = [];

  private htmlCalendarContainer: HTMLDivElement;
  private htmlCalendarNavigation: HTMLDivElement;
  private htmlCalendarMonth: HTMLDivElement;
  private htmlCalendarMonthTable: HTMLTableElement;

  private htmlCalendarNavigationMonthSelect: HTMLSelectElement;
  private htmlCalendarNavigationYearSelect: HTMLSelectElement;

  private selectedMonthIndex: number;
  private selectedYear: number;

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

    this.currentDate.setHours(0, 0, 0, 0);
    // this.calendarDataMonth = this.createMonthAsWeeks(this.currentDate.getMonth(), this.currentDate.getFullYear());

    this.selectedMonthIndex = this.currentDate.getMonth();
    this.selectedYear = this.currentDate.getFullYear();

    this.createCalendarCoreTemplate();
    this.createCalendarNavigation();
    mainCalendarContainer.appendChild(this.htmlCalendarContainer);


    this.showMonth(this.selectedMonthIndex, this.selectedYear);
    this.initCalendarMonthEventHandler();
  }

  private createCalendarCoreTemplate(): void {
    this.htmlCalendarContainer = document.createElement('div');
    this.htmlCalendarContainer.className = 'cal__Container';

    this.htmlCalendarNavigation = document.createElement('div');
    this.htmlCalendarNavigation.className = 'cal__Navigation';

    this.htmlCalendarMonth = document.createElement('div');
    this.htmlCalendarMonth.className = 'cal__Month';

    this.htmlCalendarContainer.append(this.htmlCalendarNavigation, this.htmlCalendarMonth);
  }

  private createMonthTableTemplate(showWeekNumber: boolean = this.calendarConfig.showWeekNumbers): HTMLTableElement {
    // Table
    const monthTable: HTMLTableElement = document.createElement('table');
    monthTable.className = 'cal__MonthTable';
    const monthTableHead: HTMLTableSectionElement = this.createMonthTableTemplateHead(showWeekNumber);
    const monthTableBody: HTMLTableSectionElement = this.createMonthTableTemplateBody(showWeekNumber);
    monthTable.append(monthTableHead, monthTableBody);
    return monthTable;
  }

  private createMonthTableTemplateHead(addWeekNumberColumn: boolean): HTMLTableSectionElement {
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

    if (addWeekNumberColumn) {
      const tmpTh: HTMLTableCellElement = document.createElement('th');
      tmpTh.className = 'cal__MonthTableHead__th cal__MonthTableHead__th--empty';

      monthTableHead.prepend(tmpTh);
    }

    return monthTableHead;
  }

  private createMonthTableTemplateBody(addWeekNumberColumn: boolean): HTMLTableSectionElement {
    const monthTableBody: HTMLTableSectionElement = document.createElement('tbody');
    monthTableBody.className = 'cal__MonthTableBody';

    this.calendarDataMonth.weeks.forEach((week: ICalendarDataWeek) => {
      const row: HTMLTableRowElement = document.createElement('tr');
      row.className = 'cal__MonthTableBody__tr';

      if (addWeekNumberColumn) {
        const tmpTd: HTMLTableCellElement = document.createElement('td');
        tmpTd.className = 'cal__MonthTableBody__td cal__MonthTableBody__td--week-no';

        const tmpSpan: HTMLSpanElement = document.createElement('span');
        tmpSpan.className = 'cal__MonthTableBody__td-span cal__MonthTableBody__td-span--week-no';
        tmpSpan.textContent = `${week.weekNumber}`;
        tmpTd.appendChild(tmpSpan);
        row.appendChild(tmpTd);
      }

      // Create days of the week
      week.weekDays.forEach((day: ICalendarDataDay | null) => {
        const tmpTd: HTMLTableCellElement = document.createElement('td');
        HTMLTableCellElement.prototype.calendarInstance = () => this;
        tmpTd.calendarDataDay = day;
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

    return monthTableBody;
  }

  // Calendar Navigation
  // ---------------------------------------------------------------------------
  private createCalendarNavigation(): void {
    // Month Selector
    const selectMonth: HTMLSelectElement = this.createCalendarNavigationMonthSelector();
    this.htmlCalendarNavigationMonthSelect = selectMonth;
    this.htmlCalendarNavigation.append(selectMonth);

    // Year Selector
    const selectYear: HTMLSelectElement = this.createCalendarNavigationYearSelector();

    this.htmlCalendarNavigationYearSelect = selectYear;
    this.htmlCalendarNavigation.append(selectYear);
  }

  private createCalendarNavigationMonthSelector(): HTMLSelectElement {
    const selectMonth: HTMLSelectElement = document.createElement('select');

    this.monthsList.forEach((month: ICalendarDataMonthsListItem) => {
      const tmpOption: HTMLOptionElement = document.createElement('option');
      tmpOption.value = String(month.monthIndex);
      tmpOption.text = month.nameFull;

      if (month.monthIndex === this.selectedMonthIndex) {
        tmpOption.selected = true;
      }

      selectMonth.add(tmpOption);
    });

    // Add Event Handler
    selectMonth.addEventListener('change', (e: Event) => {
      const tmpSelect: HTMLSelectElement = this.getEventTarget(e) as HTMLSelectElement;
      this.selectedMonthIndex = Number(tmpSelect.value);
      this.showMonth(this.selectedMonthIndex, this.selectedYear);
    }, false);

    return selectMonth;
  }

  private createCalendarNavigationYearSelector(): HTMLSelectElement {
    const selectYear: HTMLSelectElement = document.createElement('select');
    const yearsStart: number = this.currentDate.getFullYear() + 5;
    const yearsEnd: number = yearsStart - 100;

    for (let year: number = yearsStart; year >= yearsEnd; year--) {
      const tmpOption: HTMLOptionElement = document.createElement('option');
      tmpOption.value = String(year);
      tmpOption.text = String(year);

      if (year === this.selectedYear) {
        tmpOption.selected = true;
      }

      selectYear.add(tmpOption);
    }

    // Add Event Handler
    selectYear.addEventListener('change', (e: Event) => {
      const tmpSelect: HTMLSelectElement = this.getEventTarget(e) as HTMLSelectElement;
      this.selectedYear = Number(tmpSelect.value);
      this.showMonth(this.selectedMonthIndex, this.selectedYear);
    }, false);

    return selectYear;
  }

  //
  // ---------------------------------------------------------------------------
  private showMonth(monthIndex: number = this.selectedMonthIndex, year: number = this.selectedYear): void {
    console.log('Show month', monthIndex, year);
    this.calendarDataMonth = this.createMonthAsWeeks(monthIndex, year);
    const tmpMonthTable: HTMLTableElement = this.createMonthTableTemplate();
    if (this.htmlCalendarMonthTable) {
      this.htmlCalendarMonth.removeChild(this.htmlCalendarMonthTable);
    }
    this.htmlCalendarMonthTable = this.htmlCalendarMonth.appendChild(tmpMonthTable);
  }


  // Calendar Month Actions
  // ---------------------------------------------------------------------------
  private initCalendarMonthEventHandler(): void {
    this.htmlCalendarMonth.addEventListener('click', (e: PointerEvent) => {
      const tmpDay: HTMLTableCellElement = this.getEventTarget(e) as HTMLTableCellElement;
      console.log(tmpDay);

      if (tmpDay.classList.contains('cal__MonthTableBody__td--weekday')) {
        console.log('Allow return value');
        console.log(tmpDay.calendarDataDay);

        this.selectedMonthIndex = tmpDay.calendarDataDay.monthIndex;
        this.selectedYear = tmpDay.calendarDataDay.year;

        this.htmlCalendarNavigationMonthSelect.value = String(this.selectedMonthIndex);
        this.htmlCalendarNavigationYearSelect.value = String(this.selectedYear);

        // this.showMonth();
      }
    }, false);
  }


  // Configuration
  // ---------------------------------------------------------------------------
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

  // Utilities
  // ---------------------------------------------------------------------------
  private getEventTarget(event: Event): EventTarget | null {
    try {
      if (typeof event.composedPath === 'function') {
        const path = event.composedPath();
        return path[0];
      }
      return event.target;
    } catch (error) {
      return event.target;
    }
  }
}
