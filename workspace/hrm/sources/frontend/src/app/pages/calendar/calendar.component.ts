import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

declare const FullCalendar: any;
declare const Swal: any;

export interface CalendarEventModel {
  id: string;
  title: string;
  description?: string;
  location?: string;
  start: string;
  end?: string;
  allDay: boolean;
  className?: string;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements AfterViewInit, OnDestroy {
  @ViewChild('calendarRef', { static: false }) calendarRef!: ElementRef;
  private cdr = inject(ChangeDetectorRef);

  calendarInstance: any = null;

  // Add / Edit Modal state
  isAddModalOpen = false;
  modalMode: 'add' | 'edit' = 'add';
  
  formData = {
    id: '',
    name: '',
    description: '',
    location: '',
    allDay: false,
    startDate: '',
    startTime: '10:00',
    endDate: '',
    endTime: '12:00',
    color: 'primary'
  };

  // View Event Modal state
  isViewModalOpen = false;
  viewingEvent: {
    id: string;
    title: string;
    description: string;
    location: string;
    allDay: boolean;
    startDateFormatted: string;
    endDateFormatted: string;
  } | null = null;

  ngAfterViewInit(): void {
    this.initCalendar();
  }

  ngOnDestroy(): void {
    if (this.calendarInstance) {
      this.calendarInstance.destroy();
      this.calendarInstance = null;
    }
  }

  private initCalendar(): void {
    const FC = (typeof FullCalendar !== 'undefined' ? FullCalendar : (window as any).FullCalendar);
    const calendarEl = this.calendarRef?.nativeElement || document.getElementById('kt_calendar_app');

    if (!FC || !calendarEl) {
      setTimeout(() => this.initCalendar(), 150);
      return;
    }

    if (this.calendarInstance) {
      try {
        this.calendarInstance.destroy();
      } catch (e) {}
      this.calendarInstance = null;
    }

    const today = new Date();
    const y = today.getFullYear();
    const m = (today.getMonth() + 1).toString().padStart(2, '0');
    const d = today.getDate().toString().padStart(2, '0');
    const todayStr = `${y}-${m}-${d}`;

    const prevDate = new Date(today);
    prevDate.setDate(today.getDate() - 1);
    const prevStr = prevDate.toISOString().split('T')[0];

    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + 1);
    const nextStr = nextDate.toISOString().split('T')[0];

    const defaultEvents: CalendarEventModel[] = [
      {
        id: '1',
        title: 'All Day Kickoff Event',
        start: `${y}-${m}-01`,
        end: `${y}-${m}-02`,
        description: 'Monthly company wide status update and executive briefing',
        className: 'fc-event-danger fc-event-solid-warning',
        location: 'Federation Hall',
        allDay: true
      },
      {
        id: '2',
        title: 'Company Trip Planning',
        start: `${y}-${m}-02`,
        end: `${y}-${m}-03`,
        description: 'Finalize hotel booking, team flights and schedule itinerary',
        className: 'fc-event-primary',
        location: 'Seoul, South Korea',
        allDay: true
      },
      {
        id: '3',
        title: 'ICT Expo 2026 - Product Release',
        start: `${y}-${m}-04`,
        end: `${y}-${m}-06`,
        description: 'Official keynote demonstration and press release release',
        className: 'fc-event-light fc-event-solid-primary',
        location: 'Melbourne Exhibition Centre',
        allDay: true
      },
      {
        id: '4',
        title: 'Sprint Planning Meeting',
        start: `${todayStr}T10:30:00`,
        end: `${todayStr}T12:00:00`,
        description: 'Refine backlog, estimate story points and assign engineering tickets',
        className: 'fc-event-success',
        location: 'Room 304 / Google Meet',
        allDay: false
      },
      {
        id: '5',
        title: 'Team Lunch',
        start: `${todayStr}T12:00:00`,
        end: `${todayStr}T13:30:00`,
        className: 'fc-event-info',
        description: 'Casual company lunch and networking session',
        location: 'Central Cafeteria',
        allDay: false
      },
      {
        id: '6',
        title: 'Client Demo: Mobile Banking App',
        start: `${todayStr}T14:30:00`,
        end: `${todayStr}T16:00:00`,
        className: 'fc-event-warning',
        description: 'Interactive walkthrough of UI/UX improvements and payment flows',
        location: 'Executive Boardroom',
        allDay: false
      },
      {
        id: '7',
        title: 'Happy Hour & Social',
        start: `${todayStr}T17:30:00`,
        end: `${todayStr}T20:00:00`,
        className: 'fc-event-info',
        description: 'Team celebration for completing Phase 5 milestones',
        location: 'Sky Lounge Downtown',
        allDay: false
      },
      {
        id: '8',
        title: 'Conference Keynote',
        start: `${prevStr}T09:00:00`,
        end: `${nextStr}T18:00:00`,
        description: 'Global Developers Summit presentations',
        className: 'fc-event-primary',
        location: 'Convention Center Room A',
        allDay: false
      },
      {
        id: '9',
        title: 'Birthday Celebration Dinner',
        start: `${nextStr}T18:30:00`,
        end: `${nextStr}T21:30:00`,
        className: 'fc-event-solid-danger fc-event-light',
        description: 'Celebration dinner at New York Steakhouse',
        location: 'New York Steakhouse',
        allDay: false
      }
    ];

    this.calendarInstance = new FC.Calendar(calendarEl, {
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      initialDate: todayStr,
      navLinks: true,
      selectable: true,
      selectMirror: true,
      editable: true,
      dayMaxEvents: true,
      events: defaultEvents,
      select: (selectionInfo: any) => {
        this.handleDateSelect(selectionInfo);
      },
      eventClick: (clickInfo: any) => {
        this.handleEventClick(clickInfo);
      }
    });

    this.calendarInstance.render();
  }

