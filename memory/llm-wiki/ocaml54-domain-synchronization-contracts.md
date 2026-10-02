# OCaml domain·C binding·원자 연산

Topic: ocaml54-domain-synchronization-contracts
Version: OCaml 5.4 manual; domainslib example 0.5.0
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://ocaml.org/manual/5.4/parallelism.html

<!-- evidence-sha256: 3957d156590212693cdf33dcc71c280b305c999941f1f5908b7c871e41c83b0c -->

## 실행 계약과 진단

공식 원문을 직접 읽어 정리한 가상 진단 시나리오다. 각 행에는 위 제품·버전과 Sources가 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-OCAML-DOMAIN-001 | domain 할당 실패 | spawn 수·재귀 | 각 재귀마다 domain 생성 | bounded pool로 task 분리 | 동시 domain 수 확인 |
| SYN-OCAML-DOMAIN-002 | 작은 작업 병렬화 느림 | 작업 크기·overhead | 생성·조정 비용 우세 | 작은 입력은 순차 처리 | 크기별 시간 비교 |
| SYN-OCAML-DOMAIN-003 | 카운터 증가 손실 | shared ref·읽기 쓰기 | non-atomic 증가 race | Atomic 증가 또는 mutex | 기대 최종 count 확인 |
| SYN-OCAML-DOMAIN-004 | C 전역 상태 race | binding global·domain 수 | 기존 runtime lock 가정 | C 공유 상태 동기화 | 다중 domain 접근 검토 |
| SYN-OCAML-DOMAIN-005 | CAS 실패 뒤 갱신 누락 | CAS 반환값·경합 | 실패를 성공으로 취급 | 현재값 재조회·retry 검토 | 동시 push/pop 결과 확인 |

## 적용 한계

배포 버전과 구성은 실제 환경에서 확인한다. 조치는 진단 후보이며 운영 재현 결과가 아니다. 원문 수집 전체의 검토 또는 모델 가중치 학습 완료를 뜻하지 않는다.
