import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { Ridership } from '../models/ridership';

@Injectable({
    providedIn: 'root'
})
export class MTADataService {

    private ridershipUrl = 'https://data.ny.gov/resource/vxuj-8kew.json?$limit=50000';
    private feloniesUrl = 'https://data.ny.gov/resource/yeek-jhmu.json?$limit=50000';

    constructor(private http: HttpClient) { }

    public getRidershipData():Observable<Ridership[]>{
        return this.http.get<Ridership[]>(this.ridershipUrl);	
    }

    
}
