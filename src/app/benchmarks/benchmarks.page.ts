import { Component, OnInit } from '@angular/core';
import { NavController,  LoadingController, ModalController } from '@ionic/angular';
import { PostService } from './../post.service';
import { ErrorsModalPage } from '../modals/errors-modal/errors-modal.page';

@Component({
  selector: 'app-benchmarks',
  templateUrl: './benchmarks.page.html',
  styleUrls: ['./benchmarks.page.scss'],
})
export class BenchmarksPage implements OnInit {

  originalCat: any[];
  activeCat: string = "Strength";
  benchmarks:any;
  benchmarks_to_show: any = [];
  categories: any = [];
  exercises: any = [];
  editCat: number = null;
  editSeason: any = [null, null];
  disabledEdits: boolean = false;
  units:any = {
    "Time":["mins","secs"],//00
    "Reps":["Reps"],//0000
    "Rounds":["Rounds"], //000
    "Cals":["Cals"],//0000
    "Distance":["Meters"],//000000
    "Cal/Hr":["Cal/Hr"],//0000
    "Watts":["Watts"],//0000
    "Split Time":["mins","secs"],//00
    "Weight":["kg"]
  }
  strengthUnits: any = ["Reps","Weight"];
  exerciseEdit: any = [null,null];
  pastEdit: any = [null,null,null];
  isNew: boolean = false;
  unitSelector: string;
  pastBenchmarks: any = [];
  seasons:any = [];
  originalSeasons: any = [];

  constructor(
    private navCtrl: NavController,
    private postService: PostService,
    public modalCtrl: ModalController,
    public loadingController: LoadingController,
  ) { }

  ionViewWillEnter(): void {
    this.loadBenchmarks();
  }

  loadBenchmarks(){
    this.presentLoading();
    this.postService.loadBenchmarks().subscribe((response) => {
      this.benchmarks = response.benchmarks;
      this.benchmarks_to_show = JSON.parse(JSON.stringify(this.benchmarks));
      this.benchmarks_to_show = this.benchmarks_to_show.filter(benchmark => benchmark.type==this.activeCat);
      if(this.activeCat == 'Conditioning'){
        for(let benchmark of this.benchmarks_to_show){
          benchmark.measure = JSON.parse(benchmark.measure);
          benchmark.name = JSON.parse(benchmark.name).join('\n');
          benchmark.priority = JSON.parse(benchmark.priority);
        }
      }
      this.originalSeasons = response.seasons;
      this.originalCat = response.categories;
      this.categories = JSON.parse(JSON.stringify(this.originalCat));
      this.categories = this.categories.filter(category => category.type == this.activeCat);
      this.categories.sort((a,b)=> {return a.order - b.order});
      this.exercises = [];
      this.seasons = [];
      this.pastBenchmarks = [];
      for(var index in this.categories){
        this.seasons.push(this.originalSeasons.filter(season => season.category == this.categories[index]._id));
        this.pastBenchmarks.push([]);
        this.exercises.push(this.benchmarks_to_show.filter(benchmark => benchmark.category == this.categories[index]._id && benchmark.active == true));
        this.exercises[index].sort((a,b)=> {return a.cycle - b.cycle});
        for(var iter in this.seasons[index]){
          this.pastBenchmarks[index].push(this.benchmarks_to_show.filter(benchmark => benchmark.season == this.seasons[index][iter]._id));
        }
      }
      this.exerciseEdit = [null, null];
      this.pastEdit = [null, null, null];
      this.editSeason = [null,null];
      this.disabledEdits = false;
      this.isNew = false;
      this.editCat = null;
      setTimeout(() => {
        this.dismissLoader();
      }, 500);
    })
  }

  softLoadBenchmarks(){
    this.benchmarks_to_show = JSON.parse(JSON.stringify(this.benchmarks));
    this.benchmarks_to_show = this.benchmarks_to_show.filter(benchmark => benchmark.type==this.activeCat);
    if(this.activeCat == 'Conditioning'){
      for(let benchmark of this.benchmarks_to_show){
        benchmark.measure = JSON.parse(benchmark.measure);
        benchmark.priority = JSON.parse(benchmark.priority);
        benchmark.name = JSON.parse(benchmark.name).join('\n');
      }
    }
    this.categories = JSON.parse(JSON.stringify(this.originalCat));
    this.categories = this.categories.filter(category => category.type == this.activeCat);
    this.categories.sort((a,b)=> {return a.order - b.order});
    this.exercises = [];
    this.seasons = [];
    this.pastBenchmarks = [];
    for(var index in this.categories){
      this.seasons.push(this.originalSeasons.filter(season => season.category == this.categories[index]._id));
      this.pastBenchmarks.push([]);
      this.exercises.push(this.benchmarks_to_show.filter(benchmark => benchmark.category == this.categories[index]._id && benchmark.active == true));
      this.exercises[index].sort((a,b)=> {return a.cycle - b.cycle});
      for(var iter in this.seasons[index]){
        this.pastBenchmarks[index].push(this.benchmarks_to_show.filter(benchmark => benchmark.season == this.seasons[index][iter]._id));
      }
    }
    this.exerciseEdit = [null, null];
    this.pastEdit = [null, null, null];
    this.disabledEdits = false;
    this.isNew = false;
    this.editCat = null;
    this.editSeason = [null,null];
    console.log(this.exercises);
  }

