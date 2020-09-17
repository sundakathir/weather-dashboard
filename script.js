var table = document.getElementsByTagName("table")[0];
var tbody = table.getElementsByTagName("tbody")[0];
tbody.onclick = function (e) {
    e = e || window.event;
    var data = [];
    var target = e.srcElement || e.target;
    while (target && target.nodeName !== "TR") {
        target = target.parentNode;
    }
    if (target) {
        var cells = target.getElementsByTagName("td");
        for (var i = 0; i < cells.length; i++) {
            data.push(cells[i].innerHTML);
        }
    }
   
    document.getElementById("textCity").value =data
    clearBox("five-day") 
   
};

function clearBox(elementID) { 
  var div = document.getElementById(elementID); 
    
  while(div.firstChild) { 
      div.removeChild(div.firstChild); 
  } 
} 
//global variables
var apiKey = "77fb2b8c201644e9151a45c5208bdf13"
var city = "melbourne"
var currentConditions = "https://api.openweathermap.org/data/2.5/weather?appid="
var fiveDay =
  "https://api.openweathermap.org/data/2.5/forecast?77fb2b8c201644e9151a45c5208bdf13q={city name},{country code}"
var uvIndex =
  "https://api.openweathermap.org/data/2.5/uvi?appid={appid}&lat={lat}&lon={lon}"
var searchedArr = JSON.parse(localStorage.getItem("searchedItems")) || [];

var temp;
var loc;
var icon;
var humidity;
var wind;
var dirction;


//taking in user input, and passing the value into a variable
$(document).ready(function() {
  $("#submitBtn").on("click", function(event) {
    var userInput = $("#textCity").val()
    console.log(userInput)
    getWeather(userInput)
    
  })
})

// userInput is passed into the getWeather function as arguement 'cityName'
function getWeather(cityName) {
  var apiCall = ""

  if (cityName !== "") {
    apiCall = currentConditions + apiKey + "&q=" + cityName
    //return apiCall;
  } else {
    apiCall = currentConditions + apiKey + "&q=" + city
    //return apiCall;
  }

  $.ajax({
    url: apiCall,
    method: "GET"
  }).then(function(response) {
    console.log(response)
    var temp = response.main.temp
    temp = (temp - 273.15) * 1.8 + 32
    temp = Math.floor(temp)
    loc = response.name
    humidity=response.main.humidity
    wind=response.wind.speed
    dirction=response.wind.deg
    icon=response.weather[0].icon
    document.getElementById("loc").innerHTML ="City: " +loc;
    document.getElementById("temp").innerHTML ="Temprature: " +temp+"&deg;"
    document.getElementById("humidity").innerHTML ="Humidity: "+humidity;
    document.getElementById("wind").innerHTML ="Wind speed: " + wind + "mph";
    document.getElementById("direction").innerHTML ="Wind direction:" + dirction+ "N";
   
    fiveDay = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`

     $.ajax({
      url: fiveDay,
      method: "GET"
    }).then(function(response) {
      console.log(response)

      var averageTemp = 0
      var previousdate = ""
      var count = 0
      var results = 0
      previousdate = moment().format("MM/DD/YYYY")
      for (let index = 0; index < response.list.length; index++) {
        var currentDate = moment(response.list[index].dt, "X").format(
          "MM/DD/YYYY"
        )
        var temp = response.list[index].main.temp
        temp = (temp - 273.15) * 1.8 + 32
        temp = Math.floor(temp)
        console.log(currentDate)
        console.log(temp)

        if (previousdate === currentDate) {
          averageTemp = averageTemp + temp
          count++
          previousdate = currentDate
        } else {
          results = averageTemp / count
          results = Math.floor(results)
          var wind =response.list[index].wind.speed
          var humidity=response.list[index].main.humidity
          var direction =response.list[index].wind.deg
          
          var card = $("<div class = 'card col-sm-4 id =newcard'>")
          var div1 = $("<div class= 'card-header '>")
          div1.append("Date: " +'  '+ currentDate)
          card.append(div1)
          var div2 = $("<div class= 'card-body'>")
          div2.append("Temperature:" + results)
          card.append(div2)
          var div3 = $("<div class= 'card-body'>")
          div3.append("Humidity: " + humidity )
          card.append(div3)
          var div4 = $("<div class= 'card-body'>")
          div4.append("Wind Speed: " + wind +"mph")
          card.append(div4)
          var div5 = $("<div class= 'card-body'>")
          div5.append("Direction: " + dirction+ "N")
          card.append(div5)



          $("#five-day").append(card)
          
          count = 0
          averageTemp = 0
          previousdate = currentDate



         
        }
      }
    })
  })
}