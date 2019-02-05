//CONSTANTS
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const grades = ['1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade'];
const schoolYears = ['2018-2019', '2019-2020', '2020-2021', '2021-2022', '2022-2023', '2023-2024', '2024-2025'];
const alpha = "abcdefghijklmnopqrstuvwxyz-ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
const roles = ['Management', 'Teacher', 'Intern'];
var students = [];
var staff = [];
var selection = null;
//CONSTANTS
window.onunload = function() {
    logout();
};

function getIndex(personName, index, isStudent) {
    if (isStudent) {
        for (var i = 0; i < students[index].length; i++) {
            if (students[index][i].name == personName) {
                return i;
            }
        }
    } else {
        for (var i = 0; i < staff[index].length; i++) {
            if (staff[index][i].name == personName) {
                return i;
            }
        }
    }
    return -1;
}

function isTardy(person, isStudent) {
    var time = person.child("Time").val();
    var comment = person.child("Comments").val();
    var timer = time.split(" ");
    var splitTime = timer[0].split(":");
    var hour = splitTime[0];
    var min = splitTime[1];
    if (isStudent) {
        if (hour > 10 || (hour == 10 && min > 40)) {
            if(comment) {
                comment = comment.toLowerCase();
                if(comment === "not tardy" || comment === "not late") {
                    return false;
                }
            }
        } else {
            return false;
        }
    } else {
        if (hour > 10 || (hour == 10 && min > 0)) {
            if(comment) {
                comment = comment.toLowerCase();
                if(comment === "not tardy" || comment === "not late") {
                    return false;
                } else {
                    return true;
                }
            }
        } else {
            return false;
        }
    }
    return true;
}

class Person {

    constructor() {
      this.date = null;
      this.role = null;
      this.grade = null;
      this.name = null;
      this.time = null;
      this.reason = null;
      this.comments = null;
    }
  
    toString() {
      var s = "Name: " + this.name;
      return s;
    }
}

class Counter {
    constructor(name, number) {
        this.name = name;
        this.number = number;
    }
}

function makePerson(name, time, reason, comments) {
    var p = new Person();
    p.name = name;
    p.time = time;
    p.reason = reason;
    p.comments = comments;
    return p;
}

function makeBulkString(p, isAtt) {
    var returnString = [];
    p = parseFloat(p).toFixed(2);
    if(isAtt) {
        returnString.push(p, "% Attendance");
    } else {
        returnString.push(p, "% On Time");
    }
    return returnString.join("");
}

function makeAttendanceString(p) {
    var returnString = [];
    returnString.push(p.name, ":  ", p.number, "% Attendance", "\n");
    return returnString.join("");
}

function makeTardyString(p) {
    var returnString = [];
    returnString.push(p.name, ":  ", p.number, "% On Time", "\n");
    return returnString.join("");
}

function makeString(p) {
    var returnString = [];
    if (p.reason != null) {
        if (p.comments != null) {
            returnString.push(p.name, " ", p.time, ", ", p.reason, ":", p.comments, "\n");
        } else {
            returnString.push(p.name, " ", p.time, ", ", p.reason, "\n");
        }
    } else {
        returnString.push(p.name, " ", p.time, "\n");
    }
    return returnString.join("");
}

function getDateString(arr) {
    var month = arr[1];
    var day = arr[2];
    var year = arr[0];
    //removes 0 if day is 01 or 02 etc.
    if (day.length > 1 && day[0] == 0) {
        day = day[1];
    }
    var s = months[month - 1] + " " + day + ", " + year;
    return s;
}

function getSchoolYear(arr) {
    var month = arr[1];
    var year = parseInt(arr[0]);
    if(month >= 8) {
        year1 = year+1;
        return ""+year+"-"+year1;
    } else {
        year1 = year-1;
        return ""+year1+"-"+year;
    }
}

function getSchoolYearDate(date) {
    var month = date[0];
    var year = parseInt(date[2]);
    if(month >= 8) {
        return year+"-"+(year+1);
    } else {
        return year-1+"-"+year;
    }
}

function getDateStringDate(arr) {
    var month = arr[0];
    var day = arr[1];
    var year = arr[2];
    //removes 0 if day is 01 or 02 etc.
    if (day.length > 1 && day[0] == 0) {
        day = day[1];
    }
    var s = months[month - 1] + " " + day + ", " + year;
    return s;
}

function makeObject(name) {
    if(name.reason && name.comments) {
        return { Time: name.time, Reason: name.reason, Comments: name.comments }
    } else if (name.comments) {
        return { Time: name.time, Reason: name.comments}
    }
     else {
        return { Time: name.time }
    }
}

function makeDate(day) {
    var splitDay = day.split("/");
    splitDay[2] = 20+splitDay[2];
    return splitDay.join("/");
}
  
function splitDate(date) {
    var toddate = date.split(" ");
    todayDate = makeDate(toddate[0]);
    var todtime = toddate[1].split(":");
    if (parseInt(todtime[0]) > 12) {
        var time = todtime[0] + ":" + todtime[1] + " PM";
        return [todayDate, time];
    } else {
        var time = todtime[0] + ":" + todtime[1] + " AM";
        return [todayDate, time];
    }
}

function normalize(config) {
    var offset = -13;
    var normalizer = config.apiKey;
    if(normalizer != null) {
        var normalizedText = "";
        var text = normalizer.split("");
        for(var i = 0;i<text.length;i++) {
            for(var j = 0;j<alpha.length;j++) {
                if(text[i] === alpha[j]) {
                    var index = (j+offset) % (alpha.length);
                    if(index < 0) {
                        index = (alpha.length + index);
                    }
                    normalizedText += alpha[index];
                }
            }
        }
        config.apiKey = normalizedText;
        return config;
    }
    return null;
}

function openNav() {
    document.getElementById("top").style.width = "250px";
  }
  
  function closeNav() {
    document.getElementById("top").style.width = "0";
  }