# scikit-learn 전처리·평가 진단

Topic: frameworks/ml
Version: 1.9.1 공식 문서
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://scikit-learn.org/stable/common_pitfalls.html

<!-- evidence-sha256: ef0b861c7bee63a0c9d77f92a49832d076a3703b19491f4273b00a11f2041102 -->

## 실행 계약과 진단

아래 항목은 공식 원문을 직접 읽어 종합한 진단 시나리오다. 페이지의 제품·버전과 Sources가 모든 행에 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-SYN-SKL-001 | 학습은 좋은데 예측 악화 | train·predict 전처리 비교 | feature 공간 불일치 | Pipeline으로 동일 transform | 별도 평가 데이터 검증 |
| SYN-SYN-SKL-002 | 평가 점수 과도하게 높음 | 분리 전 fit 여부 확인 | 평가 데이터 누수 | 먼저 분리·train만 fit | 독립 평가 반복 |
| SYN-SYN-SKL-003 | CV feature selection 누수 | fold 밖 fit 확인 | 전체 데이터 feature 선택 | 선택기를 Pipeline 안에 배치 | 각 fold 학습 범위 확인 |
| SYN-SYN-SKL-004 | 반복 fit 결과 변화 | random_state 타입 확인 | RandomState가 소비됨 | 재현성 목적에 정수 seed 검토 | 동일 조건 반복 비교 |
| SYN-SYN-SKL-005 | 모델별 fold 비교 불공정 | split별 index 비교 | 공유 RNG split이 변화 | 정수 seed splitter 사용 | 동일 fold index 확인 |
| SYN-SYN-SKL-006 | seed 고정만으로 안정성 판단 | fold별 estimator RNG 확인 | 한 초기화에 평가 의존 | 다양한 초기화 평가 | 평균·변동 함께 검증 |

## 적용 한계

실제 런타임 검증은 별도 결과가 있을 때만 기록한다. 한 제품의 조건을 다른 언어·버전으로 일반화하지 않는다. 취소·자원 수명·backpressure·관측 지표의 관계는 해당 실행 계약에서 확인한다.
