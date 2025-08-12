import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

export default function RiveToggleButton() {
  const [RiveComponent, setRiveComponent] = useState<React.FC | null>(null);
  const [rive, setRive] = useState<any>(null);
  const [isOn, setIsOn] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const loadRive = async () => {
        try {
          const { useRive } = await import('@rive-app/react-canvas');

          const RiveCanvas = () => {
            const { rive: riveInstance, RiveComponent: RiveComp } = useRive({
              src: require('../../assets/todo_button_1.riv'), // On/Off 버튼 파일
              stateMachines: 'Toggle State Machine',
              autoplay: true,
              onLoad: () => {
                console.log('🎚️ Toggle 버튼 로드 완료');
              },
            });

            useEffect(() => {
              if (riveInstance) {
                console.log('🔄 Toggle State Machine 초기화');
                
                // 초기 상태 설정
                const inputs = riveInstance.stateMachineInputs('Toggle State Machine');
                if (inputs) {
                  const isOnInput = inputs.find((input: any) => input.name === 'isOn');
                  if (isOnInput) {
                    isOnInput.value = false; // 초기값: OFF
                  }
                }
                
                setRive(riveInstance);
              }
            }, [riveInstance]);

            return (
              <View style={styles.riveContainer}>
                <RiveComp width={100} height={50} />
              </View>
            );
          };

          setRiveComponent(() => RiveCanvas);
        } catch (error) {
          console.error('❌ Toggle 버튼 로드 실패:', error);
        }
      };

      loadRive();
    }
  }, []);

  const handleToggleClick = () => {
    console.log('🔘 토글 클릭:', isOn ? 'ON → OFF' : 'OFF → ON');
    
    if (Platform.OS === 'web' && rive) {
      try {
        const inputs = rive.stateMachineInputs('Toggle State Machine');
        
        if (inputs && Array.isArray(inputs)) {
          // Click 트리거 발생
          const clickTrigger = inputs.find((input: any) => input.name === 'Click');
          if (clickTrigger) {
            clickTrigger.fire();
            console.log('⚡ Click 트리거 발생');
          }
          
          // isOn 상태 토글 (State Change 리스너가 자동으로 처리하지만 백업용)
          const isOnInput = inputs.find((input: any) => input.name === 'isOn');
          if (isOnInput) {
            const newState = !isOn;
            isOnInput.value = newState;
            setIsOn(newState);
            console.log(`✅ isOn 상태 변경: ${newState}`);
          }
        }
      } catch (error) {
        console.error('💥 토글 오류:', error);
      }
    }
  };

  const handleMouseEnter = () => {
    if (Platform.OS === 'web' && rive) {
      const inputs = rive.stateMachineInputs('Toggle State Machine');
      if (inputs) {
        const hoverInput = inputs.find((input: any) => input.name === 'isHovered');
        if (hoverInput) {
          hoverInput.value = true;
          setIsHovered(true);
        }
      }
    }
  };

  const handleMouseLeave = () => {
    if (Platform.OS === 'web' && rive) {
      const inputs = rive.stateMachineInputs('Toggle State Machine');
      if (inputs) {
        const hoverInput = inputs.find((input: any) => input.name === 'isHovered');
        if (hoverInput) {
          hoverInput.value = false;
          setIsHovered(false);
        }
      }
    }
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>알림 설정</Text>
        <View 
          style={styles.toggleWrapper}
          // @ts-ignore
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleToggleClick}
        >
          {RiveComponent ? (
            <RiveComponent />
          ) : (
            <View style={styles.loadingContainer}>
              <Text>로딩 중...</Text>
            </View>
          )}
        </View>
        <Text style={styles.statusText}>
          현재 상태: {isOn ? '켜짐 ✅' : '꺼짐 ⭕'}
        </Text>
        <Text style={styles.debugText}>
          호버: {isHovered ? '예' : '아니오'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Toggle 버튼 (네이티브 구현 예정)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '600',
  },
  toggleWrapper: {
    cursor: 'pointer',
  },
  riveContainer: {
    width: 100,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  loadingContainer: {
    width: 100,
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  debugText: {
    marginTop: 5,
    fontSize: 12,
    color: '#888',
  },
}); 