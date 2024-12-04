import { Routes } from '@angular/router';
import { GhIntegrationComponent } from './gh-integration/gh-integration.component';
import { GhIntegrationCallbackComponent } from './gh-integration-callback/gh-integration-callback.component';

export const routes: Routes = [
  {
    path: '',
    component: GhIntegrationComponent
  },
  {
    path: 'callback',
    component: GhIntegrationCallbackComponent
  }
];
