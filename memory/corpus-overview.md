# 공개 원문과 학습 데이터 범위

생성 시각: 2026-10-02T07:58:30.911694+00:00. 기술 주장 검증일이 아니라 실제 파일을 수집·변환한 시각이다.

현재 428/429개 공개 저장소의 문서 187,203개, 코드 30,176개와 라이선스 파일을 확보했다. 원문은 1,889,189,974바이트이며, 중복 제거 후 문서 188,679개를 학습용 251,937청크·평가용 13,306청크로 변환했다. 오류·디버깅·버그 수정·마이그레이션 관련 공식 절 위치는 33,111개다. **절 위치는 추가로 검증된 실제 VOC 해결 건수가 아니다.**

고정 CNCF Landscape의 프로젝트 항목 255개 중 253개는 저장소 원문을 확보했다. 원문 몇 개를 가져온 상태와 제품 전체 문서·모든 버전의 완전한 복제는 다르다. 현재 건수를 상한으로 삼지 않는다.

## 분야별 원문

| 분야 | 저장소 | 문서 | 코드 |
|---|---:|---:|---:|
| languages | 61 | 40,960 | 3,814 |
| frameworks | 42 | 16,099 | 15,170 |
| cncf | 278 | 71,212 | 2,965 |
| data | 15 | 36,115 | 668 |
| algorithms | 9 | 256 | 6,282 |
| systems | 7 | 8,695 | 367 |
| security | 2 | 183 | 0 |
| ml | 5 | 2,337 | 641 |
| tooling | 8 | 8,700 | 269 |
| observability | 1 | 2,646 | 0 |

분야가 겹치는 저장소가 있어 행의 숫자를 더하면 전체와 다를 수 있다.

## 언어 계열

abap, ada, agda, assembly, bun, c-cpp, clojure, common-lisp, crystal, d, dart, deno, dotnet, elixir, elm, erlang, fish, fortran, fsharp, gleam, go, go-docs, groovy, haskell, idris, java, javascript, julia, kotlin, lean, lua, nim, nushell, ocaml, openscad, perl, php, powershell, prolog, purescript, python, r, racket, ruby, rust, scala, sql, swift, typescript, typst, v, zig, zsh. 표에 없는 언어는 향후 공식 원천을 추가한다.

## 탐색

- [OpenViking 원문 탐색](openviking/resources/official-corpus/README.md): 저장소별 L0/L1 색인과 전체 수집 파일.
- [학습 데이터 설명](training/README.md): 원문 추적, 중복 제거, 평가 분리, 수동 갱신.
- [학습 manifest](training/manifest.json), [수집 결과](corpus/acquisition-report.json), [원천 목록](corpus/source-registry.json).

## 미확보 원천

- `cncf/toc`: 원문 미확보; 수집 보고서의 실패 사유 확인.
- CNCF `Curiefense`: no supported canonical GitHub repository
- CNCF `CoHDI`: no supported canonical GitHub repository

## 판독과 재검증

원문 URL과 커밋 SHA, 파일별 SHA-256을 보관하며 UTF-8 텍스트만 저장한다. 그림·영상·바이너리, 일부 대형 파일, 제외 경로는 보관하지 않는다. 원문 내부의 상대 링크와 생성기 지시문은 그대로 남아 있으므로 공식 사이트 전체를 실행 가능한 형태로 복제한 것은 아니다. 개별 솔루션의 운영 재현·버전 적용성·모든 기술 주장은 별도로 검증해야 한다. 이 데이터셋으로 모델의 가중치를 학습하지 않았고 새 원문을 네이티브 OpenViking 서버에 가져오지도 않았다.
