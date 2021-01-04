import { Component, ViewEncapsulation, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment';

import { SantaDatePicker } from '../../models/form-models.interface';

@Component({
  selector: 'santa-datepicker',
  templateUrl: './santa-datepicker.form.container.html',
  styleUrls: ['./santa-datepicker.form.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class SantaDatepicker implements OnInit {
  @ViewChild('picker', {static: false}) datepicker: MatDatepicker<moment.Moment>;
  @Input() datepickerDTO: SantaDatePicker;
  formControl = new FormControl(moment());

  constructor(
  ) {
  }

  public ngOnInit() {
    // doing the creation of formControl in here instead of DTOService, to keep all form-specific code in the form module
    this.datepickerDTO.api.formControl = new FormControl(moment());
    this.datepickerDTO.api.datepicker = this.datepicker;
  }

  public onClickOpen() {
    this.datepickerDTO.state.opened = !this.datepickerDTO.state.opened;
    if (this.datepickerDTO.state.opened) {
      this.datepicker.open();
    } else {
      this.datepicker.close();
    }
  }

  public onDateValueChange(
    source: string,
    event: MatDatepickerInputEvent<Date>
  ) {
    console.log('test, ', source, event.value);
  }

  public onCloseDatePicker() {
    this.datepickerDTO.state.opened = false;
  }

}
