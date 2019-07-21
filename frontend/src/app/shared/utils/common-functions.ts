export class CommonFunctions {

  /**
   * Get the list of months.
   *
   * @returns {number[]} the list of months starting at 1
   */
  public static getMonthsList(): number[] {
    return Array.from(Array(12)).map((e, i) => i + 1);
  }

  /**
   * Gets a list of years from a given start year to the current year.
   *
   * @param {number} startYear the year to start from
   * @returns {number[]} the list of years in descending order
   */
  public static getYearsList(startYear = 2014): number[] {
    return Array.from(Array(CommonFunctions.getCurrentYear() - startYear + 1))
      .map((e, i) => i + startYear)
      .reverse();
  }

  /**
   * Gets the current year.
   *
   * @returns {number} the current year
   */
  public static getCurrentYear(): number {
    return new Date().getFullYear();
  }

  /**
   * Gets the current months (with January = 1).
   *
   * @returns {number} the current month
   */
  public static getCurrentMonth(): number {
    return new Date().getMonth() + 1;
  }

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
   * Consolidates the data into groups.
   *
   * @param details the list of details
   */
  public static consolidateDetails(details: {category: string, label: string, value: any}[]): any[] {
    const groupsByCategory = {};
    let total = 0;
    for (let i in details) {
      let detail = details[i];
      if (!groupsByCategory.hasOwnProperty(detail.category)) {
        groupsByCategory[detail.category] = [];
      }
      groupsByCategory[detail.category].push({
        label: detail.label,
        amount: detail.value,
        percentage: 0
      });
      total += detail.value;
    }
    const groupsWithDetails = [];
    for (let g in groupsByCategory) {
      const gd = {
        label: g,
        amount: groupsByCategory[g].reduce((t, a) => t + a.amount, 0),
        details: groupsByCategory[g].sort((g1, g2) => Math.abs(g2.amount) - Math.abs(g1.amount)),
        percentage: 0
      };
      groupsByCategory[g].map(g => g.percentage = g.amount / total * 100);
      gd.percentage = gd.amount / total * 100;
      groupsWithDetails.push(gd);
    }
    return groupsWithDetails.sort((g1, g2) => Math.abs(g2.amount) - Math.abs(g1.amount));
  }

  public static removeEmpty(obj: any): any {
    if (Array.isArray(obj)) {
      return obj
        .filter(f => f != null)
        .map((r, i) =>
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
