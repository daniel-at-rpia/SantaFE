import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input
} from '@angular/core';

@Component({
  selector: 'security-card',
  templateUrl: './security-card.component.html',
  styleUrls: ['./security-card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SecurityCard implements OnInit {
  @Input() cardData: any;
  constructor() { }

  ngOnInit() {
  }

}
