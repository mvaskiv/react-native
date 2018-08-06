import React, { Component } from "react";
import {
    Animated,
    Easing,
    PanResponder,
    StyleSheet,
    View
} from 'react-native';
import Messages from '../screens/Messages';
var createReactClass = require('create-react-class');

var Dimensions = require('Dimensions')
var screenWidth = Dimensions.get('window').width

var SlideMenu = createReactClass({
  componentWillMount: function() {
    this.offset = screenWidth // Contains the center view offset from the left edge
    this._panGesture = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
               && Math.abs(gestureState.dx) > 10
      },
      onPanResponderGrant: (evt, gestureState) => this.left = 0,
      onPanResponderMove: (evt, gestureState) => this.moveCenterView(gestureState.dx),
      onPanResponderRelease: this.moveFinished,
      onPanResponderTerminate: this.moveFinished,
    })
  },

  componentWillReceiveProps: function() {
    if (this.offset >= screenWidth && this.props.open) {
      this.offset = 0;
      this.props.onClose();
      }
  },

  moveCenterView: function(left) {
    if (!this.center) return

    if ((this.offset + left) < 0) {
      this.left = -this.offset
    } else {
      this.left = left
    }

    this.center.setNativeProps({left: this.offset + this.left})
  },

  moveFinished: function() {
    if (!this.center) return

    var offset = this.offset + this.left

    if (this.offset === 0) {
      if (offset > screenWidth * 0.35) {
        this.offset = screenWidth
      }
    } else {
      if (offset < screenWidth * 0.5) {
        this.offset = 0
      }
    }

    // Animated.timing(
    //   this.center,
    //   {
    //     toValue: 100,
    //     duration: 12000,
    //     easing: Easing.linear
    //   }
    // ).start();

    // Animation.startAnimation(this.center, 400, 0, 'easeInOut', {'anchorPoint.x': 0, 'position.x': this.offset})
    this.center.setNativeProps({left: this.offset})
  },

  render: function() {
    var centerView = this.props.renderCenterView ? this.props.renderCenterView : null
    var leftView = this.props.renderLeftView ? this.props.renderLeftView : null

    return (
      <View style={[styles.container, this.props.style]}>
        <View style={styles.left}>
          {leftView}
        </View>
        <View
          style={[styles.center, {left: this.offset}]}
          ref={(center) => this.center = center}
          {...this._panGesture.panHandlers}>
          {centerView}
        </View>
      </View>
    )
  },
})

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    borderWidth: 1,
    borderLeftColor: '#ddd',
    borderTopColor: '#FFFFFF',
    borderRightColor: '#FFFFFF',
    borderBottomColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
  },
  left: {
    position: 'absolute',
    top:0,
    left:0,
    bottom:0,
    right: 0,
    backgroundColor: '#FFFFFF',
  },
})

export default SlideMenu