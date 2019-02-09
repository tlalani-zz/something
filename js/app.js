// Initialize Firebase
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log(user);
        showOptions();
    }
});

function showOptions() {
    document.getElementById("login").style.display = "none";
    document.getElementById("login_btn").style.display = "none";
    document.getElementById("list").style.display = "block";
    document.getElementById("login_out").style.display = "block";

}

function showLogin() {
    document.getElementById("list").style.display = "none";
    document.getElementById("login").style.display = "block";
    document.getElementById("login_btn").style.display = "block";
    document.getElementById("login_out").style.display = "none";
  }

function showOptionsDropdown() {
    document.getElementById("date").style.display = "none";
    document.getElementById("dateGo").style.display = "none";
    var index = 0;
    for(schoolYear of schoolYears) {
        var o = document.createElement("option");
        o.value = index;
        o.innerHTML = schoolYear;
        document.getElementById("options1").appendChild(o);
        index++;
    }
    document.getElementById("yearGo").style.display="block";
    document.getElementById("options1").style.display = "block";
}

function showDate(select) {
    selection = select;
    document.getElementById("response").innerHTML = "";
    if (selection < 5 && selection > 1) {
        showOptionsDropdown();
    } else {
        document.getElementById("date").style.display = "blocK";
        document.getElementById("dateGo").style.display = "blocK";
        document.getElementById("options1").style.display = "none";
        document.getElementById("yearGo").style.display = "none";
    }

}

