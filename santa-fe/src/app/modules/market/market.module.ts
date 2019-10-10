import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { FormModule } from 'App/modules/form/form.module';

import { MarketPage } from 'Market/market.page';
import { MarketContainer } from 'Market/containers/market.container';
import { MarketGroupPanel } from 'Market/containers/market-group-panel.container';
import { SecurityCard } from 'Market/components/security-card/security-card.component';
import { SecurityGroup } from 'Market/components/security-group/security-group.component';
import { SecurityGroupDefinition } from 'Market/components/security-group-definition/security-group-definition.component';
import { SecurityGroupDefinitionConfigurator } from 'Market/components/definition-configurator/definition-configurator.component';

@NgModule({
  declarations: [
    MarketPage,
    MarketContainer,
    MarketGroupPanel,
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
    ]),
    FormModule
  ],
  providers: [
  ]
})
export class MarketModule { }
