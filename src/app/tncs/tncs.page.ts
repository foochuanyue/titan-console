import { Component, OnInit } from '@angular/core';
import { NavController,  LoadingController, ModalController } from '@ionic/angular';
import { PostService } from './../post.service';

@Component({
  selector: 'app-tncs',
  templateUrl: './tncs.page.html',
  styleUrls: ['./tncs.page.scss'],
})
export class TncsPage implements OnInit {

  active = "Contracts";
  packs: any;
  contracts: string = "";
  packages: string = "";
  offpeak: string = "";
  trial: string = "";

  constructor(
    private navCtrl: NavController,
    private postService: PostService,
    public modalCtrl: ModalController,
    public loadingController: LoadingController,
  ) { }

  ionViewWillEnter(): void {
    this.presentLoading();
    this.postService.loadPacks().subscribe((response) => {
      this.packs = response.packs;
      for(let pack of this.packs){
        if(pack.type=="Contracts"){
          this.contracts = pack.tncs;
        }else if(pack.type=="Packages"){
          this.packages = pack.tncs;
        }else if(pack.type=="Trial"){
          this.trial = pack.tncs;
        }else{
          this.offpeak = pack.tncs;
        }
      }
      if(this.active=="Contracts"){
        document.getElementById('contentarea').innerHTML = this.contracts;
      }else if(this.active=="Packages"){
        document.getElementById('contentarea').innerHTML = this.packages;
      }else if(this.active=="offpeak"){
        document.getElementById('contentarea').innerHTML = this.offpeak;
      }else{
        document.getElementById('contentarea').innerHTML  = this.trial;
      }
      setTimeout(() => {
        this.dismissLoader();
      }, 500);
    })
  }

  ngOnInit() {
  }

  heading(){
    var text = window.getSelection().toString();
    console.log(text);
    document.execCommand('insertHTML', false, '<span style="color:#EE4742;text-transform:uppercase;font-size:12px;letter-spacing:1.2px;font-weight:700;font-family:Lato;">'+text+'</span>');
  }

  subheading(){
    var text = window.getSelection().toString();
    console.log(text);
    document.execCommand('insertHTML', false, '<span style="color:#FFFFFF;text-transform:uppercase;font-size:10px;letter-spacing:1px;font-weight:400;font-family:Lato;">'+text+'</span>');
  }

  bodyCopy(){
    var text = window.getSelection().toString();
    console.log(text);
    document.execCommand('insertHTML', false, '<span style="color:#FFFFFF;text-transform:lowercase;font-size:10px;letter-spacing:1px;font-weight:300;font-family:Lato;">'+text+'</span>');
  }

  onContracts(){
    this.active = "Contracts";
    document.getElementById('contentarea').innerHTML = this.contracts;
  }

  onPackages(){
    this.active="Packages";
    document.getElementById('contentarea').innerHTML = this.packages;
  }

  onOffpeak(){
    this.active = "Offpeak";
    document.getElementById('contentarea').innerHTML = this.offpeak;
  }

  onTrial(){
    this.active="Trial";
    document.getElementById('contentarea').innerHTML = this.trial;
  }

  clear(){
    document.getElementById('contentarea').innerHTML = '';
  }

  save(){
    var text = document.getElementById('contentarea').innerHTML;
    var data = {
      'type':this.active,
      'tncs':text
    };
    this.postService.savePacks(data).subscribe((response) => {
      console.log(response);
      if(response.message=="success"){
        if(this.active=="Contracts"){
          this.contracts = document.getElementById('contentarea').innerHTML;
        }else if(this.active=="Packages"){
          this.packages = document.getElementById('contentarea').innerHTML;
        }else if(this.active=="offpeak"){
          this.offpeak = document.getElementById('contentarea').innerHTML;
        }else{
         this.trial = document.getElementById('contentarea').innerHTML;
        }
      }
    })
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
