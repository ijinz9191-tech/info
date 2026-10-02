# etcd 용량·압축·defrag 경계

Topic: etcd
Version: 3.6 공식 문서
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://etcd.io/docs/v3.6/op-guide/maintenance/

<!-- evidence-sha256: 20693628f8e055571434ea00f4bd2ab5967546114689d699afed0c754cfc9969 -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-ETCD-001 | 삭제·compact 후 디스크 공간 미회수 | 전체 DB 크기와 in-use 크기 비교 | 내부 fragmentation | 백업·가용성 고려하여 member별 defrag 계획 | 파일 크기와 서비스 정상 확인 |
| SYN-ETCD-002 | defrag 중 읽기·쓰기 지연 | 실행 member와 지연 시점 확인 | live member 재구성 중 차단 | 운영 창과 순차 member 계획 | 각 member 정상·지연 회복 확인 |
| SYN-ETCD-003 | NOSPACE 이후 write 거부 | alarm·quota·각 member 크기 확인 | 클러스터 maintenance mode | 공간 확보·defrag 후 alarm 해제 계획 | alarm과 write 정상 확인 |
| SYN-ETCD-004 | 과거 revision 읽기 실패 | requested revision·compaction revision 비교 | 보존 범위 밖 이력 삭제 | watch·읽기 복구 계약과 보존 창 설계 | 느린 소비자 복구 검증 |
| SYN-ETCD-005 | NoSpace 오류인데 데이터 기록 존재 | 실제 key·Txn 결과 readback | API와 Apply quota 검사 차이 | 오류만으로 미기록 단정하지 말고 상태 확인 | 실제 기록·재시도 부작용 비교 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
