// Initialize Firebase
var config = {
 apiKey: "AIzaSyCs_rm6Vd1LSg32l-g63eVswNc2PLx4XKo",
 authDomain: "train-timesheet.firebaseapp.com",
 databaseURL: "https://train-timesheet.firebaseio.com",
 storageBucket: "train-timesheet.appspot.com",
 messagingSenderId: "53672336702"
};

firebase.initializeApp(config);

//Shortcut to firebase database
var database = firebase.database();


$("document").ready(function(){

  //Commit user inputs into the firebase.database 
  $("#add-train-btn").on("click", function() {

    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var trainStart = $("#start-input").val().trim();
    var frequency = $("#frequency-input").val().trim();
    var newTrain = {
      name: trainName,
      des: destination,
      start: trainStart,
      rate: frequency
    };

    //Pushing object to the firebase database
    database.ref().push(newTrain);

    //Clear all the inputboxes after the val was sent to the database
    $(".form-control").val("");

    return false;
  });
//This can be enabled to wipe the database, but I decided not to use it.
  // $("#clear-btn").on("click", function(){

  //   //clear database and the train schedules
  //   $("#train-table > tbody").empty();
  //   database.ref().remove();
  // });

  //listening to the database for any child being added
  database.ref().on("child_added", function(childSnapshot) {

    //setting var from each database info
    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().des;
    var trainStart = childSnapshot.val().start;
    var frequency = childSnapshot.val().rate;

    //calculating times for the outputs
    var timeConverted = moment(trainStart, "HH:mm").subtract(1, "years");
    var diffTime = moment().diff(moment(timeConverted), "minutes");
    var timeRemainder = diffTime % frequency;
    var minutesAway = frequency - timeRemainder;
    var nextTrain = moment().add(minutesAway, "minutes");
    var nextArrival = moment(nextTrain).format("HH:mm"); 

    //appending all the information to the table
    $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
    frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");
  });
});
