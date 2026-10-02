# Rust RefCell 동적 borrow·공유 상태 계약

Topic: languages/rust-refcell
Version: Current official Rust Book; runtime borrow checks; no installed-toolchain reproduction claimed
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://doc.rust-lang.org/book/ch15-05-interior-mutability.html

<!-- evidence-sha256: 571dea7d7f3f00b9d4fe715a68498c159d7d2db0c2c0d16040a0ffecce57a671 -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-REFCELL-001 | 두 번째 mutable borrow panic | 활성 RefMut guard | 동시 mutable borrow 위반 | guard 수명 분리 | 중첩·순차 borrow 비교 |
| SYN-REFCELL-002 | 읽기 중 변경 panic | 활성 Ref와 RefMut | 읽기·쓰기 borrow 중첩 | 읽기 guard 범위 종료 | 읽기 후 변경 확인 |
| SYN-REFCELL-003 | clone한 소유자 값도 바뀜 | Rc clone·동일 RefCell | 공유 ownership의 같은 데이터 | 독립 복사와 공유 의도 구분 | 각 owner 관측값 |
| SYN-REFCELL-004 | 공유 상태를 thread에 넣기 실패 | 공유 방식·trait bound | RefCell 공유 동기화 미제공 | thread-safe ownership 설계 | 컴파일·경합 조건 확인 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
