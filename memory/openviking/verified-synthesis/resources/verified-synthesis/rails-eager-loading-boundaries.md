# Rails Active Record N+1·join·strict loading

Topic: Ruby on Rails Active Record
Version: 현재 Rails Guide; Rails 버전·adapter별 SQL 확인
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://guides.rubyonrails.org/active_record_querying.html

<!-- evidence-sha256: 3ecade95f5bc67273a3540aabac4cf9e603ef1e379e1fdcb06f87c09dd9564a0 -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-RAILS-001 | 목록 크기만큼 연관 SQL이 증가 | SQL 수와 association 접근 위치 | lazy loading의 N+1 | includes·preload·eager_load를 목적에 맞게 선택 | 입력 크기 변화에서 쿼리 수와 결과 확인 |
| SYN-RAILS-002 | includes와 조건 추가 뒤 부모 결과가 달라짐 | 생성 SQL·LEFT OUTER JOIN·조건 | 조건이 eager loading query 방식에 영향 | 필터와 로딩 의도를 구분하고 SQL 검토 | 연관 없는 부모·조건 일치 부모 결과 검사 |
| SYN-RAILS-003 | preload에 연관 조건을 넣어 실패 | preload query와 조건 대상 | 별도 association query 계약과 join 조건 혼동 | 적합한 join과 loading 조합 선택 | SQL 실행과 필요한 association 접근 확인 |
| SYN-RAILS-004 | eager loading했는데 일부 lazy load가 남음 | StrictLoadingViolationError와 접근 association | 중첩 관계 로딩 누락 | strict_loading 범위와 필요한 관계 명시 | 정상 요청에서 lazy load 위반 없이 처리 확인 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
