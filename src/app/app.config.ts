import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiInterceptor } from './core/interceptor/api.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideEnvironmentNgxLoaderIndicator } from 'ngx-loader-indicator';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideAnimations(),
    provideEnvironmentNgxLoaderIndicator(),
    provideHttpClient(
      withInterceptors([
        apiInterceptor
      ])
    )
  ]
};
