import { Component, Input, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import {Chart} from 'chart.js';

const DEFAULT_MAX_RAIN24H = 100;

@Component({
  selector: 'app-jw-chart',
  templateUrl: './jw-chart.component.html',
  styleUrls: ['./jw-chart.component.css']
})
export class JwChartComponent implements OnInit, AfterViewInit {
  
  context: CanvasRenderingContext2D;

  myChart = null;

  @ViewChild('myChart') myCanvas;

  private _caption: string = '';
  private _labels: string[] = [];
  private _highest = [];
  private _lowest = [];
  private _rain24h: number[] = [];

  @Input()
  set caption( caption:string ) {
    this._caption = caption;
    console.log('set caption');
    this.update();
  }

  @Input()
  set labels( labels:string[] ) {
    this._labels = labels;
    console.log('set labels');
    this.update();
  }

  @Input()
  set highest( highest ) {
    this._highest = highest;
    console.log('set highest');
    this.update();
  }

  @Input()
  set lowest( lowest ) {
    this._lowest = lowest;
    console.log('set lowest');
    this.update();
  }

  @Input()
  set rain24h( rain24h ) {
    this._rain24h = rain24h;
    console.log('set rain24h');
    this.update();
  }
//  @Input() snow = [];

  defaultLabels = ['', '', '', '', '', ''];
  defaultHighest = [12, 25.5, 3, 5, 2, 3];
  defaultLowest = [2, 9, -3, -5, -2, -10.8];
  defaultRain24h = [0, 0, 0, 0, 0, 0];
//  defaultSnow = [20, 190, 120, 0, 18, 3];

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const canvas = this.myCanvas.nativeElement;
    this.context = canvas.getContext('2d');

    if(this._labels.length==0) {
      this._labels = this.defaultLabels;
    }
    if(this._highest.length==0) {
      this.highest = this.defaultHighest;
    }
    if(this._lowest.length==0) {
      this.lowest = this.defaultLowest;
    }
    if(this._rain24h.length==0) {
      this.rain24h = this.defaultRain24h;
    }
//    if(this.snow.length==0) {
//      this.snow = this.defaultSnow;
//    }

    this.myChart = new Chart(this.context, {
      type: 'bar',
      data: {
        labels: this._labels,
        datasets: [{
          type: 'line',
          label: '最高気温[℃]',
          data: this._highest,
          backgroundColor: 'rgba(255,10,10,0.2)',
          borderColor: 'rgba(255,10,10,0.5)',
          pointBackgroundColor: "rgba(255,10,10,0.2)",
          borderWidth: 2,
          fill: false,
          yAxisID: "y-axis-1",
        },
        {
          type: 'line',
          label: '最低気温[℃]',
          data: this._lowest,
          pointStyle: 'triangle',
          backgroundColor: 'rgba(10,10,255,0.2)',
          borderColor: 'rgba(10,10,255,0.5)',
          pointBackgroundColor: 'rgba(10,10,255,0.2)',
          borderWidth: 2,
          fill: false,
          yAxisID: "y-axis-1",
        },
        {
          type: 'bar',
          label: '24h降水量[mm]',
          data: this._rain24h,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          yAxisID: "y-axis-2",
        },
/*        {
          type: 'bar',
          label: '積雪量[cm]',
          data: this.snow,
          backgroundColor: 'rgba(50, 50, 50, 0.2)',
          borderColor: 'rgba(50, 50, 50, 1)',
          borderWidth: 1,
          yAxisID: "y-axis-2",
        }*/]
      },
      options: {
        responsive: false,
        title: {
          display: true,
          text: this._caption, //'XXX の　情報',
        },
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 20,
          }
        },
        scales: {
          yAxes: [{
            id: 'y-axis-1',   // Y軸のID
            type: 'linear',   // linear固定
            position: 'left', // どちら側に表示される軸か？
            ticks: {          // スケール
              max: 40,
              min: -20,
              stepSize: 10
            },
            scaleLabel: {
              display: true,
              labelString: '温度[℃]',
            },
//            gridLines: {
//              color: 'rgba(200,255,200,1)',
//            },
          }, {
            id: 'y-axis-2',
            type: 'linear',
            position: 'right',
            ticks: {
              max: this.getMaxRain24h(),
              min: 0,
              stepSize: 20
            },
            scaleLabel: {
              display: true,
              labelString: '降水量[mm]',
            },
            gridLines: {
//              color: 'rgba(200,200,255,1)',
              drawOnChartArea: false,
            },
          }],
        }
      }
    });

  }

  getMaxRain24h() {
    const max = Math.max(...this._rain24h);
    const mix = Math.min(...this._rain24h);

    if( max>DEFAULT_MAX_RAIN24H ) {
      return Math.ceil(max/20)*20 + 20;
    } else {
      return DEFAULT_MAX_RAIN24H;
    }
  }

  update() {
    if(this.myChart) {
    console.log('ん？呼んだ？');

    this.myChart.data.labels = this._labels;

    this.myChart.data.datasets[0].data = this._highest;
    this.myChart.data.datasets[1].data = this._lowest;
    this.myChart.data.datasets[2].data = this._rain24h;
    this.myChart.options.scales.yAxes[1].ticks.max = this.getMaxRain24h();
//    this.myChart.data.datasets[3].data = this.snow;

    this.myChart.update();
    } else {
      console.log('まだnullっぽい');
    }
  }
}
