# NumPy broadcasting 축·메모리 계약

Topic: numpy25-broadcast-shape-contracts
Version: NumPy 2.5 manual snapshot 2026-10-02; deployed version separately
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://numpy.org/doc/stable/user/basics.broadcasting.html

<!-- evidence-sha256: a52bd4b606a9f50888c3a91a79bc747d1ac66dc40f22134e640380fcf077c08c -->

## 실행 계약과 진단

공식 원문을 직접 읽어 정리한 가상 진단 시나리오다. 각 행에는 위 제품·버전과 Sources가 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-NUMPY-SHAPE-001 | shape ValueError | 오른쪽부터 각 축 크기 | 동일 크기나 1 조건 위반 | 의도한 축 명시 | 호환·비호환 shape 확인 |
| SYN-NUMPY-SHAPE-002 | 행별 가중치가 열에 적용 | 입력·출력 shape | 1D 배열은 마지막 축 정렬 | 행 축에 singleton 추가 | 작은 행렬 기대값 비교 |
| SYN-NUMPY-SHAPE-003 | 예상보다 큰 결과 | 누락 축·singleton 축 | 양쪽 확장으로 외적 생성 | 출력 shape 먼저 계산 | 결과 원소 수 확인 |
| SYN-NUMPY-SHAPE-004 | 대량 비교 메모리 급증 | 중간 diff shape·bytes | 거대한 broadcast 중간 배열 | 관측별 외부 루프 검토 | 같은 결과·최대 메모리 비교 |
| SYN-NUMPY-SHAPE-005 | 거리 기준이 한 특성에 치우침 | 특성 스케일 | 단위 크기 차이 | 적절한 정규화 검토 | 정규화 전후 분류 비교 |

## 적용 한계

배포 버전과 구성은 실제 환경에서 확인한다. 조치는 진단 후보이며 운영 재현 결과가 아니다. 원문 수집 전체의 검토 또는 모델 가중치 학습 완료를 뜻하지 않는다.
