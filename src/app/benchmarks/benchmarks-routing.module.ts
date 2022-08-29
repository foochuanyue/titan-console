import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BenchmarksPage } from './benchmarks.page';

const routes: Routes = [
  {
    path: '',
    component: BenchmarksPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BenchmarksPageRoutingModule {}
