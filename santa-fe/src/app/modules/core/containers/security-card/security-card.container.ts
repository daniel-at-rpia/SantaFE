import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { UtilityService } from 'Core/services/UtilityService';
import { DTOService } from 'Core/services/DTOService';
import { RestfulCommService } from 'Core/services/RestfulCommService';
import { SecurityDTO } from 'FEModels/frontend-models.interface';
import { TriCoreDriverConfig, AlertSubTypes } from 'Core/constants/coreConstants.constant';

@Component({
  selector: 'security-card',
  templateUrl: './security-card.container.html',
  styleUrls: ['./security-card.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class SecurityCard implements OnInit {
  @Input() cardData: SecurityDTO;
  constants = {
    driver: TriCoreDriverConfig,
    side: AlertSubTypes
  };

  constructor(
    private utilityService: UtilityService,
    private restfulCommService: RestfulCommService,
    private dtoService: DTOService
  ) { }

  public ngOnInit() {
  }

  public onClickCard() {
    if (!this.cardData.state.isInteractionDisabled && !this.cardData.state.isStencil) {
      this.cardData.state.isSelected = !this.cardData.state.isSelected;
      if (!!this.cardData.api.onClickCard) {
        this.cardData.api.onClickCard(this.cardData);
      }
    }
  }

  public onClickSearch() {
    this.cardData.state.isSelected = false;
    if (!!this.cardData.api.onClickSearch) {
      this.cardData.api.onClickSearch(this.cardData);
    }
  }

  public onClickSendToGraph() {
    if (!!this.cardData.api.onClickSendToGraph) {
      this.cardData.api.onClickSendToGraph(this.cardData);
    }
  }

  public onClickOpenSecurityInBloomberg(targetModule: string) {
    const yellowCard = this.utilityService.isCDS(false, this.cardData) ? `Corp` : 'Govt';
    const url = `bbg://securities/${this.cardData.data.globalIdentifier}%20${yellowCard}/${targetModule}`;
    window.open(url);
    this.restfulCommService.logEngagement(
      this.restfulCommService.engagementMap.bloombergRedict,
      this.cardData.data.securityID,
      `BBG - ${targetModule}`,
      'Core - Security Card'
    );
  }

  public onClickOpenShortcutConfig() {
    this.cardData.state.configAlertState = true;
    this.cardData.data.alert.watchlistConfig = {
      driver: null,
      numericFilterDTO: this.dtoService.formNumericFilterObject(),
      side: [],
      isUrgent: true,
      sendEmail: false
    };
    if (this.cardData.data.mark.markDriver === TriCoreDriverConfig.Spread.label || this.cardData.data.mark.markDriver === TriCoreDriverConfig.Price.label) {
      this.cardData.data.alert.watchlistConfig.driver = this.cardData.data.mark.markDriver;
    }
  }

  public onSaveShortcutConfig() {
    this.cardData.state.configAlertState = false;
    this.cardData.state.isSelected = false;
    if (!!this.cardData.api.onClickSendToAlertConfig) {
      this.cardData.api.onClickSendToAlertConfig(this.cardData);
    }
  }

  public onCloseShortcutConfig() {
    this.cardData.state.configAlertState = false;
    this.cardData.state.isSelected = false;
  }

  public onShortcutConfigFilterChangeMin(newValue) {
    this.cardData.data.alert.watchlistConfig.numericFilterDTO.data.minNumber = newValue === "" ? newValue : parseFloat(newValue);
    this.checkIsFilled();
  }

  public onShortcutConfigFilterChangeMax(newValue) {
    this.cardData.data.alert.watchlistConfig.numericFilterDTO.data.maxNumber = newValue === "" ? newValue : parseFloat(newValue);
    this.checkIsFilled();
  }

  public onShortcutConfigFilterClickedClear() {
    this.cardData.data.alert.watchlistConfig.numericFilterDTO.data = {
      minNumber: "",
      maxNumber: ""
    };
    this.checkIsFilled();
  }

  public onSelectShortcutConfigDriver(driver: string) {
    this.cardData.data.alert.watchlistConfig.driver = driver;
  }

  public onSelectSide(targetSide: string) {
    if (this.cardData.data.alert.watchlistConfig.side.indexOf(targetSide) >= 0) {
      this.cardData.data.alert.watchlistConfig.side = this.cardData.data.alert.watchlistConfig.side.filter((eachSide) => {
        return eachSide !== targetSide;
      });
    } else {
      this.cardData.data.alert.watchlistConfig.side.push(targetSide);
    }
  }

  public onToggleUrgentFlag() {
    this.cardData.data.alert.watchlistConfig.isUrgent = !this.cardData.data.alert.watchlistConfig.isUrgent;
  }

  public onToggleSendEmailFlag() {
    this.cardData.data.alert.watchlistConfig.sendEmail = !this.cardData.data.alert.watchlistConfig.sendEmail;
  }

  public onClickPin() {
    this.cardData.state.isSelected = false;
    if (!!this.cardData.api.onClickPin) {
      this.cardData.api.onClickPin(this.cardData);
    }
  }

  private checkIsFilled() {
    const dto = this.cardData.data.alert.watchlistConfig.numericFilterDTO;
    if (dto.data.minNumber !== "" || dto.data.maxNumber !== "") {
      dto.state.isFilled = true;
    } else {
      dto.state.isFilled = false;
    }
  }
}
