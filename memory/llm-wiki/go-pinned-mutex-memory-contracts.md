# Go 고정 sync.Mutex 코드·memory 계약

Topic: languages/go/mutex-public-contracts
Version: Go source commite873c5e9294d35f874ebad91602e273a0ae83af3; src/sync/mutex.go; local race detector not run
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://github.com/golang/go/blob/e873c5e9294d35f874ebad91602e273a0ae83af3/src/sync/mutex.go

<!-- evidence-sha256: adea39487d2ba731ee27b5be1526aff91b43e6292b9e2cafdbe1ca666ddef206 -->

## 공식 계약과 범위

고정 원문 SHA-256 3dec4264678744c4ce15a05ba0cc88e5e8b155f071b71d74eb7ed229ca72c114를 읽었다. zero value는 unlocked다. 처음 사용한 뒤 Mutex를 복사하지 않는다. Unlock은 후속 Lock과 memory ordering을 만들지만 실패한 TryLock은 그런 관계를 만들지 않는다. locked Mutex는 특정 goroutine 소유가 아니며 다른 goroutine이 Unlock하도록 설계할 수 있다. 현재 공개 wrapper는 internal/sync Mutex에 위임한다. 내부 fairness·starvation 구현을 이 파일에서 읽었다고 주장하지 않는다.

## 진단과 검증

공식 원문에서 도출한 가상 진단 사례다. 실제 공개 장애·운영 재현·모델 가중치 학습 결과로 집계하지 않는다. 모든 행에 위 Sources와 version 범위가 적용되며 조치·검증은 실행해야 할 후보 절차다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
| --- | --- | --- | --- | --- | --- |
| SYN-GO-MUTEX-CODE-001 | 복사된 lock으로 공유 데이터 경쟁 | 최초 사용 이후 value copy | 서로 다른 Mutex로 보호 | pointer·소유권 경계 검토 | copy 경로·race detector 검사 |
| SYN-GO-MUTEX-CODE-002 | TryLock 실패 뒤 데이터 읽기 경쟁 | false 반환·shared read | 실패는 동기화 관계 없음 | 읽기도 유효한 동기화 경로 사용 | 동일 공유 접근의 race 검사 |
| SYN-GO-MUTEX-CODE-003 | Unlock에서 runtime 오류 | lock 상태·호출 경로 | unlocked Mutex 해제 | 해제 소유·상태 흐름 대조 | 성공·중복 해제 fixture 구분 |
| SYN-GO-MUTEX-CODE-004 | 다른 goroutine 해제를 오류로 판단 | 잠금·인계·해제 순서 | goroutine 소유 제한 오인 | 실제 인계 계약 확인 | 동기화된 인계 완료 검사 |
| SYN-GO-MUTEX-CODE-005 | zero value 초기화 오인 | Mutex 생성·추가 상태 | unlocked 기본과 상태 혼동 | 공개 zero-value 계약 대조 | 초기 Lock·Unlock 확인 |
