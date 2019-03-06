var students = [];
var db = firebase.database();
var person = makePerson();
db.ref("People").once('value', function(snapshot) {
    snapshot.forEach(function(role) {
        if (role.key == "Student") {
            role.forEach(function(grade) {
                var list = [];
                var idx = grades.indexOf(grade.key);
                grade.forEach(function(student) {
                    list.push(student.val());
                });
                students[idx] = list.sort();
            });
            var grade_sel = document.getElementById('grade-select');
            for(var child of grade_sel.children) {
                var index = parseInt(child.value);
                if(!students[index])
                    child.disabled = true;
            }
        }
    });
});


function getStudents(selected) {
    var selectedGrade = parseInt(selected.value);
    person.grade = grades[selectedGrade];
    var studentSelect = document.getElementById('student-select');
    clearChildren(studentSelect)
    if(students[selectedGrade]) {
        for(var i of students[selectedGrade]) {
            var option = document.createElement('option');
            option.value=i;
            option.innerText = i;
            studentSelect.appendChild(option);
        }
    }
    studentSelect.disabled = false;
}

function showPresentAbsent(selected) {
    person.name = selected.value;
    document.getElementById('pORa').disabled = false;;
}

function checkAbsent(selected) {
    var pOrA = selected.value 
    var time = document.getElementById('time');
    var date = document.getElementById('date');
    var tardyabsent = document.getElementById('tardy-info');
    date.disabled = false;
    if(pOrA === "A") {
        time.hidden = true;
        time.disabled = true;
        person.time = "-1";
        tardyabsent.hidden = false;
    } else {
        time.hidden = false;
        time.disabled = false;
        tardyabsent.hidden = true;
    }
}

function addDate(dater) {
    person.schoolYear = getSchoolYear(dater.value.split("-"));
    person.date = getDateString(dater.value.split("-"));
}

function addTime(timer) {
    var tardyabsent = document.getElementById('tardy-info');
    person.time = timer.value
    var time = person.time.split(":")
    var hour = parseInt(time[0]);
    var minute = parseInt(time[1]);
    if(hour > 10 || hour === 10 && minute > 40) {
        tardyabsent.hidden = false;
    } else {
        tardyabsent.hidden = true;
    }
}

function addReason(reasoner) {
    person.reason = reasoner.value;
}

function addComments(commenter) {
    person.comments = commenter.value;
}

function makeChanges() {
    if(!person.reason) {
        var time = person.time.split(":")
        var hour = time[0];
        var minute = time[1];
        if(hour > 10 || hour === 10 && minute > 40) {
            alert('You must select a reason if a Student is Tardy');
        } else {
            person.time = militaryTimeToAMPMTime(person.time);
        }
    }
    person.comments = comments.value;
    var ref = db.ref(person.schoolYear+"/"+person.date+"/Student/"+person.grade);
    ref.child(person.name).remove();
    ref = ref.child(person.name);
    ref.child("Time").set(person.time)
    if(person.reason) {
        ref.child("Reason").set(person.reason)
        if(person.comments)
            ref.child("Comments").set(person.comments)
    } else {
        if(ref.child("Reason")) {
            ref.remove
        }
    }
    person.reason = null;
    person.comments = null;
}
