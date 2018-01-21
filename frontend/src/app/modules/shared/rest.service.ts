import { Injectable } from '@angular/core';

@Injectable()
export class RestService {

  public encode(value: any, forceEncode = false): string {
    if (value === undefined) {
      return undefined;
    }
    let v = JSON.stringify(value);
    if (forceEncode) {
      v = encodeURIComponent(v);
    }
    return v;
  }

  public decode(value: string): any {
    if (value === undefined) {
      return undefined;
    }
    return JSON.parse(
      decodeURIComponent(value)
    );
  }

}
