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
    wordImage: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZWxsaXBzZSBjeD0iNTAiIGN5PSI1NSIgcng9IjM1IiByeT0iMjUiIGZpbGw9IiNmZGE0NjEiLz48ZWxsaXBzZSBjeD0iMzUiIGN5PSI0MCIgcng9IjEwIiByeT0iMTUiIGZpbGw9IiNmZGE0NjEiLz48ZWxsaXBzZSBjeD0iNjUiIGN5PSI0MCIgcng9IjEwIiByeT0iMTUiIGZpbGw9IiNmZGE0NjEiLz48Y2lyY2xlIGN4PSIzNSIgY3k9IjM1IiByPSI0IiBmaWxsPSJibGFjayIvPjxjaXJjbGUgY3g9IjY1IiBjeT0iMzUiIHI9IjQiIGZpbGw9ImJsYWNrIi8+PGVsbGlwc2UgY3g9IjUwIiBjeT0iNjUiIHJ4PSI4IiByeT0iMTIiIGZpbGw9IiNmZGE0NjEiLz48cGF0aCBkPSJNMjAgMjAgUSAxMCAxMCAyMCA1IEwgMzAgMTAiIHN0cm9rZT0iI2ZkYTQ2MSIgc3Ryb2tlLXdpZHRoPSI0IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTgwIDIwIFEgOTAgMTAgODAgNSBMIDcwIDEwIiBzdHJva2U9IiNmZGE0NjEiIHN0cm9rZS13aWR0aD0iNCIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xMCA4MCBRIDUgOTAgMTAgOTUgTCAyMCA5MCIgc3Ryb2tlPSIjZmRhNDYxIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNOTAgODAgUSA5NSA5MCA5MCA5NSBMIDgwIDkwIiBzdHJva2U9IiNmZGE0NjEiIHN0cm9rZS13aWR0aD0iNCIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==',
    quiz: {
      question: 'Which animal is a pet and says "woof"?',
      options: ['Cat', 'Dog', 'Bird', 'Fish'],
      correctAnswer: 'Dog',
    },
  },
  {
    word: 'house',
    wordImage: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB4PSIyMCIgeT0iNDAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI0MCIgZmlsbD0iIzg5YzNmNCIvPjxwb2x5Z29uIHBvaW50cz0iMTAsNDAgNTAsMTAgOTAsNDAiIGZpbGw9IiNmZjY2NjYiLz48cmVjdCB4PSI0MCIgeT0iNjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iIzg0Y2M2OSIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNzAiIHI9IjMiIGZpbGw9IiNmZmZmZmYiLz48cmVjdCB4PSIzNSIgeT0iNDUiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxNSIgZmlsbD0iIzg0Y2M2OSIvPjxjaXJjbGUgY3g9IjQwIiBjeT0iNTIiIHI9IjIiIGZpbGw9IiNmZmZmZmYiLz48L3N2Zz4=',
    quiz: {
      question: 'Where do people live?',
      options: ['House', 'Tree', 'Car', 'Water'],
      correctAnswer: 'House',
    },
  },
  {
    word: 'fish',
    wordImage: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZWxsaXBzZSBjeD0iNTAiIGN5PSI1MCIgcng9IjMwIiByeT0iMjAiIGZpbGw9IiMzM2JiZmYiLz48dHJpYW5nbGUgcG9pbnRzPSI4MCw1MCA5NSw0MCA5NSw2MCIgZmlsbD0iIzMzYmJmZiIvPjxjaXJjbGUgY3g9IjQwIiBjeT0iNDUiIHI9IjUiIGZpbGw9IndoaXRlIi8+PGNpcmNsZSBjeD0iNDAiIGN5PSI0NSIgcj0iMyIgZmlsbD0iYmxhY2siLz48cGF0aCBkPSJNMjAgNDAgUSAxMCAzMCAyMCAyMCBMIDMwIDMwIiBzdHJva2U9IiMzM2JiZmYiIHN0cm9rZS13aWR0aD0iNCIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0yMCA2MCBRIDEwIDcwIDIwIDgwIEwgMzAgNzAiIHN0cm9rZT0iIzMzYmJmZiIgc3Ryb2tlLXdpZHRoPSI0IiBmaWxsPSJub25lIi8+PC9zdmc+',
    quiz: {
      question: 'What animal lives in water and has fins?',
      options: ['Bird', 'Fish', 'Dog', 'Cat'],
      correctAnswer: 'Fish',
    },
  },
  {
    word: 'star',
    wordImage: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cG9seWdvbiBwb2ludHM9IjUwLDUgNjAsMzUgOTUsMzUgNzAsNTUgODAsODUgNTAsNjUgMjAsODUgMzAsNTUgNSwzNSA0MCwzNSIgZmlsbD0iI2ZmZGE0MCIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjEwIiBmaWxsPSIjZmZmZmZmIi8+PC9zdmc+',
    quiz: {
      question: 'What shines in the night sky?',
      options: ['Sun', 'Moon', 'Star', 'Cloud'],
      correctAnswer: 'Star',
    },
  },
  {
    word: 'tree',
    wordImage: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB4PSI0NSIgeT0iNjAiIHdpZHRoPSIxMCIgaGVpZ2h0PSI0MCIgZmlsbD0iIzg0NjM0MyIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNDAiIHI9IjI1IiBmaWxsPSIjNGFkNjQwIi8+PGNpcmNsZSBjeD0iNDAiIGN5PSIzNSIgcj0iMTUiIGZpbGw9IiM0YWQ2NDAiLz48Y2lyY2xlIGN4PSI2MCIgY3k9IjM1IiByPSIxNSIgZmlsbD0iIzRhZDY0MCIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iMjUiIHI9IjIwIiBmaWxsPSIjNGFkNjQwIi8+PGNpcmNsZSBjeD0iMzUiIGN5PSI0NSIgcj0iMTIiIGZpbGw9IiM0YWQ2NDAiLz48Y2lyY2xlIGN4PSI2NSIgY3k9IjQ1IiByPSIxMiIgZmlsbD0iIzRhZDY0MCIvPjwvc3ZnPg==',
    quiz: {
      question: 'What grows tall and has green leaves?',
      options: ['Tree', 'Flower', 'Grass', 'Rock'],
      correctAnswer: 'Tree',
    },
  },
  {
    word: 'bird',
    wordImage: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZWxsaXBzZSBjeD0iNDAiIGN5PSI1MCIgcng9IjE1IiByeT0iMTIiIGZpbGw9IiNmZmE1MDAiLz48ZWxsaXBzZSBjeD0iNjAiIGN5PSI0NSIgcng9IjIwIiByeT0iMTAiIGZpbGw9IiNmZmE1MDAiLz48Y2lyY2xlIGN4PSIzNSIgY3k9IjQ1IiByPSI0IiBmaWxsPSJibGFjayIvPjx0cmlhbmdsZSBwb2ludHM9IjMwLDU1IDI1LDUwIDMwLDQ1IiBmaWxsPSIjZmZhNTAwIi8+PHBhdGggZD0iTTIwIDMwIFEgMTAgMjAgMjAgMTAgTCAzMCAyMCIgc3Ryb2tlPSIjZmZhNTAwIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNNjAgMzAgUSA3MCAyMCA2MCAxMCBMIDUwIDIwIiBzdHJva2U9IiNmZmE1MDAiIHN0cm9rZS13aWR0aD0iNCIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0zMCA3MCBRIDIwIDgwIDMwIDkwIEwgNDAgODAiIHN0cm9rZT0iI2ZmYTUwMCIgc3Ryb2tlLXdpZHRoPSI0IiBmaWxsPSJub25lIi8+PC9zdmc+',
    quiz: {
      question: 'What animal can fly and has wings?',
      options: ['Fish', 'Bird', 'Dog', 'Cat'],
      correctAnswer: 'Bird',
    },
  },
  {
    word: 'flower',
    wordImage: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIxNSIgZmlsbD0iI2ZmZmYwMCIvPjxwYXRoIGQ9Ik01MCAzNSBRIDQwIDI1IDUwIDE1IFEgNjAgMjUgNTAgMzUiIGZpbGw9IiNmZjY2Y2MiLz48cGF0aCBkPSJNNjUgNTAgUSA3NSA0MCA2NSA0MCBRIDU1IDQwIDY1IDUwIiBmaWxsPSIjZmY2NmNjIi8+PHBhdGggZD0iTTUwIDY1IFEgNjAgNTUgNTAgNDUgUSAzNSA1NSA1MCA2NSIgZmlsbD0iI2ZmNjZjYyIvPjxwYXRoIGQ9Ik0zNSA1MCBRIDI1IDQwIDM1IDQwIFEgNDUgNDAgMzUgNTAiIGZpbGw9IiNmZjY2Y2MiLz48cmVjdCB4PSI0OCIgeT0iNjUiIHdpZHRoPSI0IiBoZWlnaHQ9IjMwIiBmaWxsPSIjOGJjMzQwIi8+PHBhdGggZD0iTTMwIDgwIFEgNDAgNzAgNTAgODAgUSA2MCA3MCA3MCA4MCIgc3Ryb2tlPSIjOGJjMzQwIiBzdHJva2Utd2lkdGg9IjMiIGZpbGw9Im5vbmUiLz48L3N2Zz4=',
    quiz: {
      question: 'What is pretty and grows in gardens?',
      options: ['Rock', 'Flower', 'Water', 'Sand'],
      correctAnswer: 'Flower',
    },
  },
  {
    word: 'cake',
    wordImage: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB4PSIyMCIgeT0iNjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSIzMCIgZmlsbD0iI2ZmYzEwNyIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNDAiIHI9IjIwIiBmaWxsPSIjZmZmZmZmIi8+PGNpcmNsZSBjeD0iNDAiIGN5PSIzNSIgcj0iMyIgZmlsbD0iI2ZmNjY2NiIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iMzUiIHI9IjMiIGZpbGw9IiNmZjY2NjYiLz48Y2lyY2xlIGN4PSI2MCIgY3k9IjM1IiByPSIzIiBmaWxsPSIjZmY2NjY2Ii8+PGNpcmNsZSBjeD0iNDUiIGN5PSI0NSIgcj0iMyIgZmlsbD0iI2ZmNjY2NiIvPjxjaXJjbGUgY3g9IjU1IiBjeT0iNDUiIHI9IjMiIGZpbGw9IiNmZjY2NjYiLz48cmVjdCB4PSIzNSIgeT0iNDAiIHdpZHRoPSIzMCIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmZmZmIi8+PC9zdmc+',
    quiz: {
      question: 'What do you eat on birthdays?',
      options: ['Cake', 'Soup', 'Salad', 'Bread'],
      correctAnswer: 'Cake',
    },
  },
  {
    word: 'book',
    wordImage: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB4PSIyMCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjMzMzMzMzIiBzdHJva2Utd2lkdGg9IjMiLz48bGluZSB4MT0iMzAiIHkxPSIzMCIgeDI9IjUwIiB5Mj0iMzAiIHN0cm9rZT0iIzMzMzMzMyIgc3Ryb2tlLXdpZHRoPSIyIi8+PGxpbmUgeDE9IjMwIiB5MT0iNDAiIHgyPSI1MCIgeTI9IjQwIiBzdHJva2U9IiMzMzMzMzMiIHN0cm9rZS13aWR0aD0iMiIvPjxsaW5lIHgxPSIzMCIgeTE9IjUwIiB4Mj0iNTAiIHkyPSI1MCIgc3Ryb2tlPSIjMzMzMzMzIiBzdHJva2Utd2lkdGg9IjIiLz48bGluZSB4MT0iMzAiIHkxPSI2MCIgeDI9IjUwIiB5Mj0iNjAiIHN0cm9rZT0iIzMzMzMzMyIgc3Ryb2tlLXdpZHRoPSIyIi8+PGNpcmNsZSBjeD0iNDAiIGN5PSIzNSIgcj0iMiIgZmlsbD0iIzMzMzMzMyIvPjxjaXJjbGUgY3g9IjQwIiBjeT0iNDUiIHI9IjIiIGZpbGw9IiMzMzMzMzMiLz48Y2lyY2xlIGN4PSI0MCIgY3k9IjU1IiByPSIyIiBmaWxsPSIjMzMzMzMzIi8+PC9zdmc+',
    quiz: {
      question: 'What do you read to learn new things?',
      options: ['Book', 'Phone', 'TV', 'Radio'],
      correctAnswer: 'Book',
    },
  },
  {
    word: 'rainbow',
    wordImage: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNMTAgNjAgUSAyMCA0MCAzMCA2MCBRIDQwIDgwIDUwIDYwIFEgNjAgNDAgNzAgNjAgUSA4MCA4MCA5MCA2MCIgc3Ryb2tlPSIjZmYwMDAwIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMTAgNjUgUSAyMCA0NSA0MCA2NSBRIDUwIDg1IDYwIDY1IFEgODAgNDUgOTAgNjUiIHN0cm9rZT0iI2ZmODAwMCIgc3Ryb2tlLXdpZHRoPSI0IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTEwIDcwIFEgMzAgNTAgNDAgNzAgUSA1MCA5MCA2MCA3MCBRIDgwIDUwIDkwIDcwIiBzdHJva2U9IiNmZmZmMDAiIHN0cm9rZS13aWR0aD0iNCIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xMCA3NSBRIDMwIDU1IDQwIDc1IFEgNTAgOTUgNjAgNzUgUSA4MCA1NSA5MCA3NSIgc3Ryb2tlPSIjMDBmZjAwIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMTAgODAgUSAyMCA2MCA0MCA4MCBRIDUwIDEwMCA2MCA4MCBRIDgwIDYwIDkwIDgwIiBzdHJva2U9IiMwMDAwZmYiIHN0cm9rZS13aWR0aD0iNCIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xMCA4NSBRIDIwIDY1IDQwIDg1IFEgNTAgMTA1IDYwIDg1IFEgODAgNjUgOTAgODUiIHN0cm9rZT0iIzgwMDBmZiIgc3Ryb2tlLXdpZHRoPSI0IiBmaWxsPSJub25lIi8+PC9zdmc+',
    quiz: {
      question: 'What appears in the sky after rain?',
      options: ['Cloud', 'Rainbow', 'Sun', 'Moon'],
      correctAnswer: 'Rainbow',
    },
  },
];