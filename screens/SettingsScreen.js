import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import  { View, AsyncStorage, Button, StyleSheet } from 'react-native';
import App from '../App';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  };

  async _Logout() {
    await AsyncStorage.removeItem('id');
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('uname');
    () => App._Login(0);
  }

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return (
      <View style={ styles.container }>
        <Button
            style={ styles.logoutBtn }
            onPress={this._Logout}
            title="Log Out" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    top: 150,
  },
  logoutBtn: {
    right: 10,
    padding: 12,
    fontSize: 16,
    color: '#a55',
  },
});
