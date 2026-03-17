import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { matchmaking as matchmakingApi } from '../api/client';

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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-2 w-64 bg-slate-200 rounded-full" />
          <div className="h-32 w-96 bg-slate-100 rounded-2xl" />
        </div>
      </div>
    );
  }
  if (error && !current) return (
    <div className="max-w-xl mx-auto px-4 py-12 text-center">
      <p className="text-red-600">{error}</p>
    </div>
  );
  if (questions.length === 0) return (
    <div className="max-w-xl mx-auto px-4 py-12 text-center text-slate-600">No questions available.</div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
      <div className="flex items-center gap-2 text-primary-600 mb-6">
        <Sparkles className="w-5 h-5" />
        <span className="font-medium">{listingId ? 'Ideal roommate profile' : 'Compatibility quiz'}</span>
      </div>
      <p className="text-slate-600 mb-8">
        {listingId
          ? "Describe your ideal roommate for this listing. We'll use this to show match % to applicants."
          : "Answer a few questions about your living habits. We'll recommend the best listings and roommates."}
      </p>

      <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-8">
        <motion.div
          className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <p className="text-sm text-slate-500 mb-6">Question {index + 1} of {questions.length}</p>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="card p-8 mb-8"
        >
          <h2 className="font-display font-bold text-xl text-slate-950 mb-6">{current.questionText}</h2>
          {current.options && current.options.length > 0 ? (
            <div className="space-y-3">
              {current.options.map((opt, i) => (
                <label
                  key={i}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    answers[current.id] === String(i)
                      ? 'border-primary-500 bg-primary-50/50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${current.id}`}
                    checked={answers[current.id] === String(i)}
                    onChange={() => setAnswer(current.id, String(i))}
                    className="sr-only"
                  />
                  <span className="text-slate-800">{opt}</span>
                </label>
              ))}
            </div>
          ) : (
            <input
              type="text"
              placeholder="Your answer"
              value={answers[current.id] ?? ''}
              onChange={(e) => setAnswer(current.id, e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {error && <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-sm">{error}</div>}

      <div className="flex justify-between gap-4">
        <button
          type="button"
          className="btn btn-secondary flex items-center gap-2"
          onClick={handlePrev}
          disabled={index === 0}
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        <button
          type="button"
          className="btn btn-primary flex items-center gap-2"
          onClick={handleNext}
          disabled={submitting}
        >
          {index < questions.length - 1 ? 'Next' : 'See my matches'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
