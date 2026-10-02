# React external store snapshot 계약

Topic: react193-external-store-snapshot-contracts
Version: React documentation v19.3 snapshot 2026-10-02
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://react.dev/reference/react/useSyncExternalStore

<!-- evidence-sha256: c8fd382acf2b46d5f4528fab2e295791467de345fd070ea47fbcb24345f7805b -->

## 실행 계약과 진단

공식 원문을 직접 읽어 정리한 가상 진단 시나리오다. 각 행에는 위 제품·버전과 Sources가 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-REACT-STORE-001 | snapshot cached 오류·반복 render | getSnapshot 참조 | 변경 없어도 새 객체 | 불변 snapshot cache | 반복 호출 Object.is 확인 |
| SYN-REACT-STORE-002 | render마다 재구독 | subscribe 참조 | 함수 identity 매번 변경 | 안정된 subscribe 정의 | 구독·정리 호출 수 비교 |
| SYN-REACT-STORE-003 | 서버 render 오류 | getServerSnapshot | 서버 snapshot 누락 | SSR 계약 추가 | 서버 render 확인 |
| SYN-REACT-STORE-004 | hydration snapshot 불일치 | 서버·클라이언트 초기값 | 초기 snapshot 전달 불일치 | 같은 초기 데이터 전달 | hydration 결과 확인 |
| SYN-REACT-STORE-005 | transition이 blocking 재시작 | DOM 전 재조회 | 외부 store가 render 중 변경 | store mutation·일관성 계약 검토 | 동시 변화 화면 버전 확인 |

## 적용 한계

배포 버전과 구성은 실제 환경에서 확인한다. 조치는 진단 후보이며 운영 재현 결과가 아니다. 원문 수집 전체의 검토 또는 모델 가중치 학습 완료를 뜻하지 않는다.
