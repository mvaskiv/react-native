import React from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ListView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  AsyncStorage,
  Button,
} from 'react-native';
import PostData from '../service/post';

var Dimensions = require('Dimensions');
var screenWidth = Dimensions.get('window').width;
const keyboardOffset = 88;

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: AsyncStorage.getItem('token'),
            id: AsyncStorage.getItem('id'),
            chatId: false,
            viewId: false,
            focus: false,
            updated: false,
            data: false,
            newMessage: '',
            start: 0,
            number: 30,
            lastCall: false,
            lastChild: false,
            interval: false,
            messages: false,
        };
        this._bootstrapAsync();
        this._onScroll = this._onScroll.bind(this);
        this._scrollListener = this._scrollListener.bind(this);
        this._sendMesssage = this._sendMesssage.bind(this);
        this.InputOnFocus = this.InputOnFocus.bind(this);
        this.onChange = this.onChange.bind(this);
        // this._getInfo = this._getInfo.bind(this);
        this._getUpdate = this._getUpdate.bind(this);
        this.changeView = this.changeView.bind(this);
        this._scrollBtm = this._scrollBtm.bind(this);
        this._msgReceived = this._msgReceived.bind(this);
        Chat._getMsgTime = Chat._getMsgTime.bind(this);
        
    }

    _bootstrapAsync = async () => {
        const id = await AsyncStorage.getItem('id');
        const name = await AsyncStorage.getItem('uname');

        await this.setState({id: id});
        await this.setState({myname: name});
  
        if (this.state.viewId) {
            await this._getData();
        }
    }

    async componentWillReceiveProps() {
        if ((this.props.id && this.props.mate) && this.props.id !== this.state.viewId) {
            await this.setState({viewId: this.props.id});
            await this.setState({data: this.props.mate});
            if (this.state.viewId) {
                await this._getData();
            }
        }
    }

    async _scrollBtm() {
        if (this.msglst && this.msglst.lastChild) {
            this.msglst.lastChild.scrollIntoView({behavior: 'smooth'});
        }
    }

    async _msgReceived(e) {
        var str = JSON.parse(e);
        // console.log(str.message);
        if (str.message) {
            await this.state.messages.push({msg: str.message, sender: str.sender});
        } else if (str.message && str.status !== "ok") {
            alert ("Ooops, something's gone wrong. Please, try again.");
        }
    }

    changeView() {
        this.setState({viewId: this.props.id});
        this.setState({data: this.props.mate});
    }

    async _getData() {
        await this.changeView()
        let ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
        });
        await fetch('http://lastminprod.com/Matcha/public/msghistory', {
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
            console.log('got data');
            let trueData = res.data.reverse();
            this.setState({dataSource: ds.cloneWithRows(trueData)});
        })
        .catch((error) => {
            console.error(error);
        });
    }

    // async _getInfo() {
    //     await this.changeView();
    //     await PostData('msghistory', this.state).then((result) => {
    //         let responseJson = result;
    //         if (responseJson.data) {
    //             var a = responseJson.data;
    //             if (a[0]) {
    //                 this.setState({lastChild: a[0]['date']});
    //                 a.reverse();
    //                 // this.msglstc.scscrollTop = (this.msglstc.scrollHeight / this.msglstc.clientHeight * 8) * this.msglstc.scrollTop;
    //                 this.setState({messages: a});
    //             }
    //         }
    //     });
    // }

    async _getUpdate() {
        let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
            });
            await fetch('http://lastminprod.com/Matcha/public/checkmsg', {
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
                console.log('got update');
                if (res.data) {

                        this.setState({lastChild: res.data[0]['date']});
                        console.log(res.data[0]['date']);
                        this.setState({updated: true});
         
                    let trueData = res.data;
                    this.setState({dataSource: ds.cloneWithRows(trueData)});
                }
            })
            .catch((error) => {
                console.error(error);
            });
       
        // Messages._updatedDialog();
    }

    componentDidMount() {
        if (this.msglst && this.msglst.lastChild) {this.msglst.lastChild.scrollIntoView(!0);}
        // if (this.props.id && (this.props.id !== this.state.viewId)) {
        //     this._getData();
        // }
        // if (this.msglstc) {
        //     this.msglstc.addEventListener('scroll', this._scrollListener);
        // }
        // this.setState({interval: setInterval(this._getUpdate, 1000)});    
    }

    componentWillUnmount() {
        // window.removeEventListener('scroll', this._onScroll, false);
        clearInterval(this.state.interval);
    }

    componentDidUpdate() {
        if (this.props.id && (this.props.id !== this.state.viewId)) {
            // this._getData();
        }
        if (this.state.updated) {
            // this._scrollBtm();
            this.setState({updated: false});
        }
        if (this.props.shown && !this.state.interval) {
            this.setState({interval: setInterval(this._getUpdate, 1500)});    
        } else if (!this.props.shown && this.state.interval) {
            clearInterval(this.state.interval);
            this.setState({interval: false});
        }
        // if (this.msglstc) {
        //     this.msglstc.addEventListener('scroll', this._scrollListener);
        // }
    }

    async _scrollListener() {
        if (this.msglstc.scrollTop <= 250) {
            await this.msglstc.scrollTo(this.msglstc.firstChild);
            const now = (new Date).getTime();
            if (this.state.lastCall && (now - this.state.lastCall < 1500)) {
                return ;
            } else {
                this.setState({lastCall: now});
                await this._onScroll();
            }
        }  
    }

    async _onScroll() {
        var n = this.state.start + 30;
        await this.setState({start: n});
        // await this.setState({number: n});
      
            await PostData('msghistory', this.state).then((result) => {
            let responseJson = result;
            if (responseJson.data) {
                var a = responseJson.data;
                if (this.state.messages) {
                    a.forEach(msg => {
                        this.state.messages.unshift(msg);     
                    });
                }
            }
        });
        console.log(this.state.start, this.state.number);
        this.setState({updated: true});
    }

    onChange(e) {
        this.setState({[e.target.name]:e.target.value});
    }

    async _msgToDb(msg) {
        await fetch('http://lastminprod.com/Matcha/public/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        body: JSON.stringify(
            msg
        )
        })
        .then((response) => response.json())
        .then((res) =>
        {
            alert(res.status);
            if (res.status === 'ok') {
                return true;
            } else {
                return false;
            }
        })
        .catch((error) => {
            console.error(error);
        });
    }

    async _sendMesssage() {
        if (this.state.newMessage) {
            alert('q');
            var message = {message: this.state.newMessage, sender: this.state.id, s_name: this.state.myname, s_ava: null, chatid: this.state.viewId};
            var messageState = {status: 'msg', to: this.state.data.id, token: this.state.token, id: this.state.id, msg: JSON.stringify(message)};
            if (this._msgToDb(messageState)) {
                alert('b');
                this.setState({newMessage: ''});
                this.setState({updated: true});
            }
        }
    }

    static _getMsgTime(t) {
        if (t) {
            var s = t.split(" ");
            var x = s[1].split(":");
            return x[0] + ":" + x[1];
        }        
    }

    InputOnFocus(a) {
        if (a === 1) {this.setState({focus: true});}
        else {this.setState({focus: false});}
        if (this.msglst && this.msglst.lastChild) {
            this.msglst.lastChild.scrollIntoView({behavior: 'smooth'});
        }
    }
    render() {
        if (this.state.data) {
            var username = this.state.data['f_name'];
        }
        if (!this.state.viewId || !this.state.dataSource) {
            return <View style={ styles.container }><Text>{this.state.viewId}</Text></View>
        }
        return (
           
                <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={keyboardOffset} enabled>
                <ScrollView>
                    {this.state.dataSource && <ListView
                        ref={msglstc => {this.msglstc = msglstc;}}
                        style={ styles.msgPane }
                        dataSource={this.state.dataSource}
                        renderRow={
                            (data) => {
                            return (
                            <MessagesBody {...data} mate={this.state.data} id={this.state.id} />
                            )}
                        }/>}

                        {/* <input
                        type='text'
                        className='form-element msg-in'
                        placeholder='Your message here'
                        name='newMessage'
                        value={ this.state.newMessage }
                        onChange={this.onChange}
                        onFocus={() => this.InputOnFocus(1)}
                        onBlur={() => this.InputOnFocus(0)} />
                    <span onClick={() => this._sendMesssage()} className='form-element-extra msg-snd-btn'><i className="fab fa-telegram-plane"></i></span> */}

                        
                </ScrollView>
                <View style={ styles.inputcntbg }>
                    <View style={ styles.inputcnt }>
                        <TextInput
                            type='text'
                            name='newMessage'
                            value={ this.state.newMessage }
                            onChangeText={(newMessage) => this.setState({newMessage})}
                            style={styles.textInput}
                            // clearButtonMode='always'
                            placeholder='Your message here'
                        />
                        <Button
                            title="send"
                            style={ styles.sumbitBtn }
                            onPress={ () => this._sendMesssage() }
                        />
                    </View>
                </View>
             
            </KeyboardAvoidingView>
        );
    }
}

