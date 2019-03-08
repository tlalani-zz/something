// Initialize Firebase
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        showOptions();
    } else {
        alert("You must be logged in to use any functions");
        window.location.href="index.html";
    }
});

function showOptions() {
    document.getElementById("list").style.display = "block";
    document.getElementById("login_out").style.display = "block";

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
    document.getElementById("yearGo").style.display="inline-block";
    document.getElementById("options1").style.display = "inline-block";
}

function patSelected() {
   if(document.getElementById('per-day-attendance').selectedIndex === 5) {
       document.getElementById('checkboi').hidden = false;
   } else {
       document.getElementById('checkboi').hidden = true;
   }
}

function showDate(id, select) {
    var daily_queries = document.getElementById("per-day-attendance")
    var yearly_stats = document.getElementById("yearly-statistics")
    if(id === daily_queries.id) {
        yearly_stats.selectedIndex = 0;
    } else {
        daily_queries.selectedIndex = 0;
    }
    selection = parseInt(select);
    document.getElementById("response").innerHTML = "";
    if (selection > 4) {
        showOptionsDropdown();
    } else {
        document.getElementById("date").style.display = "inline-block";
        document.getElementById("dateGo").style.display = "inline-block";
        document.getElementById("options1").style.display = "none";
        document.getElementById("yearGo").style.display = "none";
    }

}

function doQuery() {
    patSelected();
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
    switch(selection) {
        //Absent Students for Certain Day
        case 0:
            absentStudentsForCertainDay(db, textarea, schoolYear, date);
            break;
        //Attendance for Certain Day.
        case 1:
            attendanceForCertainDay(db, textarea, schoolYear, date);
            break;
        //Attendnace stats.
        case 2:
            attendancePercentagesByGradeByDay(db, textarea, schoolYear, date);
            break;
        //Tardy Stats
        case 3:
            tardyPercentagesByGradeByDay(db, textarea, schoolYear, date);
            break;
        //Attendance Stats by Grade
        case 4:
            presentAbsentTardyForDay(db, textarea, schoolYear, date);
            break;
        //Attendance stats by grade by day
        case 5:
            attendancePercentagesForYear(db, textarea, schoolYear);
            break;
        //Tardy Stats by Grade by Day
        case 6:
            tardyPercentagesPerYear(db, textarea, schoolYear);
            break;
        //Present Absent Tardy for a Day.
        case 7:
            attendancePercentageByGrade(db, textarea, schoolYear);
            break;
        case 8:
            break;
        default:
            alert("There was an Error, Please Refresh the Page"+selection);
            break;
    }
}