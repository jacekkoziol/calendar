import {
  CalendarData,
  ICalendarDataConfiguration,
  ICalendarDataMonthsNamesDictionary,
  ICalendarDataWeekdaysDictionary,
} from './classes/calendar-data';

console.log('Works');

export const CALENDAR_DATA_MONTHS_NAMES_DICTIONARY_PL: ICalendarDataMonthsNamesDictionary = {
  0: {shortName: 'Sty', fullName: 'Styczeń'},
  1: {shortName: 'Lut', fullName: 'Luty'},
  2: {shortName: 'Mar', fullName: 'Marzec'},
  3: {shortName: 'Kwi', fullName: 'Kwiecień'},
  4: {shortName: 'Maj', fullName: 'Maj'},
  5: {shortName: 'Cze', fullName: 'Czerwiec'},
  6: {shortName: 'Lip', fullName: 'Lipiec'},
  7: {shortName: 'Sie', fullName: 'Sierpień'},
  8: {shortName: 'Wrz', fullName: 'Wrzesień'},
  9: {shortName: 'Paź', fullName: 'Październik'},
  10: {shortName: 'Lis', fullName: 'Listopad'},
  11: {shortName: 'Gru', fullName: 'Grudzień'},
};

export const CALENDAR_DATA_WEEKDAYS_NAMES_DICTIONARY_PL: ICalendarDataWeekdaysDictionary = {
  0: {shortName: 'Nie', fullName: 'Niedziela'},
  1: {shortName: 'Pon', fullName: 'Poniedziałek'},
  2: {shortName: 'Wto', fullName: 'Wtorek'},
  3: {shortName: 'Śro', fullName: 'Środa'},
  4: {shortName: 'Czw', fullName: 'Czwartek'},
  5: {shortName: 'Pią', fullName: 'Piątek'},
  6: {shortName: 'Sob', fullName: 'Sobota'},
};

const configuration: ICalendarDataConfiguration = {
  dictionaryMonths: CALENDAR_DATA_MONTHS_NAMES_DICTIONARY_PL,
  dictionaryWeekdays: CALENDAR_DATA_WEEKDAYS_NAMES_DICTIONARY_PL,
  startWeekWithDay: 0,
  fillWeekMissingDaysWithDaysFromAdjacentMonths: true,
  weekNumberAdjust: false,
};

const calendarDataInstance: CalendarData = new CalendarData(configuration);
calendarDataInstance.createMonthAsWeeks(11, 2022);

