# React hydration 경계와 해결 검증

Topic: React hydration
Version: react.dev 표시 19.3; 2026-10-02 열람
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://react.dev/reference/react-dom/client/hydrateRoot

<!-- evidence-sha256: cfd9a9c6b065cf8d8a56a62cfc67ba079001a693b7091c824768559b63f2ed6c -->

## 원리
SSR HTML과 첫 클라이언트 출력은 일치해야 한다. CSR만 사용하는 루트는 createRoot 영역이다. hydration은 서버 데이터 전달과 렌더 트리 identity에 연결된다.

## 진단 시나리오
- 속성 불일치: 서버 HTML·첫 렌더 데이터·브라우저 DOM을 비교한다. 자동 속성 복구를 전제하지 말고 초기 출력을 일치시킨다. 실제 속성과 이벤트 대상을 검사한다.
- 경고 억제: suppressHydrationWarning은 한 단계의 제한적 탈출구다. 불일치 텍스트를 자동 수정하는 해결책으로 사용하지 않는다. 경고와 실제 내용을 따로 검증한다.
- hydration 이전 root.render: 서버 HTML이 지워지고 CSR로 전환될 수 있다. 초기화 순서를 조사하고 hydration 후 갱신한다. DOM 교체와 상태 보존을 검사한다.
- 두 단계 렌더: Effect의 상태 갱신으로 초기 일치를 유지할 수 있지만 추가 렌더 비용이 있다. 느린 연결에서 화면 이동과 반응 시간을 검증한다.

## 근거 수준
공식 문서를 직접 읽어 종합한 가설과 검증 절차다. 실제 공개 이슈 해결이나 현장 재현 성공으로 세지 않는다. 설치 패키지와 프레임워크 버전별 재검증이 필요하다.
