# Tutorial Modal Component

다른 게임에서 재사용 가능한 튜토리얼 모달 컴포넌트입니다.

## 사용 방법

### 1. 컴포넌트 복사
`TutorialModal.tsx` 파일을 프로젝트의 components 폴더에 복사합니다.

### 2. 튜토리얼 스텝 수정
게임에 맞게 `TUTORIAL_STEPS` 배열을 수정합니다:

```typescript
const TUTORIAL_STEPS: TutorialStep[] = [
  {
    image: '/tutorial/1.jpg',  // 튜토리얼 이미지 경로
    title: 'Step Title',       // 단계 제목
    description: 'Step description',  // 단계 설명
  },
  // ... 추가 스텝
];
```

### 3. 이미지 준비
- `public/tutorial/` 폴더에 튜토리얼 이미지 파일 배치 (1.jpg, 2.jpg, ...)
- `public/button/close.png` - 닫기 버튼 이미지 (기본 40×40px, 필요 시 사이즈 변경)

### 4. 부모 컴포넌트에서 사용

```typescript
import TutorialModal from './components/TutorialModal';

function YourComponent() {
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsTutorialOpen(true)}>
        Game Guide
      </button>

      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />
    </>
  );
}
```

### 5. 스테이지(1280×800) 내부에서 사용하기

게임 플레이 화면처럼 1280×800 스테이지 안에서만 모달을 띄우고 싶다면 `variant="stage"`를 전달합니다. 이렇게 하면 오버레이가 스테이지 영역뿐 아니라 스테이지의 스케일 변형에도 맞춰집니다.

```tsx
<main className="relative" style={{ width: 1280, height: 800 }}>
  {/* stage contents */}
  <TutorialModal
    isOpen={isTutorialOpen}
    onClose={() => setIsTutorialOpen(false)}
    variant="stage"
  />
</main>
```

## 디자인 사양

- **모달 크기**: 1000×640px
- **닫기 버튼 위치**: 딤 화면 기준 top: 20px, right: 48px
- **버튼 스타일**: 플랫 디자인 (그림자 없음)
- **배경**: 그라데이션 + 블러 효과
- **애니메이션**: 0.2초 페이드인 + 스케일 효과

## 주요 기능

- 여러 단계의 튜토리얼 표시
- 이전/다음 네비게이션
- 진행 상태 인디케이터 (점)
- 모달 재오픈 시 첫 단계로 자동 리셋
- 마지막 단계에서 "Close" 버튼으로 종료

## 커스터마이징

### 색상 변경
버튼 색상을 변경하려면:
- Back 버튼: `bg-slate-200` → 원하는 색상
- Next 버튼: `bg-yellow-400` → 원하는 색상

### 크기 조정
모달 크기 변경:
```typescript
style={{ width: '1000px', minHeight: '640px', padding: '28px 32px 32px 32px' }}
```

### 폰트 변경
```typescript
className="... font-[Pretendard]"
```
