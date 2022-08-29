import { Component, OnInit } from '@angular/core';
import { NavController,  LoadingController, ModalController } from '@ionic/angular';
import { PostService } from './../post.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  posts:any;

  constructor(
    private navCtrl: NavController,
    private postService: PostService,
    public modalCtrl: ModalController,
    public loadingController: LoadingController,
  ) {}

  ionViewWillEnter(): void {
    this.presentLoading();
    this.postService.load().subscribe((response) => {
      this.posts = response.posts;
      setTimeout(() => {
        this.dismissLoader();
      }, 500);
    })
  }

  ngOnInit(){
  }

  create(){
    this.navCtrl.navigateForward('create-post');
  }

  tncs(){
    this.navCtrl.navigateForward('tncs');
  }

  benchmarks(){
    this.navCtrl.navigateForward('benchmarks');
  }

  async presentLoading() {
     const loading = await this.loadingController.create({
       cssClass: 'loading-css',
       message: '<ion-img src="../../assets/icon/DA-APP-LOADING_4.gif" alt="loading..."></ion-img>',
       spinner: null,
     });
     await loading.present();

     const { role, data } = await loading.onDidDismiss();
     console.log('Loading dismissed!');
   }

  dismissLoader() {
    this.loadingController.dismiss().then((response) => {
        console.log('Loader closed!', response);
    }).catch((err) => {
        console.log('Error occured : ', err);
    });
  }
}
