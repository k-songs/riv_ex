import React, { useEffect, useRef, useState } from 'react';

export default function SimpleRiveTest() {
  const [RiveComponent, setRiveComponent] = useState<React.FC | null>(null);
  const [rive, setRive] = useState<any>(null);
  const [isOn, setIsOn] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [stateMachineNames, setStateMachineNames] = useState<string[]>([]);
  const [correctStateMachine, setCorrectStateMachine] = useState<string>('');
  const riveInstanceRef = useRef<any>(null);

  useEffect(() => {
    const loadRive = async () => {
      try {
        const { useRive, Layout, Fit, Alignment } = await import('@rive-app/react-canvas');

        const RiveCanvas = () => {
          const { rive: riveInstance, RiveComponent: RiveComp } = useRive({
            src: require('../../assets/data_binding_7.riv'),
            stateMachines: 'State Machine 1', // 명시적으로 State Machine 지정
            autoplay: true,
            layout: new Layout({
              fit: Fit.Cover,
              alignment: Alignment.Center,
            }),
            onLoad: () => {
              console.log('🎨 Rive 파일 로드 완료');
            },
            onLoadError: (error) => {
              console.error('❌ Rive 로드 에러:', error);
            },
          });

          React.useEffect(() => {
            if (riveInstance) {
              console.log('🤖 Rive 인스턴스 생성됨');
              riveInstanceRef.current = riveInstance;
              setRive(riveInstance);
              
              // State Machine 명시적으로 재생
              try {
                riveInstance.play('State Machine 1');
                console.log('▶️ State Machine 1 재생 시작');
              } catch (error) {
                console.error('State Machine 재생 실패:', error);
              }
              
              // 실제 State Machine 이름들 확인
              try {
                const availableStateMachines = riveInstance.stateMachineNames;
                console.log('🎯 실제 사용 가능한 State Machines:', availableStateMachines);
                
                if (availableStateMachines && availableStateMachines.length > 0) {
                  availableStateMachines.forEach((name: string, index: number) => {
                    console.log(`  ${index + 1}. "${name}"`);
                    
                    // 각 State Machine의 입력들 확인
                    try {
                      const inputs = riveInstance.stateMachineInputs(name);
                      if (inputs && Array.isArray(inputs)) {
                        console.log(`    📥 입력 변수들 (${name}):`);
                        inputs.forEach((input: any, inputIndex: number) => {
                          console.log(`      ${inputIndex + 1}. ${input.name} (${input.type}) = ${input.value}`);
                        });
                      }
                    } catch (error) {
                      console.log(`    ❌ ${name}의 입력 변수를 가져올 수 없음:`, error);
                    }
                  });
                  
                  // State Machine 1 사용
                  const targetStateMachine = 'State Machine 1';
                  setStateMachineNames(availableStateMachines);
                  setCorrectStateMachine(targetStateMachine);
                  console.log(`✅ 사용할 State Machine: "${targetStateMachine}"`);
                  
                  // 초기 상태 설정
                  try {
                    const inputs = riveInstance.stateMachineInputs(targetStateMachine);
                    if (inputs && Array.isArray(inputs)) {
                      const noHoverInput = inputs.find((input: any) => input.name === 'nohover');
                      const hoverInput = inputs.find((input: any) => input.name === 'hover'); // Hover → hover 변경
                      const isOffInput = inputs.find((input: any) => input.name === 'isOff');
                      const isOnInput = inputs.find((input: any) => input.name === 'isOn');

                      if (noHoverInput) {
                        noHoverInput.value = true;
                        console.log('✅ nohover = true');
                      }
                      if (hoverInput) {
                        hoverInput.value = false;
                        console.log('✅ hover = false');
                      }
                      if (isOffInput) {
                        isOffInput.value = true;
                        console.log('✅ isOff = true');
                      }
                      if (isOnInput) {
                        isOnInput.value = false;
                        console.log('✅ isOn = false');
                      }

                      console.log('✅ 초기 상태 설정 완료');
                      
                      // State Machine 상태 모니터링 시작
                      const monitorStates = () => {
                        try {
                          const currentStates = riveInstance.playingStateMachineNames;
                          console.log('🎯 현재 활성 상태들:', currentStates);
                          
                          // 현재 애니메이션 상태도 확인
                          const playingAnimations = riveInstance.playingAnimationNames;
                          console.log('🎬 현재 재생 중인 애니메이션들:', playingAnimations);
                        } catch (error) {
                          console.log('상태 모니터링 오류:', error);
                        }
                      };
                      
                      // 5초마다 상태 모니터링
                      const stateMonitorInterval = setInterval(monitorStates, 5000);
                      
                      // 컴포넌트 언마운트 시 정리
                      return () => {
                        clearInterval(stateMonitorInterval);
                      };
                    }
                  } catch (error) {
                    console.error('💥 초기 상태 설정 실패:', error);
                  }
                } else {
                  console.warn('⚠️ State Machine이 하나도 없습니다');
                }
              } catch (error) {
                console.error('💥 State Machine 이름 가져오기 실패:', error);
              }
            }
          }, [riveInstance]);

          return <RiveComp style={{ width: '100%', height: '100%' }} />;
        };

        setRiveComponent(() => RiveCanvas);
      } catch (error) {
        console.error('💥 Rive 로드 실패:', error);
      }
    };

    loadRive();
  }, []);

  const updateRiveState = (updates: { [key: string]: boolean }) => {
    const currentRive = riveInstanceRef.current || rive;
    
    if (!currentRive) {
      console.warn('⚠️ Rive 인스턴스가 준비되지 않았습니다');
      return;
    }

    const stateMachineName = 'State Machine 1'; // 명시적으로 지정

    try {
      // State Machine이 재생 중인지 확인
      const playingStateMachines = currentRive.playingStateMachineNames;
      console.log('🎬 현재 재생 중인 State Machines:', playingStateMachines);
      
      if (!playingStateMachines.includes(stateMachineName)) {
        console.log(`▶️ ${stateMachineName} 재생 시작`);
        currentRive.play(stateMachineName);
      }

      const inputs = currentRive.stateMachineInputs(stateMachineName);
      console.log(`🔄 상태 업데이트 시도 (${stateMachineName}):`, updates);
      
      if (inputs && Array.isArray(inputs)) {
        // 현재 상태 먼저 확인
        console.log('📊 업데이트 전 현재 상태:');
        inputs.forEach((input: any) => {
          console.log(`  ${input.name} = ${input.value}`);
        });

        // 상태 업데이트 (한 번에 하나씩, 순서대로)
        Object.entries(updates).forEach(([name, value]) => {
          const input = inputs.find((input: any) => input.name === name);
          if (input) {
            const oldValue = input.value;
            
            // 값이 실제로 변경될 때만 업데이트
            if (oldValue !== value) {
              input.value = value;
              console.log(`✅ ${name}: ${oldValue} → ${value}`);
              
              // 짧은 지연으로 상태 변경 간격 두기
              setTimeout(() => {
                console.log(`⏱️ ${name} 상태 변경 완료`);
              }, 10);
            } else {
              console.log(`⚪ ${name}: 값 변경 없음 (${value})`);
            }
          } else {
            console.warn(`⚠️ 입력 변수 '${name}'을 찾을 수 없습니다`);
            console.log('📋 사용 가능한 입력 변수들:');
            inputs.forEach((inp: any) => console.log(`  - ${inp.name} (${inp.type})`));
          }
        });
        
        // 업데이트 후 최종 상태 확인
        setTimeout(() => {
          console.log('📊 업데이트 후 최종 상태:');
          inputs.forEach((input: any) => {
            console.log(`  ${input.name} = ${input.value}`);
          });
        }, 50);
      } else {
        console.error('❌ State Machine inputs를 가져올 수 없습니다');
      }
    } catch (error) {
      console.error('💥 상태 업데이트 오류:', error);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    console.log('🖱️ 호버 시작');
    
    // 호버 상태만 변경 (isOn/isOff는 건드리지 않음)
    updateRiveState({
      nohover: false,
      hover: true
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    console.log('🖱️ 호버 종료');
    
    // 호버 상태만 변경 (isOn/isOff는 건드리지 않음)
    updateRiveState({
      nohover: true,
      hover: false
    });
  };

  const handleClick = () => {
    const newIsOn = !isOn;
    setIsOn(newIsOn);
    
    console.log(`🔄 토글 클릭: ${isOn ? 'ON' : 'OFF'} → ${newIsOn ? 'ON' : 'OFF'}`);
    
    // 상호 배타적으로 상태 설정 (하나만 true)
    if (newIsOn) {
      // ON 상태로 전환 → check_on 애니메이션 재생되어야 함
      console.log('🎯 목표: check_off → check_on 전환');
      console.log('📤 설정: isOn=true, isOff=false');
      updateRiveState({
        isOn: true,
        isOff: false
      });
    } else {
      // OFF 상태로 전환 → check_off 애니메이션 재생되어야 함
      console.log('🎯 목표: check_on → check_off 전환');
      console.log('📤 설정: isOn=false, isOff=true');
      updateRiveState({
        isOn: false,
        isOff: true
      });
    }
    
    // 전환 후 상태 확인을 위한 지연된 로깅
    setTimeout(() => {
      console.log(`🎬 예상 애니메이션: ${newIsOn ? 'check_on (체크 표시)' : 'check_off (빈 상태)'}`);
    }, 100);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
    }}>
      <h1 style={{
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '30px',
        color: '#333',
      }}>
        Rive State Machine 테스트 (State Machine 1)
      </h1>
      
      <div
        style={{
          width: '200px',
          height: '200px',
          borderRadius: '15px',
          overflow: 'hidden',
          backgroundColor: '#fff',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
          transition: 'transform 0.2s ease',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'scale(0.95)';
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {RiveComponent ? (
          <RiveComponent />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666',
          }}>
            Rive 로딩 중...
          </div>
        )}
      </div>

      <div style={{
        marginTop: '30px',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: '18px',
          fontWeight: '600',
          color: isOn ? '#4CAF50' : '#f44336',
          margin: '5px 0',
        }}>
          상태: {isOn ? 'ON (체크 표시)' : 'OFF (빈 상태)'}
        </div>
        <div style={{
          fontSize: '18px',
          fontWeight: '600',
          color: isHovered ? '#2196F3' : '#9E9E9E',
          margin: '5px 0',
        }}>
          호버: {isHovered ? '활성' : '비활성'}
        </div>
        <div style={{
          fontSize: '14px',
          color: rive ? '#4CAF50' : '#f44336',
          margin: '10px 0',
        }}>
          Rive 인스턴스: {rive ? '✅ 로드됨' : '❌ 로드되지 않음'}
        </div>
        <div style={{
          fontSize: '14px',
          color: correctStateMachine ? '#4CAF50' : '#f44336',
          margin: '5px 0',
        }}>
          State Machine: {correctStateMachine || '❌ 찾을 수 없음'}
        </div>
      </div>

      <div style={{
        marginTop: '20px',
        textAlign: 'left',
        fontSize: '12px',
        color: '#666',
      }}>
        <div>• 클릭: isOn/isOff 토글</div>
        <div>• 호버: hover/nohover 토글</div>
        <div>• State Machine이 명시적으로 재생됨</div>
        <div>• 개발자 도구에서 상세 로그 확인</div>
      </div>
    </div>
  );
} 