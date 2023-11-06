import { Component } from '@angular/core';
import { NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ProScoutNetwork';
  spinner: boolean = false;

  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.spinner = true;
      } else if (event instanceof NavigationEnd || event instanceof NavigationError) {
        setTimeout(() => {
          this.spinner = false;
        }, 2500);
      }
    });
  }


}
