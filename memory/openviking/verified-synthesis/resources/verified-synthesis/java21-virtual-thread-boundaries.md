# Java 21 가상 스레드의 pinning과 자원 제한

Topic: Java virtual threads
Version: JDK 21 문서; 이후 JDK에는 그대로 일반화하지 않음
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://docs.oracle.com/en/java/javase/21/core/virtual-threads.html

<!-- evidence-sha256: 4506c0b04c1f95edfe896f28043b9d21e7afd5de0eb6354c90661ec01590e157 -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-JAVA-001 | I/O 동시성이 높은데 처리량이 낮음 | JFR VirtualThreadPinned와 모니터 보유 구간 | JDK 21의 긴 synchronized I/O가 carrier를 점유 | 빈번한 긴 임계구간만 재설계 | 동일 부하의 처리량과 pinned 이벤트 비교 |
| SYN-JAVA-002 | CPU 연산 응답이 빨라지지 않음 | CPU 포화와 작업의 I/O 비율 | 가상 스레드를 연산 가속으로 오해 | CPU 자원과 작업 분할을 별도 설계 | 동일 계산량의 지연과 CPU 사용 확인 |
| SYN-JAVA-003 | 가상 스레드 증가와 함께 메모리가 급증 | ThreadLocal 객체 수와 태스크 수 | 플랫폼 풀의 작은 수를 전제한 고비용 캐시 | 공유 가능한 불변 객체와 수명 정책 검토 | 태스크 수별 객체 수·heap 측정 |
| SYN-JAVA-004 | 가상 스레드에 맞춰 자원 풀을 무제한 확대 | 외부 연결 상한과 실제 동시 요청 | 스레드 수와 외부 시스템 수용량 혼동 | 외부 자원에 별도의 동시성 제한 | DB·API 상한을 넘지 않는지 부하 검증 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
