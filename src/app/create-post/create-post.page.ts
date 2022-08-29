import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NavController,  LoadingController, ModalController } from '@ionic/angular';
import { PostService } from './../post.service';
import { ErrorsModalPage } from '../modals/errors-modal/errors-modal.page';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.page.html',
  styleUrls: ['./create-post.page.scss'],
})
export class CreatePostPage implements OnInit {

  ionicForm: FormGroup;
  photo:any;
  file:any;

  constructor(
    private navCtrl: NavController,
    public formBuilder: FormBuilder,
    private postService: PostService,
    public modalCtrl: ModalController,
    public loadingController: LoadingController,
  ) { }

  ionViewWillEnter(): void {
    this.photo = null;
    this.file = null;
    this.ionicForm = this.formBuilder.group({
      title: ['Title', [Validators.required]],
      subtitle: ['Subtitle', [Validators.required]],
      url: ['', [Validators.required]]
    })
   }

  ngOnInit() {
    this.ionicForm = this.formBuilder.group({
      title: ['Title', [Validators.required]],
      subtitle: ['Subtitle', [Validators.required]],
      url: ['', [Validators.required]]
    })
  }

  uploadPost(){
    if(this.file!=null && this.ionicForm.get('title').value.length>0 && this.ionicForm.get('url').value.length>0){
      console.log(this.file);
      const formData = new FormData();
      formData.append('myFile', this.file);
      formData.append('content',"");
      formData.append('title',this.ionicForm.get("title").value);
      formData.append('subtitle',this.ionicForm.get("subtitle").value);
      formData.append('url',this.ionicForm.get("url").value);
      this.presentLoading();
      this.postService.upload(formData).subscribe((response) => {
        console.log(response);
        if(response.message=="success"){
          this.navCtrl.navigateForward('home');
          setTimeout(() => {
            this.dismissLoader();
          }, 500);
        }
      })
    }else{
      this.errorsModal("Please fill up title, url and ensure image is uploaded.");
    }
  }

  onFileChange(e){
    this.file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
      var preload =document.getElementById('pre-load') as HTMLImageElement | null;
      preload.src = <string>e.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
  }

  goBack(){
    this.navCtrl.navigateForward('home');
  }

  async errorsModal(message) {
   const modal = await this.modalCtrl.create({
     component: ErrorsModalPage,
     cssClass: 'errors-modal',
     componentProps: {
        'message': message,
      },
   });

   return await modal.present();
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
