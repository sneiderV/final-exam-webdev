import { Meteor } from 'meteor/meteor';
import "../imports/api/comentarios.js";

import "../imports/api/remoteReq.js" //file que hace la llamada HTTP y tiene los metodos del cliente 

//import { Inject } from "meteor/meteorhacks:inject-initial";

Meteor.startup(() => {
  // code to run on server at startup
  // Inject.rawModHtml("addLanguage", function(html) {
  //   return html.replace(/<html>/, '<!-- HTML 5 -->\n<html lang="en">');
  // });
});
