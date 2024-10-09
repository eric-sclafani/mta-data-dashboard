import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { MTADataService } from '../../services/mtadata.service';
import { Ridership } from '../../models/ridership';

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-ridership',
    standalone: true,
    imports: [
        MatSelectModule,
        MatFormFieldModule
    ],
    templateUrl: 'ridership.component.html',
    styleUrl: './ridership.component.scss'
})
export class RidershipComponent implements OnInit {

    private chart: Chart;
    private riderShipAPIData: Ridership[];
    public years: Set<number>;

    public selectedYear = 2020;

    private labels: string[];
    private currentData: number[];

    constructor(private mtaDataService: MTADataService) { }


    ngOnInit(): void {
        this.initRidershipDashboard();
    }

    private initRidershipDashboard(): void {
        this.mtaDataService.getRidershipData().subscribe({
            next: (data) => this.riderShipAPIData = data,

            error: (e) => console.error(e),

            complete: () => {
                this.years = new Set(this.getYears())

                const filtered = this.getSubwayRidershipsFromYear(this.selectedYear);
                this.currentData = filtered.map((record) => parseInt(record.subways_total_estimated_ridership));
                this.labels = filtered.map((record) => new Date(record.date).toLocaleDateString("en-US"));

                this.initChart();
            }
        })
    }

    

    private initChart(): void {

        const data = {
            labels: this.labels,
            datasets: [
                {
                    label: 'Estimated Subway Ridership Per Year',
                    data: this.currentData,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }
            ]
        }

        const config = {
            data: data,
            type: 'line'
        }

        this.chart = new Chart(
            document.getElementById('ridershipPlot') as HTMLCanvasElement,
            config as ChartConfiguration
        );
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









}
