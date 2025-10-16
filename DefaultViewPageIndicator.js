'use strict';

var React = require('react');
var ReactNative = require('react-native');
var PropTypes = require('prop-types');
var createReactClass = require('create-react-class');
var {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} = ReactNative;

var deviceWidth = Dimensions.get('window').width;
var DOT_SIZE = 6;
var DOT_SAPCE = 4;

var styles = StyleSheet.create({
  tab: {
    alignItems: 'center',
  },

  tabs: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: '#E0E1E2',
    marginLeft: DOT_SAPCE,
    marginRight: DOT_SAPCE,
  },

  curDot: {
    position: 'absolute',
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: '#80ACD0',
    marginHorizontal: DOT_SAPCE,
    bottom: 0,
  },
});

// Pre-flatten
var baseDotStyle = StyleSheet.flatten(styles.dot);
var baseCurDotStyle = StyleSheet.flatten(styles.curDot);

var DefaultViewPageIndicator = createReactClass({
  propTypes: {
    goToPage: PropTypes.func,
    activePage: PropTypes.number,
    pageCount: PropTypes.number,
    dotColor: PropTypes.string,
    activeDotColor: PropTypes.string,
    scrollOffset: PropTypes.number,
    scrollValue: PropTypes.object,
  },

  getInitialState() {
    var dotStyle = this.props.dotColor ? 
      Object.assign({}, baseDotStyle, {backgroundColor: this.props.dotColor}) : 
      baseDotStyle;
    
    var curDotStaticStyle = this.props.activeDotColor ? 
      Object.assign({}, baseCurDotStyle, {backgroundColor: this.props.activeDotColor}) : 
      baseCurDotStyle;

    return {
      viewWidth: 0,
      dotStyle: dotStyle,
      curDotStaticStyle: curDotStaticStyle,
    };
  },

  componentWillReceiveProps(nextProps) {
    const dotColorChanged = nextProps.dotColor !== this.props.dotColor;
    const activeDotColorChanged = nextProps.activeDotColor !== this.props.activeDotColor;

    if (dotColorChanged || activeDotColorChanged) {
      var newState = {};
      
      if (dotColorChanged) {
        newState.dotStyle = nextProps.dotColor ? 
          Object.assign({}, baseDotStyle, {backgroundColor: nextProps.dotColor}) : 
          baseDotStyle;
      }

      if (activeDotColorChanged) {
        newState.curDotStaticStyle = nextProps.activeDotColor ? 
          Object.assign({}, baseCurDotStyle, {backgroundColor: nextProps.activeDotColor}) : 
          baseCurDotStyle;
      }

      this.setState(newState);
    }
  },

  renderIndicator(page) {
    // Use the pre-computed style object directly
    return (
      <TouchableOpacity style={styles.tab} key={'idc_' + page} onPress={() => this.props.goToPage(page)}>
        <View style={this.state.dotStyle} />
      </TouchableOpacity>
    );
  },

  render() {
    var pageCount = this.props.pageCount;
    var itemWidth = DOT_SIZE + (DOT_SAPCE * 2);
    
    var offsetX = itemWidth * (this.props.activePage - this.props.scrollOffset);
    var left = this.props.scrollValue.interpolate({
      inputRange: [0, 1], outputRange: [offsetX, offsetX + itemWidth]
    });

    var indicators = [];
    for (var i = 0; i < pageCount; i++) {
      indicators.push(this.renderIndicator(i));
    }

    var curDotStyle = [this.state.curDotStaticStyle, {left: left}];

    return (
      <View style={styles.tabs}
        onLayout={(event) => {
            var viewWidth = event.nativeEvent.layout.width;
            if (!viewWidth || this.state.viewWidth === viewWidth) {
              return;
            }
            this.setState({
              viewWidth: viewWidth,
            });
          }}>
        {indicators}
        <Animated.View style={curDotStyle} />
      </View>
    );
  },
});

module.exports = DefaultViewPageIndicator;
