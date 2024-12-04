import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GhIntegrationComponent } from './gh-integration/gh-integration.component';

@Component({
  selector: 'app-root',
  imports: [ RouterOutlet ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'gh-integration-client';
}
