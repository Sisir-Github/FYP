const faqs = [
  {
    question: 'What payment methods are accepted?',
    answer:
      'We accept Stripe (card payments), bank transfer, and Khalti mobile wallets.',
  },
  {
    question: 'What is the cancellation policy?',
    answer:
      'Cancellations 30+ days before departure receive a 70% refund. Within 30 days, refunds are based on supplier coverage.',
  },
  {
    question: 'How fit do I need to be?',
    answer:
      'A moderate level of fitness is required. We provide acclimatization days and pacing support.',
  },
  {
    question: 'What are accommodation standards?',
    answer:
      'You will stay in selected teahouses and lodges with daily meals included.',
  },
  {
    question: 'What about weather and altitude risks?',
    answer:
      'Our guides monitor weather, altitude, and health daily. Emergency protocols are always active.',
  },
]

function FAQ() {
  return (
    <div className="container-shell py-12">
      <h1 className="font-display text-3xl text-ink">Frequently Asked Questions</h1>
      <p className="mt-2 text-sm text-slate-600">
        Answers to common traveler questions about trekking in Nepal.
      </p>
      <div className="mt-8 space-y-4">
        {faqs.map((faq) => (
          <div key={faq.question} className="card-surface p-6">
            <p className="font-semibold text-ink">{faq.question}</p>
            <p className="mt-2 text-sm text-slate-600">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FAQ
