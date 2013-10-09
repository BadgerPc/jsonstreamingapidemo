/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package websocket;

import java.io.StringReader;
import java.util.HashMap;
import java.util.Map;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.json.stream.JsonParser;
import static javax.json.stream.JsonParser.Event.END_OBJECT;
import static javax.json.stream.JsonParser.Event.KEY_NAME;
import static javax.json.stream.JsonParser.Event.VALUE_STRING;
import javax.websocket.OnMessage;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

/**
 * Demo for parsing the JSON using Streaming API.
 */
@ServerEndpoint("/saveStickNotes")
public class TodoApplicationEndPoint {
  
  private Map<String, String> stickyNotes;
  
  @OnMessage
  public void receiveMessage(String message, Session session){
    parseUsingStreamingAPI(message);
    //parseUsingObjectAPI(message);
  }

  private void parseUsingStreamingAPI(String message) {
    JsonParser parser = Json.createParser(new StringReader(message));
    String keyType = null;
    String key = null, value = null;
    stickyNotes = new HashMap<>();
    while(parser.hasNext()){
      //Identify the type of event i.e type of JSON element.
      switch (parser.next()){
        //If the JSON element is the "KEY", then record the key type.
        case KEY_NAME:
          keyType = parser.getString();
          break;
        //If the JSON element is a value string then extract the value
        //and decide if the value is a sticky note key or sticky note data.
        case VALUE_STRING:
          switch(keyType){
            case "key":
              key = parser.getString();
            case "value":
              value = parser.getString();
          }
          break;
        //Once we encounter the end of the sticky note object, update the 
        //map with the sticky note key and sticky note value.
        case END_OBJECT:
          stickyNotes.put(key, value);
          break;
      }
    }
    //Printing the sticky note data to verify that we have correctly parsed the data.
    for(String k : stickyNotes.keySet()){
      System.out.println("Key: "+k+": "+ stickyNotes.get(k));
    }
  }

  private void parseUsingObjectAPI(String message) {
    JsonReader reader = Json.createReader(new StringReader(message));
    JsonArray array = reader.readArray();
    for(int i = 0 ; i < array.size(); i++){
      JsonObject jObj = array.getJsonObject(i);
      System.out.println(jObj.getString("key"));
      System.out.println(jObj.getString("value"));
    }
  }
}

