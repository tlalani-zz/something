var names = [];
var currentUser = null;

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        currentUser = user;
        document.getElementById("login_out").style.display = "block";
        document.getElementById("admin_qr").style.display = "block";
    } else {
        document.getElementById("login_out").style.display = "none";
        document.getElementById("admin_qr").style.display = "none";

    }
});

document.getElementById('input-file')
    .addEventListener('change', getFile);

function getFile(event) {
    const input = event.target
    if ('files' in input && input.files.length > 0) {
        placeFileContent(
            document.getElementById('content-target'),
            input.files[0])
    }
}

function placeFileContent(target, file) {
    readFileContent(file).then(content => {
        target.value = content
    }).catch(error => console.log(error))
}

function readFileContent(file) {
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
        reader.onload = event => resolve(event.target.result)
        reader.onerror = error => reject(error)
        reader.readAsText(file)
    })
}

function goToAdminPage() {
    window.location.href="admin_qr.html";
}
function makeCodes() {
    var data = "";
    var staffIndex = 1;
    var studentIndex = 1;
    for (var person of names) {
        var p = document.createElement("p");
        var p2 = document.createElement("p");
        p.className = "para";
        p2.className = "para";
        var text = document.createTextNode(person.name);
        var text2 = document.createTextNode(person.name);
        var div = document.createElement("div");
        var codeDiv = document.createElement("div");
        var imageDiv = document.createElement("div");
        div.className = "grid-box";
        var image = document.createElement("img");
        var code = document.createElement("img");
        if (person.role === "Student") {
            image.src = "pictures/students/" + studentIndex + ".jpg";
            studentIndex++;
        } else {
            image.src = "pictures/staff/" + staffIndex + ".jpg";
            staffIndex++;
        }
        var data = person.role+":"+person.name;
        image.className = "image";
        code.src = "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=" + data;
        code.className = "image";
        p.appendChild(text);
        imageDiv.appendChild(p);
        imageDiv.appendChild(image);
        p2.appendChild(text2);
        codeDiv.appendChild(p2);
        codeDiv.appendChild(code);
        div.appendChild(codeDiv);
        div.appendChild(imageDiv);
        codeDiv.style.cssFloat = "left";
        imageDiv.style.cssFloat = "right";
        imageTabsDiv.appendChild(div);
    }
}

function ReadData() {
    var grades = ["1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade", "6th Grade"];
    var grade = "";
    var role = "";
    var text = document.getElementById('content-target').value;
    var lines = text.split("\n");
    var i = 0;
    while(i < lines.length) {
        switch (lines[i]) {
            case "Grade":
                role = "Student";
                var x = "";
                i++;
                if (i<lines.length && lines[i] !== null) {
                    grade = grades[parseInt(lines[i]) - 1];
                }
                i++;
                break;
            case "Management":
                role = "Management";
                grade = null;
                i++;
                break;
            case "Teacher":
                role = "Teacher";
                grade = null;
                i++;
                break;
            case "Support":
            case "Interns":
            case "Intern":
                role = "Intern";
                grade = null;
                i++;
                break;
            default:
                if (lines[i] !== undefined && lines[i] !== null && lines[i].length > 0) {
                    if (grade != null) {
                        var name = new Names(role, grade, lines[i]);
                        names.push(name);
                    } else {
                        var name = new Names(role, null, lines[i]);
                        names.push(name);
                    }
                }
                i++;
                break;
        }
    }
    makeCodes();
}

class Names {

	constructor(r,g,n) {
		this.role = r;
		this.grade = g;
		this.name = n;
	}
	
	toString(){
		if(this.grade != null) {
			var x = this.role +":"+ this.grade +":"+ this.name;
			return x;
		}
		else{
			var x = this.role +":"+ this.name;
			return x;
		}
	}
}