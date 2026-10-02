# Vite #10802 공개 보고: Windows 드라이브 간 링크

Topic: Vite reported issue 10802
Version: Vite 3.2.2 / Windows 10 19045 / Node 19.0.1
Kind: public-issue-report-not-locally-reproduced
Verified: 2026-10-02

Sources:
- https://github.com/vitejs/vite/issues/10802
- https://vite.dev/guide/troubleshooting

<!-- evidence-sha256: e6970f4c5e8b302e46ed381ee9e6deeb06101d8064aae73c260cd9f6c9a6a660 -->

## 공개 보고와 진단 연결
보고자는 서로 다른 드라이브 사이의 디렉터리 링크를 통해 실행한 개발 서버·빌드가 실패하며 실제 대상 드라이브 경로에서는 정상이라고 기록했다. 현재 공식 문제 해결 문서도 cross-drive 링크를 알려진 문제로 설명한다.

확인할 증거: 링크 여부, 실제 대상 드라이브, 링크 경로와 실제 경로 각각의 결과. 원인 가설: 드라이브 간 링크와 경로 해석의 상호작용. 조치 후보: 실제 대상 경로에서 실행해 비교한다. 해결 검증: 개발 서버와 프로덕션 빌드를 모두 비교하며 프로젝트에 필요한 링크 구성이 유지되는지 확인한다.

## 상태 한계
열람 시 이슈는 Open이다. 수정 PR·수정 버전·현재 설치 버전 재현·보편적 해결 성공은 확인하지 않았다. 보고자의 환경을 모든 Windows 환경에 일반화하지 않는다. 실제 파일 이동·링크 생성은 실행하지 않았다.
