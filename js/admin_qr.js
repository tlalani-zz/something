var names = [];
var currentUser = null;

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        currentUser = user;
        //document.getElementById("login_out").style.display = "block";
        //var f = new File(null, '../pictures');
    } else {
        document.getElementById("login_out").style.display = "none";

    }
});

function addPerson() {
    var name_obj = document.getElementById("person_object");
    var pic1_obj = document.getElementById("student_staff");
    var pic2_obj = document.getElementById("pic");
    var name =pic1_obj.options[pic1_obj.selectedIndex].value+":"+name_obj.value
    var pic1 = "students"
    if(pic1_obj.selectedIndex > 1) {
        pic1 = "staff"
    }
    var pic2 = pic2_obj.value
    names.push({ 
        name:name, 
        folder:pic1, 
        jpeg:pic2 
    });
    name_obj.value = ""
    pic1_obj.selectedIndex = 0
    pic2_obj.value = ""
    console.log(names)
}

function performQR() {
    for (var object of names) {
        var p = document.createElement("p");
        var p2 = document.createElement("p");
        p.className = "para";
        p2.className = "para";
        var text = document.createTextNode(object.name.split(":")[1]);
        var text2 = document.createTextNode(object.name.split(":")[1]);
        var div = document.createElement("div");
        var codeDiv = document.createElement("div");
        var imageDiv = document.createElement("div");
        div.className = "grid-box";
        div.style.width = "400px";
        div.style.height = "250px";
        var image = document.createElement("img");
        var code = document.createElement("img");
        image.src = "pictures/"+object.folder+"/"+object.jpeg+".jpg";
        var data = object.name
        image.className = "image";
        code.src = "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=" + data;
        code.className = "image";
        p.appendChild(text);
        p.style.textAlign = 'center';
        imageDiv.appendChild(p);
        imageDiv.appendChild(image);
        p2.appendChild(text2);
        p2.style.textAlign = 'center';
        codeDiv.appendChild(p2);
        codeDiv.appendChild(code);
        div.appendChild(codeDiv);
        div.appendChild(imageDiv);
        codeDiv.style.cssFloat = "left";
        imageDiv.style.cssFloat = "right";
        imageTabsDiv.appendChild(div);
    }
    names = [];
}