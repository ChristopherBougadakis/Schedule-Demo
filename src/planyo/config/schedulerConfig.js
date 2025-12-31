/**
 * Scheduler Configuration
 * Custom configuration for react-big-schedule
 */

import { ViewType } from '../../config/default';

export const schedulerConfig = {
  // Layout dimensions
  schedulerWidth: '100%',
  besidesWidth: 20,
  underneathHeight: 20,
  schedulerMaxHeight: 0,
  schedulerContentHeight: '100vh',

  // Responsive settings
  responsiveByParent: false,

  // Table dimensions
  tableHeaderHeight: 50,

  // Resource table widths by view type
  agendaResourceTableWidth: 200,
  dayResourceTableWidth: 200,
  weekResourceTableWidth: '18%',
  monthResourceTableWidth: 180,
  quarterResourceTableWidth: 180,
  yearResourceTableWidth: 180,
  customResourceTableWidth: 180,

  // Cell widths by view type
  dayCellWidth: 40,
  weekCellWidth: '12%',
  monthCellWidth: 80,
  quarterCellWidth: 80,
  yearCellWidth: 80,
  customCellWidth: 80,

  // Max events per cell
  dayMaxEvents: 20,
  weekMaxEvents: 99,
  monthMaxEvents: 99,
  quarterMaxEvents: 99,
  yearMaxEvents: 99,
  customMaxEvents: 99,

  // Event item appearance
  eventItemHeight: 28,
  eventItemLineHeight: 30,
  eventItemPopoverTrigger: 'click', // 'hover' or 'click'
  eventItemPopoverPlacement: 'bottomLeft',
  eventItemPopoverWidth: 350,

  // Time settings
  dayStartFrom: 0, // 12 AM
  dayStopTo: 23,   // 11 PM
  minuteStep: 30,  // 30-minute intervals

  // Colors and styling
  defaultEventBgColor: '#1890ff',
  selectedAreaColor: '#7EC2F3',
  nonWorkingTimeHeadColor: '#999999',
  nonWorkingTimeHeadBgColor: '#fff0f6',
  nonWorkingTimeBodyBgColor: '#fff0f6',
  summaryColor: '#666',
  groupOnlySlotColor: '#f5f5f5',

  // Feature flags
  startResizable: true,
  endResizable: true,
  movable: true,
  creatable: true,
  crossResourceMove: true,
  checkConflict: true, // Enable conflict detection
  scrollToSpecialDayjsEnabled: true,
  eventItemPopoverEnabled: true,
  eventItemPopoverShowColor: true,
  calendarPopoverEnabled: true,
  recurringEventsEnabled: true,
  viewChangeSpinEnabled: true,
  dateChangeSpinEnabled: true,
  headerEnabled: true,
  resourceViewEnabled: true,
  displayWeekend: true,
  relativeMove: true,
  defaultExpanded: true,
  dragAndDropEnabled: true,

  // Timeout for header events
  schedulerHeaderEventsFuncsTimeoutMs: 100,

  // Resource and task labels
  resourceName: 'Service',
  taskName: 'Reservation',
  agendaViewHeader: 'Reservations',

  // Date formats
  addMorePopoverHeaderFormat: 'MMM D, YYYY dddd',
  eventItemPopoverDateFormat: 'MMM D',
  nonAgendaDayCellHeaderFormat: 'ha',
  nonAgendaWeekCellHeaderFormat: 'M/D',
  nonAgendaMonthCellHeaderFormat: 'MMM YYYY',
  nonAgendaYearCellHeaderFormat: 'YYYY',
  nonAgendaOtherCellHeaderFormat: 'ddd M/D',

  // Available views
  views: [
    { viewName: 'Day', viewType: ViewType.Day, showAgenda: false, isEventPerspective: false },
    { viewName: 'Week', viewType: ViewType.Week, showAgenda: false, isEventPerspective: false },
    { viewName: 'Month', viewType: ViewType.Month, showAgenda: false, isEventPerspective: false },
  ],
};

export default schedulerConfig;
