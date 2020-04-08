const functions = require('firebase-functions');
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

// I use express for easier testing, writing, and implementation of functions
const express = require('express')
const app = express()

//Firebase realtime database
const db = admin.firestore();

const blueAllianceAuth = functions.config().bluealliance.authkey;

/**
 * Used to create an event in the firebase storage
 * 
 * @param eventData - inside the request sent, this must contain the event's key and name
 */
app.post("/createEvent", (req, res) => {
    var event = req.body.eventData;
    db.collection("Events").doc(event.key).set({
        "name": event.name
    })
    .then(()=>{
        res.send("all done");
    })
})

/**
 * Used to create matches within an event in the firebase storage
 * 
 * @param matchData - inside the request sent, this must contain all the matches in the event 
 *                    and the alliances within each match 
 * @param key - inside the request sent, this must contain the event key 
 */
app.post("/createMatchesInEvent", (req, res) => {
    var matches = req.body.matchData;
    var eventKey = req.body.key;
    var batch = db.batch();
    for(match in matches)
    {
        var matchNum = "" + (Number(match) + 1);
        while(matchNum.length < 3)
            matchNum = "0" + matchNum;
        batch.set(db.collection("Events").doc(eventKey).collection("Matches").doc(matchNum), matches[match]);
    }
    batch.commit()
    .then(() => {
        res.send("done");
    })
})

/**
 * Used to create and setup storage for each team in the event
 * 
 * @param teamData - inside the request sent, this must contain a list of all teams in the event
 * @param key - inside the request sent, this must contain the event key
 */
app.post("/createTeamsInEvent", (req, res) => {
    var teams = req.body.teamData;
    var eventKey = req.body.key;
    var batch = db.batch();
    for(team of teams)
        batch.set(db.collection("Events").doc(eventKey).collection("Teams").doc(team), {
            teamNum: team,
            matches : {},
            averages : getEmptyMatchData().gamePlay
        });
    batch.commit().then(() =>{
        res.send("done");
    })
   
})

/**
 * Sets the app's current event to the given event
 * 
 * @param key - inside the request sent, this must contain the event key
 */
app.post("/setCurrentEvent", (req, res) => {
    //Possibly add code to confirm that the event inputted exists in current Event.
    db.collection("MetaData").doc("CurrentEvent").set({"event" : req.body.key});
})

/**
 * Returns the blue alliance auth key
 * @return the blue alliance auth key
 */
app.get("/getBlueAllianceKey", (req, res) =>{
   res.send(blueAllianceAuth);
})

/**
 * Returns the name of the current event
 * @return the name of the current event
 */
app.get("/getCurrentEvent", (req, res) =>{
    getCurrentEvent()
    .then((event) =>{
       return event.get();
    })
    .then((snap) => {
        res.send(snap.data().name);
    })
    .catch((err) => {
        console.error(err);
    })
})

/**
 * Returns the event key (ID) of the current event
 * 
 * @return the event key (ID) of the current event
 */
app.get("/getCurrentEventID", (req, res) => {
    getCurrentEvent()
    .then(event => {
        res.send(event.id);
    })
    .catch(err => {
        console.log(err);
        res.send(err);
    })
})

/**
 * Returns a list of each match number within the current event
 * 
 * @return a list of each match number within the current event
 */
app.get("/getMatches", (req, res) => {
    getCurrentEvent()
    .then((event) => {
       return event.collection("Matches").listDocuments()
    })
    .then(docs => {
        var matches = [];
        for(match of docs)
            matches.push(match.id);
        res.send(matches);
    })
    .catch(err => {
        console.error(err);
    })
})

/**
 * Returns a list of all teams within the current event
 * 
 * @return a list of all teams within the current event
 */
app.get("/getAllTeams", (req, res) => {
    getCurrentEvent()
    .then((event) => {
        return event.collection("Teams").listDocuments()
    })
    .then(docs => {
        var teams = [];
        for(team of docs)
            teams.push(team.id);
        res.send(teams);
    })
})

/**
 * Returns the teams within a given match 
 * 
 * @param match - inside the request sent, this must contain the desired match's number
 * @return the teams within a given match
 */
