import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { HTTP } from 'meteor/http'

//!!!!NOTA: para que este archivo funcione debe importarse en el main.js del servidor


//para evitar el llamado desde el cliente del http me aseguro de correrlo solo desde el servidor la http
if(Meteor.isServer){
Meteor.methods({

  'agencyList'() {
    //check(url, String);
    // Si no esta autenticado no lo deja hacer  // if (! this.userId) { throw new Meteor.Error('not-authorized');}

    let url = "http://webservices.nextbus.com/service/publicJSONFeed?command=agencyList";
    return HTTP.get(url);
  },

  'routeList'(tagAgency){
    let url = "http://webservices.nextbus.com/service/publicJSONFeed?command=routeList&a="+tagAgency;
    return HTTP.get(url);
  },

  'routeConfig'(tagAgency,tagRoute){
    let url = "http://webservices.nextbus.com/service/publicJSONFeed?command=routeConfig&a="+tagAgency+"&r="+tagRoute;
    return HTTP.get(url);
  },

  'predictions'(tagAgency,stopId){
    let url = "http://webservices.nextbus.com/service/publicJSONFeed?command=predictions&a=actransit&stopId=55222";
    //let url = "http://webservices.nextbus.com/service/publicJSONFeed?command=predictions&a="+tagAgency+"&stopId="+stopId;
    //http://webservices.nextbus.com/service/publicJSONFeed?command=predictions&a=actransit&stopId=55222
    return HTTP.get(url);
  },

  'schedule'(tagAgency,tagRoute){
    let url = "http://webservices.nextbus.com/service/publicJSONFeed?command=schedule&a="+tagAgency+"&r="+tagRoute;
    return HTTP.get(url);
  },

  'docJohn'(){
    let url="https://gist.githubusercontent.com/john-guerra/6a1716d792a20b029392501a5448479b/raw/e0cf741c90a756adeec848f245ec539e0d0cd629/sfNSchedule"
    return HTTP.get(url);
  },

  // 'tasks.remove'(taskId) {
  //   check(taskId, String);
 
  //   Tasks.remove(taskId);
  // },

  // 'tasks.setChecked'(taskId, setChecked) {
  //   check(taskId, String);
  //   check(setChecked, Boolean);
 
  //   Tasks.update(taskId, { $set: { checked: setChecked } });
  // },
  
});
  
}
