const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const grades = ['1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade'];
var alpha = "abcdefghijklmnopqrstuvwxyz-ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
const roles = ['Teacher', 'Management', 'Intern'];
var students = [];
var staff = [];
var selection = null;
const config = {
    apiKey: "NVLn6KOUs2t2jqrY9t41nYqM2zebZOaTx1AA9Zp",
    authDomain: "attendance-rec.firebaseapp.com",
    databaseURL: "https://attendance-rec.firebaseio.com",
    projectId: "attendance-rec",
    storageBucket: "attendance-rec.appspot.com",
    messagingSenderId: "69537583971"
};

firebase.initializeApp(normalize(config));