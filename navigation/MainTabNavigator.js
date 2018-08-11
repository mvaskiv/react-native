import React from 'react';
import { Platform } from 'react-native';
import { createSwitchNavigator, createBottomTabNavigator, createStackNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import Contacts from '../screens/HomeScreen';
import Messages from '../screens/Messages';
import Chat from '../screens/ChatScreen';
import SettingsScreen from '../screens/SettingsScreen';

export const ContactsStack = createSwitchNavigator({
  Home: Contacts,
});

ContactsStack.navigationOptions = {
  tabBarLabel: 'Contacts',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-contact${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

export const LinksStack = createSwitchNavigator({
  Messages: Messages,
  
});

LinksStack.navigationOptions = {
  tabBarLabel: 'Messages',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-chatbubbles${focused ? '' : '-outline'}` : 'md-link'}
    />
  ),
};

export const AndroidMessagesStack = createStackNavigator({
  Messages: {
    screen: Messages,
    navigationOptions: {
      headerStyle: {
        display: 'none',
      },
    },
  },
  Chat: {
    screen: Chat,
    navigationOptions: ({ navigation }) => {
      return {title: navigation.state.params.uname};
    }
  }
},
{
  navigationOptions: {
    headerStyle: {
      marginTop: -25,
      height: 40,
      // paddingTop: -10,
      // display: 'none',
    },
    headerTitleStyle: {
      fontWeight: '400',
      fontSize: 14,
    }
  }
});

LinksStack.AndroidMessagesStack = {
  tabBarLabel: 'Messages',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-chatbubbles${focused ? '' : '-outline'}` : 'md-link'}
    />
  ),
};

export const SettingsStack = createSwitchNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-options${focused ? '' : '-outline'}` : 'md-options'}
    />
  ),
};

export default createBottomTabNavigator({
  // LinksStack: { screen: LinksStack, navigationOptions:{tabBarVisible: false} },
  LinksStack,    
  ContactsStack,
  SettingsStack,
}, {
  initialRouteName: 'LinksStack',
});
