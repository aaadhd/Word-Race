# Word Race 화면별 기획 가이드

Word Race 게임의 주요 화면과 실제 코드에 적용된 룰, 인터랙션을 정리한 문서입니다. (`App.tsx`, `TracingActivity.tsx`, `QuizActivity.tsx` 등 현재 리포지토리 기준)

---

## 1. 타이틀 & 온보딩 (Title Screen)

### 1.1 구성 요소
| 영역 | 설명 | 비고 |
|------|------|------|
| 헤드라인 | `WORD RACE` | 대문자, 48px |
| 서브카피 | `Trace or draw the word right and fast!`<br>`Write it right, write it fast!` | 18px, 2줄 |
| CTA 버튼 | `Start` / `Game Guide` | 버튼 2개 |
| 배경 | `/public/images/title_bg.png` + 로고 | 이미 사용 중 |

### 1.2 인터랙션
- `Start`: 팀 설정 화면(`Team Setup`)으로 이동, 트랜지션 `fade (300ms)`
- `Game Guide`: 튜토리얼 모달(`TutorialModal`) 열림

### 1.3 개발 참고
- 온보딩 카피는 `constants/gameDescriptions.ts`로 추출 (중복 사용 대비)
- 게임 가이드 버튼은 `TutorialModal`과 동일 인스턴스로 연결

---

## 2. 팀 설정 (Team Setup Screen)

### 2.1 구성 요소
| 영역 | 설명 | 가이드 |
|------|------|--------|
| 헤더 카피 | `Choose your team players` | 36px |
| 서브 카피 | `Add or remove students and balance both teams.` | 18px |
| 팀 카드 | Team A, Team B 리스트 | 최소 6명, 최대 10명 |
| 액션 버튼 | `Shuffle Teams`, `Start Game` | 고정 하단 |
| info 버튼 | `Tutorial Modal` 트리거 | 상단 우측 |

### 2.2 인터랙션
- `Shuffle Teams`: 랜덤 셔플, 애니메이션 300ms
- `Start Game`: 라운드 시작으로 전환 (`RoundStart`)
- `Info (i)` 버튼: `SettingsGuideModal` 열림 (info.png)

### 2.3 QA 체크
- 플레이어 추가/삭제 시 레이아웃 깨짐 없는지
- 셔플 후 포커스 상태 유지 여부
- info 모달이 1280×800 기준 중앙에 배치되는지

---

## 3. 게임 설정 (Game Settings Modal)

### 3.1 구성 요소
| 영역 | 설명 |
|------|------|
| Left Panel | 게임 이미지, `Game Guide` 버튼 |
| Right Panel | 레슨 선택, Learning Focus, Play Type, Quiz 옵션, Rounds |
| 상단 | Back / Info / Close 버튼 |

### 3.2 카피
- Game Guide 버튼: `Game Guide`
- Info 모달 이미지: `/public/images/info.png`

### 3.3 개발 포인트
- Info 버튼은 `SettingsGuideModal` (1280×800)
- Game Guide 버튼: `TutorialModal` (variant=`stage`)
- 캡처 모드 `Ctrl+Shift+C` 시 헤더, 점수판 숨김+위치 보정 확인

---

## 4. 게임 진행 (Tracing / Quiz)

### 4.1 공통 요소
- 배경: `/public/images/background.png`
- 동물: 라운드별 스프라이트 (alpaca, chick, …)
- 상단 헤더: 타이틀, 라운드 번호, Pause/Menu/Exit 버튼
- 좌우 점수판: Team A/B 점수

### 4.2 카피 & UX
| 요소 | 카피 |
|------|------|
| 헤더 타이틀 | `Word Race` (Upper / Title Case) |
| Pause 버튼 | Tooltip `Pause Game` |
| Menu 버튼 | `Game Menu` 모달 오픈 |
| Game Menu 버튼 리스트 | `Game Guide`, `End Game`, `Exit` |
| Quiz Popup | 질문/보기 카피는 `roundData` 기반 |

### 4.3 캡처 모드 (디자이너용)
- 단축키: `Ctrl + Shift + C`
- 헤더/점수판 미렌더링, 배경·동물 위치 동일 유지
- 상단 딤, 블러 제거 및 1280×800 고정

---

## 5. 게임 메뉴 (Game Menu Modal)

### 5.1 구성 요소
| 항목 | 내용 |
|------|------|
| 타이틀 | `Game Menu` |
| 버튼 | `Game Guide`, `End Game`, `Exit` |
| 닫기 버튼 | `/public/button/close.png` (48×48, top 20px, right 40px) |
| 배경 | `bg-black/50` + blur |

