import React, { useRef, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import Rive, { RiveRef } from 'rive-react-native';

export default function RiveButtonExample() {
  const riveRef = useRef<RiveRef>(null);
  const [taskCount, setTaskCount] = useState(5);
  const [isOn, setIsOn] = useState(false);

  const handleToggle = () => {
    if (riveRef.current) {
      const newIsOn = !isOn;
      setIsOn(newIsOn);
      
      // Rive 상태 업데이트
      try {
        if (newIsOn) {
          riveRef.current.play('State Machine On/Off');
        } else {
          riveRef.current.stop('State Machine On/Off');
        }
      } catch (error) {
        console.error('Rive 상태 업데이트 실패:', error);
      }

      setTaskCount(prev => prev + (newIsOn ? 1 : -1));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.animationContainer}>
        <Rive
          ref={riveRef}
          resourceName="data_binding_1"
          artboardName="Artboard"
          stateMachineName="State Machine On/Off"
          style={styles.rive}
        />
      </View>
      <Button 
        title={`${isOn ? '할 일 완료' : '할 일 추가'} (${taskCount})`}
        onPress={handleToggle}
      />
      <Text style={styles.statusText}>
        현재 상태: {isOn ? 'ON' : 'OFF'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  animationContainer: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 4,
  },
  rive: {
    width: '100%',
    height: '100%',
  },
  statusText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
});
