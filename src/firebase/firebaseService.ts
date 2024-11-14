import { ref, set, get, update, remove, push } from "firebase/database";
import { db } from './firebaseConfig';
import { Word } from '../types/word';
import { Question } from '../types/question';
import { getAuth } from "firebase/auth";

// Helper function to check if the user has the admin role
const isAdminUser = async (): Promise<boolean> => {
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
    throw new Error('Could not update or add word due to missing data or permissions.');
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
    throw new Error(error instanceof Error ? 'Failed to fetch words: ' + error.message : 'Failed to fetch words: Unknown error');
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

    // Add the primary question (either wordCloud or happinessBarChart)
    await set(newQuestionRef, { ...question, id: newQuestionRef.key });
    console.log(`Added question with ID ${newQuestionRef.key}`);
    // If the question type is 'wordCloud', no linked question is needed
    if (question.type === 'wordCloud') {
      // No additional action needed
    } else if (question.type === 'happinessInput') {
      const happinessScaleQuestionRef = push(questionsRef);
      const happinessScaleQuestion = {
        text: "How do you rate your happiness?",
        type: 'happinessScale',
        id: happinessScaleQuestionRef.key,
      };

      await set(happinessScaleQuestionRef, happinessScaleQuestion);
      console.log(`Added linked happinessScale question with ID ${happinessScaleQuestionRef.key}`);

      await update(newQuestionRef, { linkedHappinessScale: happinessScaleQuestionRef.key });
      console.log(`Linked happinessScale question with happinessBarChart question ID ${newQuestionRef.key}`);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error adding question:', error.message);
      throw new Error('Failed to add question: ' + error.message);
    } else {
      console.error('Error adding question:', error);
      throw new Error('Failed to add question: Unknown error');
    }
  }
};

// Fetch all questions from Realtime Database, including linked questions
export const getQuestions = async (): Promise<Question[]> => {
  try {
    const dbRef = ref(db, 'questions');
    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
      const questionsObject = snapshot.val();
      const questions = Object.keys(questionsObject).map((key) => ({
        ...questionsObject[key],
        id: key,
      })) as Question[];
      // Exclude happinessScale questions when listing for the main display
      return questions.filter((question) => question.type !== 'happinessScale' as string);
    }
    return [];
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error getting questions:", error.message);
      throw new Error('Failed to fetch questions: ' + error.message);
    } else {
      console.error("Error getting questions:", error);
      throw new Error('Failed to fetch questions: Unknown error');
    }
  }
};

// Fetch a specific question by ID
export const getQuestionById = async (questionId: string): Promise<Question | null> => {
  try {
    const questionRef = ref(db, `questions/${questionId}`);
    const snapshot = await get(questionRef);

    if (snapshot.exists()) {
      return snapshot.val() as Question;
    }
    console.log(`No question found with ID ${questionId}`);
    return null;
  } catch (error) {
    console.error("Error getting question by ID:", error);
    throw new Error('Failed to fetch question: ' + (error instanceof Error ? error.message : 'Unknown error'));
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error deleting question:', error.message);
      throw new Error('Failed to delete question: ' + error.message);
    } else {
      console.error('Error deleting question:', error);
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error updating question:', error.message);
      throw new Error('Failed to update question: ' + error.message);
    } else {
      console.error('Error updating question:', error);
      throw new Error('Failed to update question: Unknown error');
    }
  }
};
