count = 0.1;
function doMap(n, start1, stop1, start2, stop2) {
    return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
};

function signIn() {
    var username = document.getElementById("username").value;
    if(username.indexOf('@') === -1) {
        username += '@gmail.com';
    }
    var password = document.getElementById("password").value;
    firebase.auth().signInWithEmailAndPassword(username, password).then(function(user) {
        if (user) window.location.href="attendance_data.html";
    }, function(error) {
        // document.body.style.opacity = 1-count;
        // count += 0.1;
        // var a = document.getElementsByClassName("login_container")[0];
        // a.style.top = doMap(Math.random(), 0, 1, -10, 60)+"%";
        // a.style.left = Math.random(0.2, 0.8)*100+"%";
        var inputs = document.getElementsByClassName("login");
        var a = document.getElementsByClassName("incorrect")[0];
        for (var input of inputs) {
            input.style.borderColor = "red";
        }
        a.style.display = "block";
        setTimeout(function(){
            for (var input of inputs) {
                input.style.borderColor = "";
                a.style.display = "none";
            }
         }, 2000);
    });
}
