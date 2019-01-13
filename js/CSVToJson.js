var todayDate;
const TEACHER = "Teacher";
const grades = ["1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade", "6th Grade"]
const roles = ["Teachers", "Management", "Support Staff"]
var peopleMap = new Map();
var students = new Map();

document.getElementById('input-file').addEventListener('change', getFile);

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
    console.log("HEY");
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
  makeJson();
  toFile(toJson());
}

function makeJson() {
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
      } else {
        role = s[1];
      }
      var date = s[0];
      var time = splitDate(date);
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
          p.time = time;
          p.name = name;
          p.reason = tardy[0];
          p.comments = tardy[1];
          students.get(grades[i]).push(p);
          break;
        }
      }
      if (p.role == null) {
        p.role = role;
        p.grade = null;
        p.time = time;
        p.name = name;
        p.reason = tardy[0];
        p.comments = tardy[1];
        peopleMap.get(role).push(p);
      }
    }
  } catch (err) {
    console.log("Hello")
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

function splitDate(date) {
  var toddate = date.split(" ");
  if (todayDate == null) {
    todayDate = toddate[0];
  }
  var todtime = toddate[1].split(":");
  if (parseInt(todtime[0]) > 12) {
    return todtime[0] + ":" + todtime[1] + " PM";
  } else {
    return todtime[0] + ":" + todtime[1] + " AM";
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

class Person {

  constructor() {
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
