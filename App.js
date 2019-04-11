import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View,Alert,Button,AsyncStorage } from 'react-native';
import firebase from 'react-native-firebase';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component {

  constructor() {
    super();
    this.state = {
      token: ''
    };   
  }
  
  componentDidMount() {
    var config = {
      apiKey: "AIzaSyC093mcKJ8ilcbgOODnHk5Hyr72urQdTyA",
      authDomain: "exact-hackathon.firebaseapp.com",
      databaseURL: "https://exact-hackathon.firebaseio.com",
      projectId: "exact-hackathon",
      storageBucket: "exact-hackathon.appspot.com",
      messagingSenderId: "539869004879",
    };
    firebase.initializeApp(config);

    console.log('Component did mount2');

    firebase.messaging().requestPermission()
      .then(() => {
        console.log('Permission completed');
      });

    setTimeout(() => {
      firebase.messaging().getToken()
        .then(token => {

          firebase.database().ref("Token").push({
            token: token
          }).then((data) => {

            alert("save:" + token);
          }).catch((error) => {
            //error callback
            alert("can't save " + error);
          })

          this.setState({ token });
          //alert(token);
        })
        .catch(err => {
          alert(err);
        });
    }, 3000);

    setTimeout(() => {
      this.createNotificationListeners();     
    },1000);
  }

  setValue = async (text) => {
    try {
      alert("set",text);
      console.log("set",text);
      await AsyncStorage.setItem('Mego', text)
    } catch(e) {
      alert("error set",e);
      console.log("error set",e);
      // save error
    }

    console.log('Done set')
  }

  getMyValue = async () => {
    try {
      const value = await AsyncStorage.getItem('Mego');
      return value;
    } catch(e) {
      alert("error get",e);
      console.log("error get",e);
      // read error
    }

    console.log('Done get')
  }

  async createNotificationListeners() {
  /*
  * Triggered when a particular notification has been received in foreground
  * */
  this.notificationListener = firebase.notifications().onNotification((notification) => {
      const { title, body } = notification;
      //alert("aaaaa") ;
      console.log("noti norm");
      console.log(notification, "||", title, "||", body);
      setValue(title);
      getMyValue().then(x => { alert(x); });
      //this.showAlert(title, body);
  });

  /*
  * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
  * */
  this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      const { title, body } = notificationOpen.notification;
      //alert(title) ;
      console.log("noti open");
      setValue(title);
      getMyValue().then(x => { alert(x); });
      //this.showAlert(title, body);
  });

  /*
  * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
  * */
  const notificationOpen = await firebase.notifications().getInitialNotification();
  if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
      alert(title) ;
      //this.showAlert(title, body);
  }
  /*
  * Triggered for data only payload in foreground
  * */
  this.messageListener = firebase.messaging().onMessage((message) => {
    //process data message
    console.log(JSON.stringify(message));
  });
}

showAlert(title, body) {
  Alert.alert(
    title, body,
    [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
    ],
    { cancelable: false },
  );
}

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        <Text style={styles.instructions}>{this.state.token}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
