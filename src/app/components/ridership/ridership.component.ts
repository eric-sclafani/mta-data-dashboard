import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js/auto';

@Component({
  selector: 'app-ridership',
  standalone: true,
  imports: [],
  template: `
     <div style="width: 800px;">
        <canvas id="acquisitions"></canvas>
    </div>
    `,
  styleUrl: './ridership.component.scss'
})
export class RidershipComponent implements OnInit{

    private data = [
        { year: 2010, count: 10 },
        { year: 2011, count: 20 },
        { year: 2012, count: 15 },
        { year: 2013, count: 25 },
        { year: 2014, count: 22 },
        { year: 2015, count: 30 },
        { year: 2016, count: 28 },
      ];

      private config = {
        type: 'bar',
        data: {
          labels: this.data.map(row => row.year),
          datasets: [
            {
              label: 'Acquisitions by year',
              data: this.data.map(row => row.count)
            }
          ]
        }
      }
   
    ngOnInit(): void {

        const chart = new Chart(
            document.getElementById('acquisitions') as HTMLCanvasElement,
            this.config as ChartConfiguration
        );

    

    

    //https://data.ny.gov/resource/vxuj-8kew.json?$limit=50000
    }
}
