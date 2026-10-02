# Falco exception tuple·연산자·override 계약

Topic: cncf/falco/rule-exceptions
Version: Falco exception support 0.28.0+; docs updated 2025-10-22; current engine version unverified
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://falco.org/docs/concepts/rules/exceptions/

<!-- evidence-sha256: 63cbc75e79c6eea89c0dac122529c85dce302572a0db259dcfcd928c16f5b4a4 -->

## 공식 계약과 범위

fields·comps·value tuple는 위치별로 대응한다. list fields의 생략 comps는 =, 단일 field는 in 기본이다. set을 나타내는 value item에는 list 구조가 필요하다. override append는 기존 예외를 유지하고 replace는 해당 예외 값을 교체한다. process 하나만 과도하게 제외하지 말고 actor와 target 범위를 함께 검토한다. Falco loader·이벤트 실행은 수행하지 않았다.

## 진단과 검증

공식 원문에서 도출한 가상 진단 사례다. 실제 공개 장애·운영 재현·모델 가중치 학습 결과로 집계하지 않는다. 모든 행에 위 Sources와 version 범위가 적용되며 조치·검증은 실행해야 할 후보 절차다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
| --- | --- | --- | --- | --- | --- |
| SYN-FALCO-EXC-001 | 예외 적용 오류 | fields·comps·tuple 길이 | 위치 대응 위반 | 각 열 정렬 확인 | loader·통제 이벤트 검사 |
| SYN-FALCO-EXC-002 | set 예외 기대 차이 | in·value item 타입 | list 구조 오인 | set 값을 list로 표현 | 포함·비포함 이벤트 비교 |
| SYN-FALCO-EXC-003 | 경보 과도 누락 | actor·target 범위 | process만 예외 처리 | 대상 조건 함께 제한 | 허용·비허용 target 검사 |
| SYN-FALCO-EXC-004 | 기존 예외 사라짐 | override replace | 값 교체 계약 | append·replace 의도 확인 | 이전·새 예외 비교 |
| SYN-FALCO-EXC-005 | comps 생략 결과 차이 | fields list·single | 기본 연산자 차이 | 명시 operator 검토 | 입력 구조별 평가 비교 |
