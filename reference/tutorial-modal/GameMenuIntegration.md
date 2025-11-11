# Game Menu에 Tutorial Modal 통합하기

Word Race 게임에서 구현한 Game Menu와 Tutorial Modal 통합 패턴입니다.

## 개요

게임 플레이 중 사용자가 메뉴 버튼을 눌러:
1. 게임 일시 중지
2. Game Guide 버튼으로 튜토리얼 확인
3. 튜토리얼 종료 시 게임 자동 재개

## 구현 단계

### 1. State 추가

```typescript
const [isPaused, setIsPaused] = useState<boolean>(false);
const [showMenu, setShowMenu] = useState<boolean>(false);
const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);
```

### 2. 핸들러 함수 구현

```typescript
const handleOpenMenu = () => {
  setShowMenu(true);
  setIsPaused(true);  // 게임 일시 중지
}

const handleCloseMenu = () => {
  setShowMenu(false);
  setIsPaused(false);  // 게임 재개
}
```

### 3. Game Menu Modal

```typescript
{/* Game Menu Modal */}
{showMenu && (
  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-8 text-center relative">
      {/* Close Button - 모달 우상단 걸침 */}
      <button
        onClick={handleCloseMenu}
        className="absolute -top-3 -right-3 w-12 h-12 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-800 transition-colors shadow-lg"
        aria-label="Close menu"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <h2 className="text-4xl font-display text-primary-text mb-6">Game Menu</h2>
      <div className="flex flex-col gap-4">
        <button
          onClick={() => {
            setShowMenu(false);
            setIsTutorialOpen(true);
          }}
          className="px-8 py-4 text-2xl font-display text-white bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg transition-transform transform hover:scale-105"
        >
          Game Guide
        </button>
        <button
          onClick={handleEndGame}
          className="px-8 py-4 text-2xl font-display text-white bg-orange-500 hover:bg-orange-600 rounded-full shadow-lg transition-transform transform hover:scale-105"
        >
          End Game
        </button>
        <button
          onClick={handleExit}
          className="px-8 py-4 text-2xl font-display text-white bg-red-500 hover:bg-red-600 rounded-full shadow-lg transition-transform transform hover:scale-105"
        >
          Exit
        </button>
      </div>
    </div>
  </div>
)}
```

### 4. Tutorial Modal 통합

```typescript
{/* Tutorial Modal */}
<TutorialModal
  isOpen={isTutorialOpen}
  onClose={() => {
    setIsTutorialOpen(false);
    setIsPaused(false);     // 일시 중지 해제
    setShowMenu(false);     // 메뉴 상태 초기화
  }}
/>
```

### 5. Pause Overlay 조정

```typescript
{/* Pause Overlay - showMenu일 때는 표시 안 함 */}
{isPaused && !showMenu && (
  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-8 text-center">
      <h2 className="text-4xl font-display text-primary-text mb-6">PAUSED</h2>
      <button
        onClick={handleResume}
        className="px-8 py-4 text-2xl font-display text-white bg-green-500 hover:bg-green-600 rounded-full shadow-lg transition-transform transform hover:scale-105"
      >
        Resume
      </button>
    </div>
  </div>
)}
```

### 6. 게임 로직에 일시 중지 적용

게임 타이머나 활동에 `isPaused` 또는 `showMenu` 상태 전달:

```typescript
<DrawingActivity
  // ...other props
  isPaused={gameState === GameState.QUIZ || isPaused || showMenu}
/>
```

## 타이머 일시 중지 구현

### TracingCanvas 컴포넌트에서 일시 중지 시간 추적

```typescript
const pausedAtRef = useRef<number | null>(null);
const totalPausedTimeRef = useRef<number>(0);

// 일시 중지 시간 추적
useEffect(() => {
  if (isPaused) {
    // 일시 중지 시작
    if (pausedAtRef.current === null) {
      pausedAtRef.current = Date.now();
    }
  } else {
    // 일시 중지 해제
    if (pausedAtRef.current !== null) {
      const pausedDuration = Date.now() - pausedAtRef.current;
      totalPausedTimeRef.current += pausedDuration;
      pausedAtRef.current = null;
    }
  }
}, [isPaused]);

// 타이머 계산 시 일시 중지 시간 제외
useEffect(() => {
  if (isPaused || startAtMs == null) return;

  const compute = () => {
    const elapsedSec = Math.floor((Date.now() - startAtMs - totalPausedTimeRef.current) / 1000);
    const remaining = Math.max(0, TRACING_TIME_SECONDS - elapsedSec);
    setTimeLeft(remaining);
    if (remaining === 0) {
      finishAttempt();
    }
  };

  compute();
  const id = setInterval(compute, 250);
  return () => clearInterval(id);
}, [isPaused, startAtMs, finishAttempt]);
```

