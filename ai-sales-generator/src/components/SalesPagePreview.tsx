"use client";

interface Benefit {
  title: string;
  description: string;
}

interface Feature {
  name: string;
  detail: string;
}

interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

interface SalesPageContent {
  headline: string;
  subheadline: string;
  productDescription: string;
  benefits: Benefit[];
  features: Feature[];
  socialProof: {
    testimonial1: Testimonial;
    testimonial2: Testimonial;
    testimonial3: Testimonial;
  };
  pricing: {
    price: string;
    description: string;
    guarantee: string;
  };
  cta: {
    primary: string;
    secondary: string;
  };
}

export default function SalesPagePreview({
  content,
  productName,
}: {
  content: SalesPageContent;
  productName: string;
}) {
  const testimonials = [
    content.socialProof.testimonial1,
    content.socialProof.testimonial2,
    content.socialProof.testimonial3,
  ];

  return (
    <div className="font-sans">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            ✨ Introducing {productName}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            {content.headline}
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto">
            {content.subheadline}
          </p>
          <button className="bg-white text-blue-700 font-bold text-lg px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition hover:scale-105">
            {content.cta.primary}
          </button>
          <p className="text-blue-200 text-sm mt-4">{content.cta.secondary}</p>
        </div>
      </section>

      {/* Product Description */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-6">
            What is {productName}?
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line">
            {content.productDescription}
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-slate-50 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">
            Why Choose {productName}?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content.benefits.map((benefit, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-blue-600 font-bold">{i + 1}</span>
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">
                  {benefit.title}
                </h3>
                <p className="text-slate-500">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">
            Everything You Need
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.features.map((feature, i) => (
              <div
                key={i}
                className="text-center p-6 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl">⚡</span>
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{feature.name}</h3>
                <p className="text-slate-500 text-sm">{feature.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-50 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-4">
            What Our Customers Say
          </h2>
          <p className="text-slate-500 text-center mb-12">
            Join thousands of happy users
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, s) => (
                    <span key={s} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-slate-600 italic mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{t.name}</p>
                    <p className="text-slate-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Simple, Transparent Pricing
          </h2>
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 text-white shadow-2xl">
            <p className="text-blue-200 text-sm font-semibold uppercase tracking-widest mb-2">
              Get Started Today
            </p>
            <div className="text-5xl font-extrabold mb-4">
              {content.pricing.price}
            </div>
            <p className="text-blue-100 mb-8">{content.pricing.description}</p>
            <button className="w-full bg-white text-blue-700 font-bold py-4 rounded-2xl text-lg hover:shadow-lg transition hover:scale-105">
              {content.cta.primary}
            </button>
            <p className="text-blue-200 text-sm mt-4">
              🛡️ {content.pricing.guarantee}
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-slate-900 py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-slate-400 mb-8">{content.cta.secondary}</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-12 py-4 rounded-full transition hover:scale-105">
            {content.cta.primary}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center">
        <p className="text-slate-500 text-sm">
          Generated by ✨ AI Sales Page Generator
        </p>
      </footer>
    </div>
  );
}