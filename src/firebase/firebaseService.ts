import { ref, set, get, update, remove, push } from "firebase/database";
import { db } from './firebaseConfig';
import { Word } from '../types/word';
import { Question } from '../types/question';
import { getAuth } from "firebase/auth";

// Helper function to check if the user has the admin role
const isAdminUser = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return false;

  const roleRef = ref(db, `users/${user.uid}/role`);
  const snapshot = await get(roleRef);
  return snapshot.exists() && snapshot.val() === "admin";
};

// Add or update a word for a specific question in the Realtime Database
export const addWord = async (word: string, questionId: string): Promise<void> => {
  try {
    if (!(await isAdminUser())) {
      throw new Error('Permission denied: User is not an admin');
    }
    
    const wordRef = ref(db, `words/${questionId}/${word}`);
    const snapshot = await get(wordRef);

    if (snapshot.exists()) {
      const wordData = snapshot.val();
      const updatedCount = wordData.count + 1;
      await update(wordRef, { count: updatedCount });
      console.log(`Updated word count for "${word}" in question ${questionId} to ${updatedCount}`);
    } else {
      await set(wordRef, { word, count: 1 });
      console.log(`Added new word "${word}" with count 1 for question ${questionId}`);
    }
  } catch (error) {
    console.error('Error adding/updating word:', error);
    if (error instanceof Error) {
      throw new Error('Failed to add/update word: ' + error.message);
    } else {
      throw new Error('Failed to add/update word: Unknown error');
    }
  }
};

// Fetch all words for a specific question from Realtime Database
export const getWords = async (questionId: string): Promise<Word[]> => {
  try {
    const dbRef = ref(db, `words/${questionId}`);
    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
      const wordsObject = snapshot.val();
      return Object.values(wordsObject) as Word[];
    } else {
      console.log(`No words found for question ${questionId}`);
      return [];
    }
  } catch (error) {
    console.error("Error getting words:", error);
    if (error instanceof Error) {
      throw new Error('Failed to fetch words: ' + error.message);
    } else {
      throw new Error('Failed to fetch words: Unknown error');
    }
  }
};

// Add a question to Firebase with a unique ID
export const addQuestion = async (question: Omit<Question, 'id'>): Promise<void> => {
  try {
    if (!(await isAdminUser())) {
      throw new Error('Permission denied: User is not an admin');
    }
    
    const questionsRef = ref(db, 'questions');
    const newQuestionRef = push(questionsRef);
    await set(newQuestionRef, { ...question, id: newQuestionRef.key });
    console.log(`Added question with ID ${newQuestionRef.key}`);
  } catch (error) {
    console.error('Error adding question:', error);
    if (error instanceof Error) {
      throw new Error('Failed to add question: ' + error.message);
    } else {
      throw new Error('Failed to add question: Unknown error');
    }
  }
};

// Fetch all questions from Realtime Database
export const getQuestions = async (): Promise<Question[]> => {
  try {
    const dbRef = ref(db, 'questions');
    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
      const questionsObject = snapshot.val();
      return Object.keys(questionsObject).map((key) => ({
        ...questionsObject[key],
        id: key,
      })) as Question[];
    } else {
      console.log("No questions found");
      return [];
    }
  } catch (error) {
    console.error("Error getting questions:", error);
    if (error instanceof Error) {
      throw new Error('Failed to fetch questions: ' + error.message);
    } else {
      throw new Error('Failed to fetch questions: Unknown error');
    }
  }
};

// Delete a question by ID from the Realtime Database
export const deleteQuestion = async (questionId: string): Promise<void> => {
  try {
    if (!(await isAdminUser())) {
      throw new Error('Permission denied: User is not an admin');
    }

    const questionRef = ref(db, `questions/${questionId}`);
    await remove(questionRef);
    console.log(`Deleted question with ID ${questionId}`);

    // Optionally, remove associated words
    const wordsRef = ref(db, `words/${questionId}`);
    await remove(wordsRef);
    console.log(`Deleted words for question ID ${questionId}`);
  } catch (error) {
    console.error('Error deleting question:', error);
    if (error instanceof Error) {
      throw new Error('Failed to delete question: ' + error.message);
    } else {
      throw new Error('Failed to delete question: Unknown error');
    }
  }
};

// Update a question by ID in the Realtime Database
export const updateQuestion = async (questionId: string, updatedData: Partial<Question>): Promise<void> => {
  try {
    if (!(await isAdminUser())) {
      throw new Error('Permission denied: User is not an admin');
    }

    const questionRef = ref(db, `questions/${questionId}`);
    await update(questionRef, updatedData);
    console.log(`Updated question with ID ${questionId}`);
  } catch (error) {
    console.error('Error updating question:', error);
    if (error instanceof Error) {
      throw new Error('Failed to update question: ' + error.message);
    } else {
      throw new Error('Failed to update question: Unknown error');
    }
  }
};
