import { Component, OnInit, AfterViewInit, AfterViewChecked, Inject, Sanitizer,VERSION } from '@angular/core';
import {JwHttpService,TemperatureData} from './jw-http.service';

const KEY_BASE_URL = 'KEY_JW_BASE_URL';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, AfterViewChecked, OnInit {

  angular_version = VERSION;

  base_url = '';

  constructor(private httpService: JwHttpService) {
  }

  ngOnInit() {
    console.log('ngOnInit()');

    this.base_url = localStorage.getItem(KEY_BASE_URL);
    this.httpService.setBaseURL(this.base_url);
  }

  ngAfterViewInit() {
    console.log('ngViewInit()');

  }

  ngAfterViewChecked() {
    //    console.log('AfterViewChecked');
  }

  onChanged(fileVal) {
    console.log('onChanged: ' + fileVal.name);
  }

  yes() {
    this.httpService.getHighestTop(
      '2018/05/01',
      5,
      data => {
        console.log(data);
      }
    );
  }

  applyBaseUrl(): void {
    console.log(this.base_url);

    localStorage.setItem(KEY_BASE_URL, this.base_url);
    this.httpService.setBaseURL(this.base_url);
  }
}
