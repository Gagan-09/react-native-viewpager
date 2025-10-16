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
    var initialDotStyle = [styles.dot];
    if (this.props.dotColor) {
      initialDotStyle.push({ backgroundColor: this.props.dotColor });
    }
    
    var initialCurDotStaticStyle = [styles.curDot];
    if (this.props.activeDotColor) {
      initialCurDotStaticStyle.push({ backgroundColor: this.props.activeDotColor });
    }

    return {
      viewWidth: 0,
      dotStyles: [initialDotStyle, initialCurDotStaticStyle], 
    };
  },

  componentWillReceiveProps(nextProps) {
    const dotColorChanged = nextProps.dotColor !== this.props.dotColor;
    const activeDotColorChanged = nextProps.activeDotColor !== this.props.activeDotColor;

    if (dotColorChanged || activeDotColorChanged) {
      this.setState(prevState => {
        let newDotStyles = [...prevState.dotStyles]; 

        if (dotColorChanged) {
          let newInactiveStyle = [styles.dot, nextProps.dotColor ? { backgroundColor: nextProps.dotColor } : {}];
          newDotStyles[0] = newInactiveStyle;
        }

        if (activeDotColorChanged) {
          let newActiveStaticStyle = [styles.curDot, nextProps.activeDotColor ? { backgroundColor: nextProps.activeDotColor } : {}];
          newDotStyles[1] = newActiveStaticStyle;
        }
        return { dotStyles: newDotStyles };
      });
    }
  },

  renderIndicator(page) {
    var dotStyle = this.state.dotStyles[0];

    return (
      <TouchableOpacity style={styles.tab} key={'idc_' + page} onPress={() => this.props.goToPage(page)}>
        <View style={dotStyle} />
      </TouchableOpacity>
    );
  },

  render() {
    var pageCount = this.props.pageCount;
    var itemWidth = DOT_SIZE + (DOT_SAPCE * 2);
    
    var offsetX = itemWidth * (this.props.activePage - this.props.scrollOffset);
    var left = this.props.scrollValue.interpolate({
      inputRange: [0, 1], outputRange: [offsetX, offsetX + itemWidth]
    })

    var indicators = [];
    for (var i = 0; i < pageCount; i++) {
      indicators.push(this.renderIndicator(i))
    }
    var activeStaticStyle = this.state.dotStyles[1];
    var curDotStyle = [...activeStaticStyle, { left }];

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
