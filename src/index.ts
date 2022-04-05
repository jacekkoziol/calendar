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

const calendarDataConfiguration: ICalendarDataConfiguration = {
  dictionaryMonths: CALENDAR_DATA_MONTHS_NAMES_DICTIONARY_PL,
  dictionaryWeekdays: CALENDAR_DATA_WEEKDAYS_NAMES_DICTIONARY_PL,
  startWeekWithDay: 0,
  fillWeekMissingDaysWithDaysFromAdjacentMonths: true,
  weekNumberAdjust: false,
};

const calendarDataInstance: CalendarData = new CalendarData();
calendarDataInstance.createMonthAsWeeks(11, 2022);

// Initialize Calendar
// -----------------------------------------------------------------------------
const calendarConfiguration: ICalendarConfiguration = {
  showWeekNumbers: true,
};

const calendar: Calendar = new Calendar('[data-js-calendar]', calendarConfiguration, calendarDataConfiguration);
console.log(calendar);