app.get("/getTeamsInMatch", (req, res) => {
    var match = req.query.match;
    getCurrentEvent()
    .then((event) => {
        return event.collection("Matches").doc(match).get()
    })
    .then((match) => {
        res.send(match.data());
    })
    .catch((err) => {
        console.error(err);
    })
})

/**
 * Returns all the data for a given team in the current event
 * 
 * @param team - inside the request sent, this must contain the desired team's number
 * @return all the data for a given team in the current event
 */
app.get("/getTeamData", (req, res) => {
    var team = req.query.team;
    getCurrentEvent()
    .then(event => {
        return event.collection("Teams").doc(team).get()
    })
    .then(teamDataSnap => {
        res.send(teamDataSnap.data())
    })
    .catch((err) => {
        console.error(err);
    })
})

/**
 * Returns a list of the data for each and every team within the current event
 * 
 * @return a list of the data for each and every team within the current event
 */
app.get("/getAllTeamData", (req, res) => {
    var order = 'desc';
    var path = "averages.totalScore"
    return getCurrentEvent()
        .then(event => {
            return event.collection("Teams").orderBy(path, order).get();
        })
        .then(snap => {
            var response = [];
            snap.forEach(doc => {
                response.push([doc.id, doc.data()["averages"]])
            })
            res.send(response);
        })
})

/**
 * Returns an empty version of the storage object used for scouting data collection
 * 
 * @return an empty version of the storage object used for scouting data collection
 */
app.get('/getEmptyData', (req, res) => {
    res.send(getEmptyMatchData());
})

/**
 * Returns an empty match data storage object
 * 
 * @return an empty match data storage object
 */
function getEmptyMatchData()
{
    /*
     TODO: Insert here each task for each gameperiod of the game. 

            You can insert as many tasks as necessary. 
            Try to keep tasks one word, if more than one word has to be 
            used to describe a task, seperate each word with an underscore.
            For example, for wanting to record if a team didn't show up, you would 
            use "no_show"

            Set each task's value to 0. 
            
            Example:
                gamePlay: {
                        auto: {
                            "line" : 0, 
                            ...
                        },
                        teleop: {
                            "jumps": 0,
                            ...
                        },
                        ...
                    }
            
            Notes: 
                    If another gameperiod is necessary to be added, that is fine to add
                    but remember to add it to getDataPointValues() as well. 

                    If after an event you decide to add more tasks or remove some,
                    that should work compeletly fine for your next event, but may cause
                    issues trying to view data from previous events. 

                    The tasks placed here must also be used for IDs in index.html. 
                    More info is explained there

    */
    return {
        match: "",
        team: "",
        gamePlay: {
            auto: {
                // Insert tasks for Auto here.
                
            },
            teleop: {
                // Insert tasks for Teleop here.

            },
            end: {
                // Insert tasks for Endgame here.
                
            },
            performance: {
                // Insert tasks for Performace here.
                // This is stuff like defense or no_show. Also set these to 0. 

            },
            totalScore: 0
        }
    }
    
}

/**
 * Returns an object containing the point values for each task being scouted
 * 
 * @return an object containing the point values for each task being scouted
 */
function getDataPointValues()
{
    /*
      TODO: Insert the point value for each task for each gameperiod of the game here.

      All gameperiods and tasks MUST be identical to those written for the content of 
      "gameplay" inside the  getEmptyMatchData() method. 

      Insert the corresponding point value for each task as described in the game manual. 
      You may want to record tasks that don't actually give a team points, just set the value 
      for these to 0. For example, the content inside the "performance" map is likely all zeros,
      stuff like "defense" or "no_show".

      Example (Made up point values): 
         {
            auto: {
                "line" : 5,
                ...
            },
            teleop: {
                "jumps": 2,
                ...
            },
            performance: {
                "defense": 0,
                ...
            },
            ...
        }
     */

    return {
        auto: {
            // Insert tasks and their point values for Auto here.
        },
        teleop: {
            // Insert tasks and their point values for Teleop here.
        },
        end: {
            // Insert tasks and their point values for Endgame here.
        },
        performance: {
            // Insert tasks and their point values for Performance recording.
            // These are all likely to have point values of 0. 
        }
    }
}

