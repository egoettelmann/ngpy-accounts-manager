import { fakeAsync, tick } from '@angular/core/testing';
import { interval } from 'rxjs/observable/interval';
import { map, take } from 'rxjs/operators';
import { lock, SubscriptionLock } from './lock-subscriber';

describe('LockSubscriber', () => {

  /**
   * -- 500ms -- 0 -- 500ms -- 1 -- 500ms -- 2 -- 500ms -- 3
   *             |             |             |             |
   *             |             |             |             |
   * ----------- 0 ----------- 1 ----------- 2 ----------- 3
   */
  it('should tick normally', fakeAsync(() => {
    let i = 0;
    let currentValue;
    const obs = interval(500).pipe(
      take(4),
      map(() => i++)
    );
    const sub = obs.subscribe((v) => {
      currentValue = v;
    });
    // Output : 500ms -> 0 -> 500ms -> 1 -> 500ms -> 2 -> 500ms -> 3 (total = 1500ms)
    expect(currentValue).toEqual(undefined);
    tick(500);
    expect(currentValue).toEqual(0);
    tick(500);
    expect(currentValue).toEqual(1);
    tick(1000); // Wait all finished

    sub.unsubscribe(); // must unsubscribe or Observable will keep emitting resulting in an error
  }));

  /**
   * -- 500ms -- 0 -- 500ms -- 1 -- 500ms -- 2 -- 500ms -- 3
   *             |             |             |             |
   *             |             |             |             |
   * ------------------ 0 ----------- 1 ----------- 2 ----------- 3
   */
  it('should tick with delay', fakeAsync(() => {
    let i = 0;
    let currentValue;
    const obs = interval(500).pipe(
      take(4),
      map(() => i++)
    );
    const sub = obs.subscribe((v) => {
      setTimeout(() => {
        currentValue = v;
      }, 250);
    });
    // Output: 1500ms -> 0 -> 1000ms -> 1 -> 1000ms -> 2 -> 1000ms -> 3 (total = 4500ms)
    expect(currentValue).toEqual(undefined);
    tick(750);
    expect(currentValue).toEqual(0);
    tick(500);
    expect(currentValue).toEqual(1);
    tick(1000);

    sub.unsubscribe(); // must unsubscribe or Observable will keep emitting resulting in an error
  }));

  /**
   * -- 500ms -- 0 -- 500ms -- 1 -- 500ms -- 2 -- 500ms -- 3
   *             |             |             |             |
   *             |             |             |             |
   * buffer ---- [] ---------- [1] --------- [2] --------- [3] -----------
   *             |                           |                           |
   *             |                           |                           |
   * lock ------ 0 --------- LOCK ---------- 1 --------- LOCK ---------- 3 --------- LOCK ------------
   *                                         |                           |                           |
   *                                         |                           |                           |
   * --------------------------------------- 0 ------------------------- 1 ------------------------- 3
   */
  it('should tick with lock and default buffer of 1', fakeAsync(() => {
    const tickLock = new SubscriptionLock();
    let i = 0;
    let currentValue;
    const obs = interval(500).pipe(
      take(4),
      map(() => i++),
      lock(tickLock)
    );
    const sub = obs.subscribe((v) => {
      setTimeout(() => {
        currentValue = v;
        tickLock.release();
      }, 1000);
    });
    expect(currentValue).toEqual(undefined);
    tick(1500);
    expect(currentValue).toEqual(0);
    tick(1000);
    expect(currentValue).toEqual(1);
    tick(1000);
    expect(currentValue).toEqual(3);

    sub.unsubscribe(); // must unsubscribe or Observable will keep emitting resulting in an error
  }));

  /**
   * -- 500ms -- 0 -- 500ms -- 1 -- 500ms -- 2 -- 500ms -- 3
   *             |             |             |             |
   *             |             |             |             |
   * buffer ---- [] ---------- [1] --------- [2] --------- [2,3] ------- [3] -------------------------
   *             |                           |                           |                           |
   *             |                           |                           |                           |
   * lock ------ 0 --------- LOCK ---------- 1 --------- LOCK ---------- 2 --------- LOCK ---------- 3 --------- LOCK ------------
   *                                         |                           |                           |                           |
   *                                         |                           |                           |                           |
   * --------------------------------------- 0 ------------------------- 1 ------------------------- 2 ------------------------- 3
   */
  it('should tick with lock and buffer of 2', fakeAsync(() => {
    const tickLock = new SubscriptionLock();
    let i = 0;
    let currentValue;
    const obs = interval(500).pipe(
      take(4),
      map(() => i++),
      lock(tickLock, 2)
    );
    const sub = obs.subscribe((v) => {
      setTimeout(() => {
        currentValue = v;
        tickLock.release();
      }, 1000);
    });
    expect(currentValue).toEqual(undefined);
    tick(1500);
    expect(currentValue).toEqual(0);
    tick(1000);
    expect(currentValue).toEqual(1);
    tick(1000);
    expect(currentValue).toEqual(2);
    tick(1000);
    expect(currentValue).toEqual(3);

    sub.unsubscribe(); // must unsubscribe or Observable will keep emitting resulting in an error
  }));

  /**
   * -- 500ms -- 0 -- 500ms -- 1 -- 500ms -- 2 -- 500ms -- 3
   *             |             |             |             |
   *             |             |             |             |
   * buffer ---- [] ---------- [] ---------- [] ---------- []
   *             |                           |
   *             |                           |
   * lock ------ 0 --------- LOCK ---------- 2 --------- LOCK ------------
   *                                         |                           |
   *                                         |                           |
   * --------------------------------------- 0 ------------------------- 2
   */
  it('should tick with lock and no buffer', fakeAsync(() => {
    const tickLock = new SubscriptionLock();
    let i = 0;
    let currentValue;
    const obs = interval(500).pipe(
      take(4),
      map(() => i++),
      lock(tickLock, 0)
    );
    const sub = obs.subscribe((v) => {
      setTimeout(() => {
        currentValue = v;
        tickLock.release();
      }, 1000);
    });
    expect(currentValue).toEqual(undefined);
    tick(1500);
    expect(currentValue).toEqual(0);
    tick(1000);
    expect(currentValue).toEqual(2);

    sub.unsubscribe(); // must unsubscribe or Observable will keep emitting resulting in an error
  }));

  /**
   * -- 500ms -- 0 -- 500ms -- 1
   *             |             |
   *             |             |
   * buffer ---- [] ------------
   *             |
   *             |
   * lock ------ 0 -------------
   *                    |      |
   *                    |      |
   * ------------------ X ---- 0
   */
  it('should tick with lock but timeout', fakeAsync(() => {
    const tickLock = new SubscriptionLock(250);
    let i = 0;
    let currentValue;
    const obs = interval(500).pipe(
      take(4),
      map(() => i++),
      lock(tickLock)
    );
    const sub = obs.subscribe((v) => {
      setTimeout(() => {
        if (v > 0) {
          fail('Callback should not be triggered a second time');
        }
        currentValue = v;
        tickLock.release();
      }, 500);
    });
    expect(currentValue).toEqual(undefined);
    try {
      tick(750);
    } catch (e) {
      expect(e).toBe('Timeout');
    }
    tick(250);
    expect(currentValue).toEqual(0);

    sub.unsubscribe(); // must unsubscribe or Observable will keep emitting resulting in an error
  }));

});
