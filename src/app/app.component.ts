import { Component, OnInit} from '@angular/core';
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
export class AppComponent implements OnInit{

    public title = 'MTA Data Dashboard';
    public selectedData:string;

    constructor(private router: Router) { }

    ngOnInit(): void {
        this.toHome();
      }

    public navigateTo():void {
        this.router.navigate([`/${this.selectedData}`]);
    }

    public toHome():void {
        this.router.navigate(['/']);
        this.selectedData = '';
    }
}