/**
 * Returns an object containing each task which only one team can accomplish per match
 * 
 * @return an object containing each task which only one team can accomplish per match
 */
function getDependentData()
{
    /*
        TODO: Insert each dependent task and its corresponding gameperiod here. 

        In a game, there are sometime tasks only one team can accomplish. 
        These tasks are referred to in this code as "dependent". 
        It is important to be aware of these tasks for gameplay predictions,
        since we can't add it to each teams score, because only one team can do it. 
        The work around for this is to only add it to the score of the team in the alliance
        who accomplishes the task the most frequently. 

        Here you only need to insert gameperiods which contains dependent tasks, 
        and inside those gameperiods, just insert the dependent tasks themselves, 
        and set their value to 0. 

        For example, this is the full code for this method for 
        the 2020 Infinite Recharge game:

             return {
                "teleop": { // This was the only gameperiod with dependent tasks
                    "rotation": 0, // These were the only dependent task
                    "position": 0
                }
            }
    */

    return {
        /*  Insert only the gameperiods which contain dependent tasks, 
            and then the tasks themseleves
            EX: "gameperiod" : {
                        "dependentTask1" : 0, 
                        "dependentTask2": 0, 
                        ...
                },
                ...
         */
    }
}

/**
 * Saves the scoutted data and updates the firebase database
 * 
 * @param data - inside the request sent, this must be the match data storage objected filled with scouted data
 */
app.post("/saveData", (req, res) => {
    var data = req.body;
    getCurrentEvent()
    .then((event) => {
        let teamRef = event.collection("Teams").doc(data.team);
        db.runTransaction((transaction) => {
           return transaction.get(teamRef)
            .then(teamDoc => {
               var teamData = teamDoc.data();
                if ( teamData.matches.hasOwnProperty(data.match) )
                {
                    console.log("Match " + data.match + " for team " + data.team  + " Already scouted")
                    return
                }
               var gamePlay = convertToProperData(data.gamePlay);
               teamData.matches[data.match] = gamePlay;
               var newAverages = updateAverages(teamData.averages, gamePlay, Object.keys(teamData.matches).length);
               transaction.update(teamRef, {matches: teamData.matches, averages: newAverages});
            })
        })
        .then((result) => {
            res.send("done");
        })
        .catch((err) => {
            console.error(err);
        })
    })
})


/**
 * Converts the given match data storage object filled with scoutted data from being filled 
 * with strings to being filled with the numeric values of those strings. 
 * 
 * @param {*} jsonData - a match data storage object filled with scoutted data 
 */
function convertToProperData(jsonData)
{
    var pointValues = getDataPointValues();
    jsonData.totalScore = 0;
    for(gamePeriod in jsonData)
    {
        if(gamePeriod == "totalScore")
            continue;
        jsonData[gamePeriod].score = 0
        for(action in jsonData[gamePeriod])
        {
            if(action == "score")
                continue;
            jsonData[gamePeriod][action] = Number(jsonData[gamePeriod][action]);
            jsonData[gamePeriod].score += jsonData[gamePeriod][action] * pointValues[gamePeriod][action];
        }
        jsonData.totalScore += jsonData[gamePeriod].score;
    }
    return jsonData;
}

/**
 * Update's a teams averages with the new scoutted data 
 * @param {*} averages - the current averages 
 * @param {*} newData - the new scoutted data
 * @param {*} num - the amount of matches now scoutted for the team 
 */
function updateAverages(averages, newData, num)
{
    if(num == 1)
        return newData;

    for(gamePeriod in averages)
        for(score in averages[gamePeriod])
        {
            var val = averages[gamePeriod][score] * (num - 1);
            val += Number(newData[gamePeriod][score]);
            averages[gamePeriod][score] = val/num;
        }
    var val = averages.totalScore * (num - 1) + Number(newData.totalScore);
    averages.totalScore = val/num;
    return averages;
}