  ngOnInit() {
  }

  addGroup(cat){

    var exercise;
    if(this.activeCat=='Strength'){

      exercise = {
        name:'',
        active: true,
        category: this.categories[cat]._id,
        cycle:0,
        reps:[],
        type:this.activeCat,
        measure:'',
      }
    }

    if(this.activeCat=='Conditioning'){
      exercise = {
        name:'',
        active: true,
        category: this.categories[cat]._id,
        cycle:0,
        reps:[],
        type:this.activeCat,
        measure:[],
        priority:[],
      }
    }

    this.isNew = true;
    this.exercises[cat].unshift(exercise);
    this.exerciseEdit = [cat, 0];
    this.disabledEdits = true;
    setTimeout(() => {
      const selects = document.querySelectorAll<any>('.custom-options');
      console.log(selects);

      for (var i = 0; i < selects.length; i++) {
        selects[i].interfaceOptions = {
          cssClass: 'my-custom-interface'
        };
      };
    }, 500);

  }

  onExerciseEditUp(index){
    if(index!=0){
      var temp = this.exercises[this.exerciseEdit[0]][this.exerciseEdit[1]];
      this.exercises[this.exerciseEdit[0]][this.exerciseEdit[1]] = this.exercises[this.exerciseEdit[0]][this.exerciseEdit[1]-1];
      this.exercises[this.exerciseEdit[0]][this.exerciseEdit[1]-1] = temp;
      this.exerciseEdit[1]--;
    }
  }

  onExerciseEditDown(index){
    if(index!=this.exercises[this.exerciseEdit[0]].length-1){
      var temp = this.exercises[this.exerciseEdit[0]][this.exerciseEdit[1]];
      this.exercises[this.exerciseEdit[0]][this.exerciseEdit[1]] = this.exercises[this.exerciseEdit[0]][this.exerciseEdit[1]+1];
      this.exercises[this.exerciseEdit[0]][this.exerciseEdit[1]+1] = temp;
      this.exerciseEdit[1]++;
    }
  }

  onExerciseEditAddUnit(){
    this.exercises[this.exerciseEdit[0]][this.exerciseEdit[1]].measure.push(this.unitSelector);
    this.exercises[this.exerciseEdit[0]][this.exerciseEdit[1]].priority.push(0);
    console.log(this.exercises[this.exerciseEdit[0]][this.exerciseEdit[1]].priority);
  }

  onExerciseRemoveUnit(index){
    this.exercises[this.exerciseEdit[0]][this.exerciseEdit[1]].measure.splice(index,1);
  }

  onExerciseEditAddRep(){
    this.exercises[this.exerciseEdit[0]][this.exerciseEdit[1]].reps.push('');
    console.log(this.exercises[this.exerciseEdit[0]][this.exerciseEdit[1]].reps);
  }

  onExerciseEditRemoveRep(index){
    this.exercises[this.exerciseEdit[0]][this.exerciseEdit[1]].reps.splice(index,1);
  }

  onExerciseEditSave(){
    var data = JSON.parse(JSON.stringify(this.exercises[this.exerciseEdit[0]]));
    if(this.activeCat=="Strength"){
      if(data[this.exerciseEdit[1]].measure == "Reps"){
        data[this.exerciseEdit[1]].reps = [];
      }
      data[this.exerciseEdit[1]].isNew = this.isNew;
      this.postService.saveBenchmarks(data).subscribe((response) => {
        console.log(response);
        if(response.message=="success"){
          this.loadBenchmarks();
        }
      })
    }
    if(this.activeCat=="Conditioning"){
      data[this.exerciseEdit[1]].isNew = this.isNew;
      for(let exercise of data){
        exercise.measure = JSON.stringify(exercise.measure);
        exercise.priority = JSON.stringify(exercise.priority);
        exercise.name = JSON.stringify(exercise.name.split('\n'));
      }
      this.postService.saveBenchmarks(data).subscribe((response) => {
        console.log(response);
        if(response.message=="success"){
          this.loadBenchmarks();
        }
      })
    }
  }

