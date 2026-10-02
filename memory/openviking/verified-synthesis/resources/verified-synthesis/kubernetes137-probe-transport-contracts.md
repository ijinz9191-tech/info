# Kubernetes probe 전송·성공 판정 경계

Topic: cncf/kubernetes/probe-transport
Version: Kubernetes live doc updated 2026-06-30; gRPC stable 1.27; h2c/TLS probe features 1.37 alpha disabled by default
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/

<!-- evidence-sha256: d20a3170e1e7f72fa5884306a3a899c89b6a1177fa8d877b4907a1de7c3be74d -->

## 공식 계약과 범위

HTTP200–399와 TCP socket 연결 성공은 업무 전체 정상과 다르다. gRPC probe는 숫자 port를 요구한다. 현재 문서의 h2c·gRPC TLS는 v1.37 alpha이며 기본 비활성이라 stable 일반 기능으로 적용하지 않는다. readiness 시간 조건은 liveness와 독립적으로 점검한다. Spring 느린 시작·외부 의존성 재시작 사례와 동일한 행을 반복하지 않는다. cluster 실행은 수행하지 않았다.

## 진단과 검증

공식 원문에서 도출한 가상 진단 사례다. 실제 공개 장애·운영 재현·모델 가중치 학습 결과로 집계하지 않는다. 모든 행에 위 Sources와 version 범위가 적용되며 조치·검증은 실행해야 할 후보 절차다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
| --- | --- | --- | --- | --- | --- |
| SYN-K8S-PROBE-001 | redirect도 성공 | HTTP status | 200–399 성공 계약 | endpoint 응답 의미 점검 | 정상·실패 응답 비교 |
| SYN-K8S-PROBE-002 | 장애인데 TCP 정상 | socket 연결·업무 응답 | 연결만 검사 | 업무 health 계약 검토 | 연결·업무 상태 대조 |
| SYN-K8S-PROBE-003 | gRPC named port 오류 | probe port | named port 미지원 | 숫자 port 계약 확인 | 해당 endpoint 응답 검사 |
| SYN-K8S-PROBE-004 | h2c 설정 사라짐 | 저장된 Pod·feature gate | 비활성 alpha gate의 필드 제거 | 실제 버전·gate 적용 확인 | 저장 spec·요청 protocol 검사 |
| SYN-K8S-PROBE-005 | readiness 실행 기대 차이 | initialDelay·startupProbe | liveness와 독립 시간 조건 | 지연 계약 확인 | 시간별 probe 이벤트 대조 |
