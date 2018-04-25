//Read File
function readSingleFile(e) {

  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var reader = new FileReader();

  // execude on load of file
  reader.onload = function(e) {
    var contents = e.target.result;

    // get data in right format
    lineArray = createArray(contents);
    var structArray = createStructs(lineArray);
    // log data
    //console.log(structArray);

    // display Contents
    displayContents(structArray);
  };
  reader.readAsText(file);
}


// Display all data
function displayContents(contents) {

  // contents with objects name, message, date, time

  // TODO: make carousell for groups
  // TODO: make it more viewable

  // User specific  ------------------------------------------------
  var wordsPerMessage = [];
  for (var i = 0; i < 2; i++) {
    // message Count ----------------------------------------
    var messagesCount = "0";
    messagesCount = contents[i].message.length;

    // Words per message ------------------------------------
    // returns [avergeWordsPerMessage,tolatWords];
    wordsPerMessage[i] = calcWordsPerMessage(contents[i].message);

    // Most used words --------------------------------------
    var Words = getWordCount(contents[i].message);
    var str4Pic = ["_<‎bild","_<picture"];
    var sentPicsIndex = [-1,-1];
    var sentAudioIndex = [-1,-1];

    // create &sort most Used array
    var mostUsed = [["",0],["",0],["",0],["",0],["",0],["",0],["",0],["",0],["",0],["",0],
                    ["",0],["",0],["",0],["",0],["",0],["",0],["",0],["",0],["",0],["",0],
                    ["",0],["",0],["",0],["",0],["",0],["",0],["",0],["",0],["",0],["",0],];
    for (var key in Words) {
      if (Words.hasOwnProperty(key)) {
        // evaluate the rest
        for (var j = 0; j < 30; j++) {
          if (Words[key] > mostUsed[j][1]){
            mostUsed.splice( j, 0, [key, Words[key]]);
            break;
          }
        }
      }
    }

    // evaluate how many pics were sent
    for (var j = 0; j < mostUsed.length; j++) {
      if (mostUsed[j][0] == str4Pic[0]) {
        sentPicsIndex[i] = j;
        break;
      }
    }
    // remove it from the array
    mostUsed.splice(sentPicsIndex[i], 1);

    // --  evaluate how many audio files were sent
    for (var j = 0; j < mostUsed.length; j++) {
      if (mostUsed[j][0] == "_<audio") {
        sentAudioIndex[i] = j;
        break;
      }
    }
    // remove it from array
    mostUsed.splice(sentAudioIndex[i], 1);

    // renove unwanted words
    // find position of "weggelassen>"
    // TODO: Add other languages
    var endOfMedia = ["_weggelassen>"]

    for (var j = 0; j < mostUsed.length; j++) {
      if (mostUsed[j][0] == endOfMedia[0]) {
        mostUsed.splice(j, 1);
        break;
      }
    }
    for (var j = 0; j < mostUsed.length; j++) {
      if (mostUsed[j][0] == "") {
        mostUsed.splice(sentPicsIndex[j], 1);
        break;
      }
    }

    // Most used emojies

    // HTML CONSTRUCTION ------------------------------------
    var mostUsedHTML ="";
    console.log(wordsPerMessage[i][1]);
    for (var j = 0; j < 30; j++) {
      mostUsedHTML = mostUsedHTML + "<p>" + mostUsed[j][0].substring(1) +" - "+ Math.round(mostUsed[j][1]/wordsPerMessage[i][1]*1000)/10 + "%</p>";
    }

    var btn = "<button type='button' class='btn' data-toggle='collapse' data-target='#mostUsed"+i+"''>" +
              "<i class='fas fa-chevron-down'></i></button>";

    var div = document.createElement('div');
    div.className = 'col-sm';
    div.innerHTML = "<h4>" + contents[i].name + "</h4>" +
                    "<p> Messages sent: <b>" + messagesCount + "</b></p>" +
                    "<p> Words per Message: <b>" + wordsPerMessage[i][0] + "</b></p>" +
                    "<p> Pictures sent: " + mostUsed[sentPicsIndex[i]][1] + "</p>" +
                    "<p>"+ btn + "<b> Most used words:</b></p>"+
                    "<div id='mostUsed"+i+"' class='collapse in'>" + mostUsedHTML + "</div>";
    document.getElementById('users').appendChild(div);

  }

  // words bar Graph
/*
  for (var i = 0; i < 30; i++) {
    barData = mostUsed[i][0];
    barLabes = mostUsed[i][1];
  }
  new Chart(
      document.getElementById("barWords"),
      {
      "type":"bar",
      "data":{"labels":[ ['Monday', ''],"Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      "datasets":[
        {"label":barLabes,
        "data":barData,
        "fill":true,"backgroundColor":"rgba(20, 168, 204, 0.2)",
        "borderColor":"rgb(20, 168, 204)",
        "pointBackgroundColor":"rgb(20, 168, 204)",
        "pointBorderColor":"#fff","pointHoverBackgroundColor":"#fff",
        "pointHoverBorderColor":"rgb(20, 168, 204)"}],
        options: {
        legend: {
          display: false
      },
      layout: {
          padding: {
            top: 20
          }
      },
      showLabelsOnBars:true,
      barLabelFontColor:"gray",
      animation: {
          duration: 0
      },
      scales: {
          yAxes: [{
              stacked: true,
              display: false,
              ticks: {
                  beginAtZero:true
              }
          }],
          xAxes: [{
              stacked: true,
              id:"ejeX",
              ticks: {
                  beginAtZero:true,
                  fontSize: 30
                  }}]
          },
          plugins: {
              datalabels: {
                color: 'black',
                font: {size: 24},
                  display: true
              }
          }
      }
      });
*/

  // factors ------------------------------------------------------

    if (contents[0].message.length > contents[1].message.length) {
      factorF = Math.round((contents[0].message.length/contents[1].message.length)*100)/100;
      wpmF = Math.round(wordsPerMessage[0][0]/wordsPerMessage[1][0]*100)/100;
      wpm = "And " + contents[0].name + " messages contain <b>" + wpmF + "</b> times the words of " +contents[1].name + " messages!</b>";
      n = 0;
    } else {
      factorF = Math.round((contents[1].message.length/contents[0].message.length)*100)/100;
      wpmF = Math.round(wordsPerMessage[1][0]/wordsPerMessage[0][0]*100)/100;
      wpm = "And " + contents[1].name + " messages contain <b>" + wpmF + "</b> times the words of " +contents[0].name + " messages!</b>";
      n = 1;
    }
    factor = contents[n].name + " writes <b>" + factorF + "</b> times more messages!";

    var percent = Math.round((wpmF)*factorF*100);
    if (percent >= 1) {
      percent = percent.toString().substring(1,3)  + "</b>% more!";
    } else {
      percent = percent  + "</b>% less!";
    }

    total = "Overall " + contents[n].name +" communicates <b>" + percent;

    var div = document.createElement('div');
    div.className = 'mb-0';
    div.innerHTML = "<p>" + factor + "</p>" +
                    "<p>" + wpm + "</p>" +
                    "<p>" + total + "</p>";
    document.getElementById('usersRows').appendChild(div);


  // Messages per Day Radar -----------------------------------------
    dayCount = [getMessagesPerDay(contents[0].date), getMessagesPerDay(contents[1].date)];
    new Chart(
        document.getElementById("dayRadar"),
        {
        "type":"radar",
        "data":{"labels":[ ['Monday', ''],"Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
        "datasets":[
          {"label":contents[0].name,
          "data":dayCount[0],
          "fill":true,"backgroundColor":"rgba(20, 168, 204, 0.2)",
          "borderColor":"rgb(20, 168, 204)",
          "pointBackgroundColor":"rgb(20, 168, 204)",
          "pointBorderColor":"#fff","pointHoverBackgroundColor":"#fff",
          "pointHoverBorderColor":"rgb(20, 168, 204)"},
          {"label":contents[1].name,
          "data":dayCount[1],
          "fill":true,"backgroundColor":"rgba(255, 72, 64, 0.2)",
          "borderColor":"rgb(255, 72, 64)",
          "pointBackgroundColor":"rgb(255, 72, 64)",
          "pointBorderColor":"#fff",
          "pointHoverBackgroundColor":"#fff",
          "pointHoverBorderColor":"rgb(255, 72, 64)"}]},
        "options":{
            "elements":{
              "line":{
                "tension":0,
                "borderWidth":3
              }
            },
            "scale":{
              "ticks": {
                beginAtZero: true
              },
              pointLabels :{
                fontStyle: "bold",
                fontColor: 'black',
                fontSize: 14
              }
            }
          }
        });

  // Create chronologicalGraph aka Messages per day
    // DATA
    // returns struct "date count indexStart"
    messageCount = [countMessages(contents[0].date), countMessages(contents[1].date)];
    datesFormated = [formatDates(messageCount[0][0].date), formatDates(messageCount[1][0].date)];
    // returns 2DArray [0][0] are the dates and [1][0] and [1][1] the counts
    formatedData = formatAll(messageCount, datesFormated);
    // GRAPH
    var ctx = document.getElementById('chronologicalGraph').getContext('2d');
      ctx.canvas.width = 1400;
      ctx.canvas.height = 500;
      var cfg = {
    type: 'line',
    data: {
      labels: formatedData[0][0],
      datasets: [{
        label: contents[0].name,
        data: formatedData[0][1][0],
        type: 'line',
        fill: false,
        steppedLine: true,
        pointRadius: 0,
        lineTension: 0,
        borderWidth: 1,
        "pointHoverRadius": 10,
        "backgroundColor":"rgba(20, 168, 204, 0.2)",
        "borderColor":"rgb(20, 168, 204)",
        "pointBackgroundColor":"rgb(20, 168, 204)",
        "pointBorderColor":"#fff","pointHoverBackgroundColor":"#fff",
        "pointHoverBorderColor":"rgb(20, 168, 204)"},
        {
        label: contents[1].name,
        data: formatedData[0][1][1],
        type: 'line',
        fill: false,
        steppedLine: true,
        pointRadius: 0,
        lineTension: 0,
        borderWidth: 1,
        "pointHoverRadius": 10,
        "backgroundColor":"rgba(255, 72, 64, 0.2)",
        "borderColor":"rgb(255, 72, 64)",
        "pointBackgroundColor":"rgb(255, 72, 64)",
        "pointBorderColor":"#fff",
        "pointHoverBackgroundColor":"#fff",
        "pointHoverBorderColor":"rgb(255, 72, 64)"}]
    },
    options: {
      scales: {
        xAxes: [{
          type: 'time',
          distribution: 'linear',
          displayFormats: {
            month:	'MMM YYYY'
          },
          time: {
            min: '03 03 2014'
          },
          unit: 'month'
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Number Of Messages'
          }
        }]
      }
    }
  };
      var chart = new Chart(ctx, cfg);

  // show chat of clicked day ------------------------------------------------


}


