import { Component, OnInit, Input} from '@angular/core';
import { ModalController} from '@ionic/angular';

@Component({
  selector: 'app-errors-modal',
  templateUrl: './errors-modal.page.html',
  styleUrls: ['./errors-modal.page.scss'],
})
export class ErrorsModalPage implements OnInit {

  @Input() message: string;

  constructor(
    public modalCtrl: ModalController,
  ) { }

  ngOnInit() {
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
