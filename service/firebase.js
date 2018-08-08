import firebase from "react-native-firebase";
import { AsyncStorage } from "react-native";

export function initializePush() {
   const messaging = firebase.messaging();
   messaging.usePublicVapidKey('BHrkgYrBzUwaKd1pGseE_XZjhkN3H0omqqDjGNW965oy4k9MIjyWr7KNiWXmhdvRR9DdUB3yq6HrBJwmPLOVfjo');
   messaging
    .requestPermission()
    .then(() => {
        console.log("Have Permission");
        return messaging.getToken();
    })
    .then(token => {
        console.warn(token);
        AsyncStorage.setItem('firebaseToken', token);
        let myid = AsyncStorage.getItem('id');
        let state = {id: myid, fbtoken: token, action: 'set'};
        fetch('http://lastminprod.com/Matcha/public/fbtoken', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(
              state
            )
          })
          .then((response) => response.json())
          .then((res) =>
          {
            if (res.status === 'ok') {
              console.log('token set');
            }
          })
          .catch((error) => {
            console.error(error);
          });
    })
    .catch(error => {
        if (error.code === "messaging/permission-blocked") {
        console.log("Please Unblock Notification Request Manually");
        } else {
        console.log("Error Occurred", error);
        }
    });
    messaging.onMessage(payload => {
        console.log("Notification Received", payload);
        });
    }
    