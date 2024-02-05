import { Component, HostListener } from '@angular/core';
import { faBars, faX } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isScrollingDown = false;
  faHamb = faBars
  faClose = faX;
  isMobileNavActive: boolean = false;
  isItPlayer: boolean = false;
  isItScout: boolean = false;
  isItAdmin: boolean = false;


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
      localStorage.removeItem('isBid');
      this.isItPlayer = false;
    }else if(localStorage.getItem('isScout')){
      localStorage.removeItem('isScout');
      localStorage.removeItem('isBid');
      this.isItScout = false;
    }else if(localStorage.getItem('isAdmin')){
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('isBid');
      this.isItAdmin = false;
    }
    localStorage.removeItem('isLoggedin');
  }

  ngOnInit(){
    if(localStorage.getItem('isPlayer')){
      this.isItPlayer = true;
    }else if(localStorage.getItem('isScout')){
      this.isItScout = true;
    }else if(localStorage.getItem('isAdmin')){
      this.isItAdmin = true;
    }

    console.log(this.isMobileNavActive);
  }

}
