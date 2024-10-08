import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

    public title = 'MTA Data Dashboard';
    public selectedData:string = '';

    constructor(private _router: Router) { }


    public navigateTo():void {
        this._router.navigate([`/${this.selectedData}`]);
    }

    public toHome():void {
        this._router.navigate(['/']);
        this.selectedData = '';
    }




  // major felonies
  // https://data.ny.gov/resource/yeek-jhmu.json?$limit=50000
}
