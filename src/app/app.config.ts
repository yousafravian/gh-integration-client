import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiInterceptor } from './core/interceptor/api.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideEnvironmentNgxLoaderIndicator } from 'ngx-loader-indicator';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: { path: 'realtime-data' } };

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection( { eventCoalescing: true } ),
    provideRouter( routes ),
    provideAnimationsAsync(),
    provideAnimations(),
    provideLottieOptions( {
      player: () => player,
    } ),
    importProvidersFrom( SocketIoModule.forRoot( config ) ),
    provideEnvironmentNgxLoaderIndicator(),
    provideHttpClient(
      withInterceptors( [
        apiInterceptor
      ] )
    ), provideAnimationsAsync()
  ]
};
