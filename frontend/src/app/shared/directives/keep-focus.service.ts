import { Injectable } from '@angular/core';

@Injectable()
export class KeepFocusService {

  private currentFocusId: string;

  setFocus(id: string) {
    this.currentFocusId = id;
  }

  unsetFocus(id: string) {
    if (this.currentFocusId === id) {
      this.currentFocusId = undefined;
    }
  }

  hasFocus(id: string) {
    return this.currentFocusId === id;
  }

}
