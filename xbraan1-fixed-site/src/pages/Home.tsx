import { Link } from 'react-router-dom';
import { ArrowRight, Scissors, Sparkles, Award, Palette, ThumbsUp, Users, Star } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import OptimizedImage from '../components/OptimizedImage';
import { siteConfig } from '../config/site';
import { getServiceBySlug } from '../data/services';
import { galleryItems } from '../data/gallery';
import { teamMembers } from '../data/team';
import { testimonials } from '../data/testimonials';
import { promotions } from '../data/promotions';
import { formatPriceFrom } from '../lib/format';

const featuredServices = ['womens-cut', 'mens-cut', 'consultation']
  .map((slug) => getServiceBySlug(slug))
  .filter((s): s is NonNullable<typeof s> => Boolean(s));

const galleryPreview = galleryItems.filter((_, i) => i % Math.max(1, Math.floor(galleryItems.length / 6)) === 0).slice(0, 6);

export default function Home() {
  const activePromotion = siteConfig.features.promotions ? promotions[0] : undefined;
  const showTestimonials = siteConfig.features.testimonials && testimonials.length > 0;
  const showTeam = siteConfig.features.team && teamMembers.length > 0;

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative bg-neutral-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 mb-4">Premium Salon & Barbershop</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-semibold leading-tight mb-6">
              Where precision meets <span className="italic text-neutral-300">personal style</span>
            </h1>
            <p className="text-lg text-neutral-300 leading-relaxed mb-8">
              Expert cuts, colour, styling and grooming — crafted by a team who care about the details.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/booking" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-neutral-900 font-medium rounded-md hover:bg-neutral-100 transition-colors">
                Book an Appointment <ArrowRight size={16} />
              </Link>
              <Link to="/services" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-neutral-600 text-white font-medium rounded-md hover:bg-white/5 transition-colors">
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Two Directions */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/salon" className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-rose-50 to-stone-50 dark:from-rose-950/20 dark:to-neutral-900 border border-rose-100 dark:border-rose-900/30 p-8 hover:shadow-lg transition-shadow">
            <div className="relative">
              <div className="w-10 h-10 bg-rose-100 dark:bg-rose-900/30 rounded-md flex items-center justify-center mb-4">
                <Sparkles size={20} className="text-rose-700 dark:text-rose-400" />
              </div>
              <h2 className="text-2xl font-serif font-semibold text-neutral-900 dark:text-white mb-2">Women's Salon</h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">Cuts, colour, balayage, braids, locs, silk presses, extensions, bridal styling and more.</p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-rose-800 dark:text-rose-400 group-hover:gap-2 transition-all">
                Explore salon services <ArrowRight size={14} />
              </span>
            </div>
          </Link>

          <Link to="/barber" className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-slate-50 to-stone-50 dark:from-slate-950/20 dark:to-neutral-900 border border-slate-200 dark:border-slate-800 p-8 hover:shadow-lg transition-shadow">
            <div className="relative">
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-md flex items-center justify-center mb-4">
                <Scissors size={20} className="text-slate-700 dark:text-slate-400" />
              </div>
              <h2 className="text-2xl font-serif font-semibold text-neutral-900 dark:text-white mb-2">Men's Barbering</h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">Fades, tapers, line-ups, beard sculpting, hot-towel shaves, designs and classic cuts.</p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-slate-800 dark:text-slate-400 group-hover:gap-2 transition-all">
                Explore barber services <ArrowRight size={14} />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Services */}
      <section className="bg-white dark:bg-neutral-900 border-y border-neutral-100 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-neutral-600 dark:text-neutral-400 mb-2">What We Offer</p>
              <h2 className="text-3xl font-serif font-semibold text-neutral-900 dark:text-white">Our Services</h2>
            </div>
            <Link to="/services" className="inline-flex items-center gap-1 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredServices.map((service) => (
              <Link key={service.slug} to={`/services/${service.slug}`} className="group block p-5 border border-neutral-100 dark:border-neutral-800 rounded-lg hover:border-neutral-300 dark:hover:border-neutral-600 hover:shadow-sm transition-all">
                <div className="w-full h-40 rounded-md overflow-hidden mb-4 bg-neutral-100 dark:bg-neutral-800">
                  <OptimizedImage 
                    src={service.image} 
                    alt={service.imageAlt}
                    className="group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">{service.name}</h3>
                <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  {formatPriceFrom(service.priceFrom)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-neutral-50 dark:bg-neutral-900 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.15em] text-neutral-600 dark:text-neutral-400 mb-2">Why xBraan1</p>
            <h2 className="text-3xl font-serif font-semibold text-neutral-900 dark:text-white">The Premium Difference</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Award, title: 'Services for every hair type', desc: 'Cuts, colour, braids, locs, natural hair and barbering, all in one place' },
              { icon: Palette, title: 'Consultation first', desc: 'Complimentary with any service booking, so you know the plan before we start' },
              { icon: ThumbsUp, title: 'Clear guide prices', desc: 'Every service has a guide price on our Prices page; the final price is confirmed at consultation' },
              { icon: Users, title: 'Inclusive space', desc: 'Welcoming all genders, hair types and styles' },
            ].map((item, i) => {
              const IconComponent = item.icon;
              return (
                <div key={i} className="text-center p-6 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-100 dark:border-neutral-700">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
                    <IconComponent size={24} className="text-neutral-700 dark:text-neutral-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team preview (shown only when real, verified team profiles are enabled in siteConfig.features) */}
      {showTeam && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-neutral-600 dark:text-neutral-400 mb-2">Our Team</p>
              <h2 className="text-3xl font-serif font-semibold text-neutral-900 dark:text-white">Meet the Team</h2>
            </div>
            <Link to="/team" className="inline-flex items-center gap-1 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white">
              View all <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {teamMembers.slice(0, 6).map((member) => (
              <Link key={member.id} to={`/team/${member.slug}`} className="group text-center">
                <div className="aspect-square rounded-lg overflow-hidden mb-2 bg-neutral-100 dark:bg-neutral-800">
                  <OptimizedImage src={member.image} alt={member.imageAlt} className="group-hover:scale-105 transition-transform duration-300" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">{member.name}</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">{member.role}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Gallery Preview */}
      <section className="bg-white dark:bg-neutral-900 border-y border-neutral-100 dark:border-neutral-800 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-neutral-600 dark:text-neutral-400 mb-2">Inspiration</p>
              <h2 className="text-3xl font-serif font-semibold text-neutral-900 dark:text-white">Style Gallery</h2>
            </div>
            <Link to="/gallery" className="inline-flex items-center gap-1 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white">
              View gallery <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {galleryPreview.map((item) => (
              <Link key={item.slug} to={`/gallery/${item.slug}`} className="group relative aspect-square rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                <OptimizedImage 
                  src={item.image} 
                  alt={item.imageAlt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials: only real, consented reviews (src/data/testimonials.ts) */}
      {showTestimonials && (
        <section className="bg-neutral-50 dark:bg-neutral-900 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.15em] text-neutral-600 dark:text-neutral-400 mb-2">Testimonials</p>
              <h2 className="text-3xl font-serif font-semibold text-neutral-900 dark:text-white">What Clients Say</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <figure key={testimonial.id} className="bg-white dark:bg-neutral-800 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  <div className="flex gap-1 mb-3" role="img" aria-label={`${testimonial.rating} out of 5 stars`}>
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} size={16} className="fill-amber-400 text-amber-500" aria-hidden="true" />
                    ))}
                  </div>
                  <blockquote className="text-sm text-neutral-700 dark:text-neutral-300 mb-4 italic">“{testimonial.text}”</blockquote>
                  <figcaption className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {testimonial.name} <span className="font-normal text-neutral-600 dark:text-neutral-400">· {testimonial.source}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Offer: only when a real promotion is configured (src/data/promotions.ts) */}
      {activePromotion && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg p-8 lg:p-12 text-center">
            <p className="text-xs uppercase tracking-[0.15em] text-neutral-600 dark:text-neutral-400 mb-2">Offer</p>
            <h2 className="text-2xl lg:text-3xl font-serif font-semibold text-neutral-900 dark:text-white mb-3">{activePromotion.title}</h2>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-6 max-w-md mx-auto">{activePromotion.description}</p>
            <Link to="/promotions" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
              See the offer <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 pb-32">
        <div className="bg-neutral-900 dark:bg-neutral-800 rounded-lg p-8 lg:p-12 text-center text-white">
          <h2 className="text-2xl lg:text-3xl font-serif font-semibold mb-3">Ready for Your Next Look?</h2>
          <p className="text-sm text-neutral-300 dark:text-neutral-400 mb-6 max-w-md mx-auto">Send an appointment request online, or get in touch to talk through the style you have in mind.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/booking" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-neutral-100 text-neutral-900 font-medium rounded-md hover:bg-neutral-100 dark:hover:bg-white transition-colors">
              Book Now <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-neutral-600 dark:border-neutral-500 text-white font-medium rounded-md hover:bg-white/5 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
