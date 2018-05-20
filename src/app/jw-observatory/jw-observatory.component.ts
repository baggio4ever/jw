import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { JwHttpService, TemperatureData, Observatory } from '../jw-http.service';

@Component({
  selector: 'app-jw-observatory',
  templateUrl: './jw-observatory.component.html',
  styleUrls: ['./jw-observatory.component.css']
})
export class JwObservatoryComponent implements OnInit {

  private _name: string;
  observatory_info: Observatory;

  // @Input() observatory: Observatory;  // obsolete
  @Input()
  set observatory_name( name:string ) {
    this._name = name;

    if(this._name) {
      this.httpService.getObservatory(
        this._name,
        data => {
          this.observatory_info = data;
          // console.log(this.observatory_info);
        }
      );
    }
  }

  constructor(private httpService: JwHttpService) { }

  ngOnInit() {
  }

  getType( t: string ): string {
    // console.log('observatory: ' + this.observatory);

    let ret = '-';
    switch(t) {
      case '官':
        ret = '気象官署';
        break;
      case '四':
        ret = '四要素観測所';
        break;
      case '三':
        ret = '三要素観測所';
        break;
      case '雨':
        ret = '雨量観測所';
        break;
      default:
        break;
    }
    return ret;
  }

}
