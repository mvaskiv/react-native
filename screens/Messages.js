import React from 'react';
import App from '../App';
import {
  Image,
  Platform,
  ScrollView,
  ListView,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  TouchableHighlight,
  TouchableWithoutFeedback,
  AsyncStorage,
} from 'react-native';
import PostData from '../service/post';
import Chat from './ChatScreen';

import { HeaderButton } from '../constants/Buttons';
import SideMenu from 'react-native-side-menu';
import LoginScreen from './LoginScreen';
import SlideMenu from '../navigation/Slider';

class Messages extends React.Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      dataSource: null,
      chats: false,
      chatid: false,
      showMessages: false,
      mate: '',
      new: false,
      id: '',
      dataSource: false,
      token: AsyncStorage.getItem('token'),
      fetching: false,
    };
    this._bootstrapAsync();
    this._getData = this._getData.bind(this);
    this._setChatid = this._setChatid.bind(this);
    // Messages._tooglePane = Messages._tooglePane.bind(this);
    this._tooglePane = this._tooglePane.bind(this);
    
    // this._callChat = this._callChat.bind(this);
  }

  static navigationOptions = {
    title: 'Messages',
    tabBarVisible: false,
    headerRight: (
      <HeaderButton
        side="right"
        title="New" />
    ),
  };

  _bootstrapAsync = async () => {
    const id = await AsyncStorage.getItem('id');
    await this.setState({id: id});
    await this._getData();
  }

  async componentDidMount() {

  }

  async _setChatid(chat, user, ava, username) {
    if (chat === -42) {
      var messageState = {status: 'msg', to: user, token: this.state.token, id: localStorage.getItem('uid'), msg: null};
      let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      fetch('http://lastminprod.com/Matcha/public/send', {
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
          
          this.setState({chatid: res.id});
          
        }
        // this.setState({dataSource: ds.cloneWithRows(trueData)});
      })
      .catch((error) => {
        console.error(error);
      });
    } else {
      await this.setState({chatid: chat});
    }
    await this.setState({mate: {f_name: username, avatar: ava, id: user}});
    this._tooglePane();
  }

  _getData = () => {
    fetch('http://lastminprod.com/Matcha/public/getchats', {
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
      this.setState({dataSource: trueData});
    })
    .catch((error) => {
      console.error(error);
    });
    this.setState({ fetching: false })
  }

  async _tooglePane() {
    // await this.setState({showMessages: !this.state.showMessages});
    this.props.navigation.navigate('Chat', {
      uname: this.state.mate.f_name,
      id: this.state.chatid,
      mate: this.state.mate,
    });
    this.forceUpdate();
  }

  _onRefresh() {
    this.setState({fetching: true}, function() { this._getData() });
  }

  render() {
    // var SlideMenu = require('../components/slide-menu')
    // , Filters = require('./filters')
    // , Products = require('./products');


    var deviceScreen= Dimensions.get('window');
    
    return (
          <View style={{backgroundColor: '#fff', flex: 1}}>
              {this.state.dataSource && <FlatList
                onRefresh={() => this._getData()}
                refreshing={this.state.fetching}
                // ListHeaderComponent={}
                // inverted={true}
                ref={ref => this.ChatList = ref}
                data={this.state.dataSource}
                extraData={this.state.newChats}
                keyExtractor={item => item.id}
                renderItem={({ item }) => {
                  var chatid = item.id;
                  var ava = item.data.avatar;
                  var username = item.data.f_name;
                  var mateid = item.user1 === this.state.id ? item.user2 : item.user1;
                  var sender = item.data.lstmsg.sender === this.state.id ? 'You' : item.data.f_name; 
                
                  const timeFinder = (t) => {
                      if (t) {
                          var s = t.split(" ");
                          var x = s[1].split(":");
                          return x[0] + ":" + x[1];
                      }        
                  }
                  const dateFinder = (t) => {
                      if (t) {
                          var s = t.split(" ");
                          var x = s[0].split("-");
                          return x[2] + "." + x[1];
                      }        
                  }
                  var now = new Date();
                  var then = new Date(item.data.lstmsg.date)
                  var day = then.getUTCDay() === now.getUTCDay() ? false :
                      then.getUTCDay() === now.getUTCDay() - 1 ? 'Yesterday' :
                          dateFinder(item.data.lstmsg.date);
                  var date = timeFinder(item.data.lstmsg.date);
                
                  return (
                      <TouchableWithoutFeedback
                        onPress={() => this._setChatid(chatid, mateid, ava, username)}>
                          <View style={ styles.MSGcontainer } >
                            <Image source={{ uri: item.data.avatar ? 
                            'https://mvaskiv.herokuapp.com/Matcha/uploads/' + item.data.avatar : 
                            'https://mvaskiv.herokuapp.com/Matcha/uploads/avatar-placeholder.png' }} 
                            style={styles.pictureSm} />
                              <View style={ styles.msgPrev }>
                                <Text style={styles.msgName}>{ item.data.f_name }</Text>
                                <Text style={styles.msgTsender}><Text style={{fontStyle: 'italic'}}>{ sender }</Text>: { item.data.lstmsg.msg }</Text>
                              </View>
                            <Text style={styles.msgDate}>{ day ? day : date }</Text>
                          </View>
                        </TouchableWithoutFeedback>
                      );
                    }
                  }/>}
        
            </View>
          

    );
  }
}

const styles = StyleSheet.create({
  msgPane: {
    flex: 1,
    backgroundColor: '#aaa',
  },
  container: {
    flex: 1,
    padding: 7,
  
    // height: 90,
    // width: 108 + '%',
  

    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  wrapper: {
    flex: 1,
    // width: screenWidth,
    paddingTop: 15,
    minHeight: Dimensions.get('screen').height - 65,
    paddingBottom: 50,
    backgroundColor: '#ffffff',
  },
  MSGcontainer: {
    flex: 1,
    padding: 7,
    top: -6,
    marginTop: 10,
    // height: 90,
    width: 108 + '%',
    borderColor: '#ccc',
    borderBottomWidth: 0.7,

    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  text: {
    marginLeft: 20,
    fontSize: 16,
  },
  photo: {
    top: -10,
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  pictureSm: {
    top: 0,
    left: 1,
    width: 55,
    height: 55,
    borderRadius: 28,
  },
  msgPrev: {
    // display: 'flex',
    top: 0,
    left: 12,
    width: 220,
    // width: 100 + '%',
    // borderWidth: 1,
  },
  msgDate: {
    right: -12,
  },
  msgTsender: {
    top: 4,
  },
  msgName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
});

export default Messages