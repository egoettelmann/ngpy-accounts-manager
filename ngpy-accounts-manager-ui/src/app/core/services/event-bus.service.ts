import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

/**
 * The event bus message interface
 */
interface EventBusMessage {
  channel: string;
  message: any;
}

/**
 * The event bus service
 */
@Injectable()
export class EventBusService {

  /**
   * The event bus
   */
  private eventBus = new Subject<EventBusMessage>();

  /**
   * Publishes an optional message on the provided channel.
   *
   * @param channel the channel to publish to
   * @param message the message to publish
   */
  publish(channel: string, message?: any) {
    this.eventBus.next({
      channel: channel,
      message: message
    });
  }

  /**
   * Accepts all messages sent to the channels matching the provided patterns.
   *
   * @param patterns the channel patterns to accept messages from
   */
  accept(patterns: string []): Observable<any> {
    return this.eventBus.pipe(
      filter(event => {
        return patterns.some(pattern => {
          return this.matches(event.channel, pattern);
        });
      }),
      map(event => event.message)
    );
  }

  /**
   * Checks if a given channel matches the provided pattern.
   *
   * @param channel the channel to check
   * @param pattern the pattern to match
   */
  private matches(channel: string, pattern: string): boolean {
    let regexp = pattern.replace('.', '\\.');
    regexp = regexp.replace('*', '.+');
    const regExp = new RegExp('^' + regexp + '$');
    return regExp.test(channel);
  }

}
