# Project Description

This repo contains the template code for an FRC or FTC scouting app. Using this code along with firebase allows for an easy, customizable app for a team to use. 

## Background

This project is a part of Arnav Parashar's (Nichols '20) Senior Thesis. The goal of this project is to allow our team, The Electric Mayhem (FRC 4930 and FTC 12736 & 12736), to create and use a scoutting app year after year. Creating an app only requires one student creating a firebase project and slightly adjusting the code in this repo to match the game for the desired year. This code is meant to be used by our team, The Electric Mayhem, but hopefully will be able for use for many teams in the future.

## Setup

First setup the firebase project on the online firebase console. Log in to any google account and go to the [firebase console](https://console.firebase.google.com/). Create a new project. The project name should be the year, the type of competiton (FTC or FRC) and then the word "Scouting". So for example, 2020FRCScouting. Follow the steps to create the project. Once created, navigate to the "Database" tab on the left of the console and set up the Database. Follow the steps to do so. 

-

Once you have your firebase project set up, you need to install Node.js and NPM. This can be done from [this website](https://nodejs.org/en/). 

Now on your laptop, create a new folder to store the project, label it the same as the project name, (So keeping with the prior example, it would be 2020FRCScouting). Open the project in an IDE such as VSCode. In terminal run

	npm install -g firebase-tools
	
This will install firebase for your project. Before initializing firebase, you need to login with the google account you used on the online firebase console. In terminal run

	firebase login
	
and you will be prompted to login with your gmail. Once logged in, in terminal, run

	firebase init
	
Firebase Firestore, Functions, Hosting, and Emulators are needed for the project. Follow the steps given for setting up the project. 

-

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
 
-

Now follow the instructions inside each folder of this repo and within the files themselves to adjust the app to your desired year's game 

## Useful Resources

Bootstrap - https://getbootstrap.com/docs/4.4/getting-started/introduction/

Firebase - https://firebase.google.com/docs

Electric Mayhem members, feel free to contact Arnav Parashar via Slack anytime. 
