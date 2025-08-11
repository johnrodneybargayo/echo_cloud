// src/components/WaitingRoom.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  listenToPresentationStatus, 
  listenToCurrentQuestion, 
  getCurrentQuestionId,
  addParticipant,
  removeParticipant,
  listenToParticipantCount
} from '../utils/realTimeSync';
import { getQuestions } from '../firebase/firebaseService';
import { Question } from '../types/question';
import './WaitingRoom.css';
// Remove the useAuth import since we don't need authentication
// import { useAuth } from '../context/AuthContext';

const WaitingRoom: React.FC = () => {
  // Remove authentication-related code
  // const { user } = useAuth();
  const navigate = useNavigate();
  
  // Remove the authentication check
  // useEffect(() => {
  //   if (!user) {
  //     navigate('/login');
  //     return;
  //   }
  // }, [user, navigate]);
  
  const [presentationStatus, setPresentationStatus] = useState<string>('inactive');
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [participantCount, setParticipantCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionMessage, setTransitionMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const navigateToCurrentQuestion = useCallback((questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) {
      console.error('Question not found:', questionId);
      return;
    }

    const sortedQuestions = [...questions].sort((a, b) => a.createdAt - b.createdAt);
    const currentIndex = sortedQuestions.findIndex(q => q.id === questionId);

    if (question.type === 'wordCloud') {
      navigate(`/enter/${questionId}`, {
        state: { questions: sortedQuestions, currentIndex }
      });
    } else if (question.type === 'happinessInput') {
      navigate(`/happiness-scale/${questionId}`, {
        state: { questions: sortedQuestions, currentIndex }
      });
    }
  }, [questions, navigate]);

  // Initialize participant and load questions - runs once on mount
  useEffect(() => {
    let currentParticipantId: string | null = null;

    const initializeParticipant = async () => {
      try {
        console.log('Initializing participant...');
        
        // Add this participant to the count
        const id = await addParticipant();
        if (id) {
          currentParticipantId = id;
          setParticipantId(id);
          console.log('Participant added with ID:', id);
        }

        // Load questions
        console.log('Loading questions...');
        const questionsData = await getQuestions();
        setQuestions(questionsData);
        console.log('Questions loaded:', questionsData.length);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing participant:', error);
        setError('Failed to connect to the presentation. Please refresh the page.');
        setQuestions([]);
        setIsLoading(false);
      }
    };

    initializeParticipant();

    return () => {
      if (currentParticipantId) {
        removeParticipant(currentParticipantId);
      }
    };
  }, []); // Empty dependency array is correct here

  // Listen for participant count changes - runs once on mount
  useEffect(() => {
    const unsubscribeParticipants = listenToParticipantCount((count) => {
      console.log('Participant count updated:', count);
      setParticipantCount(count);
    });

    return () => {
      if (unsubscribeParticipants) unsubscribeParticipants();
    };
  }, []); // Empty dependency array is correct here

  // Listen for presentation status changes
  useEffect(() => {
    const unsubscribeStatus = listenToPresentationStatus((status) => {
      console.log('Presentation status changed:', status);
      setPresentationStatus(status);
      if (status === 'active') {
        getCurrentQuestionId().then((questionId) => {
          console.log('Current question ID:', questionId);
          if (questionId) {
            setCurrentQuestionId(questionId);
            navigateToCurrentQuestion(questionId);
          }
        }).catch(error => {
          console.error('Error getting current question:', error);
        });
      }
    });

    return () => {
      if (unsubscribeStatus) unsubscribeStatus();
    };
  }, [navigateToCurrentQuestion]); // Include navigateToCurrentQuestion dependency

  // Listen for question changes during active presentation
  useEffect(() => {
    if (questions.length === 0) return;

    const unsubscribeQuestion = listenToCurrentQuestion((questionId) => {
      console.log('Question changed to:', questionId);
      setCurrentQuestionId(questionId);
      if (presentationStatus === 'active') {
        setIsTransitioning(true);
        const question = questions.find(q => q.id === questionId);
        setTransitionMessage(`Moving to: ${question?.text || 'Next Question'}`);
        
        setTimeout(() => {
          navigateToCurrentQuestion(questionId);
        }, 1500);
      }
    });

    // Cleanup function to unsubscribe the listener
    return () => {
      if (unsubscribeQuestion) {
        unsubscribeQuestion();
      }
    };
  }, [questions, presentationStatus, navigateToCurrentQuestion]);

  // Handle page unload to remove participant
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (participantId) {
        removeParticipant(participantId);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [participantId]); // Include participantId dependency

  const currentQuestion = currentQuestionId ? questions.find((q: Question) => q.id === currentQuestionId) : null;

  if (error) {
    return (
      <div className="waiting-room">
        <div className="waiting-content">
          <div className="error-message">
            <h2>⚠️ Connection Error</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Refresh Page</button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="waiting-room">
        <div className="waiting-content">
          <div className="loading-spinner"></div>
          <p>Connecting to presentation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="waiting-room">
      <div className="waiting-content">
        <div className="logo-container">
          <h1 className="app-title">VerbiVibe</h1>
          <div className="subtitle">Real-time Interactive Presentations</div>
        </div>

        <div className="participant-info">
          <p className="participant-count">👥 {participantCount} participant{participantCount !== 1 ? 's' : ''} waiting</p>
        </div>

        <div className="status-container">
          {isTransitioning ? (
            <div className="transition-message">
              <h2>🔄 {transitionMessage}</h2>
              <div className="loading-spinner"></div>
            </div>
          ) : presentationStatus === 'inactive' ? (
            <>
              <div className="waiting-message">
                <h2>🎯 Ready to Participate!</h2>
                <p>Waiting for the presentation to begin...</p>
                <div className="pulse-animation"></div>
              </div>
              
              <div className="instructions">
                <h3>What to expect:</h3>
                <ul>
                  <li>📝 Answer interactive questions</li>
                  <li>☁️ Contribute to word clouds</li>
                  <li>😊 Share your happiness levels</li>
                  <li>📊 See real-time results</li>
                </ul>
              </div>
            </>
          ) : (
            <div className="active-message">
              <h2>🚀 Presentation is Active!</h2>
              {currentQuestion && (
                <p><strong>Current question: {currentQuestion.text}</strong></p>
              )}
              <p>Redirecting you to the current question...</p>
              <div className="loading-spinner"></div>
            </div>
          )}
        </div>

        <div className="footer">
          <p>Stay on this page until the presentation starts</p>
          <small>Debug: Status = {presentationStatus}, Questions = {questions.length}</small>
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;
