# Settings Guide Modal

세팅 화면의 `Info` 버튼을 눌렀을 때 표시되는 안내 이미지를 다른 게임에서도 재사용할 수 있도록 만든 모달입니다.

## 구성 파일

- `SettingsGuideModal.tsx` – 모달 컴포넌트
- `public/images/info.png` – 안내 이미지 (1280×800 권장)
- `public/button/close.png` – 닫기 버튼 이미지 (48×48)

## 사용 방법

1. `SettingsGuideModal.tsx`를 프로젝트의 `components` 폴더로 복사합니다.
2. `public/images` 폴더에 `info.png` 이미지를 넣습니다.  
   - 해상도는 1280×800에 맞춰 제작하면 레이아웃이 가장 안정적입니다.
3. 부모 컴포넌트에서 다음과 같이 연결합니다.

```tsx
import SettingsGuideModal from '@/components/SettingsGuideModal';

function GameSettings() {
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsInfoOpen(true)}>Info</button>

      <SettingsGuideModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
      />
    </>
  );
}
```

## 디자인 스펙

- 배경: 반투명(60%) 블러 딤
- 본문: 1280×800 사이즈 이미지 전체 표시
- 닫기 버튼: 화면 상단에서 20px, 우측에서 40px 떨어진 위치 / 48×48 크기

## 참고 사항

- `info.png`만 교체하면 다른 게임에서도 그대로 활용할 수 있습니다.
- 필요하면 `SettingsGuideModal.tsx`의 `overlayClassName` 등을 추가해 색상이나 위치를 확장할 수 있습니다.

