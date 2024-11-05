import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addQuestion, getQuestions } from '../firebase/firebaseService';
import './QuestionManager.css';

interface Question {
  id: string;
  text: string;
  type: 'wordCloud' | 'scaleMeter';
}

const QuestionManager: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState<string>('');
  const [questionType, setQuestionType] = useState<'wordCloud' | 'scaleMeter'>('wordCloud');
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();

  // Fetch questions from Firebase on component mount
  useEffect(() => {
    const fetchQuestions = async () => {
      const fetchedQuestions = await getQuestions();
      setQuestions(fetchedQuestions);
    };
    fetchQuestions();
  }, []);

  const handleAddQuestion = async () => {
    if (newQuestion.trim() === '') return;

    const newQuestionObject: Omit<Question, 'id'> = {
      text: newQuestion,
      type: questionType,
    };

    setIsAdding(true);
    try {
      await addQuestion(newQuestionObject);
      const updatedQuestions = await getQuestions();
      setQuestions(updatedQuestions);
      setNewQuestion('');
    } catch (error) {
      console.error('Failed to add question:', error);
    }
    setIsAdding(false);
  };

  const handleStartPresentation = () => {
    if (questions.length > 0) {
      const firstQuestionId = questions[0].id; // Get the ID of the first question
      navigate(`/enter/${firstQuestionId}`, { state: { questions } });
    } else {
      alert('Please add at least one question before starting the presentation.');
    }
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
          onChange={(e) => setQuestionType(e.target.value as 'wordCloud' | 'scaleMeter')}
        >
          <option value="wordCloud">Word Cloud</option>
          <option value="scaleMeter">Scale Meter</option>
        </select>
        <button onClick={handleAddQuestion} disabled={isAdding}>
          {isAdding ? 'Adding...' : 'Add Question'}
        </button>
      </div>

      {questions.length > 0 && (
        <div className="questions-list">
          <h3>Questions List</h3>
          {questions.map((question) => (
            <div key={question.id} className="question-item">
              <h4>{question.text}</h4>
              <p>Type: {question.type === 'wordCloud' ? 'Word Cloud' : 'Scale Meter'}</p>
              <p>ID: {question.id}</p>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleStartPresentation}
        className="start-presentation-btn"
        disabled={questions.length === 0}
      >
        Start Presentation
      </button>
    </div>
  );
};

export default QuestionManager;
