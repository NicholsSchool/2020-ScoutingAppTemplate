# Project Description

This repo contains the template code for an FRC or FTC scouting app. Using this code along with firebase allows for an easy, customizable app for a team to use. 

## Background

This project is a part of Arnav Parashar's (Nichols '20) Senior Thesis. The goal of this project is to allow our team, The Electric Mayhem (FRC 4930 and FTC 12736 & 12736), to create and use a scouting app year after year. Creating an app only requires one student creating a firebase project and slightly adjusting the code in this repo to match the game for the desired year. This code is meant to be used by our team, The Electric Mayhem, but hopefully will be able for use for many teams in the future.

## Setup

First setup the firebase project on the online firebase console. Log in to any google account and go to the [firebase console](https://console.firebase.google.com/). Create a new project. The project name should be the year, the type of competiton (FTC or FRC) and then the word "Scouting". So for example, 2020FRCScouting. Follow the steps to create the project. Once created, navigate to the "Database" tab on the left of the console and set up the Database. Follow the steps, and begin in **Testing**, _not_ Production. 

<hr/>

Once you have your firebase project set up, you need to install Node.js and NPM. This can be done from [this website](https://nodejs.org/en/). 

Now on your laptop, create a new folder to store the project, label it the same as the project name, (So keeping with the prior example, it would be 2020FRCScouting). Open the project in an IDE such as VSCode. In terminal run

	npm install -g firebase-tools
	
This will install firebase for your project. Before initializing firebase, you need to login with the google account you used on the online firebase console. In terminal run

	firebase login
	
and you will be prompted to login with your gmail. Once logged in, in terminal, run

	firebase init
	
Firebase Firestore, Functions, Hosting, and Emulators are needed for the project. Follow the steps given for setting up the project. 

<hr/>

Once all done, download the contents of this repo.

From the content downloaded from this repo, insert all the files within "Client Side Code" into the "Public" folder of your new Project. The "index.html" file and "404.html" file should get overriden. 
 
 From the content downloaded from this repo, insert all the files within "Server Side Code", into the "Functions" folder of your new project, "index.js" should get overriden. 
 
The server side code in this repo uses the "Express" library, to make your new project use this as well, add the following code in the "firebase.json" file, inside the "hosting" object:


    "rewrites": [
      {
        "source": "**",
        "function": "app"
      }
    ],
    
 [This video](https://www.youtube.com/watch?reload=9&v=LOeioOKUKI8) has more info.
 
<hr/>

Now follow the instructions inside each folder of this repo and within the files themselves to adjust the app to your desired year's game 

For testing the app, use 
	
	firebase serve

in the terminal to locally host the app on your laptop. Once the app is all good or if the local hosting isn't working properly, use 

	firebase deploy

to launch the app. If you continue to work after deploying but only make a change to the front end, use `firebase deploy --only hosting` for a quicker deploy, or `firebase deploy --only functions` for vice versa. 

## Usage 

The scouting part of the app will vary year to year based off the game. Remember to remind scouts that they can not change the data once they submit.

 The analyzation pages for the data will remain the same. With the app the team can:

* View ranking lists for any gameplay task, which update in real time as new data gets inputted
* View any desired data for all teams in a spreadsheet layout
* Get rough predictions of match scores and match winners
* View trends in a team's gameplay throughout an event.

<hr />

The team should appoint one person to be the "Admin" of the app. This person has only one responsibility, and that is once the event schedule is on The Blue Alliance, go to the admin page of the app (access it by adding /admin.html to the end of the app url) and input the event's key, which can be found in the url for the event on blue alliance. 

For example, Miami Valley 2020 event can be found on The Blue Alliance here: https://www.thebluealliance.com/event/2020ohmv

The event key is `2020ohmv`

This will set up the event's schedule as well as each team in the app's storage, and set the app to scout for that event. 

If you would like to switch back to an event that was already set up, either to see the scouted data again or test somethings, you will have to go into the Firebase Online Console for the project and go to the Database tab and then in the "MetaData" collection, set the current event to the desired event's event key. But make sure the event already exists in the database. 

## Issues With The App

1. Quota for Reads per day: The free plan for Firebase offers 50,000 reads per day. For a few people testing the app, this is more than enough, but when the whole team uses the app for scouting and viewing the data, this can build up fast. At Miami Valley 2020, after our scouting meeting at night, we had exceeded our quota and the app would not work becuase we weren't able to use any more reads. 

	There are three things the team can do to avoid issues with the quota
	
	* Once the day ends, before the hotel scouting meeting, have someone go on the "Tables" page and select every task, and then copy and paste the data into a spreadsheet. The way the "Tables" page is built, this should be very easy to do, and this will allow the team to have a back up of the data if the quota gets exceeded.

	* Switch to [Firebase's Blaze Plan](https://firebase.google.com/pricing). This plan is pay as you go, so you only pay money if you exceed the quota **but** the quota is per month instead of per day. So if you exceed 1,500,000 reads in a month, you pay 6 cents per 100 thousand more reads. Our team will likely never ever exceed this quota becuase we would only use the app for 2 or 3 days of a month. 
	
	* Have the scouts only use the scouting side of the app on the day before our hotel night scout meeting. If lots of people are viewing the analytical parts before the meeting, the quota could run out or almost be out during the meeting. Instead, have the scouts scout and have one person viewing the data, (possibly put it on a monitor for others to see). On any other day, anyone can view the data, because it won't matter if the quota runs out becuase there is no official meeting about the data. 
	

3. Wifi. If we attend an event with no wifi or cellular service, the team will not be able to access and use the app. So always make and bring paper scouting forms to events

2. Security. The app doesn't have any authentication of users, so really anyone could use the app and put in nonsense data for scouting or log on to the admin page and switch the event. It is very unlikely that someone would do something like this, but as a safeguard, keep the url amongst team members only. Firebase does offer code to authenticate users, and this could be a feature added to the app in the future and it would also allow us to share the app with multiple teams. 


## Useful Resources

Bootstrap - https://getbootstrap.com/docs/4.4/getting-started/introduction/

Firebase - https://firebase.google.com/docs

Blue Alliance API - https://www.thebluealliance.com/apidocs/v3

2020 FRC Scouting app - https://github.com/NicholsSchool/2020-FRCScouting

Electric Mayhem members, feel free to contact Arnav Parashar via Slack anytime. 
