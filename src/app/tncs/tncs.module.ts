import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TncsPageRoutingModule } from './tncs-routing.module';

import { TncsPage } from './tncs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TncsPageRoutingModule
  ],
  declarations: [TncsPage]
})
export class TncsPageModule {}