function doQuery() {
    students = [];
    staff = [];
    document.getElementById("response").innerHTML = "";
    var textarea = document.getElementById("response");
    var db = firebase.database();
    var date = document.getElementById("date").value;
    var optionsMenu = document.getElementById("options1");
    var dateSplit = [];
    var schoolYear = 0;
    if (date) {
        dateSplit = date.split("-");
        date = getDateString(dateSplit);
        schoolYear = getSchoolYear(dateSplit);
    } else if(optionsMenu.style.display !== "none"){
        schoolYear = optionsMenu.options[optionsMenu.selectedIndex].text;
    }
    //Selection 1 is for absent checking for a certain date.
    if (selection == 0) {
        db.ref("People").once('value', function(snapshot) {
            db.ref(schoolYear+"/"+date).once('value', function(snapshot1) {
                snapshot.forEach(function(role) {
                    if (role.key == "Student") {
                        role.forEach(function(grade) {
                            var list = [];
                            var idx = grades.indexOf(grade.key);
                            grade.forEach(function(student) {
                                list.push(student.val());
                            });
                            students[idx] = list;
                        });
                    }
                });
                snapshot1.forEach(function(child) {
                    if (child.key == "Student") {
                        child.forEach(function(grade) {
                            var list = [];
                            var idx = grades.indexOf(grade.key);
                            grade.forEach(function(student) {
                                list = students[idx];
                                var index = list.indexOf(student.key);
                                if (index >= 0) {
                                    list.splice(index, 1);
                                }
                            });
                            students[idx] = list;
                        });
                        for (var i = 0; i < students.length; i++) {
                            if (students[i]) {
                                textarea.innerHTML += (grades[i] + "\n");
                                for (var j = 0; j < students[i].length; j++) {
                                    textarea.innerHTML += (students[i][j] + ", ");
                                }
                                textarea.innerHTML += "\n\n";
                            }
                        }
                    }
                });
            });
        });
        textarea.style.display = "block";
        //Selection 2 is attendance checking for a certain date.
    } else if (selection == 1) {
        db.ref(schoolYear+"/"+date).once('value', function(snapshot) {
            snapshot.forEach(role => {
                if (role.key == "Student") {
                    role.forEach(function(grade) {
                        var list = [];
                        var idx = grades.indexOf(grade.key);
                        grade.forEach(function(student) {
                            list.push(makePerson(student.key, student.child("Time").val(), student.child("Reason").val(),
                                student.child("Comments").val()));
                        });
                        students[idx] = list;
                    });
                } else {
                    if (roles.indexOf(role.key) >= 0) {
                        list = [];
                        role.forEach(staff => {
                            list.push(makePerson(staff.key, staff.child("Time").val(), staff.child("Reason").val(), staff.child("Comments").val()));
                        });
                        staff[roles.indexOf(role.key)] = list;
                    }
                }

            });
            for (var i = 0; i < students.length; i++) {
                if (students[i]) {
                    textarea.innerHTML += (grades[i] + "\n");
                    for (var j = 0; j < students[i].length; j++) {
                        textarea.innerHTML += (makeString(students[i][j]));
                    }
                    textarea.innerHTML += "\n\n";
                }
            }
            for (var i = 0; i < staff.length; i++) {
                if (staff[i]) {
                    textarea.innerHTML += (roles[i] + "\n");
                    for (var j = 0; j < staff[i].length; j++) {
                        textarea.innerHTML += (makeString(staff[i][j]));
                    }
                    textarea.innerHTML += "\n\n";
                }
            }
        });
        textarea.style.display = "block";
        //Attendnace stats.
    } else if (selection == 2) {
        var counter = 0;
        db.ref("People").once('value', function(peopleSnapshot) {
            db.ref(schoolYear).once('value', function(dateSnapshot) {
                peopleSnapshot.forEach(function(role) {
                    if (role.key == "Student") {
                        role.forEach(function(grade) {
                            var list = [];
                            var idx = grades.indexOf(grade.key);
                            grade.forEach(function(student) {
                                list.push(new Counter(student.val(), -1));
                            });
                            students[idx] = list;
                        });
                    } else {
                        var list = [];
                        var idx = roles.indexOf(role.key);
                        role.forEach(staff => {
                            list.push(new Counter(staff.val(), -1));
                        });
                        staff[idx] = list;
                    }
                });
                dateSnapshot.forEach(date => {
                    counter++;
                    date.forEach(role => {
                        if (role.key == "Student") {
                            role.forEach(grade => {
                                var idx = grades.indexOf(grade.key);
                                grade.forEach(student => {
                                    var index = getIndex(student.key, idx, true);
                                    if (index >= 0) {
                                        students[idx][index].number += 1;
                                    }
                                })
                            });
                        } else {
                            var idx = roles.indexOf(role.key);
                            role.forEach(staffmember => {
                                var index = getIndex(staffmember.key, idx, false);
                                if (index >= 0) {
                                    staff[idx][index].number += 1;
                                }
                            });
                        }
                    });
                });
                for (var i = 0; i < students.length; i++) {
                    if (students[i]) {
                        textarea.innerHTML += (grades[i] + "\n");
                        for (var j = 0; j < students[i].length; j++) {
                            if(students[i][j].number >= 0) {
                                students[i][j].number++;
                                students[i][j].number = students[i][j].number * 1.0 / counter * 100.0;
                                textarea.innerHTML += (makeAttendanceString(students[i][j]));
                            }
                        }
                        textarea.innerHTML += "\n\n";
                    }
                }
                for (var i = 0; i < staff.length; i++) {
                    if (staff[i]) {
                        textarea.innerHTML += (roles[i] + "\n");
                        for (var j = 0; j < staff[i].length; j++) {
                            if(staff[i][j].number >= 0) {
                                staff[i][j].number++;
                                staff[i][j].number = staff[i][j].number * 1.0 / counter * 100.0;
                                textarea.innerHTML += (makeAttendanceString(staff[i][j]));
                            }
                        }
                        textarea.innerHTML += "\n\n";
                    }
                }
                textarea.style.display = "block";
            });
        });
        //Tardy Stats
    } else if (selection == 3) {
        var counter = 0;
        db.ref("People").once('value', function(snapshot) {
            snapshot.forEach(function(role) {
                if (role.key == "Student") {
                    role.forEach(function(grade) {
                        var list = [];
                        var idx = grades.indexOf(grade.key);
                        grade.forEach(function(student) {
                            list.push(new Counter(student.val(), -1));
                        });
                        students[idx] = list;
                    });
                } else {
                    var list = [];
                    var idx = roles.indexOf(role.key);
                    role.forEach(staff => {
                        list.push(new Counter(staff.val(), -1));
                    });
                    staff[idx] = list;
                }
            });
            db.ref(schoolYear).once('value', function(snapshot1) {
                snapshot1.forEach(date => {
                    if (date.key != "People") {
                        counter++;
                        date.forEach(role => {
                            if (role.key == "Student") {
                                role.forEach(grade => {
                                    var idx = grades.indexOf(grade.key);
                                    grade.forEach(student => {
                                        var index = getIndex(student.key, idx, true);
                                        if (index >= 0) {
                                            if (!isTardy(student, true)) {
                                                students[idx][index].number += 1;
                                            }
                                        }
                                    })
                                });
                            } else {
                                var idx = roles.indexOf(role.key);
                                role.forEach(staffmember => {
                                    var index = getIndex(staffmember.key, idx, false);
                                    if (index >= 0) {
                                        if (!isTardy(staffmember, false)) {
                                            staff[idx][index].number += 1;
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
                for (var i = 0; i < students.length; i++) {
                    if (students[i]) {
                        textarea.innerHTML += (grades[i] + "\n");
                        for (var j = 0; j < students[i].length; j++) {
                            if(students[i][j].number >= 0) {
                                students[i][j].number++;
                                students[i][j].number = students[i][j].number * 1.0 / counter * 100.0;
                                textarea.innerHTML += (makeTardyString(students[i][j]));
                            }
                        }
                        textarea.innerHTML += "\n\n";
                    }
                }
                for (var i = 0; i < staff.length; i++) {
                    if (staff[i]) {
                        textarea.innerHTML += (roles[i] + "\n");
                        for(var j = 0;j<staff[i].length;j++) {
                            if(staff[i][j] && staff[i][j].number >= 0) {
                                staff[i][j].number++;
                                staff[i][j].number = staff[i][j].number * 1.0 / counter * 100.0;
                                textarea.innerHTML += (makeTardyString(staff[i][j]));
                            }
                        }
                        textarea.innerHTML += "\n\n";
                    }   
                }
                textarea.style.display = "block";
            });
        });
        //Attendance Stats by Grade
    } else if (selection == 4) {
        var gradeList = [0, 0, 0, 0, 0, 0];
        var staffList = [0, 0, 0];
        var counter = 0;
        db.ref("People").once('value', function(snapshot) {
            db.ref(schoolYear).once('value', function(snapshot1) {
                snapshot.forEach(function(role) {
                    if (role.key == "Student") {
                        role.forEach(function(grade) {
                            var idx = grades.indexOf(grade.key);
                            grade.forEach(function(student) {
                                if (students[idx])
                                    students[idx] += 1;
                                else
                                    students[idx] = 1;
                            });
                        });
                    } else {
                        var idx = roles.indexOf(role.key);
                        role.forEach(staffmember => {
                            if (staff[idx])
                                staff[idx] += 1;
                            else
                                staff[idx] = 1;
                        });
                    }
                });
                var gradeCounter = [];
                var staffCounter = [];
                snapshot1.forEach(date => {
                    if (date.key != "People") {
                        counter++;
                        date.forEach(role => {
                            if (role.key == "Student") {
                                role.forEach(grade => {
                                    var idx = grades.indexOf(grade.key);
                                    grade.forEach(student => {
                                        if (gradeCounter[idx])
                                            gradeCounter[idx] += 1;
                                        else
                                            gradeCounter[idx] = 1;
                                    });

                                    if (gradeList[idx]) {
                                        gradeList[idx] += gradeCounter[idx] / students[idx] * 100;
                                    } else {
                                        gradeList[idx] = gradeCounter[idx] / students[idx] * 100;
                                    }
                                    gradeCounter[idx] = 0;
                                });
                            } else {
                                var idx = roles.indexOf(role.key);
                                role.forEach(staffmember => {
                                    if (staffCounter[idx])
                                        staffCounter[idx] += 1
                                    else
                                        staffCounter[idx] = 1
                                });
                                if (staffList[idx]) {
                                    staffList[idx] += staffCounter[idx] / staff[idx] * 100;
                                } else {
                                    staffList[idx] = staffCounter[idx] / staff[idx] * 100;
                                }
                                staffCounter[idx] = 0;
                            }
                        });
                    }
                });
                for (var i = 0; i < gradeList.length; i++) {
                    if (gradeList[i]) {
                        textarea.innerHTML += (grades[i] + "\n");
                        textarea.innerHTML += (makeBulkString((gradeList[i] / counter, 1)));
                        textarea.innerHTML += "\n\n";
                    }
                }
                var addition = 0;
                for (var i = 0; i < staffList.length; i++) {
                    if (staffList[i] !== null && staffList[i] !== undefined) {
                        addition += staffList[i];
                    }
                }
                addition = addition / staffList.length;
                if (addition > 0) {
                    textarea.innerHTML += ("Staff \n");
                    textarea.innerHTML += (makeBulkString(addition, 0));
                    textarea.innerHTML += "\n\n";
                    for(var i = 0;i<roles.length;i++) { 
                        textarea.innerHTML += (roles[i] + ": " + makeBulkString(staffList[i], 0) + "\n");
                    }
                }
                textarea.style.display = "block";
            });
        });
        //Attendance stats by grade by day
    } else if (selection == 5) {
        var gradeList = [0, 0, 0, 0, 0, 0];
        var staffList = [0, 0, 0];
        var counter = 0;
        db.ref("People").once('value', function(snapshot) {
            db.ref(schoolYear+"/"+date).once('value', function(snapshot1) {
                snapshot.forEach(function(role) {
                    if (role.key == "Student") {
                        role.forEach(function(grade) {
                            var idx = grades.indexOf(grade.key);
                            grade.forEach(function(student) {
                                if (students[idx])
                                    students[idx] += 1;
                                else
                                    students[idx] = 1;
                            });
                        });
                    } else {
                        var idx = roles.indexOf(role.key);
                        role.forEach(staffmember => {
                            if (staff[idx])
                                staff[idx] += 1;
                            else
                                staff[idx] = 1;
                        });
                    }
                });
                var gradeCounter = [];
                var staffCounter = [];
                snapshot1.forEach(role => {
                    if (role.key == "Student") {
                        role.forEach(grade => {
                            var idx = grades.indexOf(grade.key);
                            grade.forEach(student => {
                                if (gradeCounter[idx])
                                    gradeCounter[idx] += 1;
                                else
                                    gradeCounter[idx] = 1;
                            });

                            if (gradeList[idx]) {
                                gradeList[idx] += gradeCounter[idx] / students[idx] * 100;
                            } else {
                                gradeList[idx] = gradeCounter[idx] / students[idx] * 100;
                            }
                        });
                    } else {
                        var idx = roles.indexOf(role.key);
                        role.forEach(staffmember => {
                            if (staffCounter[idx])
                                staffCounter[idx] += 1
                            else
                                staffCounter[idx] = 1
                        });
                        if (staffList[idx]) {
                            staffList[idx] += staffCounter[idx] / staff[idx] * 100;
                        } else {
                            staffList[idx] = staffCounter[idx] / staff[idx] * 100;
                        }
                    }
                });

                for (var i = 0; i < gradeList.length; i++) {
                    if (gradeList[i]) {
                        textarea.innerHTML += (grades[i] + "\n");
                        textarea.innerHTML += (makeBulkString(gradeList[i], 1));
                        textarea.innerHTML += "\n\n";
                    }
                }

                var addition = 0;
                for (var i = 0; i < staffList.length; i++) {
                    if (staffList[i] !== null && staffList[i] !== undefined) {
                        addition += staffList[i];
                    }
                }
                addition = addition / staffList.length;
                if (addition > 0) {
                    textarea.innerHTML += ("Staff \n");
                    textarea.innerHTML += (makeBulkString(addition, 0));
                    textarea.innerHTML += "\n\n";
                    for(var i = 0;i<roles.length;i++) { 
                        textarea.innerHTML += (roles[i] + ": " + makeBulkString(staffList[i], 0) + "\n");
                    }
                }
                textarea.style.display = "block";
            });
        });
        //Tardy Stats by Grade by Day
    } else if(selection == 6) {
        var count = 0;
        var percentage = 0;
        var addGrade = [];
        var gradeCounter = [0, 0, 0, 0, 0, 0];
        var staffCounter = [0, 0, 0];
        var gradeList = [0, 0, 0, 0, 0, 0];
        var staffList = [0, 0, 0];
        db.ref(schoolYear+"/"+date).once('value', function(snapshot1) {
            snapshot1.forEach(role => {
                if (role.key == "Student") {
                    role.forEach(grade => {
                        var idx = grades.indexOf(grade.key);
                        grade.forEach(student => {
                            gradeCounter[idx] += 1;
                            if (!isTardy(student, true))
                                gradeList[idx] += 1;
                        });
                    });
                } else {
                    var idx = roles.indexOf(role.key);
                    role.forEach(staffmember => {
                        staffCounter[idx] += 1;
                        if (!isTardy(staffmember, false))
                            staffList[idx] += 1
                    });
                }
            });
            for(var i = 0;i<gradeList.length;i++) {
                if(gradeList[i]) {
                    gradeList[i] = gradeList[i] / gradeCounter[i] * 100;
                    addGrade.push(gradeList[i]);
                }
            }
            for(var i = 0;i<staffList.length;i++) {
                staffList[i] = staffList[i] / staffCounter[i] * 100;
            }
            for (var i = 0; i < gradeList.length; i++) {
                if (gradeList[i]) {
                    textarea.innerHTML += (grades[i] + "\n");
                    textarea.innerHTML += (makeBulkString(gradeList[i], 0));
                    textarea.innerHTML += "\n\n";
                }
            }

            for(var i of addGrade) {
                if(i) {
                    count++;
                    percentage += i;
                }
            }
            percentage = percentage / count;
            textarea.innerHTML += ("\nStudent Total Percentage On Time \n");
            textarea.innerHTML += (makeBulkString(percentage, 0));
            textarea.innerHTML += "\n\n\n";


            var addition = 0;
            for (var i = 0; i < staffList.length; i++) {
                if (staffList[i] !== null && staffList[i] !== undefined) {
                    addition += staffList[i];
                }
            }
            addition = addition / staffList.length;
            if (addition > 0) {
                textarea.innerHTML += ("Staff \n");
                textarea.innerHTML += (makeBulkString(addition, 0));
                textarea.innerHTML += "\n\n";
                for(var i = 0;i<roles.length;i++) { 
                    textarea.innerHTML += (roles[i] + ": " + makeBulkString(staffList[i], 0) + "\n");
                }
            }
            textarea.style.display = "block";
        });
    } else {
        alert("There was an Error, Please Refresh the Page");
    }
}