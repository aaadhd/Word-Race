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
