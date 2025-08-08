import React, { useEffect, useRef, useState } from "react";
import { Button, Platform, StyleSheet, Text, View } from "react-native";

export default function RiveButtonExample() {
  const [RiveComponent, setRiveComponent] = useState<React.FC | null>(null);
  const [rive, setRive] = useState<any>(null);
  const [taskCount, setTaskCount] = useState(5);
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLoggedIn = true;

  useEffect(() => {
    if (Platform.OS === 'web') {
      const loadRive = async () => {
        try {
          const { useRive } = await import('@rive-app/react-canvas');

          const RiveCanvas = () => {
            const { rive: riveInstance, RiveComponent: RiveComp } = useRive({
              src: require('../../assets/todo_button.riv'),
              stateMachines: 'State Machine On/Off',
              autoplay: true,
              onLoad: () => {
                console.log('Rive 파일 로드 완료');
              },
              onLoadError: (error) => {
                console.error('Rive 로드 에러:', error);
              },
            });

            // Rive 인스턴스를 상태로 저장
            useEffect(() => {
              if (riveInstance) {
                console.log('Rive 인스턴스 생성됨 - State Machine On/Off 로드 성공!');
                console.log('Rive 인스턴스 메서드들:', Object.getOwnPropertyNames(riveInstance));
                console.log('Rive 인스턴스 프로토타입 메서드들:', Object.getOwnPropertyNames(Object.getPrototypeOf(riveInstance)));
                setRive(riveInstance);
              }
            }, [riveInstance]);

            return (
              <View style={styles.riveContainer}>
                <RiveComp width={200} height={200} />
              </View>
            );
          };

          setRiveComponent(() => RiveCanvas);
        } catch (error) {
          console.error('Rive 로드 실패:', error);
        }
      };

      loadRive();
    }
    
    // Cleanup function
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
    };
  }, []);

  const handleMouseEnter = () => {
    console.log('마우스 호버 시작');
    
    // 기존 타이머가 있으면 취소
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    // 이미 호버 상태라면 중복 실행 방지
    if (isHovered) return;
    
    setIsHovered(true);

    if (Platform.OS === 'web' && rive) {
      try {
        console.log('🎯 호버 애니메이션 시작 (부드럽게)');
        
        if (typeof rive.stateMachineInputs === 'function') {
          const inputs = rive.stateMachineInputs('State Machine On/Off');
          
          if (inputs && Array.isArray(inputs)) {
            const pressedInput = inputs.find((input: any) => input.name === 'Pressed');
            if (pressedInput) {
              pressedInput.value = true;
              console.log('✅ 호버 시 Pressed input을 true로 설정');
            }
          }
        }
      } catch (error) {
        console.error('호버 애니메이션 오류:', error);
      }
    }
  };

  const handleMouseLeave = () => {
    console.log('마우스 호버 끝');
    
    // 짧은 지연 후 호버 해제 (너무 빠른 전환 방지)
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
      
      if (Platform.OS === 'web' && rive) {
        try {
          console.log('🎯 호버 애니메이션 종료 (부드럽게)');
          
          if (typeof rive.stateMachineInputs === 'function') {
            const inputs = rive.stateMachineInputs('State Machine On/Off');
            
            if (inputs && Array.isArray(inputs)) {
              const pressedInput = inputs.find((input: any) => input.name === 'Pressed');
              if (pressedInput) {
                pressedInput.value = false;
                console.log('✅ 호버 끝날 때 Pressed input을 false로 설정');
              }
            }
          }
        } catch (error) {
          console.error('호버 종료 애니메이션 오류:', error);
        }
      }
    }, 150); // 150ms 지연으로 너무 빠른 전환 방지
  };

  const handleAddTask = () => {
    console.log('할 일 추가 클릭됨');
    setTaskCount(prev => prev + 1);
    console.log('taskCount 증가:', taskCount + 1);
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.animationContainer}>
          {RiveComponent ? (
            <View 
              style={styles.riveContainer}
              // @ts-ignore - 웹에서만 사용되는 마우스 이벤트
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <RiveComponent />
            </View>
          ) : (
            <View style={styles.loadingContainer}>
              <Text>Rive 로딩 중...</Text>
            </View>
          )}
        </View>
        <Button title={`  (${taskCount})  `} onPress={handleAddTask} />
        <Text style={styles.statusText}>웹에서 Rive 애니메이션 테스트 중</Text>
      </View>
    );
  }

  // 네이티브 플레이스홀더
  return (
    <View style={styles.container}>
      <View style={styles.placeholderContainer}>
        <Text style={styles.placeholderText}>
          Rive 애니메이션{'\n'}(네이티브에서 구현 예정)
        </Text>
      </View>
      <Button title="할 일 추가" onPress={handleAddTask} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animationContainer: {
    marginBottom: 20,
  },
  riveContainer: {
    width: 200,
    height: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
  },
  loadingContainer: {
    width: 200,
    height: 200,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  placeholderContainer: {
    width: 200,
    height: 200,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  placeholderText: {
    textAlign: 'center',
    color: '#666',
  },
  statusText: {
    marginTop: 10,
  },
});
