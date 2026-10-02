# Maven dependency mediation·scope 계약

Topic: tooling/maven/dependency-mediation
Version: Living Maven official dependency guide; exact release and update date unspecified; no Maven invocation
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html

<!-- evidence-sha256: 59531aa638db3e49c8e91cb9323209028ce26662a00740c392790518878ba120 -->

## 공식 계약과 범위

버전 선택은 최신 버전이 아니라 가까운 dependency 경로이며 같은 깊이에서는 먼저 선언된 항목이다. dependencyManagement는 실제 사용 의존성의 버전을 제어하며 선언만으로 classpath에 추가하지 않는다. project management는 plugin 의존성에 적용되지 않는다. provided는 runtime이 공급할 전제다. graph 선택이 바이너리 호환성을 보장하지 않으므로 실제 실행 classpath를 확인한다.

## 진단과 검증

공식 원문에서 도출한 가상 진단 사례다. 실제 공개 장애·운영 재현·모델 가중치 학습 결과로 집계하지 않는다. 모든 행에 위 Sources와 version 범위가 적용되며 조치·검증은 실행해야 할 후보 절차다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
| --- | --- | --- | --- | --- | --- |
| SYN-MAVEN-MED-001 | 낮은 버전 선택 | dependency tree 깊이 | nearest definition | 직접 선언·management 검토 | 선택 버전 확인 |
| SYN-MAVEN-MED-002 | 순서 변경 후 버전 변동 | 동일 깊이 선언 순서 | 첫 선언 승리 | 명시적 버전 제어 | tree 비교 |
| SYN-MAVEN-MED-003 | management만 둔 클래스 없음 | dependencies·management | 관리와 의존성 추가 혼동 | 실제 사용 의존성 선언 | classpath 확인 |
| SYN-MAVEN-MED-004 | plugin 라이브러리 미변경 | plugin dependency graph | project 관리 범위 밖 | plugin 경계에서 검토 | plugin 해석 확인 |
| SYN-MAVEN-MED-005 | provided 라이브러리 runtime 누락 | scope·실행 환경 | runtime 공급 전제 불충족 | 공급 환경·scope 정리 | 실제 classpath 확인 |
