    import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
    import { TradeAlertConfigurationAxeGroupBlockDTO, SecurityDTO } from 'FEModels/frontend-models.interface';
    import { SelectAxeWatchlistSide, SelectAxeWatchlistType, SelectAxeWatchlistRangeValue, SelectAxeWatchlistRangeDriver } from 'Core/models/frontend/frontend-blocks.interface';
    import { AxeAlertScope, AxeAlertType } from 'App/modules/core/constants/tradeConstants.constant';


@Component({
  selector: 'alert-watch-list',
  templateUrl: './alert-watch-list.component.html',
  styleUrls: ['./alert-watch-list.component.scss']
})

export class AlertWatchList implements OnInit {
  @Input() securityBlockList: TradeAlertConfigurationAxeGroupBlockDTO[];
  @Input() constants;
  @Output() selectAxeWatchlistSideBid = new EventEmitter<SelectAxeWatchlistSide>();
  @Output() selectAxeWatchlistSideAsk = new EventEmitter<SelectAxeWatchlistSide>();
  @Output() selectAxeWatchlistTypeNormal = new EventEmitter<SelectAxeWatchlistType>();
  @Output() selectAxeWatchlistTypeMarketList = new EventEmitter<SelectAxeWatchlistType>();
  @Output() changeAxeWatchlistRangeMin = new EventEmitter<SelectAxeWatchlistRangeValue>();
  @Output() changeAxeWatchlistRangeMax = new EventEmitter<SelectAxeWatchlistRangeValue>();
  @Output() clickAxeWatchlistClearRange = new EventEmitter<TradeAlertConfigurationAxeGroupBlockDTO>();
  @Output() selectAxeWatchlistRangeDriverSprd = new EventEmitter<SelectAxeWatchlistRangeDriver>();
  @Output() selectAxeWatchlistRangeDriverPx = new EventEmitter<SelectAxeWatchlistRangeDriver>();
  @Output() toggleAxeWatchlistPriority = new EventEmitter<TradeAlertConfigurationAxeGroupBlockDTO>();
  @Output() toggleAxeWatchlistSendEmail = new EventEmitter<TradeAlertConfigurationAxeGroupBlockDTO>();
  @Output() toggleDisableTargetGroupFromAxeWatchlist = new EventEmitter<TradeAlertConfigurationAxeGroupBlockDTO>();
  @Output() clickRemoveSecurityFromAxeWatchlist = new EventEmitter<TradeAlertConfigurationAxeGroupBlockDTO>();
  

  constructor() {}

  ngOnInit() {}

  public onSelectAxeAlertWatchlistSide(targetScope: AxeAlertScope, targetBlock: TradeAlertConfigurationAxeGroupBlockDTO) {
    const emitObject = {targetScope, targetBlock};
    if (AxeAlertScope.bid === targetScope) {
      this.selectAxeWatchlistSideBid.emit(emitObject)
    } else if (AxeAlertScope.ask === targetScope) {
      this.selectAxeWatchlistSideAsk.emit(emitObject)
    }
  }

  public onSelectAxeAlertWatchlistType(targetType: AxeAlertType, targetBlock: TradeAlertConfigurationAxeGroupBlockDTO) {
    const emitObject = {targetType, targetBlock};
    if (AxeAlertType.normal === targetType) {
      this.selectAxeWatchlistTypeNormal.emit(emitObject)
    } else if (AxeAlertType.marketList) {
      this.selectAxeWatchlistTypeMarketList.emit(emitObject)
    } 
  }

  public onChangeAxeWatchlistRangeMin(newValue, targetBlock: TradeAlertConfigurationAxeGroupBlockDTO) {
    this.changeAxeWatchlistRangeMin.emit({newValue, targetBlock})
  }

  public onChangeAxeWatchlistRangeMax(newValue, targetBlock: TradeAlertConfigurationAxeGroupBlockDTO) {
    this.changeAxeWatchlistRangeMax.emit({newValue, targetBlock})
  }

  public onClickAxeWatchlistClearRange(targetBlock: TradeAlertConfigurationAxeGroupBlockDTO) {
    this.clickAxeWatchlistClearRange.emit(targetBlock);
  }

  public onSelectAxeWatchlistRangeDriver(targetBlock: TradeAlertConfigurationAxeGroupBlockDTO, targetDriver: string) {
    const emitObject = {targetBlock, targetDriver};
    if (targetDriver === 'Spread') {
      this.selectAxeWatchlistRangeDriverSprd.emit(emitObject);
    } else if (targetDriver === 'Price') {
      this.selectAxeWatchlistRangeDriverPx.emit(emitObject)
    }
  }

  public onToggleAxeWatchlistPriority(targetBlock: TradeAlertConfigurationAxeGroupBlockDTO) {
    this.toggleAxeWatchlistPriority.emit(targetBlock)
  }

  public onToggleAxeWatchlistSendEmail(targetBlock: TradeAlertConfigurationAxeGroupBlockDTO) {
    this.toggleAxeWatchlistSendEmail.emit(targetBlock);
  }

  public onToggleDisableTargetGroupFromAxeWatchlist(targetBlock: TradeAlertConfigurationAxeGroupBlockDTO) {
    this.toggleDisableTargetGroupFromAxeWatchlist.emit(targetBlock);
  }

  public onClickRemoveSecurityFromAxeWatchlist(targetBlock: TradeAlertConfigurationAxeGroupBlockDTO) {
    this.clickRemoveSecurityFromAxeWatchlist.emit(targetBlock);
  }
 }