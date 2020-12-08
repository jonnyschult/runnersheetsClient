<!--prettier-ignore-start-->
Do   not    format   this
# runnersheetsClient

**Overview:** This application is aimed at team running, be that high school crosscountry teams, or a local running club. As such, this project orients around two main hubs, the athlete hub, and the coach hub. The athlete hub is where users can manually upload activities, or transfer them from fitbit. It also presents these activities on a table which display data such as distance, pace and heart rate. All activities are full CRUD. Also, athletes can see the teams they are on and update their biometrics. The coaches hub is the most feature rich section of the app. Here, coaches can create teams, add staff and athletes, and view athlete activites. Each athlete has a section which display their activities, and there is a collated, printable sheet on the side. Also, individual user activities can be printed. Teams and staff are full CRUD. 

Here is the app: [RunnerSheets](https://runnersheetsclient.herokuapp.com/)

### Important feature:
- **Fitbit connectivity**
    - follows an Oath 2.0 flow.
    - client ID and client Secret are stored in server .env file
    - client ID and client Secret Base64 encoded for fetch calls is stored in .env file
    - refresh token, which is a onetime use token to get an access token, is stored in the database. 
    - the user must grant permission for data to be accessed by app. 
    - activities are checked against database activities to prevent duplicate adds. 
- **Coach's view**
    - coach is able to pull all activities for athletes on team. 
    - athletes can be easily added or removed from team, this does not effect athlete data
    - coach can update athlete biometrics
    - measure are in place to ensure that at least one person on the team has the "manager" role, which has access to all endpoints and can delete team. 
    - coach can easily view training iteration with preset and custom date values options to retrieve specific workout intervals.
    - individual athlete and all team workouts are printable
- **General User/Athlete**
    - users are full CRUD. Biometrics, personal data, and password are all updatable, and user can delete themselves. 
    - activities can also be manually created and updated. 
    - activities can be viewed in a single sheet descending according to date. 

### Dependencies
- **React:** Base technology for client
- **Reactstrap/Bootstrap:** Assisted with styling and modals. 
- **CSS Modules:** Used for most of the styling.
- **React-router-dom:** Used for page navigation


<!--prettier-ignore-end-->
