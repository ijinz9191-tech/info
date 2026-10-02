# Nim 2.2.12 메모리 모드와 async cycle 계약

Topic: languages/nim
Version: Official documentation 2.2.12; no local compiler execution
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://nim-lang.org/docs/mm.html

<!-- evidence-sha256: aeb9fe58d6c387d567038dc556be51b136823343125fec068122aa673d5023b9 -->

## 공식 계약

Nim 2.2.12 문서는 ORC를 기본으로 설명한다. ARC는 cycle collector를 제외하며 기본 async 구현의 cycle은 ARC에서 누수 원인이 된다. --mm:none은 자동 회수를 제공하지 않는다. JS target은 JavaScript GC를 사용한다. 이를 서로 다른 backend의 동일 동작으로 일반화하지 않는다.

## 가상 진단 시나리오

아래는 공식 계약에서 도출한 가상 사례이며 실제 운영 재현 결과가 아니다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
| --- | --- | --- | --- | --- | --- |
| SYN-NIM-MM-001 | async 반복 후 메모리 증가 | compiler 버전과 mm:arc 옵션, cycle lifetime | 기본 async cycle의 ARC 회수 누락 | 같은 workload를 ORC로 비교 | 요청 완료 후 사용량 추세와 생존 object 비교 |
| SYN-NIM-MM-002 | 할당이 회수되지 않음 | mm:none 빌드 설정과 수동 해제 경로 | 자동 관리 없는 모드 선택 | ownership 계약과 적합한 MM 선택 | 동일 반복 부하에서 할당과 해제 균형 확인 |
| SYN-NIM-MM-003 | RC 최적화 기대와 성능 차이 | expandArc 출력, 함수별 timing | 실제 생성된 RC 연산 차이 | 측정된 hot function과 생성 코드 검토 | 같은 입력에서 latency와 정확성 비교 |
| SYN-NIM-MM-004 | JS와 native 메모리 곡선이 다름 | target, runtime GC, MM 설정 | JS target GC를 native ORC와 혼동 | backend 별 관찰 기준 분리 | 동일 logical lifetime과 backend별 회수 추세 확인 |