## 주요 포인트

### 1. 딤 레이어 중복 방지
- `isPaused && !showMenu` 조건으로 Pause Overlay와 Game Menu의 딤이 겹치지 않도록 함
- 두 딤이 겹치면 화면이 너무 어두워짐

### 2. 상태 초기화
- Tutorial Modal을 닫을 때 `isPaused`, `showMenu` 모두 초기화
- 사용자가 Tutorial을 보고 돌아왔을 때 Pause 화면이 나타나지 않도록 함

### 3. 닫기 버튼 위치
- `absolute -top-3 -right-3`으로 모달 밖으로 살짝 튀어나오게 배치
- 모달 제목과 겹치지 않고 눈에 잘 띔

### 4. 일시 중지 시간 보정
- `totalPausedTimeRef`에 누적된 일시 중지 시간 저장
- 타이머 계산 시 이 시간을 빼서 실제 경과 시간만 계산
- 여러 번 일시 중지해도 정확하게 누적됨

## 디자인 사양

### Game Menu Modal
- 배경: `bg-white rounded-2xl p-8`
- 제목: `text-4xl font-display`
- 버튼 간격: `gap-4`
- 버튼 크기: `px-8 py-4 text-2xl`
- 버튼 효과: `shadow-lg hover:scale-105`

### Close Button
- 크기: `w-12 h-12`
- 위치: `-top-3 -right-3` (모달 밖으로 튀어나옴)
- 배경: `bg-gray-700 hover:bg-gray-800`
- 아이콘: `w-6 h-6 text-white`

### Z-index 구조
- Game Menu: `z-50`
- Tutorial Modal: 내부에서 자체 z-index 관리
- 딤 레이어: 각 컴포넌트 내부

## 7살 대상 튜토리얼 작성 팁

1. **간단한 단어 사용**
   - "game modes" → "ways to play"
   - "neatly" → "nicely"
   - "race against each other" → "try to win"

2. **짧은 문장**
   - 한 문장은 10단어 이하 권장
   - 복잡한 문법 피하기

3. **구체적인 동작 설명**
   - "Follow the dotted lines with your finger"
   - "Look at the picture"
   - "Answer it right"

4. **긍정적인 격려**
   - "Try your best!"
   - "Write well to win!"

## 예시: Word Race 튜토리얼

```typescript
const TUTORIAL_STEPS: TutorialStep[] = [
  {
    image: '/tutorial/1.jpg',
    title: 'Team Up!',
    description: "It's Team A vs Team B! Both teams try to win in each round!",
  },
  {
    image: '/tutorial/2.jpg',
    title: 'Two Ways to Play!',
    description: 'There are two ways to play: Trace Mode and Draw Mode. Let me show you both!',
  },
  {
    image: '/tutorial/3.jpg',
    title: 'Trace Mode',
    description: 'Follow the dotted lines with your finger. Write the word nicely on the lines!',
  },
  {
    image: '/tutorial/4.jpg',
    title: 'Draw Mode',
    description: 'Look at the picture. Think of the word and write it by yourself!',
  },
  {
    image: '/tutorial/5.jpg',
    title: 'Do Your Best!',
    description: 'Write well to win! Try your best!',
  },
  {
    image: '/tutorial/6.jpg',
    title: 'Answer the Quiz!',
    description: 'The winning team gets a quiz! Answer it right to get more points!',
  },
  {
    image: '/tutorial/7.jpg',
    title: 'Get Points & Win!',
    description: 'Play all the rounds and answer the quiz. The team with more points wins!',
  },
];
```

## 체크리스트

- [ ] Game Menu 모달 구현
- [ ] Tutorial Modal import
- [ ] State 추가 (isPaused, showMenu, isTutorialOpen)
- [ ] 핸들러 함수 구현
- [ ] 닫기 버튼 추가 (모달 우상단)
- [ ] Tutorial Modal onClose에서 상태 초기화
- [ ] Pause Overlay 조건 수정 (!showMenu)
- [ ] 게임 로직에 isPaused 전달
- [ ] 타이머 일시 중지 시간 보정 구현
- [ ] 튜토리얼 내용을 대상 연령에 맞게 작성
- [ ] 이미지 파일 준비 (1.jpg ~ N.jpg)
- [ ] 테스트: 메뉴 열기/닫기
- [ ] 테스트: Tutorial 열기/닫기
- [ ] 테스트: 일시 중지 시간 정확도