  onExerciseEditDelete(){
    if(this.isNew==false){
      this.postService.deleteBenchmark(this.exercises[this.exerciseEdit[0]][this.exerciseEdit[1]]).subscribe((response) => {
        console.log(response);
        if(response.message=="success"){
          this.loadBenchmarks();
        }
      })
    }else{
      this.exercises[this.exerciseEdit[0]].splice(this.exerciseEdit[1],1);
      this.exerciseEdit = [null, null];
      this.disabledEdits = false;
      this.isNew = false;
    }
  }

  onExerciseEditCancel(){
    if(this.isNew==true){
      this.exercises[this.exerciseEdit[0]].splice(this.exerciseEdit[1],1);
      this.isNew = false;
    }else{
      this.exercises[this.exerciseEdit[0]][this.exerciseEdit[1]] = JSON.parse(JSON.stringify(this.benchmarks.filter(benchmark => benchmark._id == this.exercises[this.exerciseEdit[0]][this.exerciseEdit[1]]._id)[0]));
      if(this.activeCat=='Conditioning'){
        this.exercises[this.exerciseEdit[0]][this.exerciseEdit[1]].measure = JSON.parse(this.exercises[this.exerciseEdit[0]][this.exerciseEdit[1]].measure);
        this.exercises[this.exerciseEdit[0]][this.exerciseEdit[1]].name = JSON.parse(this.exercises[this.exerciseEdit[0]][this.exerciseEdit[1]].name).join('\n');
      }
    }
    this.exerciseEdit = [null, null];
    this.disabledEdits = false;
    console.log(this.exercises);
    console.log(this.benchmarks);
  }

  onExerciseEdit(cat, index){
    this.isNew = false;
    this.exerciseEdit = [cat, index];
    this.disabledEdits = true;
    setTimeout(() => {
      const selects = document.querySelectorAll<any>('.custom-options');
      console.log(selects);

      for (var i = 0; i < selects.length; i++) {
        selects[i].interfaceOptions = {
          cssClass: 'my-custom-interface'
        };
      };
    }, 500);
  }

  onUnitUp(index){
      this.exercises[this.exerciseEdit[0]][this.exerciseEdit[1]].priority[index] = 0;
  }

  onUnitDown(index){
      this.exercises[this.exerciseEdit[0]][this.exerciseEdit[1]].priority[index] = 1;
  }

  onSeasonEdit(i,j){
    console.log(i);
    console.log(j);
    this.editSeason = [i,j];
  }

  onSeasonUp(index){
    if(index!=0){
      var temp = this.seasons[this.editSeason[0]][this.editSeason[1]];
      var temp_benchmarks = this.pastBenchmarks[this.editSeason[0]][this.editSeason[1]];
      this.seasons[this.editSeason[0]][this.editSeason[1]] = this.seasons[this.editSeason[0]][this.editSeason[1]-1];
      this.pastBenchmarks[this.editSeason[0]][this.editSeason[1]] = this.pastBenchmarks[this.editSeason[0]][this.editSeason[1]-1];
      this.seasons[this.editSeason[0]][this.editSeason[1]-1] = temp;
      this.pastBenchmarks[this.editSeason[0]][this.editSeason[1]-1] = temp_benchmarks;
      this.editSeason[1]--;
    }
  }

  onSeasonDown(index){
    if(index!=this.seasons[this.editSeason[0]].length-1){
      var temp = this.seasons[this.editSeason[0]][this.editSeason[1]];
      var temp_benchmarks = this.pastBenchmarks[this.editSeason[0]][this.editSeason[1]];
      this.seasons[this.editSeason[0]][this.editSeason[1]] = this.seasons[this.editSeason[0]][this.editSeason[1]+1];
      this.pastBenchmarks[this.editSeason[0]][this.editSeason[1]] = this.pastBenchmarks[this.editSeason[0]][this.editSeason[1]+1];
      this.seasons[this.editSeason[0]][this.editSeason[1]+1] = temp;
      this.pastBenchmarks[this.editSeason[0]][this.editSeason[1]+1] = temp_benchmarks;
      this.editSeason[1]++;
    }
  }

  deleteSeason(){
    this.postService.deleteSeason(this.seasons[this.editSeason[0]][this.editSeason[1]]).subscribe((response) => {
      console.log(response);
      if(response.message=="success"){
        this.loadBenchmarks();
      }
    })
  }

