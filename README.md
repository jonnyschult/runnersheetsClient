# RunnerSheets - Frontend

## App Description

RunnerSheets is an ongoing project meant to be a data hub, integrating activities stored on various platforms. As of now, it is integrated with Strava and Fitbit. The app also allows one to share data with other users via the club option, and it allows coaches to collate the data from their team members without sharing that data between peers.

### Features

- Oauth integration with Strava and Fitbit
- Full User CRUD
- Team data sharing with a coach or coaches
- Club peer to peer data sharing
- Chartjs data visualization
- Manual activity adder

This project is hosted on Heroku

[Demo for RunnerSheets](https://runnersheetsclient.herokuapp.com)

## Backend

Go to [GitHub-RunnerSheetsServer](https://github.com/jonnyschult/runnersheetsServer) and follow the instructions in the README to start the server and set up the database.

## Frontend

This app is built with React, so the starting up process is fairly straightforward.

- Move to the root directory of the project
- Run `npm install` or `yarn install`
- Run `npm start` or `yarn start`

[Create-React-App boilerplate](https://github.com/facebook/create-react-app/blob/main/packages/cra-template/template/README.md)

## Using RunnerSheets

1. Follow the instruction on the backend's README to start the server and create the database.
2. Once it is running, press the "+Yourself or Sign In" button and register a user. With the user registered, the app should automatically redirect you to the athlete's landing page.
3. Click on the "Create Demo Data" button in the "Add Activities" container at the bottom right of the browser screen. This button is only available when the app is running on localhost.
4. Type in "testpass" for the password and press the "Generate Activites" button. **If you put a different value for the DEMO_PASS .env variable on the backend, you'll have to use that instead**.

This should generate about a years worth of runs assuming moderate running ability. It will also create 3 clubs, two of which you are a members, one of which you are the chair person. You have different permissions depending on which role you have. To populate those clubs, the demo button also adds about a years worth of runs for each user in those clubs. You can see this by clicking through the clubs page. I didn't bother populating the coaches page because it is very similar to the clubs page, except only the coach can see the activities.

From here, you do whatever you want. You can update user info, change password, delete user, etc. You can also log in as the other generated users. You can find their emails on the club page. All of their passwords are "testpass".

Couple final notes. As mentioned above, the Strava and Fitbit integration won't work, because you'd need my seceret keys, and I'm not sharing. Second, the UX/UI is a bit clunky, but adequate for testing out the functionality. If/when I redesign this app, it will be smoother.

Contact me: jonathon.schult@gmail.com
