import { Routes } from '@angular/router';
import { RidershipComponent } from './components/ridership/ridership.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'ridership', component: RidershipComponent},
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
