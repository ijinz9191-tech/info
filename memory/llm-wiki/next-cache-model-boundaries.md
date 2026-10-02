# Next.js 이전 캐시 모델 적용 경계

Topic: nextjs
Version: 16.3.8 문서; cacheComponents 비활성
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://nextjs.org/docs/app/guides/caching-without-cache-components

<!-- evidence-sha256: 2c187b46a5d070adc3c26a8de93eebe6e8068c03d45e5a2f336b6af9b9cd8279 -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-NEXT-001 | fetch가 매 요청 실행 | fetch cache 옵션 확인 | 기본 비캐시 | 적합한 데이터에 force-cache 명시 | 원본 요청 횟수 비교 |
| SYN-NEXT-002 | DB 조회가 반복 실행 | fetch 이외 함수 경로 확인 | fetch 옵션으로 DB 함수 캐시 불가 | 적절한 unstable_cache 경계 구성 | 반복 조회 횟수 검증 |
| SYN-NEXT-003 | 캐시 설정이 무효로 보임 | force-dynamic·segment 설정 확인 | 동적 강제 설정의 no-store 효과 | 라우트·요청 설정 일관화 | 설정별 요청 횟수 비교 |
| SYN-NEXT-004 | 버전 전환 후 캐시 기대 불일치 | cacheComponents 설정 확인 | 이전 모델 가이드 범위 밖 | 활성 모델의 공식 문서 적용 | 해당 모델로 통합 검증 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
