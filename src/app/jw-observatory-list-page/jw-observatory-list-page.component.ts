import { Component, OnInit } from '@angular/core';
import { JwHttpService, TemperatureData, Observatory } from '../jw-http.service';

@Component({
  selector: 'app-jw-observatory-list-page',
  templateUrl: './jw-observatory-list-page.component.html',
  styleUrls: ['./jw-observatory-list-page.component.css']
})
export class JwObservatoryListPageComponent implements OnInit {

  observatoryList: {[key:string]:string[]};
  prefectures: string[] = [];

  selectedObservatories: string[] = [];

  constructor(private httpService: JwHttpService) { }

  ngOnInit() {
    this.download_test();
  }

  download_test() {
    console.log('さあ、どうだ');

    this.httpService.getObservatoryList( (data) => {
      //console.log('----- json -----');
      this.observatoryList = data;
      for(let key in this.observatoryList) {
        this.prefectures.push(key);
      }
    });
  }

  objectKeys(obj) {
    return Object.keys(obj);
  }

  subItemClicked(placeName) {
    console.log('clicked: ' + placeName);

    if(this.selectedObservatories.includes(placeName)) {
      console.log('すでに登録済み');
    } else {
      console.log('お初にお目にかかります');
      this.selectedObservatories.push(placeName);
    }
  }
}
