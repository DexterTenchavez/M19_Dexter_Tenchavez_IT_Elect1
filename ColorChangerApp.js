import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';

const ColorChanger = () => {
  const [bgColor, setBgColor] = useState('white');

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.buttonContainer}>
        <Button title="White" onPress={() => setBgColor('white')} />
        <Button title="Light Blue" onPress={() => setBgColor('#ADD8E6')} />
        <Button title="Light Green" onPress={() => setBgColor('#90EE90')} />
      </View>
    </View>
  );
};

// Add missing styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
});

export default ColorChanger;