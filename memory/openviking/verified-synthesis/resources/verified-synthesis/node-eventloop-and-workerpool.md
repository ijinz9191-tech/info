# Node.js event loop·정규식·worker pool 병목

Topic: Node.js runtime
Version: 현재 공식 Learn 문서; Node 버전별 성능 측정 필요
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://nodejs.org/learn/asynchronous-work/dont-block-the-event-loop

<!-- evidence-sha256: 48c1fd824c1423c7f2a7889f336c4fdc2c1a5e70ac1a4568e11cb3c086bbe05d -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-NODE-001 | 특정 입력 뒤 모든 요청이 오래 대기 | event-loop 지연과 정규식 실행 시간 | 정규식의 최악 불일치 경로 | 입력 상한·단순 매칭·안전한 패턴 검토 | 길이별 불일치 입력의 시간 증가 측정 |
| SYN-NODE-002 | 서버 요청 경로에서 동기 I/O 때문에 지연 | sync API 호출과 요청 구간 trace | 파일·압축·암호화 동기 작업이 loop 점유 | 비동기 API 또는 적절한 작업 분리 | 다른 요청의 지연이 개선되는지 확인 |
| SYN-NODE-003 | 비동기 API인데 완료 대기가 큼 | worker pool 대기와 장기 작업 수 | pool 포화 또는 큰 작업의 독점 | 작업 분할·동시성 제한과 원인 측정 | 처리량·큐 대기·CPU 함께 비교 |
| SYN-NODE-004 | 정규식 엔진 교체 후 결과가 달라짐 | 패턴 기능과 기존 결과 fixture | RE2와 V8 기능 계약 차이 | 엔진 교체 전 호환성 검토 | 정상·경계·불일치 입력 회귀 확인 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
