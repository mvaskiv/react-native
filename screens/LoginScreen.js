import React from 'react';
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
import PostData from '../service/post';
import { StackNavigator } from "react-navigation";
import { setTimeout } from 'core-js/library/web/timers';

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
                    var id = res.id;
                    var token = res.token;
                    var uname = res.uname;
                    AsyncStorage.setItem('id', id)
                        .then(AsyncStorage.setItem('token', token))
                        .then(AsyncStorage.setItem('uname', uname))
                        // .then(() => App._Login(1));        
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
            <TextInput
                name='login'
                onChangeText={(login) => this.setState({login})}
                style={styles.textInput}
                placeholder='Public id'
            />
            <TextInput
                name='password'
                secureTextEntry={true}
                onChangeText={(password) => this.setState({password})}
                style={styles.textInput}
                placeholder='Private id'
            />
            <View style={ styles.container }>
                <Button
                    style={ styles.loginBtn }
                    onPress={this.login}
                    title="Log In" />
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
  },
  textInput: {
    position: 'relative',
    top: 120,
    marginTop: 10,
    paddingLeft: 20,
    fontSize: 18,
    height: 50,
    backgroundColor: '#eee',
    borderRadius: 0,
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
});

export default LoginScreen