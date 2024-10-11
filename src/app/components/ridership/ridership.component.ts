import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';
import { MTADataService } from '../../services/mtadata.service';
import { Ridership } from '../../models/ridership';

import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-ridership',
    standalone: true,
    imports: [
        MatSelectModule,
        MatFormFieldModule,
        MatButtonModule
    ],
    templateUrl: 'ridership.component.html',
    styleUrl: './ridership.component.scss'
})
export class RidershipComponent implements OnInit {

    public chart: Chart;
    public years: Set<number>;
    public selectedYear = 2020;

    private riderShipAPIData: Ridership[];
    private labels: string[];

    private subwayRiders: number[];
    private busRiders: number[];


    constructor(private mtaDataService: MTADataService) { }


    ngOnInit(): void {
        Chart.register(zoomPlugin);
        this.initRidershipDashboard();
    }

    public applyChartUpdate(): void {
        this.setInstanceData();
        this.removeOldData();
        this.refreshData();

    }

    private initRidershipDashboard(): void {
        this.mtaDataService.getRidershipData().subscribe({
            next: (data) => this.riderShipAPIData = data,

            error: (e) => console.error(e),

            complete: () => {
                this.years = new Set(this.getYears())
                this.setInstanceData();
                this.initChart();
            }
        })
    }

    private getYears(): number[] {
        return this.riderShipAPIData.map(record => {
            const year = new Date(record.date).getFullYear();
            return year;
        })

    }


    private initChart(): void {

        const data = {
            labels: this.labels,
            datasets: [
                {
                    label: 'Estimated Subway Ridership',
                    data: this.subwayRiders,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                },
                {
                    label: 'Estimated Bus Ridership',
                    data: this.busRiders,
                    fill: false,
                    borderColor: 'rgb(80, 51, 231)',
                    tension: 0.1
                },

            ]
        }

        const config = {
            data: data,
            type: 'line',
            options: {
                plugins: {
                    zoom: {
                        zoom: {
                            drag: {
                                enabled: true,
                                backgroundColor: 'rgb( 163, 247, 254, 0.3)'
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: '# of Subway Riders (est.)',
                            font: {
                                size: 20
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Day',
                            font: {
                                size: 20
                            }
                        }
                    }
                },
            }

        }

        this.chart = new Chart(
            document.getElementById('ridershipPlot') as HTMLCanvasElement,
            config as ChartConfiguration
        );
    }

    private setInstanceData(): void {
        const filtered = this.filterDataByYear(this.selectedYear);
        this.labels = filtered.map((record) => new Date(record.date).toLocaleDateString("en-US"));
        this.subwayRiders = this.getSubwayData(filtered);
        this.busRiders = this.getBusData(filtered);

    }



    private getSubwayData(filteredData: Ridership[]): number[] {
        return filteredData.map((record) => parseInt(record.subways_total_estimated_ridership));
    }

    private getBusData(filteredData: Ridership[]): number[] {
        return filteredData.map((record) => parseInt(record.buses_total_estimated_ridersip));
    }

    private filterDataByYear(year: number): Ridership[] {

        const filtered = this.riderShipAPIData.filter((record) => {
            const recordYear = new Date(record.date).getFullYear();
            return recordYear == year;
        })

        return filtered;
    }

    private refreshData() {
        this.chart.data.labels = this.labels;
        this.chart.data.datasets.forEach((dataset: any) => {

            switch (dataset.label) {

                case 'Estimated Subway Ridership':
                    dataset.data = this.subwayRiders;
                    break;

                case 'Estimated Bus Ridership':
                    dataset.data = this.busRiders;
                    break;
            }

        });
        this.chart.update();
    }

    private removeOldData(): void {
        this.chart.data.labels = [];
        this.chart.data.datasets.forEach((dataset) => {
            dataset.data = [];
        });
        this.chart.update();
    }


}
