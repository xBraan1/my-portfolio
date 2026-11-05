import { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';

// Everything except the layout and home page is loaded on demand to keep the first download small.
const WomensSalon = lazy(() => import('./pages/WomensSalon'));
const MensBarbering = lazy(() => import('./pages/MensBarbering'));
const ServicesDirectory = lazy(() => import('./pages/ServicesDirectory'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Booking = lazy(() => import('./pages/Booking'));
const BookingConfirmation = lazy(() => import('./pages/BookingConfirmation'));
const Gallery = lazy(() => import('./pages/Gallery'));
const StyleDetail = lazy(() => import('./pages/StyleDetail'));
const Promotions = lazy(() => import('./pages/Promotions'));
const Team = lazy(() => import('./pages/Team'));
const TeamProfile = lazy(() => import('./pages/TeamProfile'));
const About = lazy(() => import('./pages/About'));
const CaseStudies = lazy(() => import('./pages/CaseStudies'));
const CaseStudyDetail = lazy(() => import('./pages/CaseStudyDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const ContactThankYou = lazy(() => import('./pages/ContactThankYou'));
const Location = lazy(() => import('./pages/Location'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Preparation = lazy(() => import('./pages/Preparation'));
const Policies = lazy(() => import('./pages/Policies'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Cookies = lazy(() => import('./pages/Cookies'));
const Accessibility = lazy(() => import('./pages/Accessibility'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary fullPage>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/salon" element={<WomensSalon />} />
              <Route path="/barber" element={<MensBarbering />} />
              <Route path="/services" element={<ServicesDirectory />} />
              <Route path="/services/:slug" element={<ServiceDetail />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/booking/confirmation" element={<BookingConfirmation />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/gallery/:slug" element={<StyleDetail />} />
              <Route path="/promotions" element={<Promotions />} />
              <Route path="/team" element={<Team />} />
              <Route path="/team/:slug" element={<TeamProfile />} />
              <Route path="/about" element={<About />} />
              <Route path="/case-studies" element={<CaseStudies />} />
              <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/contact/thank-you" element={<ContactThankYou />} />
              <Route path="/location" element={<Location />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/preparation" element={<Preparation />} />
              <Route path="/policies" element={<Policies />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/accessibility" element={<Accessibility />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </HelmetProvider>
  );
}
