import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';

const Contact = () => {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-primary-900/70" />
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-white/80">Got questions? We'd love to hear from you.</p>
        </div>
      </section>

      <section className="section">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Contact Info */}
            <div className="space-y-6">
              <h2 className="text-2xl font-heading font-bold text-primary-500">Get In Touch</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Whether you have a question about our treks, pricing, or anything else, our team is ready to help.
              </p>

              <div className="space-y-4">
                {[
                  { icon: HiLocationMarker, label: 'Address', value: 'Thamel, Kathmandu, Nepal' },
                  { icon: HiPhone, label: 'Phone', value: '+977-1-234567890' },
                  { icon: HiMail, label: 'Email', value: 'info@everestencounter.com' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <item.icon className="w-6 h-6 text-accent-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">{item.label}</p>
                      <p className="text-sm font-medium text-gray-700">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="card p-8">
                <h3 className="text-xl font-heading font-semibold text-primary-500 mb-6">Send a Message</h3>
                <form className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="label">Full Name</label>
                      <input type="text" className="input" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="label">Email</label>
                      <input type="email" className="input" placeholder="john@example.com" />
                    </div>
                  </div>
                  <div>
                    <label className="label">Subject</label>
                    <input type="text" className="input" placeholder="How can we help?" />
                  </div>
                  <div>
                    <label className="label">Message</label>
                    <textarea rows={5} className="input resize-none" placeholder="Your message..." />
                  </div>
                  <button type="submit" className="btn-primary btn-lg w-full md:w-auto">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
