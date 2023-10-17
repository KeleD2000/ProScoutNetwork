import { Component, HostListener } from '@angular/core';
import { faBars } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isScrollingDown = false;
  faHamb = faBars
  isMobileNavActive: boolean = false;


  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    if (scrollY > 0) {
      this.isScrollingDown = true;
    } else {
      this.isScrollingDown = false;
    }
  }

  toggleMobileNav() {
    this.isMobileNavActive = !this.isMobileNavActive;
    console.log("szar");
  }

}