const MessagesBody = (props) => {
    // var display =  this.props.id === -42 ? null : this.state.messages.map((message, i) => {
        var timestamp = Chat._getMsgTime(props.date);
        return (
            <View
                ref={msglst => {this.msglst = msglst;}}
                style={ styles.MSGcontainer }>
                <Image
                    source={{ uri: props.mate.avatar ? 'http://lastminprod.com/Matcha/uploads/' + props.mate.avatar : 'http://lastminprod.com/Matcha/uploads/avatar-placeholder.png'}}
                    style={{ display: props.sender === props.id ? 'none' : 'block' }}
                    style={ styles.photo }/>
                <View style={ props.sender === props.id ? styles.sentMsg : styles.receivedMsg }>
                    <Text
                        style={[ styles.msgbody, {color: props.sender === props.id ? '#fff' : '#000' }]} >
                        { props.msg }
                    </Text>
                    <Text style={ props.sender === props.id ? styles.msgTimeR : styles.msgTimeL }>
                    { timestamp }
                    </Text>
                </View>
            </View>
        );
}

const styles = StyleSheet.create({
    maincnt: {
        flex: 1,
    },
    msgPane: {
      flex: 1,
      width: screenWidth,
      paddingTop: 15,
      paddingBottom: 50,
      backgroundColor: '#ffffff',
    },
    container: {
        position: 'absolute',
        top: 0,
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
    MSGcontainer: {
        flex: 1,
        paddingTop: 15,
        marginTop: 1,
        // height: 90,
        width: screenWidth,
        flexDirection: 'row',
        backgroundColor: '#fff',
    },
    photo: {
        // position: 'absolute',
        width: 35,
        height: 35,
    },
    receivedMsg: {
        position: 'absolute',
        backgroundColor: '#dfdfdf',
        minHeight: 20,
        minWidth: 50,
        borderRadius: 20,
        left: 50,
    },
    sentMsg: {
        position: 'absolute',
        backgroundColor: '#2386c8',   
        minHeight: 20,
        minWidth: 50,
        borderRadius: 20,
        right: 15,
    },
    msgbody: {
        padding: 10,
        paddingRight: 12,
        paddingLeft: 12,
        fontSize: 16,
    },
    msgTimeR: {
        position: 'absolute',
        left: -40,
        top: 12,
        fontSize: 12,
        color: '#b1b1b1',
    },
    msgTimeL: {
        position: 'absolute',
        right: -40,
        top: 12,
        fontSize: 12,
        color: '#b1b1b1',
    },
    inputcntbg: {
        position: 'absolute',
        bottom: -1,
        height: 50,
        width: screenWidth,
        borderWidth: 1,
        borderTopColor: '#dedede',
        borderBottomColor: '#f7f7f7',
        borderRightColor: '#f7f7f7',
        borderLeftColor: '#f7f7f7',
        backgroundColor: '#f7f7f7',

    },
    inputcnt: {
        position: 'absolute',
        bottom: 4,
        height: 40,
        width: screenWidth - 8,
        marginHorizontal: 4,
        borderColor: '#aaa',
        borderWidth: 1,
        borderRadius: 25,
        paddingRight: 10,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    textInput: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: screenWidth - 55,
        padding: 10,
        fontSize: 16,
        height: 40,
        borderRadius: 0,
      },
      sumbitBtn: {
        textAlign: 'right',
        alignSelf: 'flex-end',
        fontSize: 16,
        height: 40,
        width: 45,
        marginRight: 15,

      }
});

export default Chat