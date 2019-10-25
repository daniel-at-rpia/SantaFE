import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CoreModule } from 'Core/core.module';
import { FormModule } from 'App/modules/form/form.module';

import { MarketPage } from 'Market/market.page';
import { MarketGroupPanel } from 'Market/containers/market-group-panel.container';
import { SecurityCard } from 'Market/components/security-card/security-card.component';
import { SecurityGroup } from 'Market/components/security-group/security-group.component';
import { SecurityGroupDefinition } from 'Market/components/security-group-definition/security-group-definition.component';
import { SecurityGroupDefinitionConfigurator } from 'Market/components/definition-configurator/definition-configurator.component';
import { SecurityGroupAverageVisualizer } from 'Market/components/security-group-average-visualizer/security-group-average-visualizer.component';

@NgModule({
  declarations: [
    MarketPage,
    MarketGroupPanel,
    SecurityCard,
    SecurityGroup,
    SecurityGroupDefinition,
    SecurityGroupDefinitionConfigurator,
    SecurityGroupAverageVisualizer
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'market', component: MarketPage
      }
    ]),
    CoreModule,
    FormModule
  ],
  providers: [
  ]
})
export class MarketModule { }