### 5.2 개발 참고
- 공통 컴포넌트: `reference/game-menu-modal/GameMenuModal.tsx`
- `GameMenuWithTutorialExample.tsx` 참고하여 튜토리얼 연동

---

## 6. 게임 종료 (Game End)

### 6.1 카피
| 영역 | 내용 |
|------|------|
| 헤드라인 | `Word Race Champion!` |
| 본문 | 점수 요약: `Team A 12 pts` / `Team B 10 pts` |
| CTA | `Play Again` |

### 6.2 디자인 메모
- 축하 애니메이션(Confetti) 유지
- 배경 흐림 정도 `backdrop-blur-sm` 권장

---

## 7. 튜토리얼 모달 (Game Guide)

### 7.1 카피
1. `Team Up! — It's Team A vs Team B! Both teams try to win in each round!`
2. `Two Ways to Play! — Trace Mode and Draw Mode. Let me show you both!`
3. `Trace Mode — Follow the dotted lines with your finger.`
4. `Draw Mode — Look at the picture and write the word yourself!`
5. `Do Your Best! — Write well to win! Try your best!`
6. `Answer the Quiz! — The winner gets a quiz for bonus points.`
7. `Get Points & Win! — Highest score wins the Word Race!`

### 7.2 디자인
- 모달 크기: 1000×640
- 닫기 버튼: top 20px / right 40px / 48×48
- 이미지: `/public/tutorial/1.jpg ~ 7.jpg`

---

## 8. QA 체크리스트 (공통)
1. 모든 화면이 1280×800 기준으로 레이아웃 무너짐 없는지
2. 캡처 모드 ON/OFF 시 동물/배경 위치 변동 없는지
3. Game Guide, Info, Game Menu 모달의 닫기 버튼 좌표(20px, 40px)가 일관적인지
4. Word Race 소개 카피가 타이틀/세팅/캡처 화면에서 동일한지
5. 다국어 대응 필요 시 문자열 분리 여부 점검

---

## 9. 게임 룰 & 로직 요약

### 9.1 기본 룰
- **진행 방식**: 팀 대결 (Team A vs Team B), 라운드 단위 진행
- **플레이어 순서**: 각 라운드마다 두 팀에서 1명씩 참여
- **플레이 방식**: `Trace` 모드(점선 따라 쓰기) 또는 `Draw` 모드(자유 드로잉)
- **제한 시간**: `TracingActivity`에서 `tracingTimer`로 관리 (설정 시 노출)

### 9.2 라운드 흐름
1. **RoundStart** 화면: 카운트다운 후 `Tracing` 시작
2. **TracingActivity**: 두 팀 동시에 단어를 따라쓰기/그리기
   - Winner 판단: `handleTeamDone` 콜백 → 더 빨리 완료한 팀
3. **QuizActivity** (선택): 라운드 승리 팀이 퀴즈 풀이
   - 정답 시 +30, 오답/시간 초과 시 +10 (승리 팀만 점수 변동)
4. **RoundResult**: 라운드 승패 및 점수 업데이트, 다음 라운드로 이동

### 9.3 점수 규칙 (실제 코드 기준)
- **Trace/Draw (퀴즈 미포함)**  
  - 라운드 승리 팀: +30  
  - 패배 팀: 0
- **Quiz 포함 모드**  
  - 퀴즈 정답: +30 (승리 팀만)  
  - 퀴즈 오답·시간 초과: +10 (실행 팀만)  
  - 상대 팀: 변화 없음
- 점수는 `scores[Team.A/B]` 상태에 누적 저장

### 9.4 타이머 로직
- `showTracingTimer=true`일 때 헤더 중앙에 노출
- timer 값은 `handleTracingTimerChange` → `setTracingTimer`
- 0초 도달 시 자동 종료 및 결과 처리

### 9.5 메뉴/일시정지
- `Pause` 버튼: `isPaused` 토글 → 캔버스, 타이머 정지
- `Menu` 버튼: `GameMenuModal` 열림, 게임 일시정지 상태 유지
- `Menu` → `Game Guide`: 튜토리얼 모달 열림, 닫으면 게임 재개
- `End Game`: 즉시 `GameEnd` 화면으로 이동
- `Exit`: `GameSetup`으로 복귀

### 9.6 캡처 모드
- 단축키: `Ctrl + Shift + C`
- HUD(헤더, 점수판, 딤) 비활성화, 배경·동물 위치 고정
- 디자이너 캡처용, 모드 해제 시 모든 UI 복원

---

> 추가로 필요한 화면이나 수정 사항은 이 문서를 업데이트하고 디자인·개발팀 슬랙 채널에 공유해주세요.

