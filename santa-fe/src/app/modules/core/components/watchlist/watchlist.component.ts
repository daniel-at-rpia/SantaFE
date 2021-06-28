import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { DTOs } from 'Core/models/frontend';

@Component({
  selector: 'watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class Watchlist {
  @Input() watchlistData: DTOs.WatchlistDTO;
  @Output() onClickWatchlistCallback = new EventEmitter<DTOs.WatchlistDTO>();
  @Output() onChangeWatchlistNameCallback = new EventEmitter<string>();
  constructor(
  ) {
  }

  public onClickWatchlist() {
    if (!this.watchlistData.state.isUserInputBlocked) {
      this.onClickWatchlistCallback.emit(this.watchlistData);
    }
  }

  public onChangeWatchlistName(newName: string) {
    !!this.onChangeWatchlistNameCallback && this.onChangeWatchlistNameCallback.emit(newName);
  }

  public onEnterDefinitionHover(targetDefinition: DTOs.SecurityDefinitionDTO) {
    if (!!targetDefinition) {
      this.watchlistData.state.hoveringSlot = targetDefinition;
      this.watchlistData.state.hoveringSlotNumber = this.watchlistData.style.slotList.indexOf(targetDefinition) + 1;
    }
  }

  public onLeaveDefinitionHover(targetDefinition: DTOs.SecurityDefinitionDTO) {
    if (!!targetDefinition) {
      this.watchlistData.state.hoveringSlot = null;
      this.watchlistData.state.hoveringSlotNumber = null;
    }
  }

}
