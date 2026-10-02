# Kubernetes exec probe와 containerd IO 정리 공개 보고

Topic: cncf/containerd
Version: Reported containerd 1.6.12, runc 1.1.4
Kind: public-reported-issue-analysis
Verified: 2026-10-02

Sources:
- https://github.com/containerd/containerd/issues/7802
- https://github.com/containerd/containerd/pull/7832

<!-- evidence-sha256: f75e0953ccf706cccef1fc6706398162cc7aab29ff949cf277b9c700c8a51e98 -->

## 보고와 진단

보고자는 readiness exec shell이 timeout 된 뒤 curl 또는 sleep 자식이 남고 process 수와 containerd RSS가 증가한다고 제시했다. 관찰된 probe 간격 지연은 해당 환경의 runtime request timeout 해석이며 모든 버전의 보장으로 일반화하지 않는다.

확인할 증거: runtime와 kubelet 버전, probe 명령과 timeout, 부모·자식 process 관계, 열린 pipe, 반복 요청 간격, RSS 추세. 자식의 IO 보유와 exec IO drain 대기는 조사 경로다. 연결 PR #7832는 exec IO drain timeout 변경이므로 단순 application heap leak과 구분한다.

조치 후보는 probe 내부 명령에 유한 timeout을 두고 자식 생명주기를 관리하며 해당 runtime 수정의 실제 포함 여부를 확인하는 것이다. 성공 기준은 반복 timeout 후 process·IO·RSS가 계속 누적되지 않는지와 readiness 결과다. PR 파일 diff·릴리스 포함·로컬 재현은 아직 검증하지 않았으며 Closed를 운영 해결로 표시하지 않는다.

## 범위

실제 공개 보고 분석이다. 가상 SFT 예제, 독립 재현, 모델 가중치 학습과 구별한다.