// add file listener for chat file
document.getElementById('file-input')
  .addEventListener('change', readSingleFile, false);

// struct factory
// https://stackoverflow.com/questions/502366/structs-in-javascript
function makeStruct(names) {
  var names = names.split(' ');
  var count = names.length;
  function constructor() {
    for (var i = 0; i < count; i++) {
      this[names[i]] = arguments[i];
    }
  }
  return constructor;
}

// transform data into arrays of lines
function createArray(contents) {

  // Format for normal message:
  // [09.04.18, 10:19:36] Name: MESSAGE
  // announcments do not have a ":" and should be deleted

  // find index of all individual messsages
  lineArray = [];
  indexArray = [];
  delArray = [];

  for (var i = 0; i < contents.length; i++) {
    // search for [00.00.00, 00:00:00] and note index of "["
    testString = contents.substring(i, i+20 );

    if ( (testString.substring(0,1) == "[")  &&
         (!isNaN(testString.substring(1,3))) &&
         (!isNaN(testString.substring( testString.length - 3  , testString.length -1 )))  &&
         (testString.substring(testString.length - 1) == "]")
       ) {
         // save index
         indexArray.push(i);
       }
  }
  // split messsages


  for (var i = 0; i < indexArray.length; i++) {
    // fill array
    if (i == indexArray.length - 1) {
      lineArray[i] = contents.substring(indexArray[i],contents.length-1);
    } else {
      lineArray[i] = contents.substring(indexArray[i], indexArray[i+1]);
    }
  }

  // remove any lines without ":"
  // e.g. announcments when people get added to groups
  a = 0;
  for (var i = 0; i < lineArray.length; i++)  {
    if (lineArray[i].substring(20,lineArray[i].length).indexOf(":") < 0) {
      // no ":" found. Delete this line
      delArray[a] = i;
      a++;
    }
  }
  // log which lines to remove
  //console.log(delArray);
  for (var i = 0 ; i < a; i++) {
    lineArray.splice(delArray[i]-i,1)
  }

  return lineArray;
}

