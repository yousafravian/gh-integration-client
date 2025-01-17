import { Component, inject, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBar, MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { GhIntegrationService } from '../core/services/gh-integration.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SessionService } from '../core/services/session-service.service';
import { io, Socket } from 'socket.io-client';

@Component({
  selector: 'app-gh-integration-cb',
  imports: [
    MatProgressBarModule,
    MatSnackBarModule
  ],
  templateUrl: './gh-integration-callback.component.html',
  styleUrl: './gh-integration-callback.component.scss'
})
export class GhIntegrationCallbackComponent implements OnInit {
  #activatedRoute = inject(ActivatedRoute);
  #router = inject(Router);
  #ghIntegrationService = inject(GhIntegrationService);
  #sessionService = inject(SessionService);
  #snackBar = inject(MatSnackBar);
  socket?: Socket;

  ngOnInit() {
    this.socket = io( "ws://localhost:3000", {
      transports: [ 'websocket' ],
    } );
    if (!this.#activatedRoute.snapshot.queryParams?.['code']) {
      this.#snackBar.open('No code provided', 'Dismiss');
    }

    this.#ghIntegrationService.login(this.#activatedRoute.snapshot.queryParams['code'])
      .subscribe({
        next: (res) => {
          console.log(res);
          if ( res.payload.token ) {
            this.#sessionService.setToken(res.payload.token);
            this.#sessionService.setUser(res.payload);
            this.#router.navigate(['/']);
          }
        },
        error: (e) => {
          this.#snackBar.open('Error logging in', 'Dismiss');
          this.#router.navigate(['/']);
          console.error(e);
        }
      })

    this.socket.on('syncProcessing', (data) => {

    });
  }
}
