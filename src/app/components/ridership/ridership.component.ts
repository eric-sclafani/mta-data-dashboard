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
    private currentData: number[];

    constructor(private mtaDataService: MTADataService) { }


    ngOnInit(): void {
        Chart.register(zoomPlugin);
        this.initRidershipDashboard();
    }

    public applyChartUpdate(): void {
        this.setChartData();
        this.removeData();
        this.addData();

    }

    private initRidershipDashboard(): void {
        this.mtaDataService.getRidershipData().subscribe({
            next: (data) => this.riderShipAPIData = data,

            error: (e) => console.error(e),

            complete: () => {
                this.years = new Set(this.getYears())
                this.setChartData();
                this.initChart();
            }
        })
    }



    private initChart(): void {

        const data = {
            labels: this.labels,
            datasets: [
                {
                    label: 'Estimated Subway Ridership',
                    data: this.currentData,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }
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

    private setChartData(): void {
        const filtered = this.getSubwayRidershipsFromYear(this.selectedYear);
        this.currentData = filtered.map((record) => parseInt(record.subways_total_estimated_ridership));
        this.labels = filtered.map((record) => new Date(record.date).toLocaleDateString("en-US"));
    }

    private getYears(): number[] {
        return this.riderShipAPIData.map(record => {
            const year = new Date(record.date).getFullYear();
            return year;
        })

    }

    private getSubwayRidershipsFromYear(year: number): Ridership[] {

        const filtered = this.riderShipAPIData.filter((record) => {
            const recordYear = new Date(record.date).getFullYear();
            return recordYear == year;
        })

        return filtered;
    }

    private addData() {
        this.chart.data.labels = this.labels;
        this.chart.data.datasets.forEach((dataset: any) => {
            dataset.data = this.currentData;
        });
        this.chart.update();
    }

    private removeData(): void {
        this.chart.data.labels = [];
        this.chart.data.datasets.forEach((dataset) => {
            dataset.data = [];
        });
        this.chart.update();
    }












}
