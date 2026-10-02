# SciPy 1.18 BFGS 수렴·수치미분 계약

Topic: algorithms/optimization
Version: Official SciPy 1.18.0 Manual; workers added 1.16.0; local package unavailable
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://docs.scipy.org/doc/scipy/reference/optimize.minimize-bfgs.html

<!-- evidence-sha256: 37ae39379edb1e19ffdab6d5a2eab05dcd56d1df9f2cfaca3e878f6db69ec054 -->

## 공식 계약과 범위

gtol은 gradient norm 종료 기준이다. jac=None의 eps는 absolute forward-difference step이며 상대 step은 해당 jac 선택일 때 적용된다. 작은 step에 의한 xrtol 종료와 gradient 종료를 구분한다. c1,c2는 0<c1<c2<1이다. 단정도 numerical differentiation의 precision-loss에 gtol 완화를 검토할 수 있지만 요구 정확도가 충족됐다는 뜻은 아니다.

## 가상 진단 시나리오

아래는 공식 원문에서 도출한 가상 사례다. 운영 재현·실제 공개 이슈 해결·모델 가중치 학습 결과가 아니다. 모든 행에 Sources와 version 범위가 적용되며 조치·검증은 후보 절차다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
| --- | --- | --- | --- | --- | --- |
| SYN-SCIPY-BFGS-001 | precision-loss 종료 | dtype·jac·gtol | 수치미분 precision 부족 후보 | callable jac와 gtol 검토 | 기준 gradient·목적값 대조 |
| SYN-SCIPY-BFGS-002 | gradient 근사 차이 | jac=None·eps | absolute step 부적합 | eps 민감도 점검 | 기준 gradient 비교 |
| SYN-SCIPY-BFGS-003 | 상대 step 기대 불일치 | jac 방식·rel_step | step 공식 적용 범위 오해 | 상대 step 계약 대조 | 입력 scale별 근사 비교 |
| SYN-SCIPY-BFGS-004 | 작은 이동에서 조기 종료 | xrtol·iteration | step 종료 조건 | 허용오차와 convergence 조건 검토 | gradient·목적값도 확인 |
| SYN-SCIPY-BFGS-005 | line-search 설정 오류 | c1·c2 | 부등식 조건 위반 | 0<c1<c2<1 대조 | 설정 검사와 convergence 확인 |
| SYN-SCIPY-BFGS-006 | workers 옵션 version 불일치 | 설치 SciPy version | 1.16.0 이전 옵션 사용 | 실제 version 확인 | 지원 version의 numerical differentiation 호출 검사 |
