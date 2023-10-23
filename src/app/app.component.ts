import { Component, OnInit, ViewChild } from '@angular/core';


import { io } from 'socket.io-client'
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public chartInputData : any = [];
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;

  public  socket = io("ws://localhost:4000", {
    reconnectionDelayMax: 10000,
  });

  constructor() {

  
      this.chartOptions = {
        series: [
          {
            name: "candle",
            data: this.chartInputData ? this.chartInputData : []
          }
        ],
        chart: {
          type: "candlestick",
          height: 350
        },
        title: {
          text: "CandleStick Chart",
          align: "left"
        },
        xaxis: {
          type: "datetime"
        },
        yaxis: {
          tooltip: {
            enabled: true
          }
        }
      };
  }


  public generateDayWiseTimeSeries(baseval: any, count: any, yrange: any) {
    var i = 0;
    var series = [];
    while (i < count) {
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push([baseval, y]);
      baseval += 86400000;
      i++;
    }
    return series;
  }
  

  ngOnInit() {
    
    this.socket.on('stock_data_update', (data) => {
      // console.log(data);
      
      if(data) {
        
        this.chartInputData = [];
        data.forEach((element: any) => {
            
            console.log(element.symbol, [ element.open, element.high, element.low, element.close ] );
            
            this.chartInputData.push({
              x : element.symbol,
              y : [ element.open, element.high, element.low, element.close ]
            })
        });
        
      }

      this.chart.updateOptions({
        series : [
          {
            name : 'Candle',
            data : this.chartInputData
          }
        ],
        chart: {
          type: "candlestick",
          height: 350
        },
        title: {
          text: "CandleStick Chart",
          align: "left"
        },
        xaxis: {
          type: "string"
        },
        yaxis: {
          tooltip: {
            enabled: true
          }
        }
      })

      console.log(this.chartInputData);

    })

    

  }

  title = 'websocketfront';


}
