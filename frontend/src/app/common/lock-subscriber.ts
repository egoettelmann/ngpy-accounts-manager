import { Subscriber } from 'rxjs/Subscriber';
import { TeardownLogic } from 'rxjs/Subscription';
import { MonoTypeOperatorFunction } from 'rxjs/interfaces';
import { Observable } from 'rxjs/Observable';
import { Operator } from 'rxjs/Operator';
import { Subject } from 'rxjs/Subject';
import { catchError, filter } from 'rxjs/operators';
import { _throw } from 'rxjs/observable/throw';

/**
 * Locks all subscription with a given subscription lock.
 * Allows to perform synchronous operations and prevent any other subscription call during those operations.
 *
 * @param {SubscriptionLock} subscriptionLock the subscription lock
 * @param {number} buffer the number of emitted values (during an ongoing lock) to keep
 * @returns {MonoTypeOperatorFunction<T>}
 */
export function lock<T>(subscriptionLock: SubscriptionLock, buffer = 1): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) => source.lift(new LockOperator(subscriptionLock, buffer));
}

/**
 * The lock operator that creates a new lock subscription on the source observable.
 */
class LockOperator<T> implements Operator<T, T> {
  constructor(private subscriptionLock: SubscriptionLock,
              private buffer: number) {
  }

  call(subscriber: Subscriber<T>, source: Observable<T>): TeardownLogic {
    return source.subscribe(new LockSubscriber(subscriber, this.subscriptionLock, this.buffer));
  }
}

/**
 * A lock subscriber that takes a destination and a subscription lock.
 * Events on the destination will only be emitted once the lock is released.
 * An optional buffer can be given to keep only a limited list of values to re-emit:
 *  - a buffer value of 1 (default) will keep only the latest value
 *  - a buffer value of 0 will ignore events if the lock is set
 *  - a buffer value of -1 will keep all values
 *  - a buffer value of n will keep the n latest values
 */
class LockSubscriber<T> extends Subscriber<T> {
  private _isComplete = false;
  private keptValues: T[] = [];

  constructor(destination: Subscriber<T>,
              private subscriptionLock: SubscriptionLock,
              private buffer = 1) {
    super(destination);
    this._registerOnLockChanges(subscriptionLock);
  }

  /**
   * Tries to trigger an event on the destination with the next value.
   * Does nothing if the lock is set, otherwise sets the lock.
   * Once the complete flag is set and there are no values left, the destination is completed.
   */
  lockNext() {
    if (!this.subscriptionLock.locked) {
      if (this.keptValues.length) {
        this.subscriptionLock.lock();
        const val = this.keptValues.shift();
        this.destination.next(val);
      } else if (this._isComplete) {
        this.destination.complete();
      }
    }
  }

  /**
   * Calls the subscription with the next value.
   *
   * @param {T} value the value to emit
   * @private
   */
  protected _next(value: T): void {
    this.keptValues.push(value);
    this.lockNext();
    while (this.buffer > -1 && this.keptValues.length > this.buffer) {
      this.keptValues.shift();
    }
  }

  /**
   * Sets the complete flag.
   * Once all remaining values are emitted, the destination will be completed.
   * @private
   */
  protected _complete() {
    this._isComplete = true;
    this.lockNext();
  }

  /**
   * Registers on the lock changes.
   *
   * @param {SubscriptionLock} subscriptionLock the subscription lock
   * @private
   */
  private _registerOnLockChanges(subscriptionLock: SubscriptionLock) {
    subscriptionLock.lockChanges
      .pipe(
        filter((b) => !b),
        catchError((err) => {
          this.destination.error(err);
          return _throw(err);
        })
      ).subscribe(() => {
        this.lockNext();
      });
  }

}

/**
 * A simple lock with a timeout.
 * The lock changes are exposed as as observable.
 * Once the timeout is reached, the observable is terminated with an exception.
 */
export class SubscriptionLock {
  private _lockChanges = new Subject<boolean>();
  private _locked = false;
  private _timeoutRef: any;

  /**
   * If the given timeout is less or equal to 0, the lock won't have a timeout.
   *
   * @param {number} timeout the timeout in milliseconds (default 7 seconds)
   */
  constructor(private timeout = 7000) {
  }

  /**
   * Sets the lock, registers the timeout and triggers a lock change.
   * Calling this when the lock is already sets does nothing.
   */
  public lock() {
    if (!this._locked) {
      this._locked = true;
      this._timeoutRef = setTimeout(() => this._throwError(), this.timeout);
      this._lockChanges.next(this._locked);
    }
  }

  /**
   * Releases the lock, clears the timeout and triggers a lock change.
   * Calling this when no lock is set does nothing.
   */
  public release() {
    if (this._locked) {
      this._locked = false;
      clearTimeout(this._timeoutRef);
      this._lockChanges.next(this._locked);
    }
  }

  /**
   * Checks if the lock is set or not.
   *
   * @returns {boolean} the lock's status
   */
  get locked(): boolean {
    return this._locked;
  }

  /**
   * Gets the lock changes as an observable.
   * This observable will be triggered each time the lock's status changes.
   *
   * The observable will throw an error when a timeout is reached.
   *
   * @returns {Observable<boolean>} the lock's status as observable
   */
  get lockChanges(): Observable<boolean> {
    return this._lockChanges.asObservable();
  }

  /**
   * Terminates the lock changes observable with an error.
   * Does nothing if the timeout is less or equal to 0.
   * @private
   */
  private _throwError() {
    if (this.timeout > 0) {
      this._lockChanges.error('Timeout');
    }
  }

}
