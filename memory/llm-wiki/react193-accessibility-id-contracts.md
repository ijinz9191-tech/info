# React 19.3 접근성 ID·list·cache 경계

Topic: frameworks/react
Version: Official React documentation v19.3 snapshot; no browser execution
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://react.dev/reference/react/useId

<!-- evidence-sha256: 6b8f7a0bb0acfac9c2820c43d84285ee3b60a2dba1e4d2c7e572f563a244854c -->

## 공식 계약과 범위

useId는 접근성 연결용 ID다. 호출별 component ID이며 list key 또는 use() cache key는 데이터에서 만들어야 한다. mount 중 안정성이 모든 render의 cache key 안정성을 뜻하지 않는다. 조건·반복 내부 호출 및 async Server Component 사용 제한을 구분한다.

## 가상 진단 시나리오

아래는 공식 원문에서 도출한 가상 사례다. 운영 재현·실제 공개 이슈 해결·모델 가중치 학습 결과가 아니다. 모든 행에 Sources와 version 범위가 적용되며 조치·검증은 후보 절차다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
| --- | --- | --- | --- | --- | --- |
| SYN-REACT-ID-001 | 반복 폼의 설명 연결 오류 | 중복 DOM ID·aria-describedby | 고정 ID 재사용 | 인스턴스별 useId 연결 | 반복 폼의 접근성 관계 검사 |
| SYN-REACT-ID-002 | 목록 식별 불안정 | key 생성 위치 | useId를 목록 key로 사용 | 데이터의 안정적 key 사용 | 재정렬 후 항목 상태 확인 |
| SYN-REACT-ID-003 | use() cache 식별 불일치 | render별 cache key | 생성 ID를 cache key로 사용 | 데이터 기반 cache key 사용 | 동일 입력의 cache 일관성 확인 |
| SYN-REACT-ID-004 | Hook 순서 오류 | 조건·반복 내부 호출 | 최상위 호출 계약 위반 | 하위 component로 분리 | 조건 전환 후 오류 확인 |
| SYN-REACT-ID-005 | async server component 사용 실패 | async 선언·useId 호출 | 해당 API 지원 제한 | 호출 경계 재설계 | 대상 구성 빌드·접근성 검사 |
