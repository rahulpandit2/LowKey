'use client';


interface Question {
  id: string;
  text: string;
  placeholder: string;
}

interface GuidedQuestionsProps {
  postType: string;
  answers: Record<string, string>;
  onAnswerChange: (questionId: string, value: string) => void;
}

export default function GuidedQuestions({
  postType,
  answers,
  onAnswerChange,
}: GuidedQuestionsProps) {
  const questionsByType: Record<string, Question[]> = {
    thought: [
      {
        id: 'thought_core',
        text: "What is the core idea I'm sharing?",
        placeholder: 'The main insight or perspective...',
      },
      {
        id: 'thought_evidence',
        text: 'What experience or evidence led me here?',
        placeholder: 'Personal experience, research, observation...',
      },
      {
        id: 'thought_broader',
        text: 'How might this connect to broader perspectives?',
        placeholder: 'Related fields, implications, connections...',
      },
      {
        id: 'thought_counter',
        text: 'What counterviews have I considered?',
        placeholder: 'Alternative perspectives, objections...',
      },
      {
        id: 'thought_open',
        text: 'Am I open to changing my view?',
        placeholder: 'Yes/No and why...',
      },
    ],
    problem: [
      {
        id: 'problem_what',
        text: 'What is the problem?',
        placeholder: 'Describe the challenge clearly...',
      },
      {
        id: 'problem_tried',
        text: 'What have you tried so far and what were the outcomes?',
        placeholder: 'Actions taken, results observed...',
      },
      {
        id: 'problem_resources',
        text: 'What resources or support do you need?',
        placeholder: 'Skills, tools, advice, connections...',
      },
      {
        id: 'problem_next',
        text: 'What step could you try next?',
        placeholder: 'One small action you could take...',
      },
      {
        id: 'problem_help',
        text: 'Are you open to help?',
        placeholder: 'Yes/No and what kind of help...',
      },
    ],
    achievement: [
      {
        id: 'achievement_what',
        text: 'What did you achieve?',
        placeholder: 'Describe the milestone...',
      },
      {
        id: 'achievement_helped',
        text: 'What helped you get there?',
        placeholder: 'Strategies, people, resources...',
      },
      {
        id: 'achievement_differently',
        text: 'What would you do differently?',
        placeholder: 'Lessons learned, improvements...',
      },
      {
        id: 'achievement_who',
        text: 'Who helped or supported you?',
        placeholder: 'People, communities, mentors...',
      },
      {
        id: 'achievement_next',
        text: "What's the next step?",
        placeholder: 'What comes after this milestone...',
      },
    ],
    dilemma: [
      {
        id: 'dilemma_decision',
        text: 'What is the decision or trade-off you face?',
        placeholder: 'Describe the choice clearly...',
      },
      {
        id: 'dilemma_options',
        text: 'What are the main options and consequences?',
        placeholder: 'Option A: ... Option B: ...',
      },
      {
        id: 'dilemma_values',
        text: 'What values guide your choice?',
        placeholder: 'Principles, priorities, long-term goals...',
      },
      {
        id: 'dilemma_help',
        text: 'What would help you move toward resolution?',
        placeholder: 'Perspectives, frameworks, questions...',
      },
      {
        id: 'dilemma_step',
        text: 'What small step feels right now?',
        placeholder: 'One action to gain clarity...',
      },
    ],
  };

  const questions = questionsByType[postType] || [];

  return (
    <div className="space-y-8">
      {questions.map((question, index) => (
        <div key={question.id} className="relative">
          <label className="block text-sm text-zinc-400 mb-3 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-xs text-primary font-medium">
              {index + 1}
            </span>
            <span>{question.text}</span>
          </label>
          <textarea
            value={answers[question.id] || ''}
            onChange={(e) => onAnswerChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            rows={3}
            className="w-full bg-transparent border-b border-zinc-800 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors resize-none placeholder-zinc-700"
          />
        </div>
      ))}
    </div>
  );
}
