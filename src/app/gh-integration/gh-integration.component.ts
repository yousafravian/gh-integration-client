import { Component, inject } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { GhIntegrationService } from '../core/services/gh-integration.service';
import { SessionService } from '../core/services/session-service.service';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';
import { GhIntegrationDataComponent } from '../gh-integration-data/gh-integration-data.component';

@Component({
  selector: 'app-gh-integration',
  imports: [
    MatExpansionModule,
    MatButtonModule,
    MatRippleModule,
    MatTooltipModule,
    DatePipe,
    GhIntegrationDataComponent
  ],
  templateUrl: './gh-integration.component.html',
  styleUrl: './gh-integration.component.scss'
})
export class GhIntegrationComponent {
  #ghIntegrationService = inject(GhIntegrationService);
  sessionService = inject(SessionService);

  onGHLogin() {
    this.#ghIntegrationService.getCode();
  }

  syncInfo( $event: MouseEvent ) {
    $event.stopImmediatePropagation();
    this.onGHLogin();
  }

  onGHLogout() {
    this.#ghIntegrationService.logout();
  }
}
