import React from 'react';
import { Platform, StatusBar, StyleSheet, View, AsyncStorage, Modal, Text, TouchableHighlight } from 'react-native';
import { AppLoading, Asset, Font, Icon, Notifications } from 'expo';
// import { config } from './service/fbconfig';
// import RNFirebase from "react-native-firebase";
// import { initializePush } from './service/firebase';
import { isSignedIn } from './service/auth';
import LoginScreen from './screens/LoginScreen';
import AppNavigator from './navigation/AppNavigator';
import Messages from './screens/Messages';
import Chat from './screens/ChatScreen';

// RNFirebase.initializeApp({
//   apiKey: "AIzaSyD6jBTtHzY5vtNLdQFbFmXGffoySY24Bxg",
//   authDomain: "matcha-212014.firebaseapp.com",
//   databaseURL: "https://matcha-212014.firebaseio.com",
//   projectId: "matcha-212014",
//   storageBucket: "matcha-212014.appspot.com",
//   messagingSenderId: "38522168959"
// });

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoadingComplete: false,
      signedIn: false,
      showMessages: false,
      chatid: false,
      mate: {},
    };
    this._bootstrapAsync();
    App._Login = App._Login.bind(this);
    App._hideChat = App._hideChat.bind(this);
    App._callChat = App._callChat.bind(this);
    // this._callChat = t
  }

  _bootstrapAsync = async () => {
    const id = await AsyncStorage.getItem('id');
    await this.setState({id: id});
    // this.initializePush();
  }

  async componentDidMount() {
    if (!this.state.chatid) {
      this.setState({showMessages: false});
    }
    if (this.state.id) {
      this._notificationSubscription = Notifications.addListener(this._handleNotification);
    }
  }

  _handleNotification = (notification) => {
    this.setState({notification: notification});
    console.log(notification);
  };

  static _hideChat() {
    this.setState({showMessages: false});
  }

  static _callChat(chat, user, ava, username) {
    this.setState({chatid: chat});
    this.setState({mate: {f_name: username, avatar: ava, id: user}});
    this.setState({showMessages: true});
    alert(this.state.showMessages);
  }

  componentDidUpdate() {
    isSignedIn()
    .then(res => this.setState({ signedIn: res }))
    .catch(err => console.warn(err));
  }

  static _Login(a) {
    if (a === 0) {
      this.setState({signedIn: false});
    } else if (a === 1) {
      isSignedIn()
        .then(res => this.setState({ signedIn: res }))
        .catch(err => console.warn(err));
    }
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else if (!this.state.signedIn) {
      return (
          <LoginScreen />
      )
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppNavigator />
        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        ...Icon.Ionicons.font,
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
