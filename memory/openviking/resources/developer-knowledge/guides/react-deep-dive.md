---
kind: curated-guide
origin: "react-deep-dive.md"
source_access: see_document_links
---
# React 및 주변 도구: 설계·진단·VOC

확인일: 2026-09-30. React 버전, 렌더 방식(CSR/SSR), 라우터와 빌드 도구 버전을 먼저 고정한다. 아래는 공식 문서를 바탕으로 자체 작성한 오프라인 작업 지침이다.

## 렌더와 상태의 계약

- **렌더는 계산:** 컴포넌트 본문에서 외부 시스템을 변경하지 않는다. 입력 이벤트는 handler에서, 렌더 결과로 외부 시스템과 동기화하는 일은 Effect에서 다룬다.
- **상태의 위치:** React는 UI 트리의 컴포넌트 위치와 `key`에 상태를 연결한다. 같은 자리에 같은 타입이면 유지되고, 위치·타입·`key`가 바뀌면 초기화될 수 있다. 의도치 않은 입력 초기화는 렌더 트리 변화를 먼저 추적한다.
- **Effect:** 외부 시스템 연결에 사용한다. 의존성 배열을 임의로 줄여 오류를 숨기지 않는다. 개발 모드 Strict Mode의 추가 setup/cleanup은 정리 로직을 검증한다.
- **비동기 응답:** 요청 A보다 늦게 시작한 B가 먼저 끝날 수 있다. 중단 또는 결과 무시 로직을 넣어 오래된 응답이 최신 상태를 덮지 않게 한다.
- **SSR/hydration:** 서버가 보낸 초기 HTML과 클라이언트의 첫 렌더가 일치해야 한다. 현재 시각·무작위 값·브라우저 전용 API·잘못 중첩된 HTML을 점검한다.

근거: [렌더와 커밋](https://react.dev/learn/render-and-commit), [상태 보존과 초기화](https://react.dev/learn/preserving-and-resetting-state), [`useEffect` 문제 해결](https://react.dev/reference/react/useEffect), [`hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot).

## 주변 도구의 책임 경계

| 필요 | 도구 | 혼동하면 생기는 문제 | 공식 문서 |
|---|---|---|---|
| URL과 화면 전환 | React Router | 라우터의 Declarative/Data/Framework 모드가 제공하는 데이터 API가 다름 | [모드 안내](https://reactrouter.com/start/modes) |
| 서버 렌더·배포 통합 | Next.js | React 자체 API와 프레임워크의 캐시·라우팅 API 혼동 | [Next.js](https://nextjs.org/docs) |
| 원격 데이터 캐시 | TanStack Query | 서버 상태를 화면 로컬 상태로 복제하여 무효화·동기화 실패 | [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview) |
| 공유 클라이언트 상태 | Redux Toolkit | 서버 캐시와 클라이언트 업무 상태를 한 저장소에 뒤섞음 | [Redux Toolkit](https://redux-toolkit.js.org/introduction/getting-started) |
| 빌드·개발 서버 | Vite | 개발 서버와 실제 프로덕션 번들의 차이를 미검증 | [Vite](https://vite.dev/guide/) |
| 사용자 중심 테스트 | React Testing Library | 구현 세부 사항만 검사해 사용자 경로 실패를 놓침 | [Testing Library](https://testing-library.com/docs/react-testing-library/intro/) |
| 네이티브 UI | React Native | DOM·CSS·브라우저 API가 그대로 있다고 가정 | [React Native](https://reactnative.dev/docs/getting-started) |

## VOC 유형별 해결 카드

| 증상 | 우선 증거 | 검증할 원인 | 조치와 확인 |
|---|---|---|---|
| 개발 모드에서 Effect가 두 번 실행된다 | Strict Mode 설정, setup/cleanup 로그 | 정리 없는 구독·연결·타이머 | cleanup에서 연결 해제/중단. 개발 모드 재설치 순서에서도 결과가 같아야 함. [공식 설명](https://react.dev/reference/react/useEffect) |
| 렌더가 무한 반복된다 | Effect 의존성·state 변경 추적 | Effect가 state를 바꾸고 의존 값도 매 렌더 변경 | 외부 동기화가 아니라 파생 계산이면 Effect 제거. 필요한 동기화면 안정적인 의존 값과 조건을 명시. [공식 설명](https://react.dev/reference/react/useEffect) |
| 목록이나 폼의 입력 상태가 사라진다 | 컴포넌트 위치·타입·`key`의 전후 값 | 의도치 않은 재마운트 | 안정적인 identity 유지. 의도적 초기화일 때만 다른 `key` 사용. [공식 설명](https://react.dev/learn/preserving-and-resetting-state) |
| SSR 화면에서 hydration 오류 | 서버 HTML과 첫 클라이언트 렌더 비교 | 비결정적 값, 브라우저 전용 분기, 잘못된 HTML | 초기 출력 일치, 외부 데이터 직렬화 검증, DOM 중첩 수정. [공식 설명](https://react.dev/reference/react-dom/client/hydrateRoot) |
| 이전 검색 응답이 새 결과를 덮는다 | 요청 ID·시작/종료 시각 | 응답 순서 역전 | 취소하거나 이전 요청 결과를 무시. 최신 요청만 화면에 반영되는지 역순 응답 테스트. [공식 설명](https://react.dev/reference/react/useEffect) |
| 서버 변경 후 UI가 오래된 값을 보인다 | query key, 무효화 시점, 캐시 정책 | 서버 상태 캐시가 재검증되지 않음 | 변경 성공 후 해당 키 무효화/재조회와 실패 롤백을 테스트. [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview) |

### 검증된 공개 이슈: HTML 구조로 인한 hydration 실패

[React 이슈 #24519](https://github.com/facebook/react/issues/24519)는 잘못 중첩된 HTML이 브라우저 파싱 과정에서 수정되어 서버 HTML과 hydration 결과가 달라진다고 보고한다. 이슈의 **보고된 증상**과 공식 [`hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot) 문서의 해결 원칙을 구별한다. 재현 시 HTML 구조를 고치고 서버·클라이언트 첫 출력이 같은지 확인한다. 이 이슈가 모든 hydration 오류의 원인이라는 뜻은 아니다.

## 접수 기록 형식

`증상 / 발생 버전 / CSR·SSR 구분 / 브라우저 / 재현 코드 / 예상·실제 화면 / 콘솔 오류 / 관련 요청 / 원인 가설 / 원문 근거 / 조치 / 회귀 테스트 / 해결 확인자·날짜`.
