/**
 * Helper function
 * Converts a string into the array representation of a date
 *
 * @param {String} dateString - MM-DD-YYYY or YYYY-MM-DD Format where "-" can be "-", "/", or " "
 * @returns {Integer[]} array representationg of date [month, day, year]
 * @returns {null} if invalid input string
 */
function stringToDateArray(dateString) {
  //split string into array:
  // let dateArray = dateString.split("-");
  // if (dateArray.length < 3) dateArray = dateString.split("/");
  // if (dateArray.length < 3) dateArray = dateString.split(" ");
  let dateArray = dateString;
  if (dateString.includes("-")) {
    dateArray = dateArray.split("-");
  } else if (dateString.includes("/")) {
    dateArray = dateArray.split("/");
  } else if (dateString.includes(" ")) {
    dateArray = dateArray.split(" ");
  }

  //reformat if necessary:  YYYY-MM-DD to MM-DD-YYYY
  if (dateArray[0].length == 4) {
    dateArray = [dateArray[1], dateArray[2], dateArray[0]];
  }

  //convert strings into integers:
  return dateArray.map(Number);
  // for (let i = 0; i < 3; i++) {
  //   let value = parseInt(dateArray[i]);
  //   if (isNaN(value)) {
  //     console.warn("Date string must contain numerical values for dates");
  //     return null;
  //   }
  //   dateArray[i] = value;
  // }
  // let newArr = [dateArray[0], dateArray[1], dateArray[2]];
  // return newArr;
}

/**
 * Helper function
 * Checks in the input array is in the right format to be a date and that the values of the date make sense
 * for the given month.
 *
 * @param {Integer[]} arr - date array to check
 * @returns {Boolean} true if the array is in the correct format and false otherwise
 */
function isValidDateArray(arr) {
  if (arr == null || arr[0] > 12 || arr[0] < 1) {
    return false;
  }
  const today = new Date();
  const thirty_day_months = [4, 6, 9, 11];
  const thirty_one_day_months = [1, 3, 5, 7, 8, 10, 12]
  if(arr[1] > 31 && thirty_one_day_months.includes(arr[0])){
    return false;
  }
  if(arr[1] > 30 && thirty_day_months.includes(arr[0])){
    return false;
  }
  if((arr[2]%4 == 0 && arr[1] > 29 && arr[0] == 2) || (arr[2]%4 != 0 && arr[1] > 28 && arr[0] == 2)) {
    return false;
  }
  const arr_date = new Date(arr[2], arr[0]-1, arr[1]);
  if(arr_date > today) {
    return false;
  }
  return true;
  // if (arr[0] < 1 || arr[0] > 12) {
  //   //check month
  //   return false;
  // }
  // //if valid month: check date based on max day of given month:
  // let lastDay = 31;
  // let thirty_day_months = [4, 6, 9, 11];
  // if (thirty_day_months.includes(arr[0])) {
  //   lastDay = 30;
  // } else if (arr[0] == 2 && arr[2] % 4 == 0) {
  //   lastDay = 29;
  // } else {
  //   lastDay = 28;
  // }
  // switch (arr[0]) {
  //   case 2:
  //     lastDay = 29; //TODO handle leap years
  //     break;
  //   case 4:
  //   case 6:
  //   case 9:
  //   case 11:
  //     lastDay = 30;
  //     break;
  // }
  // if (arr[1] < 1 || arr[0] > lastDay || arr[2] < 1000 || arr[2] > 10000) {
  //   return false;
  // }
  // return true;
}

/**
 * Helper function to convert a given input string into a date object
 * @param {Integer[]} arr - array to convert
 * @returns {Object} formatted date object
 */
function arrToDateObj(arr) {
  return {
    day: arr[1],
    month: arr[0],
    year: arr[2],
  };
}

/**
 * Outwards facing function which converts a given input string into date object format
 * @param {String} input
 * @returns {Object} formatted date object
 * @returns {Null} if input is incorrectly formatted
 */
export function validateDate(input) {
  try {
    let date = stringToDateArray(input);
    if (isValidDateArray(date)) {
      return arrToDateObj(date);
    }
  } catch (e) {
    return null;
  }
}

/**
 * Checks if (a<b)
 * @param {Object} a - validated date object
 * @param {Object} b - validated date object
 * @returns {Bool} (a < b)
 */
export function isLessThan(a, b) {
  if(isEqualTo(a,b)){
    return false;
  }
  const date_a = new Date(a.year, a.month, a.day);
  const date_b = new Date(b.year, b.month, b.day);
  if(date_a < date_b){
    return true;
  }
  else{
    return false;
  }
  // let isLess = false;
  // if (a.year > b.year) {
  //   isLess = false;
  // } else if (a.year < b.year) {
  //   isLess = true;
  // } else {
  //   if (a.month > b.month) {
  //     isLess = false;
  //   } else if (a.month < b.month) {
  //     isLess = true;
  //   } else {
  //     if (a.day > b.day) {
  //       isLess = false;
  //     } else if (a.day < b.day) {
  //       isLess = true;
  //     }
  //   }
  // }
  // return isLess;

  // //compare year
  // if (a.year > b.year) {
  //   return false;
  // } else if (a.year < b.year) {
  //   return true;
  // }

  // //if years are the same compare month
  // if (a.month > b.month) {
  //   return false;
  // } else if (a.month < b.month) {
  //   return true;
  // }

  // //if month is the same compare day
  // if (a.day > b.day) {
  //   return false;
  // } else if (a.day < b.day) {
  //   return true;
  // }

  // //otherwise they are the same day:
  // return false;
}

/**
 * Checks if (a==b)
 * @param {Object} a - validated date object
 * @param {Object} b - validated date object
 * @returns {Bool} (a == b)
 */
export function isEqualTo(a, b) {
  //make sure all terms are equal
  if (a.day != b.day || a.month != b.month || a.year != b.year) {
    return false;
  }
  return true;
}

/**
 * Checks if (a>b)
 * @param {Object} a - validated date object
 * @param {Object} b - validated date object
 * @returns {Bool} (a > b)
 */
export function isGreaterThan(a, b) {
  return !isEqualTo(a, b) && !isLessThan(a, b);
}

/**
 * Checks if (a>=b)
 * @param {Object} a - validated date object
 * @param {Object} b - validated date object
 * @returns {Bool} (a >= b)
 */
 export function isGreaterThanEqualTo(a, b) {
  return !isLessThan(a, b);
}

/**
 * Checks if (a<=b)
 * @param {Object} a - validated date object
 * @param {Object} b - validated date object
 * @returns {Bool} (a <= b)
 */
 export function isLessThanEqualTo(a, b) {
  return !isGreaterThan(a, b);
}
