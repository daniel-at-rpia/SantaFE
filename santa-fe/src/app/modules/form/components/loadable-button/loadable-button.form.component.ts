import {
  Component,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'santa-loadable-button',
  templateUrl: './loadable-button.form.component.html',
  styleUrls: ['./loadable-button.form.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class SantaLoadableButton {
  @Input() isLoading: boolean;
  @Input() icon: string;
  @Input() text: string;
  @Input() columnLayout: boolean;
  @Output() onClickButton = new EventEmitter();
  constructor(
  ) {
  }

  onClick() {
    this.onClickButton.emit();
  }

}
