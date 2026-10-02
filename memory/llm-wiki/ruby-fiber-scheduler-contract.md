# Ruby Fiber 수명·scheduler 계약

Topic: ruby
Version: 3.4
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://docs.ruby-lang.org/en/3.4/Fiber.html

<!-- evidence-sha256: b642d61e3e079e289a3d467634a085114684f7239f652a940d48f667e6abae68 -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-RUBY-FIB-001 | Fiber.new 뒤 실행 없음 | resume 호출 여부 확인 | 생성만으로 실행 안 됨 | 명시적 resume 또는 적절한 scheduler 구성 | 실행 시작 확인 |
| SYN-RUBY-FIB-002 | dead fiber called | alive 상태·resume 횟수 확인 | 종료 후 재개 | 종료 수명 관리 | 종료 후 호출 오류 처리 |
| SYN-RUBY-FIB-003 | blocking false인데 동시 진행 안 됨 | 현재 thread scheduler 확인 | scheduler 미설정 | 계약을 구현하는 scheduler 설정 | I/O 대기 중 다른 작업 진행 |
| SYN-RUBY-FIB-004 | Fiber.schedule RuntimeError | scheduler 존재 확인 | scheduler 없음 | scheduler 초기화 후 schedule | 동일 thread 스케줄 확인 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
