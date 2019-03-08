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
      .catch(function(error) {
        alert(error);
      });
}