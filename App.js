import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View,Alert,Button } from 'react-native';
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
                alert(token);
              })
              .catch(err => {
                alert(err);
              });
          }, 3000);

    this.doThings;
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
