// Animal mascot configurations for each round cycle

export interface AnimalConfig {
  name: string;
  videoSrc: string;
  imageSrc: string;
  height: string;
  scaleX: number;
  side: 'left' | 'right';
}

export interface RoundAnimals {
  teamA: AnimalConfig;
  teamB: AnimalConfig;
}

// Animal configurations by cycle round (1-4)
export const ANIMAL_CONFIGS: Record<number, RoundAnimals> = {
  1: {
    teamA: {
      name: 'alpaca',
      videoSrc: '/videos/alpaca.mp4',
      imageSrc: '/images/alpaca.png',
      height: '740px',
      scaleX: 1.1,
      side: 'left'
    },
    teamB: {
      name: 'chick',
      videoSrc: '/videos/chick.mp4',
      imageSrc: '/images/chick.png',
      height: '740px',
      scaleX: 1.07,
      side: 'right'
    }
  },
  2: {
    teamA: {
      name: 'panda',
      videoSrc: '/videos/panda.mp4',
      imageSrc: '/images/panda.png',
      height: '740px',
      scaleX: 1.1,
      side: 'left'
    },
    teamB: {
      name: 'sloth',
      videoSrc: '/videos/sloth.mp4',
      imageSrc: '/images/sloth.png',
      height: '740px',
      scaleX: 1.05,
      side: 'right'
    }
  },
  3: {
    teamA: {
      name: 'koala',
      videoSrc: '/videos/koala.mp4',
      imageSrc: '/images/koala.png',
      height: '740px',
      scaleX: 1.15,
      side: 'left'
    },
    teamB: {
      name: 'tiger',
      videoSrc: '/videos/tiger.mp4',
      imageSrc: '/images/tiger.png',
      height: '740px',
      scaleX: 1.1,
      side: 'right'
    }
  },
  4: {
    teamA: {
      name: 'bigcat',
      videoSrc: '/videos/bigcat.mp4',
      imageSrc: '/images/bigcat.png',
      height: '760px',
      scaleX: 0.95,
      side: 'left'
    },
    teamB: {
      name: 'capybara',
      videoSrc: '/videos/capybara.mp4',
      imageSrc: '/images/capybara.png',
      height: '760px',
      scaleX: 0.95,
      side: 'right'
    }
  }
};
