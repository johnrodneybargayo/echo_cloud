// src/utils/realTimeSync.ts
import { ref, onValue, set, get } from "firebase/database";
import { db } from "../firebase/firebaseConfig";
import { getAuth } from "firebase/auth";

// Helper function to check if user is authenticated
const isAuthenticated = (): boolean => {
  const auth = getAuth();
  return !!auth.currentUser;
};

// Start the presentation by setting status to "active"
export const startPresentation = async (questionId: string) => {
  if (!isAuthenticated()) {
    throw new Error("Authentication required");
  }
  
  const statusRef = ref(db, "presentation/status");
  const currentQuestionRef = ref(db, "presentation/currentQuestion");
  
  await set(statusRef, "active");
  await set(currentQuestionRef, questionId);
  
  console.log(`Presentation started with question ID: ${questionId}`);
};

// Stop the presentation by setting status to "inactive"
export const stopPresentation = async () => {
  if (!isAuthenticated()) {
    throw new Error("Authentication required");
  }
  
  const statusRef = ref(db, "presentation/status");
  await set(statusRef, "inactive");
  console.log("Presentation stopped");
};

// Get the current question ID - Allow anonymous access
export const getCurrentQuestionId = async () => {
  try {
    const currentQuestionRef = ref(db, "presentation/currentQuestion");
    const snapshot = await get(currentQuestionRef);
    return snapshot.val();
  } catch (error) {
    console.error("Error getting current question ID:", error);
    return null;
  }
};

// Get the current presentation status - Allow anonymous access
export const getPresentationStatus = async () => {
  try {
    const statusRef = ref(db, "presentation/status");
    const snapshot = await get(statusRef);
    return snapshot.val() || "inactive";
  } catch (error) {
    console.error("Error getting presentation status:", error);
    return "inactive";
  }
};

// Listen for real-time status changes - Allow anonymous access
export const listenToPresentationStatus = (callback: (status: string) => void) => {
  const statusRef = ref(db, "presentation/status");
  return onValue(statusRef, (snapshot) => {
    const status = snapshot.val();
    callback(status || "inactive");
  }, (error) => {
    console.error("Error listening to presentation status:", error);
    callback("inactive");
  });
};

// Listen for real-time question changes - Allow anonymous access
export const listenToCurrentQuestion = (callback: (questionId: string) => void) => {
  const currentQuestionRef = ref(db, "presentation/currentQuestion");
  return onValue(currentQuestionRef, (snapshot) => {
    const questionId = snapshot.val();
    if (questionId) callback(questionId);
  }, (error) => {
    console.error("Error listening to current question:", error);
  });
};

// Add participant tracking functions
export const addParticipant = async () => {
  try {
    const participantId = `participant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const participantRef = ref(db, `presentation/participants/${participantId}`);
    await set(participantRef, {
      joinedAt: Date.now(),
      status: 'active'
    });
    return participantId;
  } catch (error) {
    console.error("Error adding participant:", error);
    return null;
  }
};

export const removeParticipant = async (participantId: string) => {
  if (!participantId) return;
  try {
    const participantRef = ref(db, `presentation/participants/${participantId}`);
    await set(participantRef, null);
  } catch (error) {
    console.error("Error removing participant:", error);
  }
};

export const listenToParticipantCount = (callback: (count: number) => void) => {
  const participantsRef = ref(db, "presentation/participants");
  return onValue(participantsRef, (snapshot) => {
    const participants = snapshot.val();
    const count = participants ? Object.keys(participants).length : 0;
    callback(count);
  }, (error) => {
    console.error("Error listening to participant count:", error);
    callback(0);
  });
};
// Set the current question ID
export const setCurrentQuestion = async (questionId: string) => {
  if (!isAuthenticated()) {
    throw new Error("Authentication required");
  }
  
  const currentQuestionRef = ref(db, "presentation/currentQuestion");
  await set(currentQuestionRef, questionId);
};

// Get the full presentation session data
export const getPresentationSession = async () => {
  if (!isAuthenticated()) {
    return null;
  }
  
  try {
    const sessionRef = ref(db, "presentation");
    const snapshot = await get(sessionRef);
    return snapshot.val();
  } catch (error) {
    console.error("Error getting presentation session:", error);
    return null;
  }
};

// Listen for real-time session changes
export const listenToPresentationSession = (callback: (session: any) => void) => {
  if (!isAuthenticated()) {
    callback(null);
    return () => {}; // Return empty unsubscribe function
  }
  
  const sessionRef = ref(db, "presentation");
  return onValue(sessionRef, (snapshot) => {
    const session = snapshot.val();
    callback(session);
  }, (error) => {
    console.error("Error listening to presentation session:", error);
    callback(null);
  });
};
