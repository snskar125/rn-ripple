import React, { PureComponent, ReactElement } from "react";
import {
  Animated,
  Dimensions,
  GestureResponderEvent,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
  View,
  ViewStyle,
} from "react-native";

const { height, width } = Dimensions.get("window");
const INITIAL_RIPPLE_SIZE = 25;
const MAX_SCALE = Math.floor(Math.max(height, width) / INITIAL_RIPPLE_SIZE);

interface RippleProps {
  parent: TouchableRipple;
  id: string;
  color: string;
  x: number;
  y: number;
}

class Ripple extends PureComponent<RippleProps> {
  private animation = new Animated.Value(0);

  componentDidMount() {
    Animated.timing(this.animation, {
      toValue: 1,
      duration: 750,
      useNativeDriver: true,
    }).start(() => {
      const { parent, id } = this.props;
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

interface TouchableRippleProps extends TouchableWithoutFeedbackProps {
  style?: ViewStyle;
  rippleColor?: string;
  onPressIn?: (event: GestureResponderEvent) => void;
  background?: boolean;
  children?: ReactElement;
}

interface TouchableRippleState {
  ripples: { id: string; x: number; y: number }[];
}

export default class TouchableRipple extends PureComponent<
  TouchableRippleProps,
  TouchableRippleState
> {
  static defaultProps: TouchableRippleProps = {
    rippleColor: "rgba(0,0,0,0.1)",
    onPressIn: () => {},
    children: null,
    style: {},
    background: false,
  };

  constructor(props: TouchableRippleProps) {
    super(props);
    this.state = {
      ripples: [],
    };
  }

  handlePressIn = (e: any) => {
    const { onPressIn } = this.props;
    const { locationX, locationY } = e.nativeEvent;
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
    const { style, children, rippleColor, background, ...rest } = this.props;
    return (
      <TouchableWithoutFeedback {...rest} onPressIn={this.handlePressIn}>
        <View
          pointerEvents="box-only"
          style={StyleSheet.compose(style, styles.container)}
        >
          {!background ? children : null}
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
          {background ? children : null}
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
