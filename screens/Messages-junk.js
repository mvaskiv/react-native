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
  View,
  TouchableHighlight,
  AsyncStorage,
} from 'react-native';
import PostData from '../service/post';

import { HeaderButton } from '../constants/Buttons';


const ChatListItem = (props) => {
  var myid = AsyncStorage.getItem('id');
  var chatid = props.id;
  var ava = props.data.avatar;
  var username = props.data.f_name;
  var mateid = props.user1 === myid ? props.user2 : props.user1;
  var sender = props.data.lstmsg.sender === myid ? 'You' : props.data.f_name; 

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
  var then = new Date(props.data.lstmsg.date)
  var day = then.getUTCDay() === now.getUTCDay() ? false :
      then.getUTCDay() === now.getUTCDay() - 1 ? 'Yesterday' :
          dateFinder(props.data.lstmsg.date);
  var date = timeFinder(props.data.lstmsg.date);

  return (
    <TouchableHighlight
    onPress={() => Messages._setChatid(chatid, mateid, ava, username)}>
      <View style={ styles.container } >
        <Image source={{ uri: props.data.avatar ? 
        'http://lastminprod.com/Matcha/uploads/' + props.data.avatar : 
        'http://lastminprod.com/Matcha/uploads/avatar-placeholder.png' }} 
        style={styles.pictureSm} />
          <View style={ styles.msgPrev }>
            <Text style={styles.msgName}>{ props.data.f_name }</Text>
            <Text style={styles.msgTsender}><Text style={{fontStyle: 'italic'}}>{ sender }</Text>: { props.data.lstmsg.msg }</Text>
          </View>
        <Text style={styles.msgDate}>{ day ? day : date }</Text>
      </View>
    </TouchableHighlight>
  );
}

class Messages extends React.Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    
    this.state = {
      dataSource: null,
      // token: localStorage.getItem('udata'),
      // id: localStorage.getItem('uid'),
      chats: false,
      chatid: false,
      mate: '',
      new: false,
      id: '',
      dataSource: false,
      token: AsyncStorage.getItem('token'),
    };
    this._bootstrapAsync();
    this._getData = this._getData.bind(this);
    this._setChatid = this._setChatid.bind(this);
    // this._callChat = this._callChat.bind(this);
  }

  static navigationOptions = {
    title: 'Messages',
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
   
    // alert(this.state.id);
    // await this.setState({loaded: true});
  }
  // _callChat(chat, user, ava, username) {
  //   this.setState({chatid: chat});
  //   this.setState({mate: {f_name: username, avatar: ava, id: user}});
  //   this.setState({showMessages: true});
  //   alert(this.state.showMessages);
  // }

  async _setChatid(chat, user, ava, username) {
    if (chat === -42) {
      var messageState = {status: 'msg', to: user, token: this.state.id, id: localStorage.getItem('uid'), msg: null};
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
          this._callChat(res.id, user, ava, username);
        }
        // this.setState({dataSource: ds.cloneWithRows(trueData)});
      })
      .catch((error) => {
        console.error(error);
      });
    }
    this.setState({chatid: chat});
    this.setState({mate: {f_name: username, avatar: ava, id: user}});
    this.setState({showMessages: true});
    alert('qwe');
  }
  

  

  _getData = () => {
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
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
      this.setState({dataSource: ds.cloneWithRows(trueData)});
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {

 
      return (
        <View style={{backgroundColor: '#fff', flex: 1}}>
          <ScrollView>
            {this.state.dataSource && <ListView
              style={styles.container}
              dataSource={this.state.dataSource}
              renderRow={
                (data) => (
                  <TouchableHighlight
                  onPress={() => this._setChatid(data.id, data.data.id, data.data.ava, data.data.f_name)}>
                    <View style={ styles.container } >
                      <Image source={{ uri: data.avatar ? 
                      'http://lastminprod.com/Matcha/uploads/' + data.avatar : 
                      'http://lastminprod.com/Matcha/uploads/avatar-placeholder.png' }} 
                      style={styles.pictureSm} />
                        <View style={ styles.msgPrev }>
                          <Text style={styles.msgName}>{ data.f_name }</Text>
                          <Text style={styles.msgTsender}><Text style={{fontStyle: 'italic'}}></Text>: { data.data.lstmsg.msg }</Text>
                        </View>
                      {/* <Text style={styles.msgDate}>{ day ? day : date }</Text> */}
                    </View>
                  </TouchableHighlight>  
                )} />
              }/>}
          </ScrollView>
        </View>
      );
    
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 7,
    marginTop: 1,
    // height: 90,
    width: 108 + '%',
    borderColor: '#555',
    borderBottomWidth: 0.2,

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
    left: 2,
    width: 65,
    height: 65,
    borderRadius: 31.5,
  },
  msgPrev: {
    // display: 'flex',
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