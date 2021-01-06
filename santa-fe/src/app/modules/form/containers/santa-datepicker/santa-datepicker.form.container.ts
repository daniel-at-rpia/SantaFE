import { Component, ViewEncapsulation, Input, Output, EventEmitter, OnInit, OnChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment';

import { SantaDatePicker } from '../../models/form-models.interface';
import { UtilityService } from 'Core/services';

@Component({
  selector: 'santa-datepicker',
  templateUrl: './santa-datepicker.form.container.html',
  styleUrls: ['./santa-datepicker.form.container.scss'],
  encapsulation: ViewEncapsulation.None
})

export class SantaDatepicker implements OnInit, OnChanges {
  @ViewChild('picker', {static: false}) datepicker: MatDatepicker<moment.Moment>;
  @Input() datepickerDTO: SantaDatePicker;
  @Input() changeDate: moment.Moment;
  @Output() dateSelected = new EventEmitter<moment.Moment>();

  protected formControl = new FormControl(null);

  constructor(
    private utilityService: UtilityService
  ) {
  }

  public ngOnInit() {
    // doing the creation of formControl in here instead of DTOService, to keep all form-specific code in the form module
    this.datepickerDTO.api.datepicker = this.datepicker;
  }

  public ngOnChanges() {
    if (!!this.changeDate && !this.changeDate.isSame(this.datepickerDTO.data.receivedExternalChangeDate, 'day')) {
      console.log('test, got here');
      this.datepickerDTO.data.receivedExternalChangeDate = this.utilityService.deepCopy(this.changeDate);
      this.formControl.setValue(this.datepickerDTO.data.receivedExternalChangeDate);
    }
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
    event: MatDatepickerInputEvent<moment.Moment>
  ) {
    if (source === 'input') {
      // user is changing the input manually
    } else if (source === 'change') {
      // a change is submitted either via datepicker or manually chaning the input
      this.datepickerDTO.state.opened = false;
      if (!!event.value && moment.isMoment(event.value)) {
        this.datepickerDTO.data.inputLabelDisplay = this.datepickerDTO.data.inputLabelFilled;
        !!this.dateSelected && this.dateSelected.emit(event.value);
      } else {
        this.datepickerDTO.data.inputLabelDisplay = this.datepickerDTO.data.inputLabelEmpty;
        !!this.dateSelected && this.dateSelected.emit(null);
      }
    }
  }

  public onCloseDatePicker() {
    this.datepickerDTO.state.opened = false;
  }

}
