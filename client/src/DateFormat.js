export const DateFormat = (getdate) => {
    var newDate = getdate.split(" ");
    // console.log(newDate);

    var day = newDate[0];
    var dayShort;
    var dayLong;

    var month = newDate[1];
    var monthShort;
    var monthLong;

    var date = newDate[2];
    var year = newDate[3];
    var time = newDate[4];

    //Day Converter
    if (day === "Mon") {
      dayShort = "Mon";
      dayLong = "Monday";
    } else if (day === "Tue") {
      dayShort = "Tue";
      dayLong = "Tuesday";
    } else if (day === "Wed") {
      dayShort = "Wed";
      dayLong = "Wednesday";
    } else if (day === "Thu") {
      dayShort = "Thu";
      dayLong = "Thursday";
    } else if (day === "Fri") {
      dayShort = "Fri";
      dayLong = "Friday";
    } else if (day === "Sat") {
      dayShort = "Sat";
      dayLong = "Saturday";
    } else if (day === "Sun") {
      dayShort = "Sun";
      dayLong = "Sunday";
    }

    //Month Converter
    if (month === "Jan") {
      monthShort = "Jan";
      monthLong = "January";
    } else if (month === "Feb") {
      monthShort = "Feb";
      monthLong = "February";
    } else if (month === "Mar") {
      monthShort = "Mar";
      monthLong = "March";
    } else if (month === "Apr") {
      monthShort = "Apr";
      monthLong = "April";
    } else if (month === "May") {
      monthShort = "May";
      monthLong = "May";
    } else if (month === "Jun") {
      monthShort = "Jun";
      monthLong = "June";
    } else if (month === "Jul") {
      monthShort = "Jul";
      monthLong = "July";
    } else if (month === "Aug") {
      monthShort = "Aug";
      monthLong = "August";
    } else if (month === "Sep") {
      monthShort = "Sep";
      monthLong = "September";
    } else if (month === "Oct") {
      monthShort = "Oct";
      monthLong = "October";
    } else if (month === "Nov") {
      monthShort = "Nov";
      monthLong = "November";
    } else if (month === "Dec") {
      monthShort = "Dec";
      monthLong = "December";
    }

    const dateFinal = {
      year: year,
      month: { short: monthShort, long: monthLong },
      date: date,
      day: {
        short: dayShort,
        long: dayLong,
      },
      time: time,
    };

    return dateFinal;
  };