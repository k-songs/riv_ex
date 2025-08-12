import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

const RiveButton = () => {
  // 웹 환경에서는 임시 View를 반환
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, styles.webContainer]}>
        <View style={[styles.rive, styles.webRive]} />
      </View>
    );
  }

  // 네이티브 환경에서만 Rive 컴포넌트를 동적으로 불러옴
  const Rive = require('rive-react-native').default;

  return (
    <View style={styles.container}>
      <View style={styles.riveWrapper}>
        <Rive
          resourceName="data_binding"
          artboardName="Artboard"
          stateMachineName="State Machine 1"
          autoplay={true}
          style={styles.rive}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  riveWrapper: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)',
      },
    }),
  },
  rive: {
    width: 200,
    height: 200,
  },
  webContainer: {
    cursor: 'pointer',
  },
  webRive: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
});

export default RiveButton;