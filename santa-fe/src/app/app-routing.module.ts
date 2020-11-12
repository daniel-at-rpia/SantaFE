import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavigationModule } from 'Core/constants/coreConstants.constant';
import { TradePage } from 'Trade/trade.page';
import { StructurePage } from 'Structure/structure.page';

const routes: Routes = [
      {
        path: NavigationModule.market,
        redirectTo: NavigationModule.market,
        pathMatch: 'full'
      },
      {
        path: `${NavigationModule.trade}/:stateId`,
        component: TradePage
      },
      {
        path: `${NavigationModule.structuring}/:stateId`,
        component: StructurePage
        // this is for eventually we introduce lazy loading
        // loadChildren: () => import('./modules/structure/structure.module').then(mod => mod.StructureModule)
      },
      {
        path: '**',
        redirectTo: 'trade',
        pathMatch: 'full'
      }
    ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
