import React from 'react';
import { createStackNavigator, createSwitchNavigator, createBottomTabNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import Chat from '../screens/ChatScreen';

export default createStackNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Main: {
    screen: MainTabNavigator,
    // options: {
    //   props: ({ navigation }) => {
    //     return {alert: this.navigation.props.params.alert};
    //   }
    // },
    navigationOptions: ({ navigation }) => {
      if (navigation.state.index === 0) {
       return {title: 'Messages'}
      } else if (navigation.state.index === 1) {
        return {title: 'Contacts'}
      } else if (navigation.state.index === 2) {
        return {title: 'Settings'}
      }
     }
   },
  Chat: {
    screen: Chat,
    navigationOptions: ({ navigation }) => {
      return {title: navigation.state.params.uname};
    }
  },
});