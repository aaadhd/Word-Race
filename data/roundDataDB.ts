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
    word: 'apple',
    wordImage: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjYwIiByPSIzMCIgZmlsbD0icmVkIi8+PHBhdGggZD0iTTUwIDMwIFEgNjAgMjAgNzAgMzAiIHN0cm9rZT0iZ3JlZW4iIHN0cm9keS13aWR0aD0iNSIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==',
    quiz: {
      question: 'Which of these grows on a tree?',
      options: ['Apple', 'Carrot', 'Fish', 'Stone'],
      correctAnswer: 'Apple',
    },
  },
  {
    word: 'cat',
    wordImage: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0iZ3JheSIvPjxjaXJjbGUgY3g9IjM1IiBjeT0iNDAiIHI9IjUiIGZpbGw9ImJsYWNrIi8+PGNpcmNsZSBjeD0iNjUiIGN5PSI0MCIgcj0iNSIgZmlsbD0iYmxhY2siLz48cGF0aCBkPSJNNDAgNjAgUSA1MCA3MCA2MCA2MCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIzIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTIwIDIwIEwgMzUgMzUgTTgwIDIwIEwgNjUgMzUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==',
    quiz: {
      question: 'Which animal says "meow"?',
      options: ['Dog', 'Cat', 'Bird', 'Cow'],
      correctAnswer: 'Cat',
    },
  },
  {
    word: 'sun',
    wordImage: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIzMCIgZmlsbD0ieWVsbG93Ii8+PGxpbmUgeDE9IjUwIiB5MT0iMTAiIHgyPSI1MCIgeTI9IjI1IiBzdHJva2U9InllbGxvdyIgc3Ryb2tlLXdpZHRoPSI1Ii8+PGxpbmUgeDE9IjUwIiB5MT0iNzUiIHgyPSI1MCIgeTI9IjkwIiBzdHJva2U9InllbGxvdyIgc3Ryb2tlLXdpZHRoPSI1Ii8+PGxpbmUgeDE9IjEwIiB5MT0iNTAiIHgyPSIyNSIgeTI9IjUwIiBzdHJva2U9InllbGxvdyIgc3Ryb2tlLXdpZHRoPSI1Ii8+PGxpbmUgeDE9Ijc1IiB5MT0iNTAiIHgyPSI5MCIgeTI9IjUwIiBzdHJva2U9InllbGxvdyIgc3Ryb2tlLXdpZHRoPSI1Ii8+PGxpbmUgeDE9IjIxIiB5MT0iMjEiIHgyPSIzMiIgeTI9IjMyIiBzdHJva2U9InllbGxvdyIgc3Ryb2tlLXdpZHRoPSI1Ii8+PGxpbmUgeDE9IjY4IiB5MT0iNjgiIHgyPSI3OSIgeTI9Ijc5IiBzdHJva2U9InllbGxvdyIgc3Ryb2tlLXdpZHRoPSI1Ii8+PGxpbmUgeDE9IjIxIiB5MT0iNzkiIHgyPSIzMiIgeTI9IjY4IiBzdHJva2U9InllbGxvdyIgc3Ryb2tlLXdpZHRoPSI1Ii8+PGxpbmUgeDE9IjY4IiB5MT0iMzIiIHgyPSI3OSIgeTI9IjIxIiBzdHJva2U9InllbGxvdyIgc3Ryb2tlLXdpZHRoPSI1Ii8+PC9zdmc+',
    quiz: {
      question: 'What is the big yellow star in the sky during the day?',
      options: ['Moon', 'Cloud', 'Sun', 'Star'],
      correctAnswer: 'Sun',
    },
  },
  {
    word: 'car',
    wordImage: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgNjAiPjxyZWN0IHg9IjEwIiB5PSIyMCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjIwIiBmaWxsPSJibHVlIi8+PHJlY3QgeD0iMjAiIHk9IjEwIiB3aWR0aD0iNjAiIGhlaWdodD0iMjAiIGZpbGw9ImxpZ2h0Ymx1ZSIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iNDUiIHI9IjgiIGZpbGw9ImJsYWNrIi8+PGNpcmNsZSBjeD0iNzAiIGN5PSI0NSIgcj0iOCIgZmlsbD0iYmxhY2siLz48L3N2Zz4=',
    quiz: {
      question: 'What has wheels and drives on the road?',
      options: ['Boat', 'Plane', 'Car', 'Train'],
      correctAnswer: 'Car',
    },
  },
  {
    word: 'balloon',
    wordImage: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTIwIj48ZWxsaXBzZSBjeD0iNTAiIGN5PSI1MCIgcng9IjQwIiByeT0iNTAiIGZpbGw9InB1cnBsZSIvPjxwYXRoIGQ9Ik01MCAxMDAgUSA0NSAxMTAgNTAgMTIwIEwgNTAgMTAwIiBzdHJva2U9InB1cnBsZSIgc3Ryb2tlLXdpZHRoPSIzIiBmaWxsPSJub25lIi8+PC9zdmc+',
    quiz: {
      question: 'What do you fill with air and see at birthday parties?',
      options: ['Balloon', 'Cake', 'Present', 'Hat'],
      correctAnswer: 'Balloon',
    },
  },
  {
    word: 'strawberry',
    wordImage: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMjAsNDAgQzIwLDgwIDUwLDEwMCA1MCwxMDAgQzUwLDEwMCA4MCw4MCA4MCw0MCBDODAsMjAgNjAsMTAgNTAsMjAgQzQwLDEwIDIwLDIwIDIwLDQwIFoiIGZpbGw9InJlZCIvPjxjaXJjbGUgY3g9IjQwIiBjeT0iNTAiIHI9IjIiIGZpbGw9InllbGxvdyIvPjxjaXJjbGUgY3g9IjYwIiBjeT0iNTAiIHI9IjIiIGZpbGw9InllbGxvdyIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNjUiIHI9IjIiIGZpbGw9InllbGxvdyIvPjxjaXJjbGUgY3g9IjM1IiBjeT0iNzUiIHI9IjIiIGZpbGw9InllbGxvdyIvPjxjaXJjbGUgY3g9IjY1IiBjeT0iNzUiIHI9IjIiIGZpbGw9InllbGxvdyIvPjxwYXRoIGQ9Ik00MCwxMCBRNTAsMCA2MCwxMCBMIDUwIDIwIFoiIGZpbGw9ImdyZWVuIi8+PC9zdmc+',
    quiz: {
      question: 'Which fruit is red and has seeds on the outside?',
      options: ['Banana', 'Apple', 'Grape', 'Strawberry'],
      correctAnswer: 'Strawberry',
    },
  },
];