// transform lineArray into structs
function createStructs(lineArray) {

  var uniqueNames = findNames(lineArray);
  var structArray = [];

  //console.log(lineArray);

  for (i = 0; i < uniqueNames.length; i++) {

    var date = [];
    var time = [];
    var message = [];
    var name = uniqueNames[i];
    var nameLength = name.length;
    var a = 0;

    // log name that is processed
    //console.log(name);

    // splice messages
    for (j = 0; j < lineArray.length; j++) {
      if ( lineArray[j].substring(21, 21 + nameLength).match(name) ) {

        date[a] = lineArray[j].substring(1,9);
        time[a] = lineArray[j].substring(11, 19);
        message[a] = lineArray[j].substring(21 + uniqueNames[i].length);
        a++;
      }
    }
    //console.log(message);
    // save data to struct
    var Item = makeStruct("name date time message");
    var user = new Item(name, date, time, message);
    structArray.push(user);
  }
  // log users

  // return
  return structArray;
}

// find names of the people
function findNames(lineArray) {
  names = [];
  messages = [];
  firstIndex = 21;
  group = false;

  for (var i = 0; i< lineArray.length; i++){
    // second occurence of ":" marks end of NAME
    var secondIndex = lineArray[i].substring(21, lineArray[i].length - 1).indexOf(": ") + 21;

    // log
    //console.log( lineArray[i].substring(21, lineArray[i].length - 1) );
    //console.log( secondIndex );

    names[i] = lineArray[i].substring(firstIndex,secondIndex);
  }

  var uniqueNames = [];
  $.each(names, function(i, el){
    if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
  });

  // check if its a group
  //if uniqueNames.length > 3 {
  //  group = true;
  //}

  //console.log(uniqueNames);
  return uniqueNames;
}

