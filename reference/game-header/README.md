# Game Header

게임 플레이 화면 상단에 제목, 라운드/타이머, 제어 버튼(일시정지, 메뉴, 종료)을 표시하는 헤더 컴포넌트입니다.

## 구성 파일

- `GameHeader.tsx` – 헤더 UI 및 로직
- `GameHeaderExample.tsx` – 메뉴/튜토리얼과 함께 연동하는 예제

## Props

| Prop | Type | 기본값 | 설명 |
|------|------|--------|------|
| `title` | `string` | – | 헤더 좌측에 표시되는 게임 타이틀 |
| `currentRound` | `number` | – | 라운드 번호. 값이 있으면 중앙에 `Round X` 표시 |
| `onPause` | `() => void` | – | 일시정지 버튼 클릭 핸들러 |
| `showPause` | `boolean` | `false` | 일시정지 버튼 표시 여부 |
| `isPaused` | `boolean` | `false` | (옵션) 외부에서 일시정지 상태를 관리할 때 참고용 |
| `onOpenMenu` | `() => void` | – | 메뉴 버튼 클릭 시 호출 |
| `showMenuButton` | `boolean` | `false` | 메뉴 버튼 표시 여부 |
| `onExit` | `() => void` | – | 종료 버튼 클릭 시 호출 |
| `showExitButton` | `boolean` | `false` | 종료 버튼 표시 여부 |
| `buttonsDisabled` | `boolean` | `false` | 버튼 일괄 비활성화 |
| `showTimer` | `boolean` | `false` | 타이머 표시 여부 (`true`면 라운드 대신 타이머 표시) |
| `timerValue` | `number` | `0` | 초 단위 남은 시간 |

## 사용 방법

1. `GameHeader.tsx`를 프로젝트의 `components` 폴더에 복사합니다.
2. Tailwind CSS를 사용한다는 가정 하에 스타일이 동작합니다. 다른 스타일 시스템이라면 클래스나 인라인 스타일을 수정하세요.
3. 필요한 버튼의 핸들러를 연결합니다.

```tsx
import GameHeader from '@/components/GameHeader';

<GameHeader
  title="Word Race"
  currentRound={currentRound}
  showPause
  onPause={handlePause}
  showMenuButton
  onOpenMenu={handleOpenMenu}
  showExitButton
  onExit={handleExit}
  buttonsDisabled={isPaused}
/>
```

## 타이머 모드

타이머를 표시하고 싶다면 `showTimer`와 `timerValue`를 함께 넘겨주세요.

```tsx
<GameHeader
  title="Word Race"
  showTimer
  timerValue={timeLeft} // 초 단위
  showPause
  onPause={handlePause}
/>
```

## 참고

- 메뉴 버튼/튜토리얼과 함께 쓰고 싶다면 `reference/game-menu-modal/` 폴더의 예제를 참고하세요.
- `GameHeaderExample.tsx`에는 헤더와 메뉴, 튜토리얼 모달을 모두 연동한 샘플 코드가 포함되어 있습니다.

