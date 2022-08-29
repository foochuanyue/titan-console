import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ErrorsModalPageRoutingModule } from './errors-modal-routing.module';

import { ErrorsModalPage } from './errors-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ErrorsModalPageRoutingModule
  ],
  declarations: [ErrorsModalPage]
})
export class ErrorsModalPageModule {}
