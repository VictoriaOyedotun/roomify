import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Shield, LayoutGrid, UserPlus, ClipboardList, MessageCircle, Home } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import FeatureCard from '../components/FeatureCard';
import StepCard from '../components/StepCard';
import RoommateCard from '../components/RoommateCard';
import ListingCard from '../components/ListingCard';
import CTASection from '../components/CTASection';
import { useAuth } from '../context/AuthContext';

const trustCards = [
  {
    icon: Heart,
    title: 'Compatibility Matching',
    description: 'We match you based on sleep schedule, cleanliness, social habits, budget, and more — so you find roommates who actually fit your lifestyle.',
  },
  {
    icon: Shield,
    title: 'Verified Profiles & Safer Connections',
    description: 'Intentional profiles and transparent preferences help you connect with real people. Chat in-app before meeting in person.',
  },
  {
    icon: LayoutGrid,
    title: 'Listings + Roommate Search in One Place',
    description: 'Browse available rooms or find someone looking for a roommate. One platform for every way to find your next home.',
  },
];

const steps = [
  { step: 1, title: 'Create your profile', description: 'Sign up and add your basics, location, and budget.', icon: UserPlus },
  { step: 2, title: 'Take the compatibility quiz', description: 'Answer a few questions about your lifestyle and habits.', icon: ClipboardList },
  { step: 3, title: 'Explore matches and listings', description: 'See compatible roommates and available rooms in one place.', icon: LayoutGrid },
  { step: 4, title: 'Chat and move in with confidence', description: 'Message your matches and coordinate move-in when you\'re ready.', icon: MessageCircle },
];

const placeholderMatches = [
  { name: 'Jordan', age: 24, city: 'San Francisco', matchScore: 94, bio: 'Designer who loves quiet mornings and weekend hikes.', tags: ['Early Bird', 'Clean', 'Quiet'], budget: '1,200', moveInDate: 'Dec 1' },
  { name: 'Sam', age: 26, city: 'Oakland', matchScore: 89, bio: 'Remote dev, into cooking and game nights.', tags: ['Night Owl', 'Social', 'Pet Friendly'], budget: '1,400', moveInDate: 'Jan 15' },
  { name: 'Alex', age: 23, city: 'Berkeley', matchScore: 87, bio: 'Grad student looking for a chill, respectful place.', tags: ['Student', 'Clean', 'Quiet'], budget: '1,000', moveInDate: 'Dec 15' },
];

const placeholderListings = [
  { title: 'Sunny room in Mission', location: 'San Francisco, CA', rent: 1450, availableDate: 'Dec 1', furnished: true },
  { title: 'Private room near BART', location: 'Oakland, CA', rent: 1200, availableDate: 'Jan 1', furnished: false },
  { title: 'Cozy spot in Berkeley', location: 'Berkeley, CA', rent: 1100, availableDate: 'Dec 15', furnished: true },
];

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <HeroSection />

      {/* Trust / Pain to solution */}
      <section id="trust" className="py-20 md:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="section-heading">
              Finding a roommate shouldn't be a gamble
            </h2>
            <p className="section-sub">
              Random listings are stressful, awkward, and risky. Roomify matches you with compatible roommates and listings so you can skip the guesswork.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {trustCards.map((card, i) => (
              <FeatureCard key={card.title} {...card} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 md:py-28 bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-heading">How it works</h2>
            <p className="section-sub mx-auto">Four simple steps to your next roommate.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {steps.map((s, i) => (
              <StepCard key={s.step} {...s} delay={i * 0.1} isLast={i === steps.length - 1} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured matches preview */}
      <section className="py-20 md:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
          >
            <div>
              <h2 className="section-heading">Featured matches</h2>
              <p className="section-sub">Roommates who could be a great fit.</p>
            </div>
            <Link to={isAuthenticated ? '/recommendations' : '/register'} className="btn btn-primary shrink-0">
              See More Matches
            </Link>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {placeholderMatches.map((m, i) => (
              <RoommateCard key={m.name} {...m} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* Listings preview */}
      <section className="py-20 md:py-28 bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
          >
            <div>
              <h2 className="section-heading">Browse rooms</h2>
              <p className="section-sub">Available rooms from verified listers.</p>
            </div>
            <Link to="/listings" className="btn btn-secondary shrink-0">
              View All Listings
            </Link>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {placeholderListings.map((l, i) => (
              <ListingCard
                key={l.title}
                {...l}
                availableDate={l.availableDate}
                delay={i * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Safety */}
      <section id="safety" className="py-20 md:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 text-primary-600 mb-6">
              <Shield className="w-8 h-8" />
            </div>
            <h2 className="section-heading">Safety and trust first</h2>
            <p className="section-sub">
              We're built to help you feel confident: verified profiles, intentional matching, transparent preferences, and secure in-app messaging so you're in control.
            </p>
          </motion.div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
