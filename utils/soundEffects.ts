// Web Audio API를 사용한 게임 효과음 유틸리티

let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

// 버튼 클릭 사운드 (경쾌한 "딸깍")
export const playButtonClick = () => {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.05);

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    oscillator.type = 'sine';
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  } catch (error) {
    console.log('Sound not supported');
  }
};

// 라운드 시작 사운드 (신나는 "띠링~")
export const playRoundStart = () => {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // 상승하는 멜로디
    oscillator.frequency.setValueAtTime(523, ctx.currentTime); // C5
    oscillator.frequency.setValueAtTime(659, ctx.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(784, ctx.currentTime + 0.2); // G5

    gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

    oscillator.type = 'sine';
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.4);
  } catch (error) {
    console.log('Sound not supported');
  }
};

// 퀴즈 정답 사운드 (환호하는 "딩동댕!")
export const playCorrectAnswer = () => {
  try {
    const ctx = getAudioContext();

    // 3개 음을 연속으로 재생
    const notes = [523, 659, 784]; // C5, E5, G5

    notes.forEach((freq, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.1);

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime + index * 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + index * 0.1 + 0.15);

      oscillator.type = 'sine';
      oscillator.start(ctx.currentTime + index * 0.1);
      oscillator.stop(ctx.currentTime + index * 0.1 + 0.15);
    });
  } catch (error) {
    console.log('Sound not supported');
  }
};

// 퀴즈 오답 사운드 (실망스러운 "뚜뚜웅~")
export const playWrongAnswer = () => {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // 하강하는 소리
    oscillator.frequency.setValueAtTime(400, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3);

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    oscillator.type = 'sawtooth';
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);
  } catch (error) {
    console.log('Sound not supported');
  }
};

// 타이머 카운트다운 사운드 (긴장감 있는 "틱톡")
export const playTimerTick = () => {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(1000, ctx.currentTime);

    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

    oscillator.type = 'square';
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.05);
  } catch (error) {
    console.log('Sound not supported');
  }
};

// 게임 종료 사운드 (축하하는 "팡파레")
export const playGameEnd = () => {
  try {
    const ctx = getAudioContext();

    // 팡파레 멜로디
    const melody = [
      { freq: 523, time: 0 },     // C5
      { freq: 523, time: 0.15 },  // C5
      { freq: 659, time: 0.3 },   // E5
      { freq: 784, time: 0.45 },  // G5
      { freq: 1047, time: 0.6 }   // C6
    ];

    melody.forEach(note => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time);

      gainNode.gain.setValueAtTime(0.4, ctx.currentTime + note.time);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + note.time + 0.2);

      oscillator.type = 'sine';
      oscillator.start(ctx.currentTime + note.time);
      oscillator.stop(ctx.currentTime + note.time + 0.2);
    });
  } catch (error) {
    console.log('Sound not supported');
  }
};

// 승리 팀 발표 사운드 (드라마틱한 "짜잔!")
export const playWinnerAnnounce = () => {
  try {
    const ctx = getAudioContext();
    const oscillator1 = ctx.createOscillator();
    const oscillator2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(ctx.destination);

    // 화음으로 풍성한 소리
    oscillator1.frequency.setValueAtTime(523, ctx.currentTime);
    oscillator2.frequency.setValueAtTime(659, ctx.currentTime);

    gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    oscillator1.type = 'sine';
    oscillator2.type = 'sine';

    oscillator1.start(ctx.currentTime);
    oscillator2.start(ctx.currentTime);
    oscillator1.stop(ctx.currentTime + 0.5);
    oscillator2.stop(ctx.currentTime + 0.5);
  } catch (error) {
    console.log('Sound not supported');
  }
};

// 그림 완성 사운드 (성취감 있는 "띠링딩!")
export const playDrawingComplete = () => {
  try {
    const ctx = getAudioContext();

    // 2개 음을 연속으로 재생 (상승하는 화음)
    const melody = [
      { freq: 784, time: 0, duration: 0.15 },     // G5
      { freq: 988, time: 0.1, duration: 0.2 }     // B5
    ];

    melody.forEach(note => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time);

      gainNode.gain.setValueAtTime(0.35, ctx.currentTime + note.time);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + note.time + note.duration);

      oscillator.type = 'sine';
      oscillator.start(ctx.currentTime + note.time);
      oscillator.stop(ctx.currentTime + note.time + note.duration);
    });
  } catch (error) {
    console.log('Sound not supported');
  }
};

// 페이지 전환 사운드 (부드러운 "슝~")
export const playPageTransition = () => {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(600, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.15);

    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    oscillator.type = 'sine';
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
  } catch (error) {
    console.log('Sound not supported');
  }
};

// 호버 사운드 (미묘한 "톡")
export const playHover = () => {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(1200, ctx.currentTime);

    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

    oscillator.type = 'sine';
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.05);
  } catch (error) {
    console.log('Sound not supported');
  }
};
