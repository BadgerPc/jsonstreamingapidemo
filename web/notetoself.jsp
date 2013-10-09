<%-- 
    Document   : notetoself
    Created on : Oct 9, 2013, 1:39:44 PM
    Author     : msanaull
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
  <head>
    <title>Note to Self</title>
    <meta charset=”utf-8”>
    <link rel="stylesheet" href="notetoself.css">
    <script src="notetoself.js"></script>
  </head>
  <body>
    <form>
      <input type="text" id="note_text">
      <input type="button" id="add_button" value="Add Sticky Note to Self">
      <input type="button" id="sync_button" value="Sync to Notes server">
      <div id="sync_status"></div>
    </form>
    <ul id="stickies">
    </ul>
  </body>
</html>