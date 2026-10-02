# 범위와 확장 장부

확인일: 2026-09-30. 프로그래밍 언어와 프레임워크는 계속 생기고 바뀐다. 따라서 “모든 언어의 모든 API를 저장했다”는 표시를 하지 않는다. 이 장부는 **현재 오프라인에서 읽을 수 있는 깊이**와 다음 갱신 작업을 구분한다.

| 범위 | 현재 깊이 | 다음에 채울 항목 |
|---|---|---|
| Python·Java·C·C++·C#·JavaScript·TypeScript·Go·Rust·SQL | [핵심 개념과 오류](languages.md) | 버전별 최소 예제, FFI/ABI, 프로파일링 사례 |
| 그 외 시스템·JVM·.NET·스크립트·함수형·데이터 언어 | [확장 지도](language-atlas.md)의 실행 모델과 점검점 | 언어별 표준 라이브러리·패키지·디버깅 심화 |
| 웹·API·모바일·데이터·ML·인프라 프레임워크 | [프레임워크](frameworks.md)의 선택과 장애 지점 및 [확장 지도](framework-atlas.md)의 분야별 계약 | 각 프레임워크의 버전별 라우팅·상태·보안 사례 |
| 모바일·데스크톱·게임·임베디드·GPU·ML·접근성 | [분야 지도](domain-atlas.md)의 설계 질문과 검증 | 실제 배포 수명, 디버깅, 성능, 플랫폼별 사례 |
| DB·데이터 파이프라인·분산 시스템 | [데이터와 분산 시스템](data-distributed.md)의 불변식과 장애 흐름 | 엔진별 격리·복제·복구와 장애 실험 |
| 보안·빌드·CI/CD·테스트·운영 | [보안과 도구](security-tooling.md)의 경계와 절차 | 표준·도구 버전별 실습 및 취약점 패턴 |
| 알고리즘·이벤트·장애·GitHub 코드 | 기존 주제별 문서와 [코드 읽기](github-code.md) | 분야별 사례와 커밋 고정 코드 분석 |
| React·Spring Boot | [React 심화](react-deep-dive.md), [Spring Boot 심화](spring-boot-deep-dive.md)의 설계·진단 및 공개 이슈 | 버전별 API·실제 재현 프로젝트와 회귀 테스트 |
| CNCF 전체 | [고정 Landscape](cncf-deep-dive.md)의 2,427개 항목 색인과 255개 프로젝트 목록, [프로젝트별 공개 원문 수집](corpus-overview.md) | 원문 누락 보완, 프로젝트별 운영 재현과 버전 검증 |
| VOC | **언어 130건**: [기존 55건](voc-languages.md)·[추가 55건](voc-languages-extra.md)·[추가 20건](voc-languages-more.md). **CNCF 121건**: [기존 27건](voc-cncf.md)·[분야 추가 27건](voc-cncf-extra.md)·[프로젝트 46건](voc-cncf-projects-extra.md)·[프로젝트 21건](voc-cncf-more.md). **프레임워크 122건**: [33건](voc-frameworks-extra.md)·[67건](voc-frameworks-more.md)·[22건](voc-frameworks-deeper.md). 합계 373건이며 기존 [공개 사례집](voc-public.md)은 별도 | CNCF 255개 프로젝트와 언어·프레임워크의 버전별 재현·회귀 테스트를 계속 누적. 100건은 최소 점검선일 뿐 갱신을 중단하는 상한이 아님 |

## 다음 주제 선정 규칙

1. 실제 개발 질문·장애가 생기면 해당 분야를 먼저 심화한다.
2. 비어 있는 분야를 넓힐 때 공식 명세·유지관리자 문서·프로젝트 저장소를 먼저 찾는다.
3. 새 항목에는 문제, 적용 버전, 작동 원리, 실패 사례, 검증 방법, 공식 출처, 확인일을 남긴다.
4. 링크만 추가한 항목은 **색인**, 직접 설명과 검증 절차가 있는 항목은 **가이드**로 표시한다.
5. 최신 여부를 자동 확인한 결과와 사람이 원문을 읽고 내용을 갱신한 결과를 구별한다.

이 폴더에는 특정 개인 프로젝트, 회사 문서, 사용자 스킬 원문/요약을 넣지 않는다. 공개 기술 자료의 자체 설명과 공개 업스트림 원문을 보관한다. 대량 데이터셋의 실제 건수·출처·미확보 원천은 [별도 범위](corpus-overview.md)와 [학습 장부](training/manifest.json)를 따른다. 원문 확보와 모델의 가중치 학습은 별도 상태다.

## OpenViking 저장 상태

[OpenViking 리소스 원본](openviking/README.md)에 사례 373건과 CNCF Landscape 항목 2,427개를 재구성했다. 생성 파일 수와 해시는 [manifest](openviking/manifest.json)를 따른다. 별도 로컬 서버에서 소규모 표본의 저장·읽기·검색을 확인했던 기록이 있으나 이전 전체 가져오기는 완료 확인이 없다. task 완료, 대표 원문 읽기, 검색 및 점 파일의 네이티브 L0/L1 반영은 미검증이다. 새 [공식 원문 리소스](openviking/resources/official-corpus/README.md)는 별도 `viking://resources/official-corpus/` 가져오기 원본이며 네이티브 저장은 수행하지 않았다.
