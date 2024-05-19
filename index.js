import { PureComponent } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const { height, width } = Dimensions.get("window");
const INITIAL_RIPPLE_SIZE = 10;
const MAX_SCALE = Math.floor(Math.max(height, width) / INITIAL_RIPPLE_SIZE);

class Ripple extends PureComponent {
  constructor(props) {
    super(props);
    this.animation = new Animated.Value(0);
  }
  componentDidMount() {
    const { parent, id } = this.props;
    Animated.timing(this.animation, {
      toValue: 1,
      duration: 750,
      useNativeDriver: true,
    }).start(() => {
      parent.setState((prev) => ({
        ...prev,
        ripples: prev.ripples.filter((ripple) => ripple.id !== id),
      }));
    });
  }
  render() {
    const { color, x, y } = this.props;
    const scale = this.animation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, MAX_SCALE],
    });
    const opacity = this.animation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    });
    return (
      <Animated.View
        style={[
          styles.ripple,
          {
            backgroundColor: color,
            left: x - INITIAL_RIPPLE_SIZE / 2,
            top: y - INITIAL_RIPPLE_SIZE / 2,
            transform: [{ scale }],
            opacity,
          },
        ]}
      />
    );
  }
}

export default class TouchableRipple extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      ripples: [],
    };
    this.handlePressIn = this.handlePressIn.bind(this);
  }
  handlePressIn = (e) => {
    const { onPressIn } = this.props;
    const { locationX, locationY } = e.nativeEvent.changedTouches[0];
    this.setState((prev) => ({
      ...prev,
      ripples: [
        ...prev.ripples,
        {
          id: Math.random().toString(),
          x: locationX,
          y: locationY,
        },
      ],
    }));
    onPressIn(e);
  };
  render() {
    const { style, children, rippleColor, onPressIn, foreground, ...rest } =
      this.props;
    return (
      <TouchableWithoutFeedback onPressIn={this.handlePressIn} {...rest}>
        <View pointerEvents="box-only" style={[styles.container, style]}>
          {foreground ? children : null}
          {this.state.ripples.map((r) => (
            <Ripple
              key={r.id}
              id={r.id}
              x={r.x}
              y={r.y}
              color={rippleColor}
              parent={this}
            />
          ))}
          {!foreground ? children : null}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  ripple: {
    height: INITIAL_RIPPLE_SIZE,
    width: INITIAL_RIPPLE_SIZE,
    borderRadius: INITIAL_RIPPLE_SIZE,
    position: "absolute",
  },
});

TouchableRipple.defaultProps = {
  rippleColor: "rgba(0,0,0,0.25)",
  onPressIn: () => {},
  children: null,
  style: {},
  foreground: true,
};
