import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import {
  SearchShortcutDTO
} from 'FEModels/frontend-models.interface';

@Component({
  selector: 'search-shortcut',
  templateUrl: './search-shortcut.component.html',
  styleUrls: ['./search-shortcut.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class SearchShortcut {
  @Input() shortcutData: SearchShortcutDTO;
  @Output() onClickShortcutCallback = new EventEmitter<SearchShortcutDTO>();
  @Output() onChangeShortcutNameCallback = new EventEmitter<string>();
  constructor(
  ) {
  }

  public onClickShortcut() {
    if (!this.shortcutData.state.isUserInputBlocked) {
      this.onClickShortcutCallback.emit(this.shortcutData);
    }
  }

  public onChangeShortcutName(newName: string) {
    !!this.onChangeShortcutNameCallback && this.onChangeShortcutNameCallback.emit(newName);
  }

}
