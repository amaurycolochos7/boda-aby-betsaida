'use client';

import { useEffect, useState } from 'react';

export function ScrollAnimator({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('ec-visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.ec-animate').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
}

interface FAQItemData {
  question: string;
  answer: string;
}

export function FAQList({ items }: { items: FAQItemData[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      {items.map((item, i) => (
        <div key={i} className={`ec-faq-item ${openIndex === i ? 'open' : ''}`}>
          <button className="ec-faq-question" onClick={() => toggle(i)}>
            <span>{item.question}</span>
            <svg className="ec-faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <div className="ec-faq-answer">
            <p className="ec-faq-answer-text">{item.answer}</p>
          </div>
        </div>
      ))}
    </>
  );
}

interface TestimonialData {
  stars: number;
  text: string;
  initials: string;
  name: string;
  role: string;
}

export function TestimonialCarousel({ items }: { items: TestimonialData[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [items.length]);

  const item = items[active];

  return (
    <div className="ec-carousel">
      <div className="ec-carousel-card" key={active}>
        <div className="ec-testimonial-stars">
          {Array.from({ length: item.stars }).map((_, i) => (
            <svg key={i} className="ec-testimonial-star" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          ))}
        </div>
        <p className="ec-testimonial-text">{item.text}</p>
        <div className="ec-testimonial-author">
          <div className="ec-testimonial-avatar">{item.initials}</div>
          <div>
            <div className="ec-testimonial-name">{item.name}</div>
            <div className="ec-testimonial-role">{item.role}</div>
          </div>
        </div>
      </div>
      <div className="ec-carousel-dots">
        {items.map((_, i) => (
          <button
            key={i}
            className={`ec-carousel-dot ${i === active ? 'active' : ''}`}
            onClick={() => setActive(i)}
            aria-label={`Testimonio ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

const EXAMPLE_URLS = [
  'ana-y-luis',
  '15-valeria',
  'boda-reyes',
  'fiesta-sofia',
];

export function AnimatedURL() {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % EXAMPLE_URLS.length);
        setFading(false);
      }, 300);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="ec-url-demo">
      <div className="ec-url-before">
        <span className="ec-url-label">Antes</span>
        <span className="ec-url-old">eventcontrol.site/event/mi-boda</span>
      </div>
      <div className="ec-url-after">
        <span className="ec-url-label">Ahora</span>
        <span className="ec-url-bar">
          <span className="ec-url-lock">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
          </span>
          <span className={`ec-url-slug ${fading ? 'ec-url-fading' : ''}`}>{EXAMPLE_URLS[index]}</span>
          <span className="ec-url-domain">.eventcontrol.site</span>
        </span>
      </div>
    </div>
  );
}