// format dates according to moment.js
function formatDates(datesToFormat) {
  var datesFormated = [];

  for (i = 0; i < datesToFormat.length; i ++) {
    // DD MM YY-> D MMM YY
    var date = '20'+ datesToFormat[i].substring(6,8) + datesToFormat[i].substring(3,5) + datesToFormat[i].substring(0,2);
    datesFormated[i] = moment(date).format('D MMM YY');
  }

  return datesFormated;
}

function formatAll(data, datesF) {
  var formated = [];
  var counts = [];

  for(i = 0; i < data.length; i++) {
    var datesToFormat = datesF[i];
    var countToFormat = data[i][0].count;
    var datesToCheck = data[i][0].date;
    var countsT = [];
    /*
    console.log("--------");
    console.log(i);
    console.log(datesToFormat);
    console.log(countToFormat);
    */

    // Returns an array of dates between the two dates
    var getDates = function(startDate, endDate) {
      var dates = [],
      currentDate = startDate,
      addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
      };
      while (currentDate <= endDate) {
        dates.push(currentDate);
        currentDate = addDays.call(currentDate, 1);
      }
      return dates;
    };
    // reformats dates to D MMM YY

    var dates = getDates(new Date(20+datesToCheck[0].substring(6,8), parseInt(datesToCheck[0].substring(3,5)) - 1,datesToCheck[0].substring(0,2)), new Date(20+datesToCheck[datesToCheck.length-1].substring(6,8),datesToCheck[datesToCheck.length-1].substring(3,5),datesToCheck[datesToCheck.length-1].substring(0,2)));
    for(j = 0; j < dates.length; j++){
      //Sun May 18 2014 00:00:00 GMT+0200 (CEST)
      dates[j] = moment(dates[j]).format('D MMM YY');
    }
    /*
    console.log("---DATES---");
    console.log(dates);
    console.log(datesToFormat);
    */
    for (k = 0; k < dates.length; k ++) {
      // DD MM YY-> D MMM YY
      var index = datesToFormat.indexOf(dates[k])
      if (index == -1) {
        countsT[k] = 0;
      } else {
        countsT[k] = countToFormat[index];
      }
      counts[i] = countsT;
    }
  }
  formated.push([dates, counts]);
  //console.log("FORMATED", formated);
  return formated;
}


