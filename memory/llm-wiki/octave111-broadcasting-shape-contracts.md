# GNU Octave broadcasting 축·함수·성능 계약

Topic: languages/octave/broadcasting
Version: GNU Octave11.1.0 manual; automatic broadcasting since 3.6.0; no local runtime or benchmark
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://docs.octave.org/latest/Broadcasting.html

<!-- evidence-sha256: 6565e19edffbc9ab37df20ae9218319ab5f4375e641fcef84939cffdc4e8fd76 -->

## 공식 계약과 범위

대응 차원은 같거나 한쪽이 1이어야 하며 누락 trailing dimension은 1로 해석한다. row·column 벡터가 행렬로 확장될 수 있다. bsxfun 함수는 같은 길이 column vector 쌍 또는 column/scalar를 받는 계약이 필요하다. broadcast 후 합산이 matrix product와 동등한 경우 중간 배열을 피하는 구현을 검토할 수 있지만 실제 값·성능을 비교해야 한다. 로컬 benchmark 결과가 아니다.

## 진단과 검증

공식 원문에서 도출한 가상 진단 사례다. 실제 공개 장애·운영 재현·모델 가중치 학습 결과로 집계하지 않는다. 모든 행에 위 Sources와 version 범위가 적용되며 조치·검증은 실행해야 할 후보 절차다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
| --- | --- | --- | --- | --- | --- |
| SYN-OCTAVE-BC-001 | nonconformant arguments | 대응 dimension | 양쪽 비singleton 불일치 | shape 확인 | 정상·불일치 shape 검사 |
| SYN-OCTAVE-BC-002 | 벡터 대신 NxN 결과 | row·column 방향 | 양쪽 singleton 확장 | 의도한 orientation 확인 | output size·원소 비교 |
| SYN-OCTAVE-BC-003 | RGB scale 축 오류 | m×n×3·scale shape | dimension 대응 오인 | permute 축 검토 | 채널별 값 검사 |
| SYN-OCTAVE-BC-004 | bsxfun 함수 실패 | 함수의 vector 입력 지원 | scalar만 처리 | 함수 입력 계약 수정 검토 | vector·scalar 조합 검사 |
| SYN-OCTAVE-BC-005 | broadcast 구현 느림 | 3D 중간 결과·sum | matrix product를 우회 | 동등한 matrix multiply 검토 | 값·시간·메모리 비교 |
| SYN-OCTAVE-BC-006 | 고차원 결과 예상 차이 | trailing dimension | 누락 축을 1로 해석 | 전체 shape 명시 | dimension별 출력 검사 |
