import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View,Alert,Button,AsyncStorage,TouchableOpacity } from 'react-native';
import firebase from 'react-native-firebase';
import Modal from "react-native-modal";

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      notifications: [],
      modalKey: '',
      modalBody: '',
      modalTitle: ''
    };  
  }
  
  componentDidMount() {
    this.getMyValue().then(x => {
        if (x != null){
          this.setState({notifications: JSON.parse(x)});
        }
    });

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

    // setTimeout(() => {
    //   firebase.messaging().getToken()
    //     .then(token => {

    //       firebase.database().ref("Token").push({
    //         token: token
    //       }).then((data) => {

    //         //alert("save:" + token);
    //       }).catch((error) => {
    //         //error callback
    //         //alert("can't save " + error);
    //       })

    //       this.setState({ token });
    //       //alert(token);
    //     })
    //     .catch(err => {
    //       alert(err);
    //     });
    // }, 3000);

    setTimeout(() => {
      this.createNotificationListeners();     
    },1000);
  }
  
  async createNotificationListeners() {
  var aa = this;

  this.notificationListener = firebase.notifications().onNotification((notification) => {
      console.log("When inside the app");
      
      this.getMyValue().then(x => {
        var notifications = [];
        var key;
        if (x == null || x == "[]"){
          notifications = [];
          key = 1;
        } else {
          notifications = JSON.parse(x);
          key = notifications[0].key + 1;
        }
        var record = {key , newMessage: true, title: notification.data.title, body: notification.data.body};
        notifications.unshift(record);
        var bb = JSON.stringify(notifications);
        aa.setValue(bb);
        aa.setState({notifications});
      })
  });

  const notificationOpen = await firebase.notifications().getInitialNotification();
  if (notificationOpen) {
    console.log("When app is closed"); 
    this.getMyValue().then(x => {
        var notifications = [];
        var key;
        if (x == null || x == "[]"){
          notifications = [];
          key = 1;
        } else {
          notifications = JSON.parse(x);
          key = notifications[0].key + 1;
        }
        var record = {key , newMessage: true, title: notificationOpen.notification.data.title, body: notificationOpen.notification.data.body};
        notifications.unshift(record);
        var bb = JSON.stringify(notifications);
        aa.setValue(bb);
        aa.setState({notifications});
      })
    }
  }

  setValue = async (text) => {
    try {
      await AsyncStorage.setItem('Mego', text)
    } catch(e) {
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
      console.log("error get",e);
      // read error
    }

    console.log('Done get')
  }

  deleteRecord = () => {
    var aa = this;
    this.getMyValue().then(x => {
        var notifications = [];
        notifications = JSON.parse(x);

        notifications = notifications.filter(function(y) {
          console.log(aa.state.modalKey);
          return y.key != aa.state.modalKey;
        });

        var bb = JSON.stringify(notifications);
        aa.setValue(bb);
        aa.setState({notifications});
        this.setState({ visibleModal: null })   
      })
  }

  renderModalContent = () => (
    <View style={styles.textArea}>
      <Text style={styles.title}>{this.state.modalTitle}</Text>
      <Text style={styles.body}>{this.state.modalBody}</Text>
      <Button color="red" title="Delete" onPress={() => this.deleteRecord()} />
    </View>
  );

  updateRecord = (key, body) => {
    var aa = this;
    this.getMyValue().then(x => {
        var notifications = [];
        notifications = JSON.parse(x);

        for(i=0;i<notifications.length;i++){
          if(notifications[i].key == key){
            notifications[i] = Object.assign({},notifications[i],body);
            break;
          }
        }

        var bb = JSON.stringify(notifications);
        aa.setValue(bb);
        aa.setState({notifications});
      })
  }

  render() {
    return (
      <View>
        <Text style={styles.welcome}>Exact Notification</Text> 
        <Button style={styles.remove} onPress= {() => {Alert.alert('Clear all data', 'Are you sure?',
          [
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel',},
            {text: 'OK', onPress: () => {AsyncStorage.clear(); this.setState({notifications:[]});},},
          ],); } } title="Clear" /> 
        {
            this.state.notifications.map((x) => (
              <TouchableOpacity
                  key = {x.key}
                  style = {(x.newMessage)?styles.newList:styles.list}
                  onPress = {() => {
                    this.updateRecord(x.key, {newMessage: false});
                    this.setState({ visibleModal: 4, modalBody: x.body, modalTitle: x.title, modalKey: x.key });
                    }}>
                  <Text style={(x.newMessage)?{fontWeight: 'bold'}:{}}>
                    {x.title}
                  </Text>
              </TouchableOpacity>
            ))
        }
        <Modal
          isVisible={this.state.visibleModal === 4}
          onBackdropPress={() => this.setState({ visibleModal: null })}>
          {this.renderModalContent()}
        </Modal>
      </View>  
    );
  }
}

const styles = StyleSheet.create({
  welcome: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#FFFFFF',
    backgroundColor: '#0288D1',
    height: 50,
    paddingLeft: 15,
    paddingTop: 8,
  },
  list: {
    padding: 10,
    marginTop: 6,
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    height: 40,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
   },
  newList: {
    padding: 10,
    marginTop: 6,
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: '#00FF00',
    alignItems: 'center',
    height: 40,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
   },
  textArea: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  title: {
    paddingLeft: 10,
    fontSize: 22,
    fontWeight: 'bold', 
    textAlign: 'left',
    color: 'black',
    backgroundColor: 'white'
  },
  body: {
    paddingTop: 5,
    paddingBottom: 15,
    fontSize: 18, 
    textAlign: 'center',
    color: 'black',
    backgroundColor: 'white'
  },
});
