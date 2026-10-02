# TanStack Query 캐시 경계

Topic: tanstack-query
Version: v5 현재 공식 문서
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults

<!-- evidence-sha256: 7cd6a86adeb4528a82b9991ffbcb0753e9697918ebe0b816a0829be1c17c6a8e -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-TAN-001 | 포커스마다 재조회 | staleTime·focus 설정 확인 | 기본 stale 판정 | 업무 신선도에 맞춰 설정 | 포커스 전후 요청 비교 |
| SYN-TAN-002 | invalidate 후 갱신 없음 | staleTime static 여부 확인 | static은 수동 무효화도 차단 | Infinity와 static 계약에 맞게 선택 | 무효화 후 조회 확인 |
| SYN-TAN-003 | 캐시가 사라짐 | inactive 시간·gcTime 확인 | 비활성 캐시 수거 | staleTime과 gcTime 구분 조정 | 재마운트 요청 확인 |
| SYN-TAN-004 | 비JSON 값 참조 변경 | 결과 타입·참조 비교 | 기본 structural sharing 범위 밖 | 필요 시 사용자 비교 함수 | 동일 결과 참조·렌더 확인 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
