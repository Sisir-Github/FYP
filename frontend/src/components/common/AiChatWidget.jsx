import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HiChatAlt2,
  HiPaperAirplane,
  HiSparkles,
  HiX,
} from 'react-icons/hi';
import aiService from '../../services/aiService';

const WELCOME_MESSAGE = {
  role: 'assistant',
  content:
    'Namaste. I can help with trek recommendations, difficulty, duration, pricing, seasons, booking basics, and blog topics from Everest Encounter.',
  relatedTreks: [],
};

const QUICK_PROMPTS = [
  'Recommend an easy trek for beginners',
  'Which treks are best in autumn?',
  'How does booking work on this website?',
];

const AiChatWidget = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [error, setError] = useState('');
  const scrollRef = useRef(null);

  const history = useMemo(
    () =>
      messages
        .filter((message) => message.role === 'user' || message.role === 'assistant')
        .slice(-8)
        .map(({ role, content }) => ({ role, content })),
    [messages]
  );

  useEffect(() => {
    if (!isOpen) return;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isOpen]);

  const submitMessage = async (rawMessage) => {
    const message = rawMessage.trim();
    if (!message || isLoading) return;

    const nextUserMessage = { role: 'user', content: message };
    const previousHistory = history;

    setMessages((current) => [...current, nextUserMessage]);
    setInput('');
    setError('');
    setIsLoading(true);

    try {
      const response = await aiService.chat({
        message,
        history: previousHistory,
        pageContext: {
          pathname: location.pathname,
        },
      });

      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: response.data.reply,
          relatedTreks: response.data.relatedTreks || [],
        },
      ]);
    } catch (err) {
      const messageText = err.response?.data?.message || 'The AI assistant is unavailable right now.';
      setError(messageText);
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content:
            'I could not generate a live reply right now. You can still browse treks or use the contact page for direct support.',
          relatedTreks: [],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await submitMessage(input);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[60]">
      {isOpen ? (
        <div className="w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-[28px] border border-primary-100 bg-white shadow-2xl">
          <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 px-5 pb-5 pt-4 text-white">
            <div className="absolute right-[-22px] top-[-26px] h-24 w-24 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-[-40px] left-[-12px] h-24 w-24 rounded-full bg-white/10 blur-2xl" />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
                  <HiSparkles className="h-4 w-4" />
                  AI Help
                </div>
                <h3 className="text-lg font-heading font-bold">Everest Encounter Assistant</h3>
                <p className="mt-1 text-sm text-white/80">
                  Ask about treks, seasons, pricing, bookings, or blog topics.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full bg-white/15 p-2 text-white transition-colors hover:bg-white/25"
                aria-label="Close AI assistant"
              >
                <HiX className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="max-h-[26rem] space-y-4 overflow-y-auto bg-slate-50 px-4 py-4">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                    message.role === 'user'
                      ? 'rounded-br-md bg-primary-600 text-white'
                      : 'rounded-bl-md border border-white bg-white text-slate-700'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>

                  {message.relatedTreks?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.relatedTreks.map((trek) => (
                        <Link
                          key={trek.slug}
                          to={`/treks/${trek.slug}`}
                          className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-600 transition-colors hover:bg-primary-100"
                        >
                          {trek.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md border border-white bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 bg-white px-4 py-4">
            {messages.length === 1 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => submitMessage(prompt)}
                    className="rounded-full border border-primary-100 bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-600 transition-colors hover:bg-primary-100"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {error && <p className="mb-3 text-xs text-red-500">{error}</p>}

            <form onSubmit={handleSubmit} className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                rows={1}
                maxLength={2000}
                placeholder="Ask about Everest treks..."
                className="input min-h-[52px] resize-none rounded-2xl bg-slate-50 py-3"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-accent-500 text-white transition-colors hover:bg-accent-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                aria-label="Send message"
              >
                <HiPaperAirplane className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-3 rounded-full bg-gradient-to-r from-primary-600 to-accent-500 px-4 py-3 text-white shadow-2xl transition-transform duration-200 hover:-translate-y-0.5"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
            <HiChatAlt2 className="h-6 w-6" />
          </span>
          <div className="hidden text-left sm:block">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75">AI Help</p>
            <p className="text-sm font-semibold">Ask About Treks</p>
          </div>
        </button>
      )}
    </div>
  );
};

export default AiChatWidget;
