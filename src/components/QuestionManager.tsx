// src/components/QuestionManager.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addQuestion, getQuestions, updateQuestion } from '../firebase/firebaseService';
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
  const [editQuestionId, setEditQuestionId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      const fetchedQuestions = await getQuestions();
      setQuestions(fetchedQuestions);
    };
    fetchQuestions();
  }, []);

  const handleAddOrUpdateQuestion = async () => {
    if (newQuestion.trim() === '') return;

    const questionData: Omit<Question, 'id'> = {
      text: newQuestion,
      type: questionType,
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
      setNewQuestion('');
      setEditQuestionId(null);
    } catch (error) {
      console.error('Failed to add/update question:', error);
    }
    setIsAdding(false);
  };

  const handleEditQuestion = (question: Question) => {
    setEditQuestionId(question.id);
    setNewQuestion(question.text);
    setQuestionType(question.type);
  };

  const handleStartPresentation = () => {
    if (questions.length > 0) {
      const firstQuestionId = questions[0].id;
      navigate(`/enter/${firstQuestionId}`, { state: { questions } });
    } else {
      alert('Please add at least one question before starting the presentation.');
    }
  };

  return (
    <div className="full-page-container">
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
          <button onClick={handleAddOrUpdateQuestion} disabled={isAdding}>
            {isAdding ? 'Processing...' : editQuestionId ? 'Update Question' : 'Add Question'}
          </button>
        </div>

        {questions.length > 0 && (
          <div className="questions-grid">
            {questions.map((question) => (
              <div
                key={question.id}
                className="question-item"
                style={{ backgroundColor: question.type === 'wordCloud' ? '#fce5cd' : '#d0e0e3' }}
              >
                <h4>{question.text}</h4>
                <p style={{ fontWeight: 'normal', textAlign: 'center' }}>Type: {question.type}</p>
                <p style={{ fontWeight: 'normal', textAlign: 'center' }}>ID: {question.id}</p>
                <button onClick={() => handleEditQuestion(question)}>Edit</button>
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
    </div>
  );
};

export default QuestionManager;
