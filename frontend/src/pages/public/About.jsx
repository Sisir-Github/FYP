import { HiOutlineGlobe, HiOutlineHeart, HiOutlineShieldCheck } from 'react-icons/hi';

const About = () => {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1920&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-primary-900/70" />
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">About Us</h1>
          <p className="text-lg text-white/80 max-w-xl mx-auto">
            Learn about our story, mission, and the team behind your Himalayan adventures.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-accent-500 font-semibold text-sm uppercase tracking-wider mb-2">Our Story</p>
            <h2 className="text-3xl font-heading font-bold text-primary-500">
              Born in the Heart of the Himalayas
            </h2>
          </div>
          <div className="prose prose-lg text-gray-600 mx-auto text-center">
            <p>
              Everest Encounter Treks and Expedition Pvt. Ltd. was founded with a passion for sharing
              the raw beauty and spiritual richness of Nepal's mountains. Based in Kathmandu, we have
              been organizing treks, peak climbing expeditions, and cultural tours for adventurers from
              around the world.
            </p>
            <p>
              Our team of experienced Sherpa guides and trek leaders are committed to providing safe,
              sustainable, and unforgettable experiences. We believe in responsible tourism that
              benefits local communities and preserves the pristine Himalayan environment.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: HiOutlineShieldCheck,
                title: 'Safety & Trust',
                desc: 'Your safety is our top priority. All treks are led by certified guides with comprehensive safety equipment.',
              },
              {
                icon: HiOutlineHeart,
                title: 'Passion & Care',
                desc: 'We treat every trekker like family. Personalized attention and genuine care define our service.',
              },
              {
                icon: HiOutlineGlobe,
                title: 'Sustainability',
                desc: 'We practice leave-no-trace principles and support local communities through responsible tourism.',
              },
            ].map((value, i) => (
              <div key={i} className="card p-8 text-center">
                <value.icon className="w-10 h-10 text-accent-500 mx-auto mb-4" />
                <h3 className="text-lg font-heading font-semibold text-primary-500 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-500">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