  // User clicked/dragged a date cell or range on FullCalendar
  private handleDateSelect(selectionInfo: any): void {
    const startIso = selectionInfo.startStr.split('T')[0];
    let endIso = selectionInfo.endStr ? selectionInfo.endStr.split('T')[0] : startIso;

    // FullCalendar end date is exclusive for all-day selections
    if (selectionInfo.allDay && selectionInfo.end) {
      const adjustedEnd = new Date(selectionInfo.end);
      adjustedEnd.setDate(adjustedEnd.getDate() - 1);
      endIso = adjustedEnd.toISOString().split('T')[0];
    }

    this.modalMode = 'add';
    this.formData = {
      id: '',
      name: '',
      description: '',
      location: '',
      allDay: selectionInfo.allDay,
      startDate: startIso,
      startTime: '09:00',
      endDate: endIso >= startIso ? endIso : startIso,
      endTime: '10:00',
      color: 'primary'
    };

    this.isAddModalOpen = true;
    this.cdr.detectChanges();
  }

  // User clicked on an existing event pill in FullCalendar
  private handleEventClick(clickInfo: any): void {
    const e = clickInfo.event;
    const startStr = e.start ? e.start.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: e.allDay ? undefined : 'short' }) : '';
    const endStr = e.end ? e.end.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: e.allDay ? undefined : 'short' }) : startStr;

    this.viewingEvent = {
      id: e.id,
      title: e.title,
      description: e.extendedProps?.description || '--',
      location: e.extendedProps?.location || '--',
      allDay: e.allDay,
      startDateFormatted: startStr,
      endDateFormatted: endStr
    };

    this.isViewModalOpen = true;
    this.cdr.detectChanges();
  }

  // Open Add Event modal from the top toolbar button
  openAddModal(): void {
    const today = new Date().toISOString().split('T')[0];
    this.modalMode = 'add';
    this.formData = {
      id: '',
      name: '',
      description: '',
      location: '',
      allDay: false,
      startDate: today,
      startTime: '10:00',
      endDate: today,
      endTime: '11:00',
      color: 'primary'
    };
    this.isAddModalOpen = true;
    this.cdr.detectChanges();
  }

  // Close Add / Edit Event modal
  closeAddModal(): void {
    this.isAddModalOpen = false;
    this.cdr.detectChanges();
  }

  // Switch from View Modal to Edit Form
  editViewingEvent(): void {
    if (!this.viewingEvent || !this.calendarInstance) return;

    const event = this.calendarInstance.getEventById(this.viewingEvent.id);
    if (!event) return;

    const startIso = event.start ? event.start.toISOString().split('T')[0] : '';
    const startTime = event.start ? event.start.toTimeString().substring(0, 5) : '09:00';
    const endIso = event.end ? event.end.toISOString().split('T')[0] : startIso;
    const endTime = event.end ? event.end.toTimeString().substring(0, 5) : '10:00';

    this.modalMode = 'edit';
    this.formData = {
      id: event.id,
      name: event.title,
      description: event.extendedProps?.description || '',
      location: event.extendedProps?.location || '',
      allDay: event.allDay,
      startDate: startIso,
      startTime: startTime,
      endDate: endIso,
      endTime: endTime,
      color: 'primary'
    };

    this.isViewModalOpen = false;
    this.isAddModalOpen = true;
    this.cdr.detectChanges();
  }

  // Delete event with confirmation
  deleteViewingEvent(): void {
    if (!this.viewingEvent || !this.calendarInstance) return;

    const eventId = this.viewingEvent.id;
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        text: "Are you sure you would like to delete this event?",
        icon: "warning",
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, return",
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-active-light"
        }
      }).then((result: any) => {
        if (result.isConfirmed) {
          const event = this.calendarInstance.getEventById(eventId);
          if (event) {
            event.remove();
          }
          this.isViewModalOpen = false;
          this.viewingEvent = null;
          this.cdr.detectChanges();

          Swal.fire({
            text: "Your event has been deleted!",
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            customClass: { confirmButton: "btn btn-primary" }
          });
        }
      });
    } else {
      if (confirm(`Are you sure you would like to delete "${this.viewingEvent.title}"?`)) {
        const event = this.calendarInstance.getEventById(eventId);
        if (event) {
          event.remove();
        }
        this.isViewModalOpen = false;
        this.viewingEvent = null;
        this.cdr.detectChanges();
      }
    }
  }

  // Save event (either Add or Edit)
  saveEvent(): void {
    if (!this.formData.name.trim()) {
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          text: "Event name is required!",
          icon: "error",
          buttonsStyling: false,
          confirmButtonText: "Ok, got it!",
          customClass: { confirmButton: "btn btn-primary" }
        });
      } else {
        alert('Please provide an event name.');
      }
      return;
    }
    if (!this.formData.startDate) {
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          text: "Start date is required!",
          icon: "error",
          buttonsStyling: false,
          confirmButtonText: "Ok, got it!",
          customClass: { confirmButton: "btn btn-primary" }
        });
      } else {
        alert('Please select a start date.');
      }
      return;
    }

    let startIso: string;
    let endIso: string;

    if (this.formData.allDay) {
      startIso = this.formData.startDate;
      const endD = new Date(this.formData.endDate || this.formData.startDate);
      endD.setDate(endD.getDate() + 1);
      endIso = endD.toISOString().split('T')[0];
    } else {
      startIso = `${this.formData.startDate}T${this.formData.startTime || '09:00'}:00`;
      const endDate = this.formData.endDate || this.formData.startDate;
      endIso = `${endDate}T${this.formData.endTime || '10:00'}:00`;
    }

    const eventClass = this.formData.color.startsWith('solid-')
      ? `fc-event-${this.formData.color}`
      : `fc-event-${this.formData.color}`;

    if (this.modalMode === 'edit') {
      const existing = this.calendarInstance.getEventById(this.formData.id);
      if (existing) {
        existing.remove();
      }
    }

    const newId = this.modalMode === 'edit' ? this.formData.id : Date.now().toString();

    this.calendarInstance.addEvent({
      id: newId,
      title: this.formData.name,
      start: startIso,
      end: endIso,
      allDay: this.formData.allDay,
      className: eventClass,
      description: this.formData.description,
      location: this.formData.location
    });

    const isEdit = this.modalMode === 'edit';
    this.isAddModalOpen = false;
    this.cdr.detectChanges();

    if (typeof Swal !== 'undefined') {
      Swal.fire({
        text: isEdit ? "Event updated successfully!" : "New event added to calendar!",
        icon: "success",
        buttonsStyling: false,
        confirmButtonText: "Ok, got it!",
        customClass: { confirmButton: "btn btn-primary" }
      });
    }
  }
}
