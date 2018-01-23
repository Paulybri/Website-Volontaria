import { Component } from '@angular/core';
import {EventService} from "../../../services/event.service";
import { Event } from "../../../models/event";
import {TasktypeService} from "../../../services/tasktype.service";
import {Tasktype} from "../../../models/tasktype";
import {CellService} from "../../../services/cell.service";
import {Cell} from "../../../models/cell";
import {User} from "../../../models/user";
import {AuthenticationService} from "../../../services/authentication.service";


@Component({
  templateUrl: 'activities-page.component.html',
  selector: 'activities-page',
  styleUrls: ['activities-page.component.scss']
})
export class ActivitiesPageComponent {

  user: User;
  events: Event[];
  tasktypes: Tasktype[];
  cells: Cell[];

  filteredEvents: Event[];
  tasktypeFilter: any = [];
  cellFilter: any = [];

  constructor(private eventService:EventService,
              private tasktypeService:TasktypeService,
              private cellService:CellService,
              private authenticationService:AuthenticationService)
  {
    this.user = this.authenticationService.getProfile();

    this.eventService.getEvents().subscribe(
      data => {
        this.events = data.results.map(e => new Event(e) );
        this.filter();
      }
    );

    this.tasktypeService.getTasktypes().subscribe(
      data => {
        this.tasktypes = data.results.map(t => new Tasktype(t) );
      }
    );

    this.cellService.getCells().subscribe(
      data => {
        this.cells = data.results.map(c => new Cell(c) );
      }
    );
  }

  filter() {
    this.filteredEvents = [];
    var eventFiltered = [];

    for (let event in this.events) {
      if ( new Date(this.events[event].start_date).getTime() > new Date().getTime()) {
        // If no task_type filter or filter is verified
        if (this.tasktypeFilter.length == 0 || this.events[event].task_type.id in this.tasktypeFilter || this.events[event].task_type.id == this.tasktypeFilter) {
          // If no cell filter or filter is verified
          if (this.cellFilter.length == 0 || this.events[event].cell.id in this.cellFilter || this.events[event].cell.id == this.cellFilter) {
            eventFiltered.push(this.events[event]);
          }
        }
      }
    }

    // If no filters, we take all events
    if (this.cellFilter.length == 0 && this.tasktypeFilter.length == 0) {
      for (let event in this.events) {
        if (new Date(this.events[event].start_date).getTime() > new Date().getTime()) {
          this.filteredEvents.push(this.events[event]);
        }
      }
    } else {
      this.filteredEvents = eventFiltered;
    }
  }
}
