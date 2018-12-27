// Initialize Firebase
function signIn() {
    var username = document.getElementById("userName").value;
    var password = document.getElementById("password").value;
    firebase.auth().signInWithEmailAndPassword(username, password).then(function(user) {
        if (user) {
            showOptions();
        }
    }, function(error) {
        alert(error);
    });
}

function showOptions() {
    document.getElementById("list").style.display = "block";
}

function showDate(select) {
    selection = select;
    document.getElementById("response").innerHTML = "";
    if (selection != 5 && selection > 1) {
        doQuery();
    } else {
        document.getElementById("date").style.display = "blocK";
        document.getElementById("dateGo").style.display = "blocK";
    }

}

function doQuery() {
    students = [];
    staff = [];
    document.getElementById("response").innerHTML = "";
    var textarea = document.getElementById("response");
    var db = firebase.database();
    var date = document.getElementById("date").value;
    var dateSplit = [];
    var schoolYear = 0;
    if (date) {
        dateSplit = date.split("-");
        date = getDateString(dateSplit);
        schoolYear = getSchoolYear(dateSplit);
    }
    //Selection 1 is for absent checking for a certain date.
    if (selection == 0) {
        db.ref("People").once('value', function(snapshot) {
            db.ref(schoolYear+"/"+date).once('value', function(snapshot1) {
                console.log(snapshot1);
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
                            list.push(new Person(student.key, student.child("Time").val(), student.child("Reason").val(),
                                student.child("Comments").val()));
                        });
                        students[idx] = list;
                    });
                } else {
                    if (roles.indexOf(role.key) >= 0) {
                        list = [];
                        role.forEach(staff => {
                            list.push(new Person(staff.key, staff.child("Time").val(), staff.child("Reason").val(), staff.child("Comments").val()));
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
        document.getElementById("date").style.display = "none";
        document.getElementById("dateGo").style.display = "none";
        var counter = 0;
        db.ref("People").once('value', function(snapshot) {
            db.ref(schoolYear).once('value', function(snapshot1) {
                snapshot.forEach(function(role) {
                    if (role.key == "Student") {
                        role.forEach(function(grade) {
                            var list = [];
                            var idx = grades.indexOf(grade.key);
                            grade.forEach(function(student) {
                                list.push(new Counter(student.val(), 0));
                            });
                            students[idx] = list;
                        });
                    } else {
                        var list = [];
                        var idx = roles.indexOf(role.key);
                        role.forEach(staff => {
                            list.push(new Counter(staff.val(), 0));
                        });
                        staff[idx] = list;
                    }
                });
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
                    }
                });
                for (var i = 0; i < students.length; i++) {
                    if (students[i]) {
                        textarea.innerHTML += (grades[i] + "\n");
                        for (var j = 0; j < students[i].length; j++) {
                            students[i][j].number = students[i][j].number * 1.0 / counter * 100.0;
                            textarea.innerHTML += (makeAttendanceString(students[i][j]));
                        }
                        textarea.innerHTML += "\n\n";
                    }
                }
                for (var i = 0; i < staff.length; i++) {
                    if (staff[i]) {
                        textarea.innerHTML += (roles[i] + "\n");
                        for (var j = 0; j < staff[i].length; j++) {
                            staff[i][j].number = staff[i][j].number * 1.0 / counter * 100.0;
                            textarea.innerHTML += (makeAttendanceString(staff[i][j]));
                        }
                        textarea.innerHTML += "\n\n";
                    }
                }
                textarea.style.display = "block";
            });
        });
        //Tardy Stats
    } else if (selection == 3) {
        document.getElementById("date").style.display = "none";
        document.getElementById("dateGo").style.display = "none";
        var counter = 0;
        db.ref("People").once('value', function(snapshot) {
            db.ref(schoolYear).once('value', function(snapshot1) {
                snapshot.forEach(function(role) {
                    if (role.key == "Student") {
                        role.forEach(function(grade) {
                            var list = [];
                            var idx = grades.indexOf(grade.key);
                            grade.forEach(function(student) {
                                list.push(new Counter(student.val(), 0));
                            });
                            students[idx] = list;
                        });
                    } else {
                        var list = [];
                        var idx = roles.indexOf(role.key);
                        role.forEach(staff => {
                            list.push(new Counter(staff.val(), 0));
                        });
                        staff[idx] = list;
                    }
                });
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
                                            if (!isTardy(student.child("Time").val(), true)) {
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
                                        if (!isTardy(staffmember.child("Time").val(), false)) {
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
                            students[i][j].number = students[i][j].number * 1.0 / counter * 100.0;
                            textarea.innerHTML += (makeTardyString(students[i][j]));
                        }
                        textarea.innerHTML += "\n\n";
                    }
                }
                for (var i = 0; i < staff.length; i++) {
                    if (staff[i]) {
                        textarea.innerHTML += (roles[i] + "\n");
                        for (var j = 0; j < staff[i].length; j++) {
                            staff[i][j].number = staff[i][j].number * 1.0 / counter * 100.0;
                            textarea.innerHTML += (makeTardyString(staff[i][j]));
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
        document.getElementById("date").style.display = "none";
        document.getElementById("dateGo").style.display = "none";
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
                        textarea.innerHTML += (makeBulkString((gradeList[i] / counter)));
                        textarea.innerHTML += "\n\n";
                    }
                }
                var min = 100;
                var max = 0;
                var index = 0;
                var index1 = 0;
                var addition = 0;
                for (var i = 0; i < staffList.length; i++) {
                    if (staffList[i]) {
                        if (staffList[i] / counter < min) {
                            min = staffList[i] / counter;
                            index = i;
                        }
                        if (staffList[i] / counter > max) {
                            max = staffList[i] / counter;
                            index1 = i;
                        }
                        addition += staffList[i] / counter;
                    }
                }
                if (addition > 0) {
                    textarea.innerHTML += ("Staff \n");
                    textarea.innerHTML += (makeBulkString(addition / staffList.length));
                    textarea.innerHTML += "\n\n";
                    textarea.innerHTML += ("Lowest Percentage \n");
                    textarea.innerHTML += (roles[index] + ": " + parseFloat(min).toFixed(2) + "%" + "\n");
                    textarea.innerHTML += ("Highest Percentage \n");
                    textarea.innerHTML += (roles[index1] + ": " + parseFloat(max).toFixed(2) + "%");
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
                        textarea.innerHTML += (makeBulkString(gradeList[i]));
                        textarea.innerHTML += "\n\n";
                    }
                }

                var addition = 0;
                var min = 100;
                var max = 0;
                var index = 0;
                var index1 = 0;
                for (var i = 0; i < staffList.length; i++) {
                    if (staffList[i]) {
                        if (staffList[i] < min) {
                            min = staffList[i];
                            index = i;
                        }
                        if (staffList[i] > max) {
                            max = staffList[i];
                            index1 = i;
                        }
                        addition += staffList[i];
                    }
                }
                if (addition > 0) {
                    textarea.innerHTML += ("Staff \n");
                    textarea.innerHTML += (makeBulkString(addition / staffList.length));
                    textarea.innerHTML += "\n\n";
                    textarea.innerHTML += ("Lowest Percentage \n");
                    textarea.innerHTML += (roles[index] + ": " + parseFloat(min).toFixed(2) + "%" + "\n");
                    textarea.innerHTML += ("Highest Percentage \n");
                    textarea.innerHTML += (roles[index1] + ": " + parseFloat(max).toFixed(2) + "%");
                }
                textarea.style.display = "block";
            });
        });
    } else {
        alert("There was an Error, Please Refresh the Page");
    }
}