/**
 * Common util functions.
 */
export class CommonFunctions {

  /**
   * Resizes an array.
   *
   * @param {number[]} arrayToResize the array to resize
   * @param {number} placeholder the placeholder to set for new values
   * @param {number} maxSize the max size of the array
   */
  public static resizeArray(arrayToResize: number[], placeholder: number, maxSize: number) {
    for (let i = arrayToResize.length; i <= maxSize; i++) {
      arrayToResize[i] = placeholder;
    }
  }

  /**
   * Cleans all 'null' and 'undefined' fields of the provided object.
   *
   * @param obj the object to clean
   */
  public static removeEmpty(obj: any): any {
    if (Array.isArray(obj)) {
      return obj
        .filter(f => f != null)
        .map(r =>
          CommonFunctions.removeEmpty(r)
        );
    } else if (typeof obj !== 'object') {
      return obj;
    } else {
      return Object.keys(obj)
        .filter(f => obj[f] != null)
        .reduce(
          (r, i) => {
            return {...r, [i]: CommonFunctions.removeEmpty(obj[i])};
          },
          {}
        );
    }
  }

}
