// add a leading 0 to a number if it is only one digit
function addLeadingZero(num) {
  num = num.toString();
  while (num.length < 2) num = "0" + num;
  return num;
}

function getInverseOffset(date) {
  timezoneOffset = date.getTimezoneOffset();
  // Calculate USA timezones.
  // Check against known offsets to avoid TZ lookup where possible.
  const canBeUSA = [4 * 60, 5 * 60, 6 * 60, 7 * 60, 8 * 60].includes(timezoneOffset);
  if (canBeUSA) {
    // Note: Date-dependant and so cannot be mapped from offsets.
    const shortZoneName = date.toLocaleTimeString('en-US',{timeZoneName:'short'});
    // Check for RFC 822 timezones.
    if (["EST", "EDT", "CST", "CDT", "MST", "MDT", "PST", "PDT"].includes(shortZoneName)) {
      return shortZoneName;
    }
  }

  // Split hours and minutes for -HHMM / +HHMM formatting
  const minutes = Math.abs(timezoneOffset % 60).toFixed(0).padStart(2, 0);
  const hours = Math.abs(Math.floor(timezoneOffset / 60)).toFixed(0).padStart(2, 0);
  // Reverse the sign to get offset from GMT/UTC
  const modifier = timezoneOffset < 0 ? '+' : '-';

  return `${modifier}${hours}${minutes}`
}

function buildRFC822Date(dateString) {
  const dayStrings = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthStrings = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const timeStamp = Date.parse(dateString);
  const date = new Date(timeStamp);

  const day = dayStrings[date.getDay()];
  const dayNumber = addLeadingZero(date.getDate());
  const month = monthStrings[date.getMonth()];
  const year = date.getFullYear();
  const time = `${addLeadingZero(date.getHours())}:${addLeadingZero(date.getMinutes())}:00`;
  const timezone = date.getTimezoneOffset() === 0 ? "GMT" : getInverseOffset(date);

  //Wed, 02 Oct 2002 13:00:00 GMT
  return `${day}, ${dayNumber} ${month} ${year} ${time} ${timezone}`;
}

const exampleOne = buildRFC822Date("2021-11-29T00:00:00.000Z");
const exampleTwo = buildRFC822Date("2021-09-08T00:00:00.000+01:00");

console.log(exampleOne);
console.log(exampleTwo);
