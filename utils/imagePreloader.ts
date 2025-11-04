// Image preloader utility for smoother transitions

const imageCache = new Map<string, HTMLImageElement>();
const loadingPromises = new Map<string, Promise<void>>();

/**
 * Preload a single image
 */
export const preloadImage = (src: string): Promise<void> => {
  // If already cached, return immediately
  if (imageCache.has(src)) {
    return Promise.resolve();
  }

  // If already loading, return existing promise
  if (loadingPromises.has(src)) {
    return loadingPromises.get(src)!;
  }

  // Start loading
  const promise = new Promise<void>((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      imageCache.set(src, img);
      loadingPromises.delete(src);
      resolve();
    };

    img.onerror = () => {
      loadingPromises.delete(src);
      reject(new Error(`Failed to load image: ${src}`));
    };

    img.src = src;
  });

  loadingPromises.set(src, promise);
  return promise;
};

/**
 * Preload multiple images
 */
export const preloadImages = (sources: string[]): Promise<void[]> => {
  return Promise.all(sources.map(src => preloadImage(src)));
};

/**
 * Get the next round cycle number
 */
export const getNextCycleRound = (currentRound: number): number => {
  const nextRound = currentRound + 1;
  return nextRound <= 4 ? nextRound : ((nextRound - 1) % 4) + 1;
};

/**
 * Get image sources for a specific cycle round
 */
export const getImagesForRound = (cycleRound: number): string[] => {
  const images = [
    '/images/background.png', // Background is always needed
  ];

  // Add animal images based on cycle round
  switch (cycleRound) {
    case 1:
      images.push('/images/alpaca.png', '/images/chick.png');
      break;
    case 2:
      images.push('/images/panda.png', '/images/sloth.png');
      break;
    case 3:
      images.push('/images/koala.png', '/images/tiger.png');
      break;
    case 4:
      images.push('/images/bigcat.png', '/images/capybara.png');
      break;
  }

  return images;
};

/**
 * Preload images for the next round
 */
export const preloadNextRoundImages = (currentRound: number): Promise<void[]> => {
  const nextCycle = getNextCycleRound(currentRound);
  const imagesToLoad = getImagesForRound(nextCycle);

  console.log(`🖼️ Preloading images for next round (cycle ${nextCycle}):`, imagesToLoad);

  return preloadImages(imagesToLoad);
};

/**
 * Preload all game images (for initial load)
 */
export const preloadAllGameImages = (): Promise<void[]> => {
  const allImages = [
    '/images/background.png',
    '/images/alpaca.png',
    '/images/chick.png',
    '/images/panda.png',
    '/images/sloth.png',
    '/images/koala.png',
    '/images/tiger.png',
    '/images/bigcat.png',
    '/images/capybara.png',
  ];

  console.log('🖼️ Preloading all game images...');

  return preloadImages(allImages);
};

// ========================
// Video Preloader
// ========================

const videoCache = new Map<string, HTMLVideoElement>();
const videoLoadingPromises = new Map<string, Promise<void>>();

/**
 * Preload a single video by creating a hidden HTMLVideoElement and forcing a load.
 * We resolve when enough data for metadata is loaded; the browser will cache the data.
 */
export const preloadVideo = (src: string): Promise<void> => {
  if (videoCache.has(src)) return Promise.resolve();
  if (videoLoadingPromises.has(src)) return videoLoadingPromises.get(src)!;

  const promise = new Promise<void>((resolve, reject) => {
    const video = document.createElement('video');
    // Make sure it does not autoplay or show on screen
    video.preload = 'auto';
    video.muted = true;
    video.src = src;
    // Some browsers fire onloadeddata sooner than oncanplaythrough; metadata is enough for quick start
    const cleanup = () => {
      video.removeEventListener('loadeddata', onLoaded);
      video.removeEventListener('error', onError);
    };
    const onLoaded = () => {
      cleanup();
      videoCache.set(src, video);
      videoLoadingPromises.delete(src);
      resolve();
    };
    const onError = () => {
      cleanup();
      videoLoadingPromises.delete(src);
      reject(new Error(`Failed to load video: ${src}`));
    };
    video.addEventListener('loadeddata', onLoaded, { once: true });
    video.addEventListener('error', onError, { once: true });
    // Kick off
    try { video.load(); } catch {}
  });

  videoLoadingPromises.set(src, promise);
  return promise;
};

export const preloadVideos = (sources: string[]): Promise<void[]> => {
  return Promise.all(sources.map(src => preloadVideo(src)));
};

export const getVideosForRound = (cycleRound: number): string[] => {
  switch (cycleRound) {
    case 1: return ['/videos/alpaca_bg.mp4'];
    case 2: return ['/videos/panda_bg.mp4'];
    case 3: return ['/videos/koala_bg.mp4'];
    case 4: return ['/videos/bigcat_bg.mp4'];
    default: return [];
  }
};

export const preloadNextRoundVideos = (currentRound: number): Promise<void[]> => {
  const nextCycle = getNextCycleRound(currentRound);
  const videosToLoad = getVideosForRound(nextCycle);
  if (videosToLoad.length === 0) return Promise.resolve([]);
  console.log(`🎬 Preloading videos for next round (cycle ${nextCycle}):`, videosToLoad);
  return preloadVideos(videosToLoad);
};

export const preloadAllGameVideos = (): Promise<void[]> => {
  const allVideos = [
    '/videos/alpaca_bg.mp4',
    '/videos/panda_bg.mp4',
    '/videos/koala_bg.mp4',
    '/videos/bigcat_bg.mp4'
  ];
  console.log('🎬 Preloading all game videos...');
  return preloadVideos(allVideos);
};

// ========================
// Audio Preloader
// ========================

const audioCache = new Map<string, HTMLAudioElement>();
const audioLoadingPromises = new Map<string, Promise<void>>();

export const preloadAudio = (src: string): Promise<void> => {
  if (audioCache.has(src)) return Promise.resolve();
  if (audioLoadingPromises.has(src)) return audioLoadingPromises.get(src)!;

  const promise = new Promise<void>((resolve, reject) => {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.src = src;

    const cleanup = () => {
      audio.removeEventListener('canplaythrough', onReady);
      audio.removeEventListener('error', onError);
    };
    const onReady = () => {
      cleanup();
      audioCache.set(src, audio);
      audioLoadingPromises.delete(src);
      resolve();
    };
    const onError = () => {
      cleanup();
      audioLoadingPromises.delete(src);
      reject(new Error(`Failed to load audio: ${src}`));
    };

    audio.addEventListener('canplaythrough', onReady, { once: true });
    audio.addEventListener('error', onError, { once: true });
    try { audio.load(); } catch {}
  });

  audioLoadingPromises.set(src, promise);
  return promise;
};

export const preloadAudios = (sources: string[]): Promise<void[]> => {
  return Promise.all(sources.map(src => preloadAudio(src)));
};

export const preloadAllMusics = (): Promise<void[]> => {
  const musics = [
    '/musics/bgm.mp3'
  ];
  console.log('🎵 Preloading musics...', musics);
  return preloadAudios(musics);
};