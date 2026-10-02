# Go 파이프라인의 취소·채널 종료·메모리 상한

Topic: Go channels and goroutines
Version: Go 공식 2014 pipeline 글; context 적용은 별도 명세 참조
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://go.dev/blog/pipelines

<!-- evidence-sha256: 6fc3c09696cf92ed8bf208bfcaff6d976a9446ff11b3b7caca97a2c385f5e0e2 -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-GO-001 | 소비자가 일찍 종료한 뒤 goroutine이 남음 | goroutine stack의 channel send 대기 | upstream 종료 신호 없음 | done 채널 종료와 select 취소 경로 | 중도 종료 후 goroutine 수 회복 |
| SYN-GO-002 | 버퍼 확대로 누수를 숨겼다가 다시 멈춤 | 입력 수와 실제 소비 수 | 고정 버퍼가 남은 입력을 모두 감당한다고 가정 | 명시적 취소·backpressure 계약 | 입력량·소비량 변화에서 종료 검사 |
| SYN-GO-003 | fan-in 채널 close 후 panic | sender 완료와 close 순서 | 공유 출력이 너무 일찍 닫힘 | 모든 sender 완료 뒤 단일 소유자가 close | 순서 변동·실패 주입에서 panic 없음 |
| SYN-GO-004 | 파일 수가 많을 때 메모리 급증 | 동시 파일 read 수와 파일 크기 | 파일마다 무제한 goroutine과 buffer 생성 | 고정 worker 수로 동시 읽기 제한 | 대량 입력에서 메모리 상한과 정확성 측정 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
