# Vite #964 공개 보고: 대소문자와 HMR

Topic: Vite reported issue 964
Version: Vite 1.0.0-rc.6 / Vue 3.0.2 / macOS Catalina / Node 12.19.0
Kind: public-issue-report-not-locally-reproduced
Verified: 2026-10-02

Sources:
- https://github.com/vitejs/vite/issues/964
- https://vite.dev/guide/troubleshooting

<!-- evidence-sha256: db28f660dcf48c81e2daa4457b66506e61e428f6556e3f41b6dc8ec9576759a7 -->

## 공개 보고와 진단 연결
보고자는 Vue SFC 템플릿 변경이 반영되지 않는다고 기록했다. 로그는 최초 로드 src/views와 변경 감지 src/Views 경로 차이를 보여준다. 현재 공식 문제 해결 문서는 import 대소문자 불일치를 HMR 실패 원인으로 안내한다.

확인할 증거: 실제 경로와 모든 import 표기, 변경 감지 로그. 원인 가설: 경로 대소문자 불일치. 조치 후보: 표기를 통일한다. 해결 검증: 파일 수정 뒤 템플릿 갱신과 Linux 빌드를 검사한다.

## 상태 한계
열람 시 이슈는 Open이다. 수정 PR·수정 버전·로컬 재현·해결 성공은 확인하지 않았다. 이 보고와 기존 대소문자 진단 시나리오는 같은 실패 경로일 수 있으므로 새 독립 사건으로 합산하지 않는다. 원문 인증 정보·개인 경로·전체 로그는 저장하지 않는다.
