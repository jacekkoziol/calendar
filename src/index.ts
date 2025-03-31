import './styles/style.css';
import './styles/calendar.css';

import {
  CalendarData,
  ICalendarDataConfiguration,
  ICalendarDataMonthsNamesDictionary,
  ICalendarDataWeekdaysDictionary,
} from './classes/calendar-data';
import {Calendar, ICalendarConfiguration} from './components/calendar';

console.log('Works');
// Check creating Calendar Data
console.log('%c--START-------- Calendar Data Initialization Test', 'color: purple');
const calendarDataInstance: CalendarData = new CalendarData();
calendarDataInstance.createMonthAsWeeks(11, 2022);
console.log('%c--END---------- Calendar Data Initialization Test', 'color: purple');
console.log('\n\n\n\n');

// Initialize Calendar Default
// -----------------------------------------------------------------------------
const calendar: Calendar = new Calendar('[data-js-calendar-default]');
console.log('Calendar: ', calendar);
console.log('\n\n\n\n');


// Initialize Calendar Second
// -----------------------------------------------------------------------------
const calendarDataConfigurationSecond: ICalendarDataConfiguration = {
  // dictionaryMonths: CALENDAR_DATA_MONTHS_NAMES_DICTIONARY_PL,
  // dictionaryWeekdays: CALENDAR_DATA_WEEKDAYS_NAMES_DICTIONARY_PL,
  startWeekWithDay: 0,
  fillWeekMissingDaysWithDaysFromAdjacentMonths: false,
  weekNumberAdjust: false,
};

const calendarConfigurationSecond: ICalendarConfiguration = {
  initialDate: new Date('2025-01-01'),
  showWeekNumbers: true,
};

const calendarSecond: Calendar = new Calendar('[data-js-calendar-second]', calendarConfigurationSecond, calendarDataConfigurationSecond);
console.log('calendarSecond: ', calendarSecond);
console.log('\n\n\n\n');


// Initialize Calendar Second
// -----------------------------------------------------------------------------
export const CALENDAR_DATA_MONTHS_NAMES_DICTIONARY_PL: ICalendarDataMonthsNamesDictionary = {
  0: {nameShort: 'Sty', nameFull: 'Styczeń'},
  1: {nameShort: 'Lut', nameFull: 'Luty'},
  2: {nameShort: 'Mar', nameFull: 'Marzec'},
  3: {nameShort: 'Kwi', nameFull: 'Kwiecień'},
  4: {nameShort: 'Maj', nameFull: 'Maj'},
  5: {nameShort: 'Cze', nameFull: 'Czerwiec'},
  6: {nameShort: 'Lip', nameFull: 'Lipiec'},
  7: {nameShort: 'Sie', nameFull: 'Sierpień'},
  8: {nameShort: 'Wrz', nameFull: 'Wrzesień'},
  9: {nameShort: 'Paź', nameFull: 'Październik'},
  10: {nameShort: 'Lis', nameFull: 'Listopad'},
  11: {nameShort: 'Gru', nameFull: 'Grudzień'},
};

export const CALENDAR_DATA_WEEKDAYS_NAMES_DICTIONARY_PL: ICalendarDataWeekdaysDictionary = {
  0: {nameShort: 'Nie', nameFull: 'Niedziela'},
  1: {nameShort: 'Pon', nameFull: 'Poniedziałek'},
  2: {nameShort: 'Wto', nameFull: 'Wtorek'},
  3: {nameShort: 'Śro', nameFull: 'Środa'},
  4: {nameShort: 'Czw', nameFull: 'Czwartek'},
  5: {nameShort: 'Pią', nameFull: 'Piątek'},
  6: {nameShort: 'Sob', nameFull: 'Sobota'},
};

const calendarDataConfigurationPL: ICalendarDataConfiguration = {
  dictionaryMonths: CALENDAR_DATA_MONTHS_NAMES_DICTIONARY_PL,
  dictionaryWeekdays: CALENDAR_DATA_WEEKDAYS_NAMES_DICTIONARY_PL,
  startWeekWithDay: 0,
  fillWeekMissingDaysWithDaysFromAdjacentMonths: true,
  weekNumberAdjust: false,
};

const calendarConfigurationPL: ICalendarConfiguration = {
  initialDate: new Date('2025-01-01'), // new Date('2021-07-01')
  showWeekNumbers: true,
};

const calendarPL: Calendar = new Calendar('[data-js-calendar-pl]', calendarConfigurationPL, calendarDataConfigurationPL);
console.log('calendarSecond: ', calendarPL);
console.log('\n\n\n\n');
