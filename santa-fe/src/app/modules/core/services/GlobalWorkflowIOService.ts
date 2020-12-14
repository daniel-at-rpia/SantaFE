import { Injectable } from '@angular/core';

import { GlobalWorkflowStateDTO } from 'FEModels/frontend-models.interface';

@Injectable()

export class GlobalWorkflowIOService {
  public temporaryStore: object = {};

  constructor(){}

  public storeState(targetState: GlobalWorkflowStateDTO) {
    this.temporaryStore[targetState.data.uuid] = targetState;
  }

  public fetchState(targetUUID: string): GlobalWorkflowStateDTO {
    if (!!this.temporaryStore[targetUUID]) {
      return this.temporaryStore[targetUUID];
    } else {
      return null;
    }
  }
}