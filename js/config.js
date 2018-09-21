var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var grades = ['1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade'];
var roles = ['Teacher', 'Management', 'Intern'];
var students = [];
var staff = [];
var selection = null;
var config = {
    apiKey: "AIzaSyBHfOgO7deLVgQNaLd-Om2YMBXGkNooVMc",
    authDomain: "attendance-rec.firebaseapp.com",
    databaseURL: "https://attendance-rec.firebaseio.com",
    projectId: "attendance-rec",
    storageBucket: "attendance-rec.appspot.com",
    messagingSenderId: "69537583971"
};
firebase.initializeApp(config);