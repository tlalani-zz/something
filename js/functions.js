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

function isTardy(time, isStudent) {
    var timer = time.split(" ");
    var splitTime = timer[0].split(":");
    var hour = splitTime[0];
    var min = splitTime[1];
    if (isStudent) {
        if (hour > 10 || (hour == 10 && min > 40)) {
            return true;
        } else {
            return false;
        }
    } else {
        if (hour > 10 || (hour == 10 && min > 0)) {
            return true;
        } else {
            return false;
        }
    }
}

function Person(name, time, reason, comments) {
    this.name = name;
    this.time = time;
    this.reason = reason;
    this.comments = comments;
}

function Counter(name, number) {
    this.name = name;
    this.number = number;
}

function makeBulkString(p) {
    var returnString = [];
    p = parseFloat(p).toFixed(2);
    returnString.push(p, "% Attendance");
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