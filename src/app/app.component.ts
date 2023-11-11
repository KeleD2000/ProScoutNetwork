import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ProScoutNetwork';
  spinner: boolean = false;
  showHeaderAndFooter: boolean = true;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

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
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Ellenőrizze, hogy az aktuális útvonal 404-es hiba-e
        const isNotFound = this.activatedRoute.firstChild?.snapshot.url.some(segment => segment.path === 'not-found');
        this.showHeaderAndFooter = !isNotFound;
      }
    });

  }


}
