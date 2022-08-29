import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BenchmarksPageRoutingModule } from './benchmarks-routing.module';

import { BenchmarksPage } from './benchmarks.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BenchmarksPageRoutingModule
  ],
  declarations: [BenchmarksPage]
})
export class BenchmarksPageModule {}
