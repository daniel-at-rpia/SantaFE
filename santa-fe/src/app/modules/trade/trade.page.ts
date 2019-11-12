import {
  Component,
  ViewEncapsulation
} from '@angular/core';

import { TradeState } from 'FEModels/frontend-page-states.interface';

@Component({
  selector: 'santa-trade',
  templateUrl: './trade.page.html',
  styleUrls: ['./trade.page.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class TradePage {
  state: TradeState;

  constructor(
  ) {
    this.state = {
      graphsCollapsed: false
    };
  }

  public onToggleCollapseGraphs() {
    this.state.graphsCollapsed = !this.state.graphsCollapsed;
  }

}
