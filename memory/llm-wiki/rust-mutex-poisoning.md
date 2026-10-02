# Rust Mutex poisoning과 불변식 복구

Topic: Rust std::sync::Mutex
Version: 공식 std 1.99.0 표시; 설치 툴체인 적용성 별도 확인
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://doc.rust-lang.org/std/sync/struct.Mutex.html

<!-- evidence-sha256: 6b06ddab3b435f0c6fec6fe52cb7687e1660c15b0daff7d720987455e44dd674 -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-RS-001 | 다른 스레드 panic 뒤 lock unwrap도 panic | 최초 panic과 PoisonError 발생 위치 | 보호 데이터 불변식 손상 가능성 | 실패 전파 또는 명시적 불변식 복구 | 복구 후 데이터 조건과 후속 접근 검사 |
| SYN-RS-002 | PoisonError를 무시하니 손상 상태가 사용됨 | 복구 전 보호 데이터의 업무 불변식 | into_inner가 자동 복구한다고 오해 | guard 획득 뒤 실제 데이터를 검사·복구 | 의도적 panic 후 불변식 성립 확인 |
| SYN-RS-003 | poison되지 않았으니 unsafe 접근이 안전하다고 가정 | panic context·외부 예외·포인터 수명 | poisoning을 메모리 안전성 증명으로 사용 | unsafe 안전 조건을 독립적으로 증명 | poison 상태에 의존하지 않는 수명·alias 검토 |
| SYN-RS-004 | 공유 데이터 접근 중 대기가 늘어남 | guard 보유 시간과 다른 스레드 대기 | 불필요하게 긴 임계구간 | RAII guard의 수명을 필요한 범위로 제한 | 정확성 유지와 대기 시간 비교 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
