window.onload = init;

var websocket;
function init() {

  var button = document.getElementById("add_button");
  button.onclick = createSticky;

  //Loading all the sticky notes in the local storage and adding it to HTML DOM.
  var stickiesArray = getStickiesArray();
  for (var i = 0; i < stickiesArray.length; i++) {
    var key = stickiesArray[i];
    var value = localStorage.getItem(key);
    addStickyToDom(key, value);
  }

  var syncButton = document.getElementById("sync_button");
  syncButton.onclick = syncNotesToServer;
  initWebSocket();
}

/**
 * Function to init the WebSocket connection to the server endpoint
 */
function initWebSocket(){
  //If the websocket is not intialized, then create a new one.
  if (websocket == null) {
    websocket = new WebSocket("ws://localhost:8080/DemoApplication/saveStickNotes");
  }
  else if (websocket != null) {
    //The websocket might have been closed, so reconnect to the server.
    if (websocket.readyState != WebSocket.OPEN) {
      websocket = new WebSocket("ws://localhost:8080/DemoApplication/saveStickNotes");
    }
  }
}
/**
 * Function to sync the sticky notes to the server.
 */
function syncNotesToServer() {
  if (websocket != null && websocket.readyState == WebSocket.OPEN)
  {
    var stickiesArray = getStickiesArray();
    var stickyNotesArray = [];
    for (var i = 0; i < stickiesArray.length; i++) {
      var key = stickiesArray[i];
      var value = localStorage.getItem(key);
      stickyNotesArray.push({key: key, value: value});
    }
    console.log(JSON.stringify(stickyNotesArray));
    websocket.send(JSON.stringify(stickyNotesArray));
    var syncStatusDiv = document.getElementById("sync_status");
    syncStatusDiv.innerHTML = "Last sync to server: "+(new Date());
  }
}

/**
 * Event handler for the button which adds the notes.
 */
function createSticky() {
  var value = document.getElementById("note_text").value;
  var currentDate = new Date();
  var time = currentDate.getTime();

  //Creating the key for the sticky note
  var key = "sticky_" + time;
  //Storing the sticky note with the key in the local storage.
  localStorage.setItem(key, value);

  var stickiesArray = getStickiesArray();
  //Only the key is stored in the stickies array.
  stickiesArray.push(key);
  //And the array of sticky note keys is stored in local storage.
  localStorage.setItem("stickiesArray", JSON.stringify(stickiesArray));

  addStickyToDom(key, value);

}

/**
 * Function to add the sticky data to the HTML DOM.
 */
function addStickyToDom(key, value) {
  var stickies = document.getElementById("stickies");
  var sticky = document.createElement("li");
  sticky.setAttribute("id", key);
  var span = document.createElement("span");
  span.setAttribute("class", "sticky");
  span.innerHTML = value;
  sticky.appendChild(span);
  stickies.appendChild(sticky);
  sticky.onclick = deleteSticky;
}

/**
 * Function to load the sticky note data from the local storage.
 */
function getStickiesArray() {
  var stickiesArray = localStorage.getItem("stickiesArray");
  if (!stickiesArray) {
    stickiesArray = [];
    localStorage.setItem("stickiesArray", JSON.stringify(stickiesArray));
  }
  else {
    stickiesArray = JSON.parse(stickiesArray);
  }

  return stickiesArray;
}
/**
 * Function to delete the sticky note from the local storage.
 */
function deleteSticky(e) {
  var key = e.target.id;
  if (e.target.tagName.toLowerCase() == "span") {
    key = e.target.parentNode.id;
  }
  localStorage.removeItem(key);
  var stickiesArray = getStickiesArray();
  if (stickiesArray) {
    for (var i = 0; i < stickiesArray.length; i++) {
      if (key == stickiesArray[i]) {
        stickiesArray.splice(i, 1);
      }
    }
    localStorage.setItem("stickiesArray", JSON.stringify(stickiesArray));
    removeStickyFromDom(key);
  }
}

/**
 * Function to remove the sticky note element present in the HTML DOM.
 */
function removeStickyFromDom(key) {
  var sticky = document.getElementById(key);
  sticky.parentNode.removeChild(sticky);
}