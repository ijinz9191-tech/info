# React Effect 의존성·cleanup·서버 경계

Topic: frameworks/react-effects
Version: Current React reference; StrictMode extra cycle development-only; deployed version must match
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://react.dev/reference/react/useEffect

<!-- evidence-sha256: 089231dea0337af5a0df4365088d05f1f77455544e0143e30235c4ad2f7c2654 -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-EFFECT-001 | 개발에서 setup 추가 실행 | StrictMode·cleanup | 개발 stress cycle | setup을 되돌리는 cleanup | setup-cleanup-setup 비교 |
| SYN-EFFECT-002 | commit마다 재연결 | dependency 배열 | 배열 누락 | 실제 reactive 값 선언 | 입력별 실행 횟수 |
| SYN-EFFECT-003 | 객체 dependency로 반복 | Object.is 비교 | 매 render 새 참조 | 불필요 객체 의존 제거 | 참조·실행 비교 |
| SYN-EFFECT-004 | 무한 재실행 | state 갱신·dependency 변화 | state가 dependency 변경 | 외부 동기화와 상태 설계 점검 | 지속 cycle 제거 |
| SYN-EFFECT-005 | unmount 전 cleanup | dependency 변경 | 이전 setup 정리 | setup과 cleanup 대칭 | 변경·unmount 모두 확인 |
| SYN-EFFECT-006 | tooltip 위치 깜박임 | paint·Effect 순서 | visual 처리 지연 | 필요한 useLayoutEffect 검토 | paint 시점 관찰 |
| SYN-EFFECT-007 | 서버에서 Effect 데이터 없음 | SSR·client 실행 | Effect는 client 전용 | 서버 데이터 경로 설계 | 초기 HTML·client 결과 비교 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
