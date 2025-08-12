import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

// 간단한 2-State 토글 버튼 (Off ↔ On)
export default function SimpleToggleButton() {
  const [RiveComponent, setRiveComponent] = useState<React.FC | null>(null);
  const [rive, setRive] = useState<any>(null);
  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const loadRive = async () => {
        try {
          const { useRive } = await import('@rive-app/react-canvas');

          const RiveCanvas = () => {
            const { rive: riveInstance, RiveComponent: RiveComp } = useRive({
              src: require('../../assets/data_binding.riv'),
              stateMachines: 'StateMachine',
              autoplay: true,
              onLoad: () => {
                console.log('🎚️ Simple Toggle 로드 완료');
              },
            });

            useEffect(() => {
              if (riveInstance) {
                console.log('📊 Simple Toggle State Machine 구조:');
                console.log('  - Off State: 회색, 슬라이더 왼쪽');
                console.log('  - On State: 파란색, 슬라이더 오른쪽');
                console.log('  - 전환: 즉시 또는 0.3초 애니메이션');
                
                setRive(riveInstance);
              }
            }, [riveInstance]);

            return <RiveComp width={80} height={40} />;
          };

          setRiveComponent(() => RiveCanvas);
        } catch (error) {
          console.error('❌ 로드 실패:', error);
        }
      };

      loadRive();
    }
  }, []);

  const handleToggle = () => {
    if (rive) {
      const inputs = rive.stateMachineInputs('Simple Toggle SM');
      if (inputs) {
        // 방법 1: Toggle 트리거 사용
        const toggleTrigger = inputs.find((input: any) => input.name === 'Toggle');
        if (toggleTrigger) {
          toggleTrigger.fire();
          setIsOn(!isOn);
          console.log(`🔄 토글: ${!isOn ? 'ON' : 'OFF'}`);
        }
        
        // 방법 2: 직접 상태 변경
        const stateInput = inputs.find((input: any) => input.name === 'IsOn');
        if (stateInput) {
          stateInput.value = !isOn;
          setIsOn(!isOn);
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>간단한 2-State 토글</Text>
      
      <View style={styles.stateBox}>
        <Text style={styles.stateLabel}>현재 상태:</Text>
        <View style={[styles.indicator, isOn ? styles.onIndicator : styles.offIndicator]}>
          <Text style={styles.stateText}>{isOn ? 'ON' : 'OFF'}</Text>
        </View>
      </View>

      <View 
        style={styles.toggleContainer}
        // @ts-ignore
        onClick={handleToggle}
      >
        {RiveComponent ? (
          <RiveComponent />
        ) : (
          <View style={styles.placeholder}>
            <Text>로딩...</Text>
          </View>
        )}
      </View>

      <View style={styles.explanation}>
        <Text style={styles.explainTitle}>상태 구조:</Text>
        <Text style={styles.explainText}>• Off State: 기본 상태 (회색)</Text>
        <Text style={styles.explainText}>• On State: 활성 상태 (파란색)</Text>
        <Text style={styles.explainText}>• 클릭 시 즉시 전환 또는 애니메이션</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  stateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  stateLabel: {
    fontSize: 14,
    marginRight: 10,
  },
  indicator: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  offIndicator: {
    backgroundColor: '#E0E0E0',
  },
  onIndicator: {
    backgroundColor: '#4CAF50',
  },
  stateText: {
    color: 'white',
    fontWeight: 'bold',
  },
  toggleContainer: {
    cursor: 'pointer',
    marginBottom: 20,
  },
  placeholder: {
    width: 80,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  explanation: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    width: '100%',
  },
  explainTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  explainText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
}); 