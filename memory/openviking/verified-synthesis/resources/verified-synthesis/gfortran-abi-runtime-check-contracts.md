# GNU Fortran ABI·배열·런타임 검사 경계

Topic: languages/fortran/code-generation
Version: Living GNU Fortran code-generation manual read 2026-10-02; exact compiler release and local execution unverified
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://gcc.gnu.org/onlinedocs/gfortran/Code-Gen-Options.html

<!-- evidence-sha256: ab4240a0bd1586ef38b739cf5577bfa0aaf81a9bdb9b4aa522604f506d777db9 -->

## 공식 계약과 범위

-ff2c는 기본 REAL·COMPLEX 반환 ABI를 바꾼다. symbol 일치와 link 성공은 호출 ABI 일치를 보장하지 않으며 bind(C)가 더 견고한 경로다. bounds 검사의 일부는 main도 해당 flag로 컴파일해야 한다. array-temps 경고는 위치별 한 번이어서 할당 횟수가 아니다. recursion 검사는 OpenMP에서 동작하지 않으며 -frecursive/-fopenmp와 함께 비활성이다. -fstack-arrays는 unknown-size 배열과 temporary를 stack에 두고 -Ofast에서 조건부 기본이 된다. 원문 flag의 정확한 설치 버전 적용성을 확인해야 한다. 컴파일러·업무 실행은 수행하지 않았다.

## 진단과 검증

공식 원문에서 도출한 가상 진단 사례다. 실제 공개 장애·운영 재현·모델 가중치 학습 결과로 집계하지 않는다. 모든 행에 위 Sources와 version 범위가 적용되며 조치·검증은 실행해야 할 후보 절차다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
| --- | --- | --- | --- | --- | --- |
| SYN-GFORTRAN-CODEGEN-001 | link 성공 뒤 반환 값 손상 | 양쪽 object flag·REAL/COMPLEX 반환 | ff2c와 기본 ABI 혼용 | FFI 선언·컴파일 ABI 일치 검토 | 격리된 반환 값·호출 규약 fixture 비교 |
| SYN-GFORTRAN-CODEGEN-002 | 이름 일치인데 FFI 실패 | symbol·argument·길이·반환 규약 | 이름만 같고 ABI가 다름 | bind(C)와 interoperable 선언 검토 | 형식·호출 양방향 최소 예제 검사 |
| SYN-GFORTRAN-CODEGEN-003 | 일부 bounds 오류 미탐지 | main·각 unit의 compile flag | 검사 instrumentation 누락 후보 | main 포함 build flag 대조 | 범위 내·밖 fixture의 검사 결과 확인 |
| SYN-GFORTRAN-CODEGEN-004 | temporary 횟수가 경고보다 많음 | 경고 위치·호출 빈도 | 위치별 1회 경고를 계수로 오인 | 경고와 allocation 측정 구분 | 동일 위치 반복 호출과 profiling 대조 |
| SYN-GFORTRAN-CODEGEN-005 | recursion 검사 기대 불일치 | OpenMP·frecursive·fopenmp | 검사 지원 조건 밖 | 실제 flag와 실행 모델 대조 | 지원 조건의 작은 fixture 검사 |
| SYN-GFORTRAN-CODEGEN-006 | Ofast에서 큰 배열 실행 실패 | stack 한도·temporary·최적화 flag | stack 배치로 용량 초과 후보 | 배열 배치와 한도 검토 | 동일 입력의 메모리·결과 비교 |
