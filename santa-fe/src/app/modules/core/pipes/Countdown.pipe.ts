import {Pipe, PipeTransform} from '@angular/core';
import {Moment} from 'moment';
import * as moment from 'moment';

@Pipe({name: 'countdown'})
export class CountdownPipe implements PipeTransform {
  transform(value: Moment): any {
    const eventTime = value;
    const currentTime = moment(Date.now());
    const dur = moment.duration(eventTime.diff(currentTime));
    // console.log(`eventTime: ${eventTime.toISOString()}, currentTime: ${currentTime.toISOString()}`);
    return `${this.addLeadingZeroIfNecessary(dur.hours())}:${this.addLeadingZeroIfNecessary(dur.minutes())}:${this.addLeadingZeroIfNecessary(dur.seconds())}`;
  }

  addLeadingZeroIfNecessary(val: number) {
    // return val;
    return val > 9 ? val : `0${val.toFixed(0)}`;
  }
}
