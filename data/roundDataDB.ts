import type { RoundData } from '../types.ts';

/**
 * This is your local database for round data.
 * 
 * To add a custom image:
 * 1. Go to an online image to base64 converter (e.g., https://www.base64-image.de/).
 * 2. Upload your image and copy the generated text string (it starts with 'data:image/...').
 * 3. Paste the entire string as the value for the `wordImage` property.
 * 
 * If you don't want an image for a word, you can set `wordImage: undefined`.
 */
export const roundDataDB: RoundData[] = [
  {
    word: 'dog',
    wordImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop&crop=center',
    quiz: {
      question: 'Which animal is a pet and says "woof"?',
      options: ['Cat', 'Dog', 'Bird', 'Fish'],
      correctAnswer: 'Dog',
    },
  },
  {
    word: 'house',
    wordImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=300&fit=crop&crop=center',
    quiz: {
      question: 'Where do people live?',
      options: ['House', 'Tree', 'Car', 'Water'],
      correctAnswer: 'House',
    },
  },
  {
    word: 'fish',
    wordImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=300&fit=crop&crop=center',
    quiz: {
      question: 'What animal lives in water and has fins?',
      options: ['Bird', 'Fish', 'Dog', 'Cat'],
      correctAnswer: 'Fish',
    },
  },
  {
    word: 'star',
    wordImage: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=300&h=300&fit=crop&crop=center',
    quiz: {
      question: 'What shines in the night sky?',
      options: ['Sun', 'Moon', 'Star', 'Cloud'],
      correctAnswer: 'Star',
    },
  },
  {
    word: 'tree',
    wordImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop&crop=center',
    quiz: {
      question: 'What grows tall and has green leaves?',
      options: ['Tree', 'Flower', 'Grass', 'Rock'],
      correctAnswer: 'Tree',
    },
  },
  {
    word: 'bird',
    wordImage: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=300&h=300&fit=crop&crop=center',
    quiz: {
      question: 'What animal can fly and has wings?',
      options: ['Fish', 'Bird', 'Dog', 'Cat'],
      correctAnswer: 'Bird',
    },
  },
  {
    word: 'flower',
    wordImage: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300&h=300&fit=crop&crop=center',
    quiz: {
      question: 'What is pretty and grows in gardens?',
      options: ['Rock', 'Flower', 'Water', 'Sand'],
      correctAnswer: 'Flower',
    },
  },
  {
    word: 'cake',
    wordImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=300&fit=crop&crop=center',
    quiz: {
      question: 'What do you eat on birthdays?',
      options: ['Cake', 'Soup', 'Salad', 'Bread'],
      correctAnswer: 'Cake',
    },
  },
  {
    word: 'book',
    wordImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop&crop=center',
    quiz: {
      question: 'What do you read to learn new things?',
      options: ['Book', 'Phone', 'TV', 'Radio'],
      correctAnswer: 'Book',
    },
  },
  {
    word: 'car',
    wordImage: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=300&h=300&fit=crop&crop=center',
    quiz: {
      question: 'What vehicle has four wheels and drives on roads?',
      options: ['Boat', 'Car', 'Plane', 'Bike'],
      correctAnswer: 'Car',
    },
  },
  {
    word: 'apple',
    wordImage: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop&crop=center',
    quiz: {
      question: 'What red fruit grows on trees?',
      options: ['Apple', 'Banana', 'Orange', 'Grape'],
      correctAnswer: 'Apple',
    },
  },
  {
    word: 'sun',
    wordImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop&crop=center',
    quiz: {
      question: 'What bright light shines during the day?',
      options: ['Moon', 'Sun', 'Star', 'Lamp'],
      correctAnswer: 'Sun',
    },
  },
  {
    word: 'ball',
    wordImage: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop&crop=center',
    quiz: {
      question: 'What round object do you play with?',
      options: ['Ball', 'Box', 'Book', 'Cup'],
      correctAnswer: 'Ball',
    },
  },
  {
    word: 'cat',
    wordImage: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=300&fit=crop&crop=center',
    quiz: {
      question: 'What small pet says "meow"?',
      options: ['Dog', 'Cat', 'Bird', 'Fish'],
      correctAnswer: 'Cat',
    },
  },
  {
    word: 'rainbow',
    wordImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop&crop=center',
    quiz: {
      question: 'What appears in the sky after rain?',
      options: ['Cloud', 'Rainbow', 'Sun', 'Moon'],
      correctAnswer: 'Rainbow',
    },
  },
];