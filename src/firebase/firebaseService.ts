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

  try {
    const roleRef = ref(db, `users/${user.uid}/role`);
    const snapshot = await get(roleRef);
    return snapshot.exists() && snapshot.val() === "admin";
  } catch (error) {
    console.error("Error checking admin role:", error);
    return false;
  }
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
    } else {
      await set(wordRef, { word, count: 1 });
    }
  } catch (error) {
    console.error('Error adding/updating word:', error);
    throw new Error('Failed to add or update word.');
  }
};

// Fetch words for a specific question
export const getWords = async (questionId: string): Promise<Word[]> => {
  try {
    const dbRef = ref(db, `words/${questionId}`);
    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
      const wordsObject = snapshot.val();
      return Object.values(wordsObject) as Word[];
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error getting words:", error);
    throw new Error('Failed to fetch words.');
  }
};

// Add a question to Firebase with a unique ID
// Add a question and handle linked happinessBarChart
export const addQuestion = async (question: Omit<Question, "id">): Promise<void> => {
  try {
    // Add admin permission check
    if (!(await isAdminUser())) {
      throw new Error('Permission denied: User is not an admin');
    }

    const questionsRef = ref(db, "questions");
    const newQuestionRef = push(questionsRef);

    const newQuestion = {
      ...question,
      id: newQuestionRef.key,
      createdAt: Date.now(),
    };

    await set(newQuestionRef, newQuestion);

    // If happinessInput, link to a happinessBarChart
    if (question.type === "happinessInput") {
      const linkedBarChart = {
        id: newQuestionRef.key, // Same ID as the happinessInput
        text: "Happiness Bar Chart",
        type: "happinessBarChart",
        linkedTo: newQuestionRef.key,
        linkedHappinessScale: true, // Add the missing required property
        createdAt: Date.now(),
      };
      await set(ref(db, `questions/${newQuestionRef.key}_chart`), linkedBarChart);
    }
  } catch (error) {
    console.error("Error adding question:", error);
    throw new Error("Failed to add question.");
  }
};

// Fetch and sort questions by createdAt
export const getQuestions = async (): Promise<Question[]> => {
  try {
    const snapshot = await get(ref(db, "questions"));
    if (snapshot.exists()) {
      const questions: Question[] = Object.values(snapshot.val()) as Question[];
      return questions.sort((a, b) => a.createdAt - b.createdAt);
    }
    return [];
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw new Error("Failed to fetch questions.");
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
    return null;
  } catch (error) {
    console.error("Error getting question by ID:", error);
    throw new Error('Failed to fetch question.');
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

    const wordsRef = ref(db, `words/${questionId}`);
    await remove(wordsRef);
  } catch (error) {
    console.error('Error deleting question:', error);
    throw new Error('Failed to delete question.');
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
  } catch (error) {
    console.error('Error updating question:', error);
    throw new Error('Failed to update question.');
  }
};
