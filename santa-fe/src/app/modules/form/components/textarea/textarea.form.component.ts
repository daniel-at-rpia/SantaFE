import {
  Component,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
  OnChanges
} from '@angular/core';

@Component({
  selector: 'santa-textarea',
  templateUrl: './textarea.form.component.html',
  styleUrls: ['./textarea.form.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class SantaTextarea {
  @Input() inputValue: string;
  @Output() onInputChange = new EventEmitter<string>();
  @Output() onInputFocus = new EventEmitter();
  @Output() onInputBlur = new EventEmitter();
  @Output() onEnterKeyPressed = new EventEmitter<string>();
  
  constructor(
  ) {
  }

  public onKey() {
    !!this.onInputChange && this.onInputChange.emit(this.inputValue);
  }

  public onFocus() {
    !!this.onInputFocus && this.onInputFocus.emit();
  }

  public onBlur() {
    !!this.onInputBlur && this.onInputBlur.emit();
  }

  public onPressedEnterKey() {
    !!this.onEnterKeyPressed && this.onEnterKeyPressed.emit(this.inputValue);
  }

}
