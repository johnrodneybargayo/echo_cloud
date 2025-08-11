import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  addQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
} from "../firebase/firebaseService";
import { Question } from "../types/question";
import DeleteLoader from "./loader/DeleteLoader";
import "./QuestionManager.css";

const QuestionManager: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState<string>("");
  const [questionType, setQuestionType] = useState<Question["type"]>("wordCloud");
  const [isAdding, setIsAdding] = useState(false);
  const [editQuestionId, setEditQuestionId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();

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
      linkedHappinessScale: false, // Add this required property
      createdAt: Date.now(),
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

  const handleStartPresentation = () => {
    if (!questions.length) {
      alert("Add a question before starting the presentation.");
      return;
    }

    const sortedQuestions = [...questions].sort((a, b) => a.createdAt - b.createdAt);
    const firstQuestion = sortedQuestions[0];

    if (firstQuestion.type === "happinessInput") {
      navigate(`/happiness-scale/${firstQuestion.id}`);
    } else if (firstQuestion.type === "happinessBarChart" && firstQuestion.linkedTo) {
      const linkedInput = questions.find((q) => q.id === firstQuestion.linkedTo);
      if (linkedInput) {
        navigate(`/happiness-scale/${linkedInput.id}`);
      } else {
        alert("Linked question not found.");
      }
    } else if (firstQuestion.type === "wordCloud") {
      navigate(`/enter/${firstQuestion.id}`);
    } else {
      alert("Unsupported question type.");
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

      {paginatedQuestions.length > 0 ? (
        paginatedQuestions.map((question) => (
          <div key={question.id} className="question-item">
            <p>{getDisplayText(question)}</p>
            <button onClick={() => handleEditQuestion(question)}>Edit</button>
            <button onClick={() => handleDeleteQuestion(question.id)}>Delete</button>
          </div>
        ))
      ) : (
        <p>No questions available.</p>
      )}

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

      <button onClick={handleStartPresentation}>Start Presentation</button>
    </div>
  );
};

export default QuestionManager;
