const config = {
    apiKey: "NVLn6KOUs2t2jqrY9t41nYqM2zebZOaTx1AA9Zp",
    authDomain: "attendance-rec.firebaseapp.com",
    databaseURL: "https://attendance-rec.firebaseio.com",
    projectId: "attendance-rec",
    storageBucket: "attendance-rec.appspot.com",
    messagingSenderId: "69537583971"
};

firebase.initializeApp(normalize(config));

function logout() {
    firebase.auth().signOut()
  .then(function() {
    document.getElementById("login_out").style.display = "none";
  })
  .catch(function(error) {
      alert(error);
  });
}

function signIn() {
    var username = document.getElementById("userName").value;
    var password = document.getElementById("password").value;
    firebase.auth().signInWithEmailAndPassword(username, password).then(function(user) {
        if (user) {
          showOptions();
          document.getElementById('input-file').addEventListener('change', getFile);
        }
    }, function(error) {
        alert(error);
    });
}