  saveSeason(){
    this.postService.saveSeasons(this.seasons[this.editSeason[0]]).subscribe((response) => {
      console.log(response);
      if(response.message=="success"){
        this.loadBenchmarks();
      }
    })
  }

  onPastExerciseEdit(i,j,k){
    this.isNew = false;
    this.pastEdit = [i,j,k];
    this.disabledEdits = true;
    setTimeout(() => {
      const selects = document.querySelectorAll<any>('.custom-options');
      console.log(selects);

      for (var i = 0; i < selects.length; i++) {
        selects[i].interfaceOptions = {
          cssClass: 'my-custom-interface'
        };
      };
    }, 500);

  }

  onPastEditSave(){
    var data = JSON.parse(JSON.stringify(this.pastBenchmarks[this.pastEdit[0]][this.pastEdit[1]]));
    for(let exercise of data){
      exercise.measure = JSON.stringify(exercise.measure);
      exercise.name = JSON.stringify(exercise.name.split('\n'));
    }
    this.postService.saveBenchmarks(data).subscribe((response) => {
      console.log(response);
      if(response.message=="success"){
        this.loadBenchmarks();
      }
    })
  }

  onPastEditDelete(){
    this.postService.deleteBenchmark(this.pastBenchmarks[this.pastEdit[0]][this.pastEdit[1]][this.pastEdit[2]]).subscribe((response) => {
      console.log(response);
      if(response.message=="success"){
        this.loadBenchmarks();
      }
    })
  }

  onPastEditCancel(){
    this.pastBenchmarks[this.pastEdit[0]][this.pastEdit[1]][this.pastEdit[2]] = JSON.parse(JSON.stringify(this.benchmarks.filter(benchmark => benchmark._id == this.pastBenchmarks[this.pastEdit[0]][this.pastEdit[1]][this.pastEdit[2]]._id)[0]));
    if(this.activeCat=='Conditioning'){
      this.pastBenchmarks[this.pastEdit[0]][this.pastEdit[1]][this.pastEdit[2]].measure = JSON.parse(this.pastBenchmarks[this.pastEdit[0]][this.pastEdit[1]][this.pastEdit[2]].measure);
      this.pastBenchmarks[this.pastEdit[0]][this.pastEdit[1]][this.pastEdit[2]].name = JSON.parse(this.pastBenchmarks[this.pastEdit[0]][this.pastEdit[1]][this.pastEdit[2]].name).join('\n');
    }
    this.pastEdit = [null, null];
    this.disabledEdits = false;
  }

  onPastEditUp(index){
    if(index!=0){
      var temp = this.pastBenchmarks[this.pastEdit[0]][this.pastEdit[1]][this.pastEdit[2]];
      this.pastBenchmarks[this.pastEdit[0]][this.pastEdit[1]][this.pastEdit[2]] = this.pastBenchmarks[this.pastEdit[0]][this.pastEdit[1]][this.pastEdit[2]-1];
      this.pastBenchmarks[this.pastEdit[0]][this.pastEdit[1]][this.pastEdit[2]-1] = temp;
      this.pastEdit[2]--;
    }
  }

  onPastEditDown(index){
    if(index!=this.pastBenchmarks[this.pastEdit[0]][this.pastEdit[1]].length-1){
      var temp = this.pastBenchmarks[this.pastEdit[0]][this.pastEdit[1]][this.pastEdit[2]];
      this.pastBenchmarks[this.pastEdit[0]][this.pastEdit[1]][this.pastEdit[2]] = this.pastBenchmarks[this.pastEdit[0]][this.pastEdit[1]][this.pastEdit[2]+1];
      this.pastBenchmarks[this.pastEdit[0]][this.pastEdit[1]][this.pastEdit[2]+1] = temp;
      this.pastEdit[2]++;
    }
  }

  onPastEditAddUnit(){
    this.pastBenchmarks[this.pastEdit[0]][this.pastEdit[1]][this.pastEdit[2]].measure.push(this.unitSelector);
    this.pastBenchmarks[this.pastEdit[0]][this.pastEdit[1]][this.pastEdit[2]].priority.push(0);
  }

  onPastUnitUp(index){
     this.pastBenchmarks[this.pastEdit[0]][this.pastEdit[1]][this.pastEdit[2]].priority[index] = 0;
  }

  onPastUnitDown(index){
   this.pastBenchmarks[this.pastEdit[0]][this.pastEdit[1]][this.pastEdit[2]].priority[index] = 1;
  }

