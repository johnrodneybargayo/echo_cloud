import React, { useState, useEffect } from "react";
// Remove this import since navigate is not used
// import { useNavigate } from "react-router-dom";
// Remove QRCode import temporarily
import {
  addQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
} from "../../firebase/firebaseService";
import { Question } from "../../types/question";
import DeleteLoader from "../loader/DeleteLoader";
import "./QuestionManager.css";
import { 
  startPresentation,
  stopPresentation,
  setCurrentQuestion,
  getPresentationStatus
} from "../../utils/realTimeSync";

const QuestionManager: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState<string>("");
  const [questionType, setQuestionType] = useState<Question["type"]>("wordCloud");
  const [isAdding, setIsAdding] = useState(false);
  const [editQuestionId, setEditQuestionId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showQRCode, setShowQRCode] = useState(false);
  const itemsPerPage = 6;
  // Remove this line since navigate is not used
  // const navigate = useNavigate();

  // Fetch questions on component mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const fetchedQuestions = await getQuestions();
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, []);

  const handleAddOrUpdateQuestion = async () => {
    if (!newQuestion.trim()) return;

    const questionData: Omit<Question, "id"> = {
      text: newQuestion,
      type: questionType,
      createdAt: Date.now(),
      linkedHappinessScale: false
    };

    setIsAdding(true);
    try {
      if (editQuestionId) {
        await updateQuestion(editQuestionId, questionData);
      } else {
        await addQuestion(questionData);
      }
      const updatedQuestions = await getQuestions();
      setQuestions(updatedQuestions);
      setNewQuestion("");
      setEditQuestionId(null);
    } catch (error) {
      console.error("Error adding/updating question:", error);
    }
    setIsAdding(false);
  };

  const handleEditQuestion = (question: Question) => {
    setEditQuestionId(question.id);
    setNewQuestion(question.text);
    setQuestionType(question.type);
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      setIsDeleting(true);
      try {
        await deleteQuestion(questionId);
        setQuestions(questions.filter((q) => q.id !== questionId));
      } catch (error) {
        console.error("Error deleting question:", error);
      }
      setIsDeleting(false);
    }
  };

  // Add these state variables to the component:
  const [presentationActive, setPresentationActive] = useState(false);
  const [currentPresentationQuestion, setCurrentPresentationQuestion] = useState<string | null>(null);
  
  // Add this useEffect to monitor presentation status:
  useEffect(() => {
    const checkPresentationStatus = async () => {
      const status = await getPresentationStatus();
      setPresentationActive(status === 'active');
    };
    checkPresentationStatus();
  }, []);
  
  // Enhanced handleStartPresentation function:
  const handleStartPresentation = async () => {
    if (!questions.length) {
      alert("Add a question before starting the presentation.");
      return;
    }
  
    const sortedQuestions = [...questions].sort((a, b) => a.createdAt - b.createdAt);
    const firstQuestion = sortedQuestions[0];
  
    try {
      await startPresentation(firstQuestion.id);
      setPresentationActive(true);
      setCurrentPresentationQuestion(firstQuestion.id);
      setShowQRCode(true);
      
      // Show success message
      alert(`Presentation started! Share the QR code with participants.`);
    } catch (error) {
      console.error("Error starting presentation:", error);
      alert("Failed to start presentation. Please try again.");
    }
  };
  
  // Add handleStopPresentation function:
  const handleStopPresentation = async () => {
    try {
      await stopPresentation();
      setPresentationActive(false);
      setCurrentPresentationQuestion(null);
      setShowQRCode(false);
      alert("Presentation stopped. Participants will be redirected to waiting room.");
    } catch (error) {
      console.error("Error stopping presentation:", error);
      alert("Failed to stop presentation. Please try again.");
    }
  };
  
  // Add handleNextQuestion function:
  const handleNextQuestion = async () => {
    console.log('Next button clicked, current question:', currentPresentationQuestion);
    if (!currentPresentationQuestion) return;
    
    const sortedQuestions = [...questions].sort((a, b) => a.createdAt - b.createdAt);
    const currentIndex = sortedQuestions.findIndex(q => q.id === currentPresentationQuestion);
    console.log('Current index:', currentIndex, 'Total questions:', sortedQuestions.length);
    
    if (currentIndex < sortedQuestions.length - 1) {
      const nextQuestion = sortedQuestions[currentIndex + 1];
      console.log('Moving to next question:', nextQuestion);
      try {
        await setCurrentQuestion(nextQuestion.id);
        setCurrentPresentationQuestion(nextQuestion.id);
        alert(`Moved to next question: ${nextQuestion.text}`);
      } catch (error) {
        console.error('Error setting current question:', error);
      }
    } else {
      console.log('Presentation completed');
      await stopPresentation();
      setPresentationActive(false);
      setCurrentPresentationQuestion(null);
      setShowQRCode(false);
      alert("Presentation completed!");
    }
  };
  
  const paginatedQuestions = questions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(questions.length / itemsPerPage);

  const changePage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const getDisplayText = (question: Question) => {
    if (question.type === "happinessInput") {
      return `Happiness Input (linked to Bar Chart)`;
    }
    if (question.type === "happinessBarChart" && question.linkedTo) {
      return `Happiness Bar Chart (linked to Input)`;
    }
    return question.text;
  };

  return (
    <div className="question-manager">
      <h2>Question Manager</h2>
      <div className="question-form">
        <input
          type="text"
          placeholder="Enter your question"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
        />
        <select
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value as Question["type"])}
        >
          <option value="wordCloud">Word Cloud</option>
          <option value="happinessInput">Happiness Input</option>
        </select>
        <button onClick={handleAddOrUpdateQuestion} disabled={isAdding}>
          {editQuestionId ? "Update" : "Add"}
        </button>
      </div>

      {isDeleting && <DeleteLoader />}

      <div className="questions-grid">
        {paginatedQuestions.length > 0 ? (
          paginatedQuestions.map((question) => (
            <div key={question.id} className="question-item">
              <p>{getDisplayText(question)}</p>
              <div className="button-group">
                <button className="edit-button" onClick={() => handleEditQuestion(question)}>Edit</button>
                <button className="delete-button" onClick={() => handleDeleteQuestion(question.id)}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>No questions available.</p>
        )}
      </div>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={i + 1 === currentPage ? "active" : ""}
            onClick={() => changePage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div className="presentation-controls">
        {!presentationActive ? (
          <button 
            onClick={handleStartPresentation} 
            className="start-presentation-btn magical-presentation-button"
          >
            🚀 Start Magical Presentation ✨
          </button>
        ) : (
          <div className="active-presentation-controls">
            <button 
              onClick={handleNextQuestion} 
              className="next-question-btn"
            >
              ➡️ Next Question
            </button>
            <button 
              onClick={handleStopPresentation} 
              className="stop-presentation-btn"
            >
              ⏹️ Stop Presentation
            </button>
            <p className="current-question-info">
              Current: {questions.find(q => q.id === currentPresentationQuestion)?.text || 'Unknown'}
            </p>
          </div>
        )}
      </div>

      {showQRCode && (
        <div className="qr-code-modal">
          <div className="qr-code-content">
            <h3>Share this link with Participants</h3>
            <div className="qr-code-container">
              <div className="participant-link">
                <p>Participants can join at:</p>
                <div className="url-container">
                  <input 
                    type="text" 
                    value={`${window.location.origin}/waiting-room`}
                    readOnly
                    className="participant-url-input"
                  />
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/waiting-room`);
                      alert('Link copied to clipboard!');
                    }}
                    className="copy-link-btn"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            </div>
            <p>Participants can use this link to join the presentation</p>
            <div className="qr-code-actions">
              <button 
                onClick={() => setShowQRCode(false)}
                className="close-qr-btn"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  const url = `${window.location.origin}/waiting-room`;
                  navigator.clipboard.writeText(url);
                  alert('Link copied to clipboard!');
                }}
                className="copy-link-btn"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionManager;
