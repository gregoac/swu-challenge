export function findObjectByProperty<T>(array: T[], property: string, value: string) {
    return array.find(obj => obj[property] === value);
  }

export function getRandomLongitudeAndLatitude() {
    const minLongitude = -180;
    const maxLongitude = 180;
    const minLatitude = -90;
    const maxLatitude = 90;
    
    const randomLongitude = Math.random() * (maxLongitude - minLongitude) + minLongitude;
    const randomLatitude = Math.random() * (maxLatitude - minLatitude) + minLatitude;
    return [randomLongitude, randomLatitude];
  }

export function isConvertibleToNumber(value: string): boolean {
    // Try parsing the string as a number
    const parsedValue = parseFloat(value);
    // Check if the parsed value is not NaN
    return !isNaN(parsedValue);
  }