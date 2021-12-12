/* jshint esversion: 6 */
require('dotenv').config();
const express = require('express');
const https = require("http");
const bodyParser = require("body-parser");


// const Redis = require("ioredis");

// const redis = require("./redix-client");

const app = express();


app.use(bodyParser.urlencoded({extended:true}));   



let requests=1;

app.get('/',function(req,res){
    res.sendFile(__dirname + "/index.html");
})

app.post("/",(req,res)=>{
    console.log("withOut Interval =>",requests);
    if(requests<=2){
        
        city = req.body.cityName;
        apikey = process.env.APIKEY;
        units = "metric" ;
        url="http://api.openweathermap.org/data/2.5/weather?&q=" + city + "&appid="+ apikey + "&units=" + units;
        https.get(url,function(respond){
            // console.log(respond.statusCode);
            respond.on("data",function(data){
                const weatherData = JSON.parse(data);
                // console.log(weatherData);
                const temp = weatherData.main.temp;
                const description = weatherData.weather[0].description;
                const icon= weatherData.weather[0].icon;
                const imageUrl = "http://openweathermap.org/img/wn/" + icon +"@2x.png"
                res.write("<h1>The temperture of " + city + " is "+ temp + " degree C</h1>");
                res.write("<h2>And, the weather Condition is "+ description + "</h2>");
                res.write("<img src="+ imageUrl + ">");
                res.send();
            })
    })
    }
    else if(requests>2 && requests<=4){
        setTimeout(function(){ 
            
        city = req.body.cityName;
        apikey = process.env.APIKEY;
        units = "metric" ;
        url="http://api.openweathermap.org/data/2.5/weather?&q=" + city + "&appid="+ apikey + "&units=" + units;
        https.get(url,function(respond){
        // console.log(respond.statusCode);
        respond.on("data",function(data){
            const weatherData = JSON.parse(data);
            // console.log(weatherData);
            const temp = weatherData.main.temp;
            const description = weatherData.weather[0].description;
            const icon= weatherData.weather[0].icon;
            const imageUrl = "http://openweathermap.org/img/wn/" + icon +"@2x.png"
            res.write("<h1>The temperture of " + city + " is "+ temp + " degree C</h1>");
            res.write("<h2>And, the weather Condition is "+ description + "</h2>");
            res.write("<img src="+ imageUrl + ">");
            res.send();
        })
    })
         }, 20000)
    }
    else if(requests>4){
        return console.log("Server Busy");
    }


    
    if(requests>2){
        
    var downloadTimer = setInterval(function(){
        if(requests > 2){
            requests -= 1;
            console.log(requests);
      } 
      else{
        clearInterval(downloadTimer);
      }
    }, 60000);
    }

    requests++;
    
});

app.listen(3000, function(){
    console.log("Server is Running.!!");
});