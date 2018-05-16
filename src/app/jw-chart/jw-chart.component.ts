import { Component, Input, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import {Chart} from 'chart.js';

@Component({
  selector: 'app-jw-chart',
  templateUrl: './jw-chart.component.html',
  styleUrls: ['./jw-chart.component.css']
})
export class JwChartComponent implements OnInit, AfterViewInit {
  
  context: CanvasRenderingContext2D;

  myChart = null;

  @ViewChild('myChart') myCanvas;

  @Input() caption:string = '';
  @Input() labels = [];
  @Input() highest = [];
  @Input() lowest = [];
  @Input() rain24h = [];
  @Input() snow = [];

  defaultLabels = ['5/1', '5/2', '5/3', '5/4', '5/5', '5/6'];
  defaultHighest = [12, 25.5, 3, 5, 2, 3];
  defaultLowest = [2, 9, -3, -5, -2, -10.8];
  defaultRain24h = [18, 39, 30, 15, 22, 3];
  defaultSnow = [20, 190, 120, 0, 18, 3];

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const canvas = this.myCanvas.nativeElement;
    this.context = canvas.getContext('2d');

    if(this.labels.length==0) {
      this.labels = this.defaultLabels;
    }
    if(this.highest.length==0) {
      this.highest = this.defaultHighest;
    }
    if(this.lowest.length==0) {
      this.lowest = this.defaultLowest;
    }
    if(this.rain24h.length==0) {
      this.rain24h = this.defaultRain24h;
    }
    if(this.snow.length==0) {
      this.snow = this.defaultSnow;
    }

    this.myChart = new Chart(this.context, {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [{
          type: 'line',
          label: '最高気温[℃]',
          data: this.highest,
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
          data: this.lowest,
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
          data: this.rain24h,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          yAxisID: "y-axis-2",
        },
        {
          type: 'bar',
          label: '積雪量[cm]',
          data: this.snow,
          backgroundColor: 'rgba(50, 50, 50, 0.2)',
          borderColor: 'rgba(50, 50, 50, 1)',
          borderWidth: 1,
          yAxisID: "y-axis-2",
        }]
      },
      options: {
        responsive: false,
        title: {
          display: true,
          text: this.caption, //'XXX の　情報',
        },
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 20,
          }
        },
        scales: {
          yAxes: [{
            id: "y-axis-1",   // Y軸のID
            type: "linear",   // linear固定 
            position: "left", // どちら側に表示される軸か？
            ticks: {          // スケール
              max: 35,
              min: -30,
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
            id: "y-axis-2",
            type: "linear",
            position: "right",
            ticks: {
              max: 300,
              min: 0,
              stepSize: 100
            },
            scaleLabel: {
              display: true,
              labelString: '降水量/積雪量[cm]',
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

  update() {
    console.log('ん？呼んだ？');

    this.myChart.data.labels = this.labels;

    this.myChart.data.datasets[0].data = this.highest;
    this.myChart.data.datasets[1].data = this.lowest;
    this.myChart.data.datasets[2].data = this.rain24h;
    this.myChart.data.datasets[3].data = this.snow;

    this.myChart.update();
  }
}
