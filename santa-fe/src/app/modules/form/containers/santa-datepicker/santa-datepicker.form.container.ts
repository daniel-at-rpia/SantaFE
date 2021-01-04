import { Component, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'santa-datepicker',
  templateUrl: './santa-datepicker.form.container.html',
  styleUrls: ['./santa-datepicker.form.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class SantaDatepicker {

  date = new FormControl(moment([2017, 0, 1]));

  constructor(
  ) {
  }

}
