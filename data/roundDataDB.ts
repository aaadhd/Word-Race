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
    wordImage: '/questions/dog.png',
    quiz: {
      question: 'Which animal is a pet and says "woof"?',
      options: ['Cat', 'Dog', 'Bird', 'Fish'],
      correctAnswer: 'Dog',
    },
  },
  {
    word: 'house',
    wordImage: '/questions/house.png',
    quiz: {
      question: 'Where do people live?',
      options: ['House', 'Tree', 'Car', 'Water'],
      correctAnswer: 'House',
    },
  },
  {
    word: 'fish',
    wordImage: '/questions/fish.png',
    quiz: {
      question: 'What animal lives in water and has fins?',
      options: ['Bird', 'Fish', 'Dog', 'Cat'],
      correctAnswer: 'Fish',
    },
  },
  {
    word: 'star',
    wordImage: '/questions/star.png',
    quiz: {
      question: 'What shines in the night sky?',
      options: ['Sun', 'Moon', 'Star', 'Cloud'],
      correctAnswer: 'Star',
    },
  },
  {
    word: 'tree',
    wordImage: '/questions/tree.png',
    quiz: {
      question: 'What grows tall and has green leaves?',
      options: ['Tree', 'Flower', 'Grass', 'Rock'],
      correctAnswer: 'Tree',
    },
  },
  {
    word: 'bird',
    wordImage: '/questions/bird.png',
    quiz: {
      question: 'What animal can fly and has wings?',
      options: ['Fish', 'Bird', 'Dog', 'Cat'],
      correctAnswer: 'Bird',
    },
  },
  {
    word: 'flower',
    wordImage: '/questions/flower.png',
    quiz: {
      question: 'What is pretty and grows in gardens?',
      options: ['Rock', 'Flower', 'Water', 'Sand'],
      correctAnswer: 'Flower',
    },
  },
  {
    word: 'cake',
    wordImage: '/questions/cake.png',
    quiz: {
      question: 'What do you eat on birthdays?',
      options: ['Cake', 'Soup', 'Salad', 'Bread'],
      correctAnswer: 'Cake',
    },
  },
  {
    word: 'book',
    wordImage: '/questions/book.png',
    quiz: {
      question: 'What do you read to learn new things?',
      options: ['Book', 'Phone', 'TV', 'Radio'],
      correctAnswer: 'Book',
    },
  },
  {
    word: 'car',
    wordImage: '/questions/car.png',
    quiz: {
      question: 'What vehicle has four wheels and drives on roads?',
      options: ['Boat', 'Car', 'Plane', 'Bike'],
      correctAnswer: 'Car',
    },
  },
  {
    word: 'apple',
    wordImage: '/questions/apple.png',
    quiz: {
      question: 'What red fruit grows on trees?',
      options: ['Apple', 'Banana', 'Orange', 'Grape'],
      correctAnswer: 'Apple',
    },
  },
  {
    word: 'sun',
    wordImage: '/questions/sun.png',
    quiz: {
      question: 'What bright light shines during the day?',
      options: ['Moon', 'Sun', 'Star', 'Lamp'],
      correctAnswer: 'Sun',
    },
  },
  {
    word: 'ball',
    wordImage: '/questions/ball.png',
    quiz: {
      question: 'What round object do you play with?',
      options: ['Ball', 'Box', 'Book', 'Cup'],
      correctAnswer: 'Ball',
    },
  },
  {
    word: 'cat',
    wordImage: '/questions/cat.png',
    quiz: {
      question: 'What small pet says "meow"?',
      options: ['Dog', 'Cat', 'Bird', 'Fish'],
      correctAnswer: 'Cat',
    },
  },
  {
    word: 'rainbow',
    wordImage: '/questions/rainbow.png',
    quiz: {
      question: 'What appears in the sky after rain?',
      options: ['Cloud', 'Rainbow', 'Sun', 'Moon'],
      correctAnswer: 'Rainbow',
    },
  },
  {
    word: 'balloon',
    wordImage: '/questions/balloon.png',
    quiz: {
      question: 'What do you fill with air and it can float?',
      options: ['Balloon', 'Rock', 'Car', 'Book'],
      correctAnswer: 'Balloon',
    },
  },
];