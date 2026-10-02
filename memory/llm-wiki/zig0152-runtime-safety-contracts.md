# Zig 정수·포인터·빌드 모드 안전성

Topic: zig0152-runtime-safety-contracts
Version: Zig 0.15.2 language reference; not a latest-version claim
Kind: official-document-synthesis
Verified: 2026-10-02

Sources:
- https://ziglang.org/documentation/0.15.2/

<!-- evidence-sha256: 2ebf7c8d73990ca72a6c0eef49105206c6f04e4fab84a9333a64d0aae3f9d4e5 -->

## 실행 계약과 진단

공식 원문을 직접 읽어 정리한 가상 진단 시나리오다. 각 행에는 위 제품·버전과 Sources가 적용된다. 실제 공개 이슈 해결 또는 운영 재현으로 세지 않는다.

| ID | 증상 | 확인할 증거 | 원인 가설 | 조치 | 해결 검증 |
|---|---|---|---|---|---|
| SYN-ZIG-SAFETY-001 | ReleaseFast에서 overflow 불안정 | 빌드 모드·안전성 설정 | 안전 검사 비활성 상태의 illegal behavior | 범위 검사 또는 의도한 wrapping/saturating 선택 | 경계값을 안전 모드와 비교 |
| SYN-ZIG-SAFETY-002 | 정수 변환 panic | 원본 값·목적 타입 범위 | @intCast 범위 밖 | 범위 확인 또는 값 표현 재설계 | 최소·최대·범위 밖 값 검사 |
| SYN-ZIG-SAFETY-003 | enum 변환 panic | 태그 값·enum 선언 | 열거형에 없는 정수 | 지원 값 검증·non-exhaustive 의도 확인 | 알려진 값과 미지원 값 비교 |
| SYN-ZIG-SAFETY-004 | 포인터 변환 뒤 데이터 손상 | 원래 타입·접근 형태 | @ptrCast 뒤 부적절한 접근 | 수명·정렬·타입 계약 확인 | 안전한 변환과 접근 비교 |
| SYN-ZIG-SAFETY-005 | comptime과 runtime 오류 차이 | 평가 시점·같은 입력 | 컴파일 시 더 강한 오류 탐지 | 두 실행 조건을 분리해 확인 | 컴파일 오류와 런타임 안전 검사 비교 |

## 적용 한계

배포 버전과 구성은 실제 환경에서 확인한다. 조치는 진단 후보이며 운영 재현 결과가 아니다. 원문 수집 전체의 검토 또는 모델 가중치 학습 완료를 뜻하지 않는다.
