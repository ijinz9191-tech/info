# Racket 계약 경계·wrapper·blame 진단

Topic: languages/racket
Version: Official Racket Guide living documentation read 2026-10-02; exact installed release not verified
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://docs.racket-lang.org/guide/contract-boundaries.html
- https://docs.racket-lang.org/guide/contracts-gotchas.html

<!-- evidence-sha256: 771f3e7000bdaf8fec7e7535715ac7898a3e837491ec0ae95d6853633db4abae -->

## 공식 계약과 범위

contract-out은 모듈 경계를 감시한다. 숫자 전용 predicate만 쓰면 다른 타입에서 predicate 오류가 발생할 수 있어 number?와 and/c를 조합한다. 함수 wrapper는 eq? identity 관측에 영향을 준다. define/contract의 실제 경계와 blame 대상은 호출자 직관과 다를 수 있다. 공식 guide의 mutable export 사례는 설치 버전의 수정 여부를 확인하지 않았다.

## 가상 진단 시나리오

공식 계약에서 도출한 가상 사례다. 실제 공개 이슈 해결·운영 재현으로 세지 않는다. 모든 행에 위 버전과 Sources가 적용된다. 조치 후 검증은 수행해야 할 절차이며 실행 결과가 아니다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
| --- | --- | --- | --- | --- | --- |
| SYN-RACKET-CONTRACT-001 | 계약 검사 대신 predicate 타입 오류 | positive? 입력 타입과 contract 조합 | 숫자 전용 predicate를 모든 값에 적용 | number?와 positive?를 and/c로 조합 | 숫자·symbol·비양수의 계약 오류 비교 |
| SYN-RACKET-CONTRACT-002 | 같은 함수처럼 보이는데 eq? false | contract-out wrapper와 비교 값 | wrapper identity를 함수 행동 동일성과 혼동 | 계약 값의 identity 의존 설계 검토 | 행동과 identity 가정을 별도로 검증 |
| SYN-RACKET-CONTRACT-003 | 직접 호출 함수 대신 top-level blame | define/contract 경계와 freevar 경로 | 함수 사이 직접 계약이 없는 중개 경계 | 모듈 경계 또는 #:freevar 계약 검토 | 잘못된 인수 fixture의 blame 대상 확인 |
| SYN-RACKET-CONTRACT-004 | recursive contract 정의 시 undefined | contract 조합 인수의 eager 평가 | 정의 전 자기 identifier 참조 | recursive-contract로 평가 지연 | 정의 성공과 실제 위반 감지를 함께 확인 |
| SYN-RACKET-CONTRACT-005 | mutable export 변화가 client에 안 보임 | set! 위치, contract-out, 버전 | guide가 설명한 export snapshot 경로 후보 | 변수 직접 export 대신 accessor 검토 | 해당 버전에서 변경 후 getter 값 확인 |
