import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { MTADataService } from '../../services/mtadata.service';
import { Ridership } from '../../models/ridership';

@Component({
    selector: 'app-ridership',
    standalone: true,
    imports: [],
    templateUrl: 'ridership.component.html',
    styleUrl: './ridership.component.scss'
})
export class RidershipComponent implements OnInit {


    private chart: Chart;
    private riderShipData: Ridership[];




    constructor(private mtaDataService: MTADataService) { }


    ngOnInit(): void {
        this.getRidershipData();
        this.initChart();
    }

    private getRidershipData(): void {
        this.mtaDataService.getRidershipData().subscribe({
            next: (data) => this.riderShipData = data,
            error: (e) => console.error(e),
            complete: () => {
                console.info('Ridership data successfully retrieved!');

            }
        })
    }

    private initChart(): void {

        // this.chart = new Chart(
        //     document.getElementById('ridershipPlot') as HTMLCanvasElement,
        //     this.config as ChartConfiguration
        // );
    }

    private getSubwayRidershipsFromYear(year: number): number[] {
        const filtered = this.riderShipData.filter((record) => {
            const recordYear = new Date(record.date).getFullYear();
            return recordYear == year;
        })

        const data = filtered.map((record) => parseInt(record.subways_total_estimated_ridership));
        return data;
    }

    private getUniqueYears(): Set<number> {
        return new Set(
            this.riderShipData.map(record => {
                const year = new Date(record.date).getFullYear();
                return year;
            })
        )
    }







}
