import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { matchmaking as matchmakingApi } from '../api/client';
import './MatchmakingQuiz.css';

export default function MatchmakingQuiz() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const listingIdParam = searchParams.get('listingId');
  const listingId = listingIdParam ? Number(listingIdParam) : null;
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    matchmakingApi.getQuestions()
      .then(setQuestions)
      .catch(() => setError('Could not load questions'))
      .finally(() => setLoading(false));
  }, []);

  const current = questions[index];
  const progress = questions.length ? ((index + 1) / questions.length) * 100 : 0;

  const setAnswer = (questionId, valueText) => {
    setAnswers((a) => ({ ...a, [questionId]: valueText }));
  };

  const handleNext = () => {
    if (index < questions.length - 1) setIndex((i) => i + 1);
    else handleSubmit();
  };

  const handlePrev = () => {
    if (index > 0) setIndex((i) => i - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    const answerList = Object.entries(answers).map(([questionId, valueText]) => ({
      questionId: Number(questionId),
      valueText: String(valueText),
    }));
    try {
      await matchmakingApi.submitAnswers({ answers: answerList, listingId: listingId || undefined });
      if (listingId) navigate(`/listings/${listingId}/edit`);
      else navigate('/recommendations');
    } catch (err) {
      setError(err.message || 'Failed to submit');
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading quiz...</p>;
  if (error && !current) return <p>{error}</p>;
  if (questions.length === 0) return <p>No questions available.</p>;

  return (
    <div className="quiz-page">
      <h1>{listingId ? 'Ideal roommate profile' : 'Matchmaking quiz'}</h1>
      <p className="quiz-intro">
        {listingId
          ? "Describe your ideal roommate for this listing. This helps us match you with compatible users."
          : "Answer a few questions about your living habits. We'll use this to recommend the best listings and roommates."}
      </p>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <p className="progress-text">Question {index + 1} of {questions.length}</p>
      <div className="quiz-card">
        <h2>{current.questionText}</h2>
        {current.options && current.options.length > 0 ? (
          <div className="options">
            {current.options.map((opt, i) => (
              <label key={i} className="option">
                <input
                  type="radio"
                  name={`q-${current.id}`}
                  checked={answers[current.id] === String(i)}
                  onChange={() => setAnswer(current.id, String(i))}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        ) : (
          <input
            type="text"
            placeholder="Your answer"
            value={answers[current.id] ?? ''}
            onChange={(e) => setAnswer(current.id, e.target.value)}
          />
        )}
      </div>
      {error && <div className="error">{error}</div>}
      <div className="quiz-actions">
        <button type="button" className="btn btn-secondary" onClick={handlePrev} disabled={index === 0}>
          Previous
        </button>
        <button type="button" className="btn btn-primary" onClick={handleNext} disabled={submitting}>
          {index < questions.length - 1 ? 'Next' : 'See my matches'}
        </button>
      </div>
    </div>
  );
}
