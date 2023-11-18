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
  isItPlayer: boolean = false;
  isItScout: boolean = false;


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

  }

  logout(){
    if(localStorage.getItem('isPlayer')){
      localStorage.removeItem('isPlayer');
      this.isItPlayer = false;
    }else if(localStorage.getItem('isScout')){
      localStorage.removeItem('isScout');
      this.isItScout = false;
    }
    localStorage.removeItem('isLoggedin');
  }

  ngOnInit(){
    if(localStorage.getItem('isPlayer')){
      this.isItPlayer = true;
    }else if(localStorage.getItem('isScout')){
      this.isItScout = true;
    }
  }

}
