# Game Menu Modal

게임 진행 중 메뉴 버튼을 눌렀을 때 나타나는 Game Menu 모달 구현 예제입니다.  
이 모달은 다음 기능을 제공합니다.

- 게임 일시 정지 표시
- Game Guide(튜토리얼) 열기
- 게임 종료, 나가기 버튼
- 닫기 버튼 (우측 상단 48×48)

## 구성 파일

- `GameMenuModal.tsx` – 모달 컴포넌트
- `GameMenuModal.types.ts` – 타입 정의 (선택 사항)
- `GameMenuWithTutorialExample.tsx` – TutorialModal까지 포함한 통합 예제

## 사용 방법

1. `GameMenuModal.tsx`(및 필요 시 `GameMenuModal.types.ts`)를 프로젝트의 `components` 폴더에 복사합니다.
2. 부모 컴포넌트에 상태와 핸들러를 추가합니다.

```tsx
const [showMenu, setShowMenu] = useState(false);
const [isTutorialOpen, setIsTutorialOpen] = useState(false);

const handleOpenMenu = () => {
  setShowMenu(true);
  setIsPaused(true);
};

const handleCloseMenu = () => {
  setShowMenu(false);
  setIsPaused(false);
};

const handleOpenTutorial = () => {
  setShowMenu(false);
  setIsTutorialOpen(true);
};
```

3. 렌더링 코드에서 모달을 호출합니다.

```tsx
<GameMenuModal
  isOpen={showMenu}
  onClose={handleCloseMenu}
  onOpenGuide={handleOpenTutorial}
  onEndGame={handleEndGame}
  onExit={handleExit}
/>

- `GameMenuModal.tsx`는 `TutorialModal`을 내부에서 렌더링하지 않습니다.
- Game Guide를 함께 열고 싶다면 별도의 상태로 `TutorialModal`을 연결하세요.

```tsx
<TutorialModal
  isOpen={isTutorialOpen}
  onClose={() => {
    setIsTutorialOpen(false);
    setIsPaused(false);
    setShowMenu(false);
  }}
  variant="stage"
/>
```

## 디자인 스펙

- 전체 화면 딤: `rgba(0,0,0,0.5)` + 블러
- 모달 사이즈: 560px 폭, 라운드 24px
- 버튼 스타일: 기본 그라데이션, hover 시 scale/색상 변화
- 닫기 버튼: 상단 20px, 우측 40px, 크기 48×48 ( `/button/close.png` 사용 )

## 참고

- `TutorialModal`은 `variant="stage"`로 호출하면 1280×800 게임 스테이지 안에서만 출력됩니다.
- 필요 시 `buttonLabels` props를 이용해 버튼 텍스트를 변경하세요.

- `GameMenuWithTutorialExample.tsx`는 메뉴 + 튜토리얼을 동시에 다루는 완성 예제입니다.

