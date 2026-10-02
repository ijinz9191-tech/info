# Vue 3 watcher 의존성과 수명

Topic: vue3-watcher-lifetime-contracts
Version: Vue 3 guide snapshot 2026-10-02; onWatcherCleanup requires 3.5+
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://vuejs.org/guide/essentials/watchers

<!-- evidence-sha256: b13eccc3b1781dc5a1b8102c8c4f1e8cf081559390e506bd9c9e55848f7a58b2 -->

## 실행 계약과 진단

공식 원문을 직접 읽어 정리한 가상 진단 시나리오다. 각 행에는 위 제품·버전과 Sources가 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-VUE-WATCH-001 | 변경 감지 없음 | watch 첫 인자 | 숫자를 직접 전달 | getter 사용 | count 변경 시 callback 확인 |
| SYN-VUE-WATCH-002 | 이전 HTTP 응답이 덮어씀 | 요청 ID·완료 순서 | 무효화 요청 잔존 | cleanup에 abort 등록 | 연속 변경 결과 확인 |
| SYN-VUE-WATCH-003 | await 이후 의존성 미감지 | 접근 시점 | watchEffect 동기 추적만 적용 | 명시 source 또는 동기 접근 | 의존성별 변경 검사 |
| SYN-VUE-WATCH-004 | cleanup 등록 실패 | Vue 버전·await 위치 | 3.5 API 동기 계약 위반 | 동기 등록 또는 callback onCleanup 검토 | 무효화 시 정리 확인 |
| SYN-VUE-WATCH-005 | DOM 측정이 이전 값 | flush·DOM 시점 | 기본 callback은 소유 DOM 갱신 전 | flush post 검토 | 갱신 DOM 측정 확인 |
| SYN-VUE-WATCH-006 | 언마운트 후 watcher 잔존 | 생성 시점·stop handle | 비동기 생성은 소유 컴포넌트 미결합 | 반환 handle로 중단 | 언마운트 후 callback 확인 |

## 적용 한계

배포 버전과 구성은 실제 환경에서 확인한다. 조치는 진단 후보이며 운영 재현 결과가 아니다. 원문 수집 전체의 검토 또는 모델 가중치 학습 완료를 뜻하지 않는다.
