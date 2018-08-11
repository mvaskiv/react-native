import React from 'react';
import { RkButton, RkTextInput, RkText, RkAvoidKeyboard } from 'react-native-ui-kitten';
import App from '../App';
import {
  Image,
  Platform,
  ScrollView,
  ListView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Button,
  View,
  AsyncStorage,
} from 'react-native';
import { Permissions, Notifications } from 'expo';
import PostData from '../service/post';
import { StackNavigator } from "react-navigation";
import { setTimeout } from 'core-js/library/web/timers';
const PUSH_ENDPOINT = 'http://lastminprod.com/Matcha/public/pushtoken';

class LoginScreen extends React.Component {
    constructor(props) {
        super(props);    
        this.state = {
            login: '',
            password: '',
            wrongCred: false,
            redirectToReferrer: false
        };
        this.login = this.login.bind(this);
        this.onChange = this.onChange.bind(this);
        this.registerForPushNotificationsAsync = this.registerForPushNotificationsAsync.bind(this);
    }

    async registerForPushNotificationsAsync(id) {
      const { status: existingStatus } = await Expo.Permissions.getAsync(
        Expo.Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      console.log(finalStatus);
      // only ask if permissions have not already been determined, because
      // iOS won't necessarily prompt the user a second time.
      if (existingStatus !== 'granted') {
        // Android remote notification permissions are granted during the app
        // install, so this will only ask on iOS
        const { status } = await Expo.Permissions.askAsync(Expo.Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      console.log(finalStatus);
    
      // Stop here if the user did not grant permissions
      if (finalStatus !== 'granted') {
        return;
      }
    
      // Get the token that uniquely identifies this device
      let token = await Notifications.getExpoPushTokenAsync();
      console.log(token);
      // POST the token to your backend server from where you can retrieve it to send push notifications.
      let state = {id: id, fbtoken: token, action: 'set'};
      return fetch('http://lastminprod.com/Matcha/public/fbtoken', {
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
        });;
    }
    
    login() {
        if(this.state.login && this.state.password) {
            fetch('http://lastminprod.com/Matcha/public/login', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                    body: JSON.stringify(
                        this.state
                    )
                })
                .then((response) => response.json())
                .then((res) =>
                {
                    let id = res.id;
                    let token = res.token;
                    let uname = res.uname;
                    AsyncStorage.setItem('id', id)
                        .then(AsyncStorage.setItem('token', token))
                        .then(AsyncStorage.setItem('uname', uname));
                    this.registerForPushNotificationsAsync(id);      
                })
                .catch((error) => {
                    console.error(error);
            });           
        }
    }
    
    async _setStorage(id, token, uname) {
        await AsyncStorage.setItem('id', id);
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('uname', uname);
    }

    onChange(e) {
        this.setState({[e.target.name]:e.target.value});
    }

    render() {
        return (
        <View>
            <Text style={ styles.welcome }>Welcome</Text>
            <RkText
                rkType='primary'
                style={ styles.welcome2 }>
                Please, enter your{"\n"}secure credentials:</RkText>
            <RkTextInput
                rkType='rounded'                
                name='login'
                onChangeText={(login) => this.setState({login})}
                style={styles.textInput}
                placeholder='Public id'
            />
            <RkTextInput
                rkType='rounded'
                name='password'
                secureTextEntry={true}
                onChangeText={(password) => this.setState({password})}
                style={styles.textInput}
                placeholder='Private id'
            />
            <View style={ styles.container }>
                <RkButton
                    rkType='small rounded outline'
                    style={ styles.loginBtn }
                    onPress={this.login}>
                    Log in</RkButton>
            </View>
        </View>
        );  
    }
}

const styles = StyleSheet.create({
  container: {
    top: 150,
  },
  welcome: {
      fontSize: 30,
      fontWeight: 'bold',
      top: 100,
      left: 20,
      marginBottom: 5,
  },
  welcome2: {
    fontSize: 25,
    lineHeight: 35,
    // fontWeight: 'bold',
    top: 100,
    left: 20,
  },
  textInput: {
    // position: 'relative',
    top: 120,
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: 10,
    // fontSize: 18,
    height:40,
    // backgroundColor: '#eee',
    // borderRadius: 0,
  },
  text: {
    marginLeft: 15,
    fontSize: 16,
  },
  photo: {
    top: -10,
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  headerBtnRight: {
    right: 10,
    padding: 12,
    fontSize: 16,
    color: '#2386c8',
  },
  loginBtn: {
      position: 'absolute',
      top: -20,
      right: 15,
    //   backgroundColor: '#fff',
    //   color: '#2386c8',
  }
});

export default LoginScreen