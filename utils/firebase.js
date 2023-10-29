import 'firebase/messaging'
import firebase from 'firebase/app'
import localforage from 'localforage'

const firebaseCloudMessaging = {
  //checking whether token is available in indexed DB
  tokenInlocalforage: async () => {
    return localforage.getItem('fcm_token')
  },
  //initializing firebase app
  init: async function () {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyCS3HNkQx6ZFtjQ-QtUAuFE00GQ7x13ZFI",
        authDomain: "dev-brightdigigold.firebaseapp.com",
        projectId: "dev-brightdigigold",
        storageBucket: "dev-brightdigigold.appspot.com",
        messagingSenderId: "908747279877",
        appId: "1:908747279877:web:d8744167169a5ece2b166c",
        measurementId: "G-QN1RJ7NC7N"
      })

      try {
        const messaging = firebase.messaging()
        const tokenInLocalForage = await this.tokenInlocalforage()
        //if FCM token is already there just return the token
        if (tokenInLocalForage !== null) {
          return tokenInLocalForage
        }
        //requesting notification permission from browser
        const status = await Notification.requestPermission()
        if (status && status === 'granted') {
          //getting token from FCM
          const fcm_token = await messaging.getToken({
            vapidKey: 'BEc9LGURyN1GtbzdPvKttOeIrxe1LEnOT5IjExDP4SRDGSZenla-RwNeGS9z9QQzeWDnARtUamkcBIiAHmuOQJo'
          })
          if (fcm_token) {
            //setting FCM token in indexed db using localforage
            localforage.setItem('fcm_token', fcm_token)
            
            //return the FCM token after saving it
            return fcm_token
          }
        }
      } catch (error) {
        console.error(error)
        return null
      }
    }
  }
}
export { firebaseCloudMessaging }