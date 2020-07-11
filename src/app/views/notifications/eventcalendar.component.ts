
import { CommonService } from '../../common.service';
import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'mwl-demo-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // styleUrls: ['styles.css'],
  templateUrl: 'eventcalendar.component.html'
})
export class EventCalendarComponent {
  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  refresh: Subject<any> = new Subject();
  events: any;
  items: any =[];
  empid: any;
  empname: any;
  value1: any;
  data: any;
  activeDayIsOpen: boolean = false;
  constructor(private modal: NgbModal, private commonservice: CommonService) { }
  ngOnInit() {

    this.empid = localStorage.getItem("id");
    this.empname = localStorage.getItem("empname");
    this.commonservice.mappedgetEvent().subscribe(res => {
      for (let i = 0; i < Object.keys(res).length; i++) {
        // console.log(res[i]);
        this.items.push({
        // this.events.push({
        // this.items = [{
          start: startOfDay(new Date(res[i].start)),
          end: endOfDay(new Date(res[i].end)),
          title: res[i].title,
          color: {
            primary: res[i].primary,
            secondary: res[i].secondary
          },
          draggable: false
        // }]
        })
      }
      this.events = this.items;
    })
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}

