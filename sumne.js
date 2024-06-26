//const {firebase}=require('./firebase/index')
const { getMessaging } = require('firebase/messaging');
const serviceAccount = require('./firebase/serviceAccountKeys.json')
const firebase = require("firebase-admin");
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount)
})
const message = {
    data: {
      score: '850',
      time: '2:45'
    },
    token: "c7PgscLzSwGyuZKSwwhDss:APA91bE4psIhi-bgV2iiBc6OcKDTIpzfpQOC-9toT6Eygjem5VJ7XRm2b1ynyUxI_6ydDiyen9sPgZJGqM4d4Gurbzcc-YswoBScCfRIYEV6JX7967Sy7iyBPQwC0Rxx67rxHQm6SsRS"
  };
  getMessaging().send(message)
  .then((response) => {
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    console.log('Error sending message:', error);
  });
  
  // Send a message to the device corresponding to the provided
  // registration token.