// ----- ---- ---- PERSONAL STATS -------------------- //

// activity by day of week
function getMessagesPerDay(dates) {
  dayCount = [0,0,0,0,0,0,0];

  // check and reformat date to american standard MM.DD.YYY
  var reformat = false;
  for (i = 0; i < dates.length; i++) {
    if (dates[i].substring(0,2) > 12) {
        // reformat
        reformat = true;
    }
    if (dates[i].substring(3,5) > 12) {
      // american notation
      break;
    }
  }

  // evaluate and count
  for (i = 0; i < dates.length; i++) {
    if (reformat) {
      var d = new Date(dates[i].substring(3,6) + dates[i].substring(0,3) + dates[i].substring(6));
    } else {
      var d = new Date(dates[i]);
    }
    dayNum = d.getDay();
    //console.log("index" + i + "DayNum:" + dayNum + "Date:" + d + "Input:" + dates[i]);
    dayCount[dayNum]++;
  }
  return dayCount;
}

// activity by time
// returns struct "date count indexStart"
function countMessages(dates) {
  // init
  var date = [];
  var count = [];
  var indexStart = [];

  // loop
  for (var i = 0; i < dates.length; i++) {

    if (i == 1) {
      var temp = dates[0];
      date[0] = dates[0];
      count[0] = 1;
      indexStart[0] = 0;
      var r = 0;
    }
    else if (temp != dates[i]) {
      r++;
      temp = dates[i]
      date[r] = dates[i];
      count[r] = 1;
      indexStart[r] = i;
    } else {
      count[r]++;
    }

  }

  // save to struct
  var messageCount = [];
  var Item = makeStruct("date count indexStart");
  var struct = new Item(date, count, indexStart);
  messageCount.push(struct);

  return messageCount;
}

// activity by hour

// count words per person

// counts how often you use every word
// thanks to https://stackoverflow.com/a/6565353/7151828
function getWordCount(messages) {
    var wordCounts = { };
    var words = messages.join(" ").split(/[\b\s(?:,| )+]/);

  for (var i = 0; i < words.length; i++) {
    wordCounts["_" + words[i].toLowerCase()] = (wordCounts["_" + words[i].toLowerCase()] || 0) + 1;
  }
  //console.log(wordCounts);
  return wordCounts;
}

// 30 most used emoji per person



//

// count media
// TAG <‎Bild weggelassen> in GERMAN
// TAG

// ---- ---- ---- TOTAL STATS

// average words per message
function calcWordsPerMessage(messages) {
  var tlt = 0;
  for (var i = 0; i < messages.length; i++) {
    tlt = tlt + messages[i].trim().split(/\s+/).length;
  }
  return [(Math.round(tlt/messages.length*100)/100),tlt];
}

// average messages per day
