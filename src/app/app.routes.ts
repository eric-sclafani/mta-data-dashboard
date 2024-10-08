import { Routes } from '@angular/router';
import { RidershipComponent } from './components/ridership/ridership.component';
import { FeloniesComponent } from './components/felonies/felonies.component';

export const routes: Routes = [
    { path: 'ridership', component: RidershipComponent},
    { path: 'felonies', component: FeloniesComponent},

  
];
