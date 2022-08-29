import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TncsPage } from './tncs.page';

const routes: Routes = [
  {
    path: '',
    component: TncsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TncsPageRoutingModule {}
