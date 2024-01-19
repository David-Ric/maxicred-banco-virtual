import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit{
  @ViewChild('drawer') drawer!: MatSidenav;
  isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(result => result.matches)
  );

  user: string | null = null;

  isMenuOpen: boolean = false;

  constructor(private breakpointObserver: BreakpointObserver,private cookie: CookieService, private router: Router) {}

  isCurrentRoute(route: string): boolean {
    return this.router.url === route;
  }

  toggleSidenav() {
    if (this.drawer) {
      this.drawer.toggle();
      this.isMenuOpen = !this.isMenuOpen;
      console.log("menu-open",this.isMenuOpen)
    }
  }
  handleLogout(): void {
    this.cookie.delete('T_USER');
    localStorage.removeItem('user');
    window.location.reload();
    void this.router.navigate(['/home']);

  }

  ngOnInit(): void {
    const storedUser = localStorage.getItem("user");
    if (storedUser !== null) {
      this.user = storedUser;
    }
  }
}
