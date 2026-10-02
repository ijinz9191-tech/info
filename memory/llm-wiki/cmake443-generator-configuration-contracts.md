# CMake generator와 빌드 configuration 선택 계약

Topic: tooling/cmake/build-configurations
Version: CMake official 4.4.3 documentation; local CMake execution unavailable
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://cmake.org/cmake/help/latest/variable/CMAKE_BUILD_TYPE.html
- https://cmake.org/cmake/help/latest/variable/CMAKE_CONFIGURATION_TYPES.html
- https://cmake.org/cmake/help/latest/manual/cmake-buildsystem.7.html

<!-- evidence-sha256: ab1e4469c7ad4497b45dfb564468379ff462800b4f62ae5e1ed87dbd4beb2a14 -->

## 공식 계약과 범위

single-config는 configure 때 CMAKE_BUILD_TYPE을 선택한다. Visual Studio/Xcode/Ninja Multi-Config는 build 때 configuration을 선택하고 CMAKE_BUILD_TYPE을 무시한다. CMAKE_CONFIGURATION_TYPES는 가능한 목록이다. 새 build tree의 첫 project/enable_language에서 환경 또는 toolchain/generator 기본으로 초기화하므로 빈 기본을 Debug로 가정하지 않는다. 일반 문자열 비교와 $<CONFIG>의 casing 보존을 $<CONFIG:Debug>의 case-insensitive 조건 검사와 구분한다. configure-time if 대신 필요한 경우 configuration generator expression을 검토한다. imported target의 configuration mapping도 적용된다. 로컬 생성·컴파일은 수행하지 않았다.

## 진단과 검증

공식 원문에서 도출한 가상 진단 사례다. 실제 공개 장애·운영 재현·모델 가중치 학습 결과로 집계하지 않는다. 모든 행에 위 Sources와 version 범위가 적용되며 조치·검증은 실행해야 할 후보 절차다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
| --- | --- | --- | --- | --- | --- |
| SYN-CMAKE-CONFIG-001 | Visual Studio 결과가 BUILD_TYPE과 다름 | generator·실제 선택 config | multi-config에서 BUILD_TYPE 무시 | build 시 config 선택 확인 | 실제 compile flag·산출물 비교 |
| SYN-CMAKE-CONFIG-002 | Debug 전용 define 누락 | configure if·generator 종류 | configure 시 실제 config 미정 | configuration generator expression 검토 | 각 config의 compile command 검사 |
| SYN-CMAKE-CONFIG-003 | 기본 build가 Debug가 아님 | 새 cache·환경·toolchain 기본 | 빈 기본 또는 다른 초기값 | configuration을 명시적으로 선택 | cache·debug symbol·최적화 flag 확인 |
| SYN-CMAKE-CONFIG-004 | case 변형에 조건 오작동 | 문자열 비교·config expression | case 처리 경로 혼동 | 비교 계약과 expression을 대조 | Debug/debug 입력별 결과 검사 |
| SYN-CMAKE-CONFIG-005 | imported 라이브러리 config 불일치 | target config mapping | 매핑과 소비 config 불일치 | MAP_IMPORTED_CONFIG 조건 검토 | link된 실제 artifact와 ABI 확인 |
