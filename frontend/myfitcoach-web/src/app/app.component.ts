import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'MyFitCoach';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const path = this.router.url;

    if (path === '/' || path === '/welcome') {
      if (this.authService.isLoggedIn()) {
        this.router.navigate(['/dashboard'], { replaceUrl: true });
      } else {
        this.router.navigate(['/welcome'], { replaceUrl: true });
      }
    }
  }
}
