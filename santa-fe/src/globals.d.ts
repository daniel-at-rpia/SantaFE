import {Moment} from 'moment';

// declare var moment: Moment;
declare global {
  interface Window {
    moment: any;
  }
}
