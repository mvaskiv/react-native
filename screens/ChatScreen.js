import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  ListView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AsyncStorage,
} from 'react-native';
import PostData from '../service/post';
import { HeaderButton } from '../constants/Buttons';

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
        this._onScroll = this._onScroll.bind(this);
        this._scrollListener = this._scrollListener.bind(this);
        this._sendMesssage = this._sendMesssage.bind(this);
        this.InputOnFocus = this.InputOnFocus.bind(this);
        this.onChange = this.onChange.bind(this);
        // this._getInfo = this._getInfo.bind(this);
        // this._getUpdate = this._getUpdate.bind(this);
        this.changeView = this.changeView.bind(this);
        this._scrollBtm = this._scrollBtm.bind(this);
        this._msgReceived = this._msgReceived.bind(this);
        
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

    // async _getUpdate() {
    //     await PostData('checkmsg', this.state).then((result) => {
    //         let responseJson = result;
    //         if (responseJson.data) {
    //             var a = responseJson.data;
    //             if (a) {
    //                 this.setState({lastChild: a[0]['date']});
    //                 // this.msglstc.scscrollTop = (this.msglstc.scrollHeight / this.msglstc.clientHeight * 8) * this.msglstc.scrollTop;
    //                 a.forEach(msg => {
    //                     this.state.messages.push(msg);     
    //                 });
    //                 this.setState({updated: true});
    //             }
    //         }
    //     });
    //     Messages._updatedDialog();
    // }

    componentDidMount() {
        if (this.msglst && this.msglst.lastChild) {this.msglst.lastChild.scrollIntoView(!0);}
        if (this.props.id && (this.props.id !== this.state.viewId)) {
            this._getData();
        }
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
            this._getInfo();
        }
        if (this.state.updated) {
            // this._scrollBtm();
            this.setState({updated: false});
        }
        if (this.props.shown && !this.state.interval) {
            this.setState({interval: setInterval(this._getUpdate, 1000)});    
        } else if (!this.props.shown && this.state.interval) {
            clearInterval(this.state.interval);
            this.setState({interval: false});
        }
        if (this.msglstc) {
            this.msglstc.addEventListener('scroll', this._scrollListener);
        }

        // if (this.msglst.lastChild) {
        //     this.msglst.lastChild.scrollIntoView({behavior: 'smooth'});
        // }
        // if (this.state.updated) {
        //     this.setState({updated: false});
        // }
    }

    async _scrollListener() {
        // console.log(this.msglstc.scrollTop);
        // console.log(this.msglstc.clientHeight);
        // console.log(this.msglstc.scrollHeight);
        if (this.msglstc.scrollTop <= 250) {
            await this.msglstc.scrollTo(this.msglstc.firstChild);
            // var q = this.msglstc.scrollTop;
            // this.msglstc.scrollTop += 1;
            const now = (new Date).getTime();
            if (this.state.lastCall && (now - this.state.lastCall < 1500)) {
                return ;
            } else {
                this.setState({lastCall: now});
                await this._onScroll();
                // this.msglstc.scrollTop = q + this.msglstc.clientHeight;
            }
            // this.msglstc.scrollTop = (this.msglstc.scrollHeight) - this.msglstc.scrollTop * 2;
            // this.msglstc.scrollTop += this.msglstc.clientHeight;

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
                    // this.msglstc.scrollTop = (this.msglstc.scrollHeight / this.msglstc.clientHeight * 4) * this.msglstc.scrollTop;
                    // this.setState({messages: w});
                }
            }
        });
        console.log(this.state.start, this.state.number);
        this.setState({updated: true});
        // setTimeout(null, 1000);
        // this._getInfo();
    }

    onChange(e) {
        this.setState({[e.target.name]:e.target.value});
    }

    async _msgToDb(msg) {
        await PostData('send', msg).then((result) => {
            let responseJson = result;
            if (responseJson.status === 'ok') {
                return true;
            } else {
                return false;
            }
        });
    }

    async _sendMesssage() {
        if (this.state.newMessage) {
            var message = {message: this.state.newMessage, sender: localStorage.getItem('uid'), s_name: localStorage.getItem('uname'), s_ava: localStorage.getItem('uava'), chatid: this.state.viewId};
            var messageState = {status: 'msg', to: this.state.data.id, token: localStorage.getItem('udata'), id: localStorage.getItem('uid'), msg: JSON.stringify(message)};
            if (this._msgToDb(messageState)) {
                // this.conn.send(JSON.stringify(messageState));
                // this._getInfo();
                // await this.state.messages.push({msg: this.state.newMessage, sender: this.state.id});
                this.setState({newMessage: ''});
                this.setState({updated: true});
            }
        }
    }

    _getMsgTime(t) {
        if (t) {
            var s = t.split(" ");
            var x = s[1].split(":");
            return x[0] + ":" + x[1];
        }        
    }

    InputOnFocus(a) {
        // // Main.hideMenuBar(a);
        if (a === 1) {this.setState({focus: true});}
        else {this.setState({focus: false});}
        if (this.msglst && this.msglst.lastChild) {
            this.msglst.lastChild.scrollIntoView({behavior: 'smooth'});
        }
    }


    async _getData() {
        let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
            });
            fetch('http://lastminprod.com/Matcha/public/msghistory', {
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
                this.setState({dataSource: ds.cloneWithRows(trueData)});
                // console.warn(this.state.dataSource._dataBlob.s1);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    render() {
        if (this.state.data) {
            var username = this.state.data['f_name'];
        }
        if (!this.state.viewId) {
            return <View style={ styles.container }><Text>Hello World</Text></View>
        }
        return (
            <View>
            <ScrollView>
              {this.state.dataSource && <ListView
                ref={msglstc => {this.msglstc = msglstc;}}
                style={styles.container}
                dataSource={this.state.dataSource}
                renderRow={
                  (data) => <MessagesBody {...data} />
                }/>}
            </ScrollView>
          </View>
        );
    }
}

const MessagesBody = (props) => {
        var display =  this.props.id === -42 ? null : this.state.messages.map((message, i) => {
            var timestamp = this._getMsgTime(message.date);
            return (
                <View ref={msglst => {this.msglst = msglst;}}>
                    <Image
                        source={{ uri: this.state.data.avatar ? 'http://lastminprod.com/Matcha/uploads/' + this.state.data.avatar : 'http://lastminprod.com/Matcha/uploads/avatar-placeholder.png'}}
                        style={{ display: message.sender === this.state.id ? 'none' : 'block' }}
                        style={ styles.photo }/>
                    <Text style={ message.sender === this.state.id ? styles.sentMsg : styles.receivedMsg }>
                        { message.msg }
                        <Text style={ message.sender === this.state.id ? style.msgTimeR : style.msgTimeL }>
                        { timestamp }
                        </Text>
                    </Text>
                </View>
            );
        });

}

const styles = StyleSheet.create({
    msgPane: {
      flex: 1,
      backgroundColor: '#aaa',
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
    photo: {
        width: 35,
        height: 35,
    },
});

export default Chat