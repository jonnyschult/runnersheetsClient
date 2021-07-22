let APIURL = "";

switch (window.location.hostname) {
  case "localhost" || "127.0.0.1":
    APIURL = "http://localhost:8800";
    break;
  case "runnersheetsclient.herokuapp.com":
    APIURL = "https://runnersheetsserver.herokuapp.com";
}

export default APIURL;
