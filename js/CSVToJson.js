var todayDate;
var date = "";
var peopleMap = new Map();
var students = new Map();
var checked = false;
var date = "";
var TEACHER = "Teacher"

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    showOptions();
  } else {
    showLogin();
  }
});

function showOptions() {
  document.getElementById("after_login").style.display = "block";
  document.getElementById("login").style.display = "none";
  document.getElementById("login_btn").style.display = "none";
  document.getElementById("login_out").style.display = "block";
}

function showLogin() {
  document.getElementById("after_login").style.display = "none";
  document.getElementById("login").style.display = "block";
  document.getElementById("login_btn").style.display = "block";
  document.getElementById("login_out").style.display = "none";
}

function getFile(event) {
  const input = event.target
  if ('files' in input && input.files.length > 0) {
    placeFileContent(
      document.getElementById('content-target'),
      input.files[0])
    // mainFunc();
  }
}

function placeFileContent(target, file) {
  readFileContent(file).then(content => {
    target.value = content
  }).catch(error => {
    console.log(error)
  })
}

function readFileContent(file) {
  const reader = new FileReader()
  return new Promise((resolve, reject) => {
    reader.onload = event => resolve(event.target.result)
    reader.onerror = error => reject(error)
    reader.readAsText(file)
  })
}

function mainFunc() {
  initializeMaps();
  makeObjects();
  if(checked) {
    toFile(toJson());
  } else {
    sendToDB();
  }
}

function sendToDB() {
  var db = firebase.database();
  for(var grade of students.values()) {
    for(var name of grade) {
      var schoolYear = getSchoolYearDate(name.date.split("/"));
      date = getDateStringDate(name.date.split("/"))
      var obj = makeObject(name);
        db.ref(schoolYear+"/"+date+"/"+name.role+"/"+name.grade+"/"+name.name).set(obj)
    }
  }
  for(var role of peopleMap.values()) {
    for(var name of role) {
      var schoolYear = getSchoolYearDate(name.date.split("/"));
      date = getDateStringDate(name.date.split("/"))
      var obj = makeObject(name);
      db.ref(schoolYear+"/"+date+"/"+name.role+"/"+name.name).set(obj)
    }
  }
}

function makeObjects() {
  try {
    var text = document.getElementById('content-target').value;
    var lines = text.split("\n");
    for (var line of lines) {
      var role = "";
      var s = line.split(",");
      if(s[0] === "Timestamp") {
        continue;
      }
      if (s[1] === "Teachers") {
        role = TEACHER;
      } else if(s[1].split(" ")[0] === "Support") {
        role = "Intern";
      } else {
        role = s[1];
      }
      var day = s[0];
      var time = splitDate(day);
      var name = "";
      for (var i = 2; i < s.length; i++) {
        if (s[i] !== "") {
          name = s[i];
          break;
        }
      }
      var p = new Person();
      var tardy = getTardy(s);
      for (var i = 0; i < grades.length; i++) {
        if (grades[i] === role) {
          p.role = "Student";
          p.grade = grades[i];
          p.date = time[0];
          p.time = time[1];
          p.name = name;
          if(tardy[0] !== p.name) {
            p.reason = tardy[0];
          }
          p.comments = tardy[1];
          students.get(grades[i]).push(p);
          break;
        }
      }
      if (p.role == null) {
        p.role = role;
        p.grade = null;
        p.date = time[0]
        p.time = time[1];
        p.name = name;
        if(tardy[0] !== p.name) {
          p.reason = tardy[0];
        }
        p.comments = tardy[1];
        peopleMap.get(role).push(p);
      }
    }
  } catch (err) {
    console.log(err);
  }
}

function initializeMaps() {
  peopleMap.set(TEACHER, []);
  for (var i = 1; i < roles.length; i++) {
    peopleMap.set(roles[i], []);
    //peopleMap.get(roles[i]) = new ArrayList<String>();
  }
  for (var i = 0; i < grades.length; i++) {
    students.set(grades[i], []);
    //students.get(roles[i]) = new ArrayList<String>();
  }
}

function getTardy(tardy) {
  var comments;
  var reason = tardy[tardy.length - 2];
  var s = [];
  if (reason != null) {
    comments = tardy[tardy.length - 1];
    if (comments != null) {
      s[0] = reason;
      s[1] = comments;
      return s;
    }
    s[0] = reason;
    s[1] = null;
    return s;
  }
  s[0] = null;
  s[1] = null;
  return s;
}

function toFile(s) {
    var jsonFile ="data.json";
    var text = s.join('');
    download(jsonFile, text);
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

  function toJson() {
  var sb = [];
  sb.push("{");
  for (var [key, value] of peopleMap.entries()) {
    if (key === "Support Staff") {
      sb.push("\"Intern\": {");
    } else
      sb.push("\"" + key + "\": {");
    var personList = value;
    for (var i = 0; i < personList.length; i++) {
      var p = personList[i]
      sb.push("\"" + p.name + "\":{");
      sb.push("\"Time\": \"" + p.time + "\"");
      if (p.reason !== "") {
        sb.push(",\"Reason\": \"" + p.reason + "\",");
        if (p.comments !== "") {
          sb.push("\"Comments\": \"" + p.comments + "\"");
        }
      }
      if (i < personList.length - 1)
        sb.push("},");
      else
        sb.push("}");
    }
    sb.push("},");
  }
  sb.push("\"Student\": {");
  var j = 0;
  var lastGrade = getLastKey();
  for (var [key, value] of students.entries()) {
    if (value.length === 0) {
      j++;
      continue;
    }
    sb.push("\"" + key + "\": {");
    var personList = value;
    for (var i = 0; i < personList.length; i++) {
      var p = personList[i]
      sb.push("\"" + p.name + "\":{");
      sb.push("\"Time\": \"" + p.time + "\"");
      if (p.reason !== "") {
        sb.push(",\"Reason\": \"" + p.reason + "\",");
        if (p.comments !== "") {
          sb.push("\"Comments\": \"" + p.comments + "\"");
        }
      }
      if (i < personList.length - 1)
        sb.push("},");
      else
        sb.push("}");
    }
    if (grades[j] != lastGrade)
      sb.push("},");
    else
      sb.push("}");
    j++;
  }
  sb.push("}");
  sb.push("}");
  return sb;
}

function boxChecked() {
  if(checked) {
    checked = false;
  } else {
    checked = true;
  }
}

function getLastKey() {
  var lastKey = "";
  var iter = "";
  var keys = students.keys();
  while((iter = keys.next()).value !== undefined) {
    if(students.get(iter.value).length > 0) {
      lastKey = iter.value;
    }
  }
  return lastKey;
}
