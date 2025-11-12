# Word Race Intro Copy & Implementation Guide

이 문서는 Word Race 게임의 소개 문구를 디자이너와 개발자가 동일하게 사용할 수 있도록 정리한 가이드입니다.

---

## 1. 문구 사양

| 요소 | 내용 | 비고 |
|------|------|------|
| **헤드라인** | `WORD RACE` | 전부 대문자 사용 |
| **본문 1** | `Trace or draw the word right and fast!` | 문장 길이 60자 이하 |
| **본문 2** | `Write it right, write it fast!` | 문장 길이 80자 이하 |

### 카피 톤 & 매너
- 대상: 초등 저학년 수준, 간단한 어휘 사용
- 리듬감 있는 문장, 감탄문 사용 OK
- 팀 경쟁, 속도감, 퀴즈 보상 요소 강조

#### 한국어 참고 번역 (내부 공유용)
> 단어를 정확하고 빠르게 따라 그리고 써보세요!  
> 빠르게, 정확하게! 팀과 함께 승리를 잡으세요.

---

## 2. 디자인 가이드

| 항목 | 가이드 |
|------|--------|
| 폰트 | Pretendard 혹은 프로젝트 기본 본문 폰트 |
| 정렬 | 중앙 정렬, 최대 폭 480px 추천 |
| 행간 | 헤드라인 120%, 본문 140% |
| 간격 | 헤드라인 ↔ 본문1 : 12px<br>본문1 ↔ 본문2 : 6px |
| 색상 | 헤드라인 `#111827` (text-slate-900), 본문 `#4B5563` (text-slate-600) |
| 배경 | 흰 배경 위 사용 시 박스 그림자 optional (태블릿 뷰 고려) |
| 반응형 | 모바일에서는 폰트 사이즈 2단계 축소 (헤드라인 20px, 본문 14px) |

### 예시 레이아웃 (초안)
```
[ 헤드라인 ]  24px bold, uppercase
[ 본문 1 ]    16px regular
[ 본문 2 ]    16px regular
```

---

## 3. 개발 적용 방법

### 공통 컴포넌트 예시 (React)
```tsx
interface GameIntroProps {
  title?: string;
  lines?: string[];
}

const GameIntro: React.FC<GameIntroProps> = ({
  title = 'WORD RACE',
  lines = [
    'Trace or draw the word right and fast!',
    'Write it right, write it fast!',
  ],
}) => (
  <section className="text-center space-y-2">
    <h2 className="text-3xl font-bold tracking-wide text-slate-900 uppercase">
      {title}
    </h2>
    {lines.map((line, index) => (
      <p key={index} className="text-base text-slate-600">
        {line}
      </p>
    ))}
  </section>
);
```

### 적용 위치 권장
- 게임 세팅 화면: Game Guide 버튼 근처
- 타이틀 혹은 온보딩 화면
- 마케팅용 캡처/슬라이드

### 번들링 팁
- 문자열은 `constants/gameDescriptions.ts` 같이 별도 파일에 정의하면 다국어 확장 시 유리
- Tailwind 사용 시 `uppercase tracking-wide` 등 공통 유틸 클래스로 관리

---

## 4. QA 체크리스트

1. 헤드라인이 모든 뷰포트에서 한 줄로 유지되는지 확인  
2. 본문 문장이 두 줄 이상일 때 줄간격이 어색하지 않은지 확인  
3. 다국어 전환(예: 한국어) 시 레이아웃 깨짐 여부 점검  
4. 캡처 모드(디자인 확인용) 화면에서도 동일한 문구가 출력되는지 확인

---

### 문의
- **카피 관련**: 디자인팀 문구 담당
- **개발 적용**: 프론트엔드 담당자 (Word Race 팀)

필요 시 추가 수정 사항은 해당 파일을 업데이트하고 관련자에게 공유해 주세요.

