import React from 'react';
import Expo from 'expo';
import { createTabNavigator, createMaterialTopTabNavigator, createStackNavigator, createSwitchNavigator, createBottomTabNavigator } from 'react-navigation';
import { Platform } from 'react-native';
import MainTabNavigator, { LinksStack, AndroidMessagesStack, ContactsStack, SettingsStack } from './MainTabNavigator';
import Chat from '../screens/ChatScreen';
export const AppNavigator = createStackNavigator({
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

export const AndroidAppNavigator = createMaterialTopTabNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Messages: {
    screen: AndroidMessagesStack,
    
    // options: {
    //   props: ({ navigation }) => {
    //     return {alert: this.navigation.props.params.alert};
    //   }
    // },
   },
   Contacts: {
     screen: ContactsStack
   },
   Settings: SettingsStack,
  // Chat: {
  //   screen: Chat,
  //   navigationOptions: ({ navigation }) => {
  //     return {title: navigation.state.params.uname};
  //   }
  // },
},
{
  tabBarOptions: {
    style: {
      paddingTop: Expo.Constants.statusBarHeight,
      backgroundColor: '#fff',
      // display: 'none',
    },
    indicatorStyle: {
      backgroundColor: '#2386c8',
    },
    inactiveTintColor: '#292929',
    activeTintColor: '#2386c8',
  },
  swipeEnabled: true,
  animationEnabled: true,
});
