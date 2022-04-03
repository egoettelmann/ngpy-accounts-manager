import { Injectable } from '@angular/core';

/**
 * The keep focus service to store the currently focused element.
 */
@Injectable()
export class KeepFocusService {

  /**
   * The id of the currently focused element.
   */
  private currentFocusId?: string;

  /**
   * Stores the id of the currently focused element.
   *
   * @param id the focus id to store
   */
  setFocus(id: string): void {
    this.currentFocusId = id;
  }

  /**
   * Clears the stored focus id.
   * If the provided id does not match the stored id, the clear is ignored.
   *
   * @param id the focus id to clear
   */
  unsetFocus(id: string): void {
    if (this.currentFocusId === id) {
      this.currentFocusId = undefined;
    }
  }

  /**
   * Checks if the provided id matches the currently stored focus id.
   *
   * @param id the id to check
   */
  hasFocus(id: string): boolean {
    return this.currentFocusId === id;
  }

}
