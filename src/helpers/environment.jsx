let APIURL = "";

switch (window.location.hostname) {
  case "localhost" || "127.0.0.1":
    APIURL = "http://localhost:4040";
    break;
  case "https://runnersheetclient.herokuapp.com/":
    APIURL = "https://runnersheets.herokuapp.com/";
}

export default APIURL;
