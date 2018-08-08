import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  ListView,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  AsyncStorage,
} from 'react-native';
import PostData from '../service/post';
import Messages from './Messages';
import { HeaderButton } from '../constants/Buttons';

const ContactLisItem = (props) => {
  return (
    <TouchableWithoutFeedback
      onPress={() => Messages._setChatid(-42, props.id, props.avatar, props.f_name)}>
      <View style={styles.container}>
        <Image source={{ uri: props.avatar ? 
          'https://mvaskiv.herokuapp.com/Matcha/uploads/' + props.avatar : 
          'https://mvaskiv.herokuapp.com/Matcha/uploads/avatar-placeholder.png' }} 
          style={styles.photo} />
        <Text style={styles.text}>
          {`${props.f_name} ${props.l_name}`}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  )
}

class Contacts extends React.Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2}
    );
    
    this.state = {
      search: '',
      start: 0,
      id: '',
      token: '',
      start_age: 9,
      end_age: 99,
      sort: 'age',
      number: 15,
      dataSource: null,
    };
    this._bootstrapAsync();
    this._getData = this._getData.bind(this);
  }

  static navigationOptions = {
    title: 'Contacts',
    headerRight: (
      <HeaderButton
        side="right"
        title="New" />
    ),
  };

  _bootstrapAsync = async () => {
    const id = await AsyncStorage.getItem('id');
    const token = await AsyncStorage.getItem('token');
    await this.setState({token: token});
    await this.setState({id: id});
  }

  async componentDidMount() {
    await this._getData();
    // await this.setState({loaded: true});
  }
  
  _getData = () => {
    fetch('http://lastminprod.com/Matcha/public/users', {
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
      let trueData = res.data;
      // console.warn(trueData);
      this.setState({dataSource: trueData});
      // console.warn(this.state.dataSource._dataBlob.s1);

    })
    .catch((error) => {
      console.error(error);
    });
  }

  async _setChatid(chat, user, ava, username) {
      let messageState = {status: 'msg', to: user, token: this.state.token, id: this.state.id, msg: null};
      await fetch('http://lastminprod.com/Matcha/public/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          messageState
        )
      })
      .then((response) => response.json())
      .then((res) =>
      {
        if (res.id) {
          console.log('found');
          this.setState({chatid: res.id});
        } else {
          console.log(chat);
          this.setState({chatid: chat});
        }
      })
      .catch((error) => {
        console.error(error);
      });
    await this.setState({mate: {f_name: username, avatar: ava, id: user}});
    await this.props.navigation.navigate('Chat', {
      uname: this.state.mate.f_name,
      id: this.state.chatid,
      mate: this.state.mate,
    });
  }

  render() {
    return (
      <View style={{backgroundColor: '#fff'}}>
        <ScrollView>
          {this.state.dataSource && <FlatList
            ref={ref => this.ContactList = ref}
            data={this.state.dataSource}
            style={ styles.container }
            extraData={this.state.newContacts}
            keyExtractor={item => item.id}
            renderItem={({ item }) => {
              return (
                <TouchableWithoutFeedback
                  onPress={() => this._setChatid(-42, item.id, item.avatar, item.f_name)}>
                  <View style={styles.container}>
                    <Image source={{ uri: item.avatar ? 
                      'https://mvaskiv.herokuapp.com/Matcha/uploads/' + item.avatar : 
                      'https://mvaskiv.herokuapp.com/Matcha/uploads/avatar-placeholder.png' }} 
                      style={styles.photo} />
                    <Text style={styles.text}>
                      {`${item.f_name} ${item.l_name}`}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              )
            }
            }/>}
        </ScrollView>
      </View>
    );  
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    flexDirection: 'row',
    backgroundColor: '#fff',
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

export default Contacts








// import React from 'react';
// import {
//   Image,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { WebBrowser } from 'expo';

// import { MonoText } from '../components/StyledText';

// export default class HomeScreen extends React.Component {
//   static navigationOptions = {
//     header: null,
//   };

//   render() {
//     return (
//       <View style={styles.container}>
//         <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
//           <View style={styles.welcomeContainer}>
//             <Image
//               source={
//                 __DEV__
//                   ? require('../assets/images/robot-dev.png')
//                   : require('../assets/images/robot-prod.png')
//               }
//               style={styles.welcomeImage}
//             />
//           </View>

//           <View style={styles.getStartedContainer}>
//             {this._maybeRenderDevelopmentModeWarning()}

//             <Text style={styles.getStartedText}>Get started by opening</Text>

//             <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
//               <MonoText style={styles.codeHighlightText}>screens/HomeScreen.js</MonoText>
//             </View>

//             <Text style={styles.getStartedText}>
//               Change this text and your app will automatically reload.
//             </Text>
//           </View>

//           <View style={styles.helpContainer}>
//             <TouchableOpacity onPress={this._handleHelpPress} style={styles.helpLink}>
//               <Text style={styles.helpLinkText}>Help, it didn’t automatically reload!</Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>

//         <View style={styles.tabBarInfoContainer}>
//           <Text style={styles.tabBarInfoText}>This is a tab bar. You can edit it in:</Text>

//           <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>
//             <MonoText style={styles.codeHighlightText}>navigation/MainTabNavigator.js</MonoText>
//           </View>
//         </View>
//       </View>
//     );
//   }

//   _maybeRenderDevelopmentModeWarning() {
//     if (__DEV__) {
//       const learnMoreButton = (
//         <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
//           Learn more
//         </Text>
//       );

//       return (
//         <Text style={styles.developmentModeText}>
//           Development mode is enabled, your app will be slower but you can use useful development
//           tools. {learnMoreButton}
//         </Text>
//       );
//     } else {
//       return (
//         <Text style={styles.developmentModeText}>
//           You are not in development mode, your app will run at full speed.
//         </Text>
//       );
//     }
//   }

//   _handleLearnMorePress = () => {
//     WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
//   };

//   _handleHelpPress = () => {
//     WebBrowser.openBrowserAsync(
//       'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
//     );
//   };
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   developmentModeText: {
//     marginBottom: 20,
//     color: 'rgba(0,0,0,0.4)',
//     fontSize: 14,
//     lineHeight: 19,
//     textAlign: 'center',
//   },
//   contentContainer: {
//     paddingTop: 30,
//   },
//   welcomeContainer: {
//     alignItems: 'center',
//     marginTop: 10,
//     marginBottom: 20,
//   },
//   welcomeImage: {
//     width: 100,
//     height: 80,
//     resizeMode: 'contain',
//     marginTop: 3,
//     marginLeft: -10,
//   },
//   getStartedContainer: {
//     alignItems: 'center',
//     marginHorizontal: 50,
//   },
//   homeScreenFilename: {
//     marginVertical: 7,
//   },
//   codeHighlightText: {
//     color: 'rgba(96,100,109, 0.8)',
//   },
//   codeHighlightContainer: {
//     backgroundColor: 'rgba(0,0,0,0.05)',
//     borderRadius: 3,
//     paddingHorizontal: 4,
//   },
//   getStartedText: {
//     fontSize: 17,
//     color: 'rgba(96,100,109, 1)',
//     lineHeight: 24,
//     textAlign: 'center',
//   },
//   tabBarInfoContainer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     ...Platform.select({
//       ios: {
//         shadowColor: 'black',
//         shadowOffset: { height: -3 },
//         shadowOpacity: 0.1,
//         shadowRadius: 3,
//       },
//       android: {
//         elevation: 20,
//       },
//     }),
//     alignItems: 'center',
//     backgroundColor: '#fbfbfb',
//     paddingVertical: 20,
//   },
//   tabBarInfoText: {
//     fontSize: 17,
//     color: 'rgba(96,100,109, 1)',
//     textAlign: 'center',
//   },
//   navigationFilename: {
//     marginTop: 5,
//   },
//   helpContainer: {
//     marginTop: 15,
//     alignItems: 'center',
//   },
//   helpLink: {
//     paddingVertical: 15,
//   },
//   helpLinkText: {
//     fontSize: 14,
//     color: '#2e78b7',
//   },
// });
