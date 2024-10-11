import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';
import { MTADataService } from '../../services/mtadata.service';
import { Ridership } from '../../models/ridership';
import { Dataset } from '../../models/dataset';

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

    
    private riderShipAPIData: Ridership[];
    private labels: string[];
    private currentDataView: Dataset;
    private ridershipTypes:Record<string,string> = {
        'Estimated Subway Ridership' : 'subways_total_estimated_ridership',
        'Estimated Bus Ridership' : 'buses_total_estimated_ridersip', 
        'Estimated LIRR Ridership' : 'lirr_total_estimated_ridership',
        'Estimated Metro-North Ridership' : 'metro_north_total_estimated_ridership',
        'Estimated Bridges and Tunnels Traffic' : 'bridges_and_tunnels_total_traffic',
    }

    public ridershipTypeNames = Object.keys(this.ridershipTypes);
    public chart: Chart;
    public years: Set<number>;
    public selectedYear = 2020;
    public selectedView = 'Estimated Subway Ridership'

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

    private setInstanceData():void {
        const filtered = this.filterDataByYear(this.selectedYear);
        this.labels = filtered.map((record) => new Date(record.date).toLocaleDateString("en-US"));
        this.setDataView(filtered);
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
            datasets: [this.currentDataView]
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
                            text: 'Traffic (est.)',
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

        config.data = data;
        this.chart = new Chart(
            document.getElementById('ridershipPlot') as HTMLCanvasElement,
            config as ChartConfiguration
        );
    }

    private setDataView(filteredAPIData: Ridership[]):void{
        const possibleColors = [
            'rgb(75, 192, 192)',
            'rgb( 92, 157, 14)',
            'rgb( 212, 139, 36)',
            'rgb( 62, 193, 14)',
            'rgb( 193, 14, 134)',
            'rgb( 193, 14, 87)'
        ]
        let idx = Math.floor(Math.random() * possibleColors.length);

        const dataView = {
            label: this.selectedView,
            data: this.getNumericData(filteredAPIData, this.ridershipTypes[this.selectedView]),
            fill: false,
            borderColor: possibleColors[idx],
            tension: 0.1
        }

        this.currentDataView = dataView;
    }

    private getNumericData(filteredData:Ridership[], field:string):number[]{
        return filteredData.map((record:any) => parseInt(record[field]));
    }

    private filterDataByYear(year: number): Ridership[] {

        const filtered = this.riderShipAPIData.filter((record) => {
            const recordYear = new Date(record.date).getFullYear();
            return recordYear == year;
        })

        return filtered;
    }

    private refreshData():void {
        this.chart.data.labels = this.labels;
        this.chart.data.datasets = [this.currentDataView];
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
