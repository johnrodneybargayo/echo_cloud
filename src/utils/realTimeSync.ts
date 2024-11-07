// src/utils/realTimeSync.ts
import { ref, onValue, set } from "firebase/database";
import { db } from "../firebase/firebaseConfig";

// Start the presentation by setting status to "active"
export const startPresentation = () => {
  const statusRef = ref(db, "presentation/status");
  set(statusRef, "active");
};

// Stop the presentation by setting status to "inactive"
export const stopPresentation = () => {
  const statusRef = ref(db, "presentation/status");
  set(statusRef, "inactive");
};

// Listen for real-time status changes and invoke callback with the new status
export const listenToPresentationStatus = (callback: (status: string) => void) => {
  const statusRef = ref(db, "presentation/status");
  onValue(statusRef, (snapshot) => {
    const status = snapshot.val();
    if (status) callback(status);
  });
};
