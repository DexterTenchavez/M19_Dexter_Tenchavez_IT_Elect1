import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';

const CounterApp = () => {
  const [count, setCount] = useState(0);

  return (
    <View>
      <Text>Counter App</Text>
      <Text>Count: {count}</Text>
      <View>
        <Button title="Increment (+1)" onPress={() => setCount(count + 1)} />
        <Button title="Decrement (-1)" onPress={() => setCount(count - 1)} />
      </View>
    </View>
  );
};

export default CounterApp;