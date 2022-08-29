import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class PostService {

  endpoint = environment.baseUrl;

  constructor(
    private httpClient: HttpClient,
  ) { }

  load(): Observable<any> {
    return this.httpClient.get<any>(this.endpoint + '/homeposts');
  }

  upload(postData): Observable<any>{
    return this.httpClient.post(this.endpoint+'/upload', postData);
  }

  loadPacks(): Observable<any> {
    return this.httpClient.get<any>(this.endpoint + '/getPacks');
  }

  savePacks(pack): Observable<any> {
    console.log(pack);
    return this.httpClient.post(this.endpoint+'/savePacks', pack);
  }

  loadBenchmarks(): Observable<any> {
    return this.httpClient.get<any>(this.endpoint + '/benchmarks');
  }

  saveBenchmarks(benchmarks): Observable<any> {
    return this.httpClient.post(this.endpoint+'/saveBenchmarks', benchmarks);
  }

  deleteBenchmark(benchmark): Observable<any> {
    return this.httpClient.post(this.endpoint+'/deleteBenchmark', {id:benchmark._id});
  }

  saveCats(categories): Observable<any> {
    return this.httpClient.post(this.endpoint+'/saveCategories', categories);
  }

  deleteCat(category): Observable<any> {
    return this.httpClient.post(this.endpoint+'/deleteCategory', {id:category._id});
  }

  savePastBenchmarks(benchmarks): Observable<any> {
    return this.httpClient.post(this.endpoint+'/savePastBenchmarks', benchmarks);
  }

  deleteSeason(season): Observable<any> {
    return this.httpClient.post(this.endpoint+'/deleteSeason', {id:season._id});
  }

  saveSeasons(seasons): Observable<any> {
    return this.httpClient.post(this.endpoint+'/saveSeasons', seasons);
  }
}