/**
 * Returns a ranked list of teams and their average score for a given task
 * 
 * @param path - inside the request sent, this must be the path to where the task is stored
 * @param numTeams - inside the request sent, this must be how many teams in the ranked list are desired
 * @param isReversed - inside the request sent, this must be true for reversed, false otherwise
 * @return a ranked list of teams and their average score for a given task
 */
app.get("/getRanking", (req, res) => {
    var path = req.query.path;
    var numTeams = Number(req.query.numTeams);
    var order = req.query.isReversed == "true" ? 'asc' : "desc";
    getCurrentEvent()
    .then((event) => {
        if(numTeams <= 0)
            return event.collection("Teams").orderBy(path, order).get();
        else
            return event.collection("Teams").orderBy(path, order).limit(numTeams).get();
    })
    .then((snap) => {
        var data = [];
        path = path.split(".");
        snap.forEach(doc => {
            var value = doc.data();
            for (i = 0; i < path.length; i++)
                value = value[path[i]];
            data.push([doc.id, value]);
        });
        res.send(data);
    })
})

/**
 * Calculates the predicted score for an alliance of teams if they played together
 * @param {*} allianceAverages - a list of the averages scores for each team in the alliance
 */
function calculateAllianceScore(allianceAverages)
{
    var points = getDataPointValues(); // Also used for looping through
    var dependentData = getDependentData();
    var allianceScore = 0;
    for(gamePeriod in points)
        for (teamAverage of allianceAverages)
        {
            console.log(gamePeriod)
            //Adding average total score is unreliable because some tasks only require 1 out of 3 teams
            if (gamePeriod == "totalScore" || gamePeriod == "performance") 
                continue;
            //If everything in this period is independent, just add the average score
            if(!(gamePeriod in dependentData))
            {
                allianceScore += teamAverage[gamePeriod].score;
                continue;
            }

            for (action in teamAverage[gamePeriod])
            {
                if(action == "score")
                    continue;
                
                //If this action is not a dependent action, then just add it to the score
                if (!(action in dependentData[gamePeriod]))
                    allianceScore += teamAverage[gamePeriod][action] * points[gamePeriod][action];
                else
                    if(dependentData[gamePeriod][action] <= teamAverage[gamePeriod][action])
                        dependentData[gamePeriod][action] = teamAverage[gamePeriod][action];
            }
        }

    for(gamePeriod in dependentData)
        for(action in dependentData[gamePeriod])
            allianceScore += dependentData[gamePeriod][action] * points[gamePeriod][action];
        
    return allianceScore

}

/**
 * Returns the predicted score for an alliance 
 * @param {FirebaseFirestore.QuerySnapshot} allianceSnap - the query snapshot containing 
 *                                          the data for the teams within the alliance
 * @return the predicted score for an alliance
 */
function getAllianceScore(allianceSnap){
    var allianceAverages = []
    allianceSnap.forEach(team => {
        allianceAverages.push(team.data().averages);
    })
    return calculateAllianceScore(allianceAverages);
}

/**
 * Returns the predicted scores for a match 
 * @param blue - inside the request sent, this must be a list of teams in the blue alliance
 * @param red -  inside the request sent, this must be a list of teams in the red alliance
 */
app.get("/getWinner", (req, res) => {
    var blueAlliance = req.query.blue;
    var redAlliance = req.query.red;
    var blueScore = 0;
    var redScore = 0;
    var teamsRef;
    getCurrentEvent()
    .then((event) => {
        teamsRef = event.collection("Teams");
        return teamsRef.where('teamNum', 'in', blueAlliance ).get();
    })
    .then((alliance) => {
        blueScore = getAllianceScore(alliance);
        return teamsRef.where('teamNum', 'in', redAlliance).get();
    })
    .then((alliance) => {
        redScore = getAllianceScore(alliance);
        res.send({"blue": blueScore, "red": redScore});
    })
    .catch((err) => {
        console.log(err);
        res.send(err);
    })
})

async function getCurrentEvent(){
    return db.collection("MetaData").doc("CurrentEvent").get()
        .then(snap => {
            return db.collection("Events").doc(snap.data().event);
        })
}

exports.app = functions.https.onRequest(app);