import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { MarketPage } from 'Market/market.page';
import { MarketContainer } from 'Market/containers/market.container';
import { SecurityCard } from 'Market/components/security-card/security-card.component';
import { SecurityGroup } from 'Market/components/security-group/security-group.component';
import { SecurityGroupDefinition } from 'Market/components/security-group-definition/security-group-definition.component';
import { SecurityGroupDefinitionConfigurator } from 'Market/components/definition-configurator/definition-configurator.component';

import { DTOService } from 'App/services/DTOService';

@NgModule({
  declarations: [
    MarketPage,
    MarketContainer,
    SecurityCard,
    SecurityGroup,
    SecurityGroupDefinition,
    SecurityGroupDefinitionConfigurator
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'market', component: MarketPage
      }
    ])
  ],
  providers: [
  ]
})
export class MarketModule { }
