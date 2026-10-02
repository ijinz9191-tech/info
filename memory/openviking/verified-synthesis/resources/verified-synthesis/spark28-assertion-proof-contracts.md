# Ada SPARK assertion·runtime·proof 경계

Topic: languages/ada-spark/assertions
Version: SPARK Users Guide 28.0w; Assert Ada2005, named Assertion_Policy Ada2012; Disable is GNAT-specific; no proof run
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://docs.adacore.com/spark2014-docs/html/ug/en/source/assertion_pragmas.html

<!-- evidence-sha256: 87d68e3c6d8f327c336646799dfc44428e2e163e38ce0d2c0c7588c7af9b4ddd -->

## 공식 계약과 범위

GNAT 기본 compilation은 assertion을 무시한다. Check/Ignore는 GNATprove 분석을 바꾸지 않지만 GNAT의 Disable은 분석도 제외한다. 앞 assertion에서 중단한다는 가정으로 뒤 assertion이 증명될 수 있으므로 일부 proved 메시지만으로 모든 obligation을 통과했다고 판단하지 않는다. loop invariant의 초기 성립과 보존은 별도다. Assume 자체는 증명하지 않는다. 이 기본값을 모든 Ada compiler에 적용하지 않고 외부 가정·runtime 정책·전체 proof 결과를 분리한다.

## 진단과 검증

공식 원문에서 도출한 가상 진단 사례다. 실제 공개 장애·운영 재현·모델 가중치 학습 결과로 집계하지 않는다. 모든 행에 위 Sources와 version 범위가 적용되며 조치·검증은 실행해야 할 후보 절차다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
| --- | --- | --- | --- | --- | --- |
| SYN-SPARK-ASSERT-001 | 위반인데 runtime 예외 없음 | gnata·Assertion_Policy | assertion 비활성 | build 정책 확인 | Check build의 경계 입력 확인 |
| SYN-SPARK-ASSERT-002 | 뒤 Assert만 proved | 앞 미증명 Assert | 앞 실패 시 중단 가정 | 첫 assertion 검토 | 전체 obligation·runtime 정책 대조 |
| SYN-SPARK-ASSERT-003 | contract 분석 메시지 없음 | Disable·Ignore | Disable은 proof 제외 | 정책 의도 확인 | obligation 목록 비교 |
| SYN-SPARK-ASSERT-004 | invariant 보존만 통과 | initialization 결과 | 첫 반복 조건 위반 | 초기 조건 수정 검토 | 초기·보존 각각 확인 |
| SYN-SPARK-ASSERT-005 | true invariant 미증명 | inductiveness·context | 귀납 정보 부족 | invariant 강화 검토 | 임의 반복 증명 재검사 |
| SYN-SPARK-ASSERT-006 | Assume 뒤 proof를 전체 보장으로 해석 | 외부 가정 근거 | 가정 자체 미증명 | justification·외부 계약 확인 | 가정 검증 별도 수행 |