  onPastRemoveUnit(index){
    this.pastBenchmarks[this.pastEdit[0]][this.pastEdit[1]][this.pastEdit[2]].measure.splice(index,1);
  }

  liveBenchmark(i){
    this.isNew = false;
    var data = JSON.parse(JSON.stringify(this.exercises[i]));
    for(let exercise of data){
      exercise.measure = JSON.stringify(exercise.measure);
      exercise.priority = JSON.stringify(exercise.priority);
      exercise.name = JSON.stringify(exercise.name.split('\n'));
      exercise.active = false;
    }
    this.postService.savePastBenchmarks(
      {
        season:{
          name: "Season "+(this.pastBenchmarks[i].length+1).toString(),
          type: this.activeCat,
          order:this.pastBenchmarks[i].length+1,
          category: this.categories[i]._id,
        },
        benchmarks: data
     }
    ).subscribe((response) => {
      console.log(response);
      if(response.message=="success"){
        this.loadBenchmarks();
      }
    })
  }

  deleteCat(i){
    if(this.categories[i].isNew==true){
      this.categories.splice(i,1);
      this.exercises.splice(i,1);
      if(this.activeCat=="Conditioning"){
        this.seasons.splice(i,1);
        this.pastBenchmarks.splice(i,1);
      }
      this.editCat = null;
      this.disabledEdits = false;
      this.isNew = false;
    }else{
      this.postService.deleteCat(this.categories[i]).subscribe((response) => {
        console.log(response);
        if(response.message=="success"){
          this.loadBenchmarks();
        }
      })
    }
  }

  saveCat(i){
    if(this.categories[i].name!=''){
      this.postService.saveCats(this.categories).subscribe((response) => {
        console.log(response);
        if(response.message=="success"){
          this.loadBenchmarks();
        }
      })
    }else{
      this.errorsModal("Please fill category name");
    }
  }

  catIndexChange(e){
    console.log(e.detail.value);
    if (this.activeCat=="Strength"){
      var temp = this.categories[this.editCat];
      var tempExercise = this.exercises[this.editCat];
      this.categories.splice(this.editCat,1);
      this.exercises.splice(this.editCat,1);
      this.categories.splice(e.detail.value-1,0,temp);
      this.exercises.splice(e.detail.value-1,0,tempExercise);
      this.editCat = e.detail.value-1;
    }else{
      var temp = this.categories[this.editCat];
      var tempExercise = this.exercises[this.editCat];
      var tempSeasons = this.seasons[this.editCat];
      var tempPast = this.pastBenchmarks[this.editCat];
      this.categories.splice(this.editCat,1);
      this.exercises.splice(this.editCat,1);
      this.seasons.splice(this.editCat,1);
      this.pastBenchmarks.splice(this.editCat,1);
      this.categories.splice(e.detail.value-1,0,temp);
      this.exercises.splice(e.detail.value-1,0,tempExercise);
      this.seasons.splice(e.detail.value-1,0,tempSeasons);
      this.pastBenchmarks.splice(e.detail.value-1,0,tempPast);
      this.editCat = e.detail.value-1;
    }
  }

  addCat(){
    this.categories.unshift({type:this.activeCat,name:'',isNew:true});
    this.exercises.unshift([]);
    if(this.activeCat=="Conditioning"){
      this.pastBenchmarks.unshift([]);
      this.seasons.unshift([]);
    }
    this.editCat = 0;
    this.disabledEdits = true;
    setTimeout(() => {
      const selects = document.querySelectorAll<any>('.custom-options');
      console.log(selects);

      for (var i = 0; i < selects.length; i++) {
        selects[i].interfaceOptions = {
          cssClass: 'my-custom-interface'
        };
      };
    }, 500);
  }

  onEditCat(i){
    this.editCat = i;
    this.disabledEdits = true;
    setTimeout(() => {
      const selects = document.querySelectorAll<any>('.custom-options');
      console.log(selects);

      for (var i = 0; i < selects.length; i++) {
        selects[i].interfaceOptions = {
          cssClass: 'my-custom-interface'
        };
      };
    }, 500);
  }

  strengthcat(){
    this.activeCat = "Strength";
    this.softLoadBenchmarks();
  }

  conditioningcat(){
    this.activeCat = "Conditioning";
    this.softLoadBenchmarks();
  }

  onHome(){
    this.navCtrl.navigateForward('home');
  }

  onTncs(){
    this.navCtrl.navigateForward('tncs');
  }

  onBenchmarks(){
    this.navCtrl.navigateForward('benchmarks');
  }

  customTrackBy(index: number, obj: any): any {
  	return index;
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
