import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addQuestion, getQuestions, updateQuestion, deleteQuestion } from '../../firebase/firebaseService';
import DeleteLoader from '../loader/DeleteLoader';
import { Question } from '../../types/question';
import './QuestionManager.css';

const QuestionManager: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState<string>('');
  const [questionType, setQuestionType] = useState<Question['type']>('wordCloud');
  const [isAdding, setIsAdding] = useState(false);
  const [editQuestionId, setEditQuestionId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFading, setIsFading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      const fetchedQuestions: Question[] = await getQuestions();
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
      const updatedQuestions: Question[] = await getQuestions();
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

  const handleDeleteQuestion = async (questionId: string) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      setIsDeleting(true);
      try {
        await deleteQuestion(questionId);
        setQuestions(prevQuestions => prevQuestions.filter((question) => question.id !== questionId));
      } catch (error) {
        console.error('Failed to delete question:', error);
      } finally {
        setTimeout(() => {
          setIsDeleting(false);
        }, 3000);
      }
    }
  };

  const handleStartPresentation = () => {
    if (questions.length > 0) {
      navigate(`/enter/${questions[0].id}`, { state: { questions } });
    } else {
      alert('Please add at least one question before starting the presentation.');
    }
  };

  const paginatedQuestions = questions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(questions.length / itemsPerPage);

  const changePage = (pageNumber: number) => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentPage(pageNumber);
      setIsFading(false);
    }, 500);
  };
  const getDisplayText = (question: Question) => {
    if (question.type === 'happinessInput' && question.linkedHappinessScale) {
      return `Happiness Bar Chart (linked to Happiness Scale)`;
    }
    return question.text;
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
            onChange={(e) => setQuestionType(e.target.value as Question['type'])}
          >
            <option value="wordCloud">Word Cloud</option>
            <option value="happinessInput">Happiness Scale</option>
          </select>
          <button onClick={handleAddOrUpdateQuestion} disabled={isAdding}>
            {isAdding ? 'Processing...' : editQuestionId ? 'Update Question' : 'Add Question'}
          </button>
        </div>

        {isDeleting && <DeleteLoader />}

        {paginatedQuestions.length > 0 && (
          <div className={`questions-grid ${isFading ? 'fade-out' : ''}`}>
            {paginatedQuestions.map((question, index) => (
              <div
                key={question.id}
                className="question-item"
                style={{
                  backgroundColor: question.type === 'wordCloud' ? '#fce5cd' : '#d0e0e3',
                }}
              >
                <h4>Question {index + 1 + (currentPage - 1) * itemsPerPage}:</h4>
                <p className="question-text">{getDisplayText(question)}</p>
                <p className="type-id">Type: {question.type}</p>
                <p className="type-id">ID: {question.id}</p>
                {question.linkedHappinessScale && (
                  <p className="linked-id">Linked Bar Chart ID: {question.linkedHappinessScale}</p>
                )}
                <div className="button-group">
                  <button className="edit-button" onClick={() => handleEditQuestion(question)}>Edit</button>
                  <button className="delete-button" onClick={() => handleDeleteQuestion(question.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={i + 1 === currentPage ? 'active' : ''}
              onClick={() => changePage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>

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
