import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  user: string | null = null;

  constructor(private router: Router) {}

  isCurrentRoute(route: string): boolean {
    return this.router.url === route;
  }

  forHome(): void {
    this.router.navigate(['/home']);
  }

  forFinanceiro(): void {
    this.router.navigate(['/financeiro']);
  }

  forClassificacao(): void {
    this.router.navigate(['/classificacao']);
  }
  forPesagem(): void {
    this.router.navigate(['/pesagem']);
  }

  ngOnInit(): void {
    const storedUser = localStorage.getItem("user");
    if (storedUser !== null) {
      this.user = storedUser;
    }
  }
}
