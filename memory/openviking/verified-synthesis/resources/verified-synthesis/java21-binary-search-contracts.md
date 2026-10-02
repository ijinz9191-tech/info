# Java Arrays binarySearch 조건·결과 계약

Topic: java21-binary-search-contracts
Version: Java SE 21 Arrays API
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Arrays.html

<!-- evidence-sha256: 7401fd4b69fe3f6ce20647090164c7d58ba1b08ffbcd82c43d73fd553fcd1d98 -->

## 실행 계약과 진단

공식 원문을 직접 읽어 정리한 가상 진단 시나리오다. 각 행에는 위 제품·버전과 Sources가 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-JAVA-BSEARCH-001 | 탐색 결과 불안정 | 정렬 상태·comparator | 동일 순서로 정렬 안 됨 | 탐색 comparator와 정렬 일치 | 정렬·검색 key 검사 |
| SYN-JAVA-BSEARCH-002 | 중복 key 첫 index 예상 실패 | duplicate 범위 | 어느 중복값인지 보장 없음 | 필요한 경계 탐색 별도 설계 | 모든 동일 key 범위 확인 |
| SYN-JAVA-BSEARCH-003 | 미발견 음수를 index로 사용 | return 값 | insertion encoding 오인 | 음수는 -result-1 해석 | 앞·중간·끝 삽입 위치 확인 |
| SYN-JAVA-BSEARCH-004 | 마지막 range 원소 검색 안 됨 | fromIndex·toIndex | toIndex는 exclusive | 반열린 범위로 설계 | 경계 key 검사 |
| SYN-JAVA-BSEARCH-005 | NaN 검색과 == 결과 차이 | double key·NaN | API는 NaN들을 동등 취급 | API 비교 계약 사용 | NaN·일반값 검색 비교 |

## 적용 한계

배포 버전과 구성은 실제 환경에서 확인한다. 조치는 진단 후보이며 운영 재현 결과가 아니다. 원문 수집 전체의 검토 또는 모델 가중치 학습 완료를 뜻하지 않는다.
