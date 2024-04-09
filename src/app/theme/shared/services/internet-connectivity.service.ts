import { Injectable } from '@angular/core';
import { Observable, fromEvent, merge } from 'rxjs';
import { map, startWith, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InternetConnectivityService {

  constructor() { }

  checkInternetConnectivity(): Observable<boolean> {
    const online$ = fromEvent(window, 'online').pipe(map(() => true));
    const offline$ = fromEvent(window, 'offline').pipe(map(() => false));

    // Merge online and offline events into a single observable
    return merge(online$, offline$).pipe(
      startWith(navigator.onLine), // Emit current status on subscription
      distinctUntilChanged() // Only emit when status changes
    );
  }

}
