# @snskar125/rn-ripple

Ripple Effect Component for React Native

## Usage

```javascript
import { StyleSheet, Text, View } from "react-native";
import TouchableRipple from "@snskar125/rn-ripple";

export default function App() {
  return (
    <View style={styles.container}>
      <TouchableRipple
        rippleColor={"rgba(255,255,255,0.5)"}
        style={styles.button}
      >
        <Text style={styles.text}>Button</Text>
      </TouchableRipple>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#6fd5fc",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
  },
  text: {
    color: "#252525",
    fontWeight: "600",
    fontSize: 20,
  },
});
```

## Props

| Prop        | Type                               |
| ----------- | ---------------------------------- |
| rippleColor | String (Use RGBA for Transparency) |
| background  | Boolean (Ripple Position)          |

All TouchableWithoutFeedback Props
