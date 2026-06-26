import { useEffect } from 'react';
import { initPortfolio } from '../js/main.js';

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#works', label: 'Works' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
];

const marqueeTags = ['[TAG1]', '[TAG2]', '[TAG3]', '[TAG4]', '[TAG5]'];
const filters = [
  { value: 'all', label: 'All' },
  { value: '[CAT1]', label: '[CATEGORY 1]' },
  { value: '[CAT2]', label: '[CATEGORY 2]' },
  { value: '[CAT3]', label: '[CATEGORY 3]' },
];

const projects = [
  { num: '01', title: '[PROJECT TITLE]', tags: '[Tag] · [Tag] · [Year]', category: '[CAT1]', large: true },
  { num: '02', title: '[PROJECT TITLE]', tags: '[Tag] · [Tag] · [Year]', category: '[CAT2]' },
  { num: '03', title: '[PROJECT TITLE]', tags: '[Tag] · [Tag] · [Year]', category: '[CAT3]' },
  { num: '04', title: '[PROJECT TITLE]', tags: '[Tag] · [Tag] · [Year]', category: '[CAT1]' },
];

const stats = [
  { num: '[N]+', label: 'Years Experience' },
  { num: '[N]+', label: 'Projects' },
  { num: '[N]+', label: 'Clients' },
];

const skills = [
  { num: '01', title: '[SKILL / SERVICE 1]', desc: '[MÔ TẢ NGẮN]', delay: undefined },
  { num: '02', title: '[SKILL / SERVICE 2]', desc: '[MÔ TẢ NGẮN]', delay: '0.1s' },
  { num: '03', title: '[SKILL / SERVICE 3]', desc: '[MÔ TẢ NGẮN]', delay: '0.2s' },
  { num: '04', title: '[SKILL / SERVICE 4]', desc: '[MÔ TẢ NGẮN]', delay: '0.3s' },
];

const testimonials = [
  {
    quote: '"[LỜI NHẬN XÉT CỦA KHÁCH HÀNG / ĐỐI TÁC]"',
    name: '[TÊN]',
    role: '[CHỨC VỤ, CÔNG TY]',
    delay: undefined,
  },
  {
    quote: '"[LỜI NHẬN XÉT]"',
    name: '[TÊN]',
    role: '[CHỨC VỤ, CÔNG TY]',
    delay: '0.15s',
  },
];

const socials = ['LinkedIn', 'GitHub', 'Behance', 'Dribbble'];

function Loader() {
  return (
    <div id="loader">
      <div className="loader__top">
        <div className="loader__logo-box" aria-label="La Hieu Phong">
          <div className="loader__logo-mark" aria-hidden="true">
            <span className="loader__logo-computer">
              <span className="loader__logo-screen">
                <span className="loader__logo-monogram">LHP</span>
              </span>
              <span className="loader__logo-stand" />
              <span className="loader__logo-base" />
            </span>
          </div>
          <span className="loader__logo-wordmark">LA HIEU PHONG</span>
        </div>
      </div>

      <div className="loader__center">
        <p className="loader__word" aria-label="loading">
          <span className="loader__word-part loader__word-part--load" aria-hidden="true">
            <span className="loader__letter loader__letter--l">l</span>
            <span className="loader__letter loader__letter--o">o</span>
            <span className="loader__letter loader__letter--a">a</span>
            <span className="loader__letter loader__letter--d">d</span>
          </span>
          <span className="loader__word-icon" aria-hidden="true" />
          <span className="loader__word-part loader__word-part--ing" aria-hidden="true">
            <span className="loader__letter loader__letter--i">i</span>
            <span className="loader__letter loader__letter--n">n</span>
            <span className="loader__letter loader__letter--g">g</span>
          </span>
        </p>
      </div>

      <div className="loader__bottom" aria-hidden="true">
        <div className="loader__bird" data-svg-src="assets/svg/loader-bird.svg" />
      </div>
    </div>
  );
}

function Cursor() {
  return (
    <div id="cursor">
      <div className="cursor__dot" />
      <div className="cursor__ring" />
    </div>
  );
}

function Navigation() {
  return (
    <>
      <nav id="nav">
        <a href="#hero" className="nav__logo">[TÊN]</a>
        <ul className="nav__links">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="nav__link">{link.label}</a>
            </li>
          ))}
        </ul>
        <button className="nav__menu-btn" aria-label="Menu">
          <span />
          <span />
        </button>
      </nav>

      <div id="mobile-menu">
        <ul className="mobile-menu__links">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="mobile-menu__link">{link.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function Hero() {
  return (
    <section id="hero">
      <canvas id="hero-canvas" aria-hidden="true" />

      <div className="hero__cloudscape" aria-hidden="true">
        <div className="hero__cloud-layer hero__cloud-layer--back" />
        <div className="hero__cloud-layer hero__cloud-layer--mid" />
        <div className="hero__cloud-layer hero__cloud-layer--front" />
        <div className="hero__cloud-layer hero__cloud-layer--veil" />
      </div>

      <div className="hero__blobs" aria-hidden="true">
        <div className="hero__blob-wrap" data-parallax-depth="0.8">
          <div className="hero__blob hero__blob--1" />
        </div>
        <div className="hero__blob-wrap" data-parallax-depth="1.5">
          <div className="hero__blob hero__blob--2" />
        </div>
        <div className="hero__blob-wrap" data-parallax-depth="2.3">
          <div className="hero__blob hero__blob--3" />
        </div>
        <div className="hero__blob-wrap" data-parallax-depth="1.0">
          <div className="hero__blob hero__blob--4" />
        </div>
        <div className="hero__blob-wrap" data-parallax-depth="2.8">
          <div className="hero__blob hero__blob--5" />
        </div>
      </div>

      <div className="hero__museum-logo" aria-label="UNESCO">
        <span className="hero__museum-mark" aria-hidden="true">
          <span className="hero__museum-roof" />
          <span className="hero__museum-pillars">
            <span />
            <span />
            <span />
            <span />
          </span>
          <span className="hero__museum-base" />
        </span>
        <span className="hero__museum-word">unesco</span>
      </div>

      <div className="hero__content hero__content--museum">
        <h1 className="hero__title hero__title--museum">
          <span className="hero__title-line">UNESCO Virtual Museum</span>
          <span className="hero__title-line hero__title-line--accent">
            of Stolen Cultural Objects
          </span>
        </h1>
        <p className="hero__subtitle hero__subtitle--museum">
          Explore a unique museum - a digital space to learn, connect with and share<br />
          the stories of stolen cultural heritage.
        </p>
        <div className="hero__cta hero__cta--museum">
          <a href="#about" className="btn hero__visit-btn">
            <span>Visit now</span>
            <span className="hero__visit-arrow" aria-hidden="true">›</span>
          </a>
        </div>
      </div>

      <div className="hero__vr-note" aria-hidden="true">
        <span className="hero__vr-icon" />
        <span>This website is also available<br />with a VR Headset.</span>
      </div>

      <div className="hero__language" aria-hidden="true">
        <span>English</span>
        <span className="hero__language-chevron">⌄</span>
      </div>

      <div className="hero__equalizer" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="hero__media" aria-hidden="true">
        <div className="hero__media-placeholder" />
      </div>
    </section>
  );
}

function Marquee() {
  const loopedTags = [...marqueeTags, ...marqueeTags];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {loopedTags.map((tag, index) => (
          <span key={`${tag}-${index}`}>{tag}</span>
        )).reduce((acc, tag, index) => {
          acc.push(tag);
          acc.push(<span key={`dot-${index}`}>·</span>);
          return acc;
        }, [])}
      </div>
    </div>
  );
}

function About() {
  return (
    <section id="about">
      <div className="container">
        <div className="section-label reveal-text">About</div>

        <div className="about__grid">
          <div className="about__text-col">
            <p className="about__lead reveal-line">
              [CÂU MỞ ĐẦU ẤN TƯỢNG VỀ BẢN THÂN — 1-2 CÂU DÀI]
            </p>
            <p className="about__body reveal-text">
              [ĐOẠN MÔ TẢ CHI TIẾT HƠN — BACKGROUND, PASSION, APPROACH]
            </p>
            <a href="#" className="btn btn--text reveal-text">Download CV →</a>
          </div>

          <div className="about__side-col">
            <div className="about__image reveal-scale">
              <div className="about__image-placeholder" />
            </div>

            <div className="about__stats reveal-text">
              {stats.map((stat) => (
                <div className="stat" key={stat.label}>
                  <span className="stat__num">{stat.num}</span>
                  <span className="stat__label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }) {
  const classes = project.large ? 'project-card project-card--large' : 'project-card';

  return (
    <article className={classes} data-category={project.category}>
      <a href="#" className="project-card__link">
        <div className="project-card__media">
          <div className="project-card__media-placeholder" />
          <div className="project-card__overlay">
            <span className="project-card__view">View Project ↗</span>
          </div>
        </div>
        <div className="project-card__info">
          <span className="project-card__num">{project.num}</span>
          <div>
            <h3 className="project-card__title">{project.title}</h3>
            <p className="project-card__tags">{project.tags}</p>
          </div>
        </div>
      </a>
    </article>
  );
}

function Works() {
  return (
    <section id="works">
      <div className="container">
        <div className="section-header">
          <div className="section-label reveal-text">Works</div>
          <h2 className="section-title reveal-line">Selected Projects</h2>
        </div>

        <div className="works__filters reveal-text">
          {filters.map((filter, index) => (
            <button
              className={index === 0 ? 'filter-btn filter-btn--active' : 'filter-btn'}
              data-filter={filter.value}
              key={filter.value}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="works__grid">
          {projects.map((project) => (
            <ProjectCard project={project} key={project.num} />
          ))}
        </div>

        <div className="works__more reveal-text">
          <a href="#" className="btn btn--ghost">See All Works</a>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section id="skills">
      <div className="container">
        <div className="section-header">
          <div className="section-label reveal-text">Skills</div>
          <h2 className="section-title reveal-line">What I Do</h2>
        </div>

        <div className="skills__grid">
          {skills.map((skill) => (
            <div
              className="skill-item reveal-up"
              key={skill.num}
              style={skill.delay ? { '--delay': skill.delay } : undefined}
            >
              <span className="skill-item__num">{skill.num}</span>
              <h3 className="skill-item__title">{skill.title}</h3>
              <p className="skill-item__desc">{skill.desc}</p>
              <div className="skill-item__tags">
                <span>[Tool]</span>
                <span>[Tool]</span>
                <span>[Tool]</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section id="testimonials">
      <div className="container">
        <div className="section-label reveal-text">Testimonials</div>

        <div className="testimonials__grid">
          {testimonials.map((testimonial) => (
            <blockquote
              className="testimonial reveal-up"
              key={testimonial.quote}
              style={testimonial.delay ? { '--delay': testimonial.delay } : undefined}
            >
              <p className="testimonial__quote">{testimonial.quote}</p>
              <footer className="testimonial__author">
                <span className="testimonial__name">{testimonial.name}</span>
                <span className="testimonial__role">{testimonial.role}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact">
      <div className="container">
        <div className="contact__inner">
          <div className="section-label reveal-text">Contact</div>

          <h2 className="contact__title reveal-line">
            Let's work<br /><em>together</em>
          </h2>

          <p className="contact__sub reveal-text">[CÂU MỜI HỢP TÁC NGẮN]</p>

          <a href="mailto:[EMAIL]" className="contact__email reveal-text">[EMAIL]</a>

          <div className="contact__socials reveal-text">
            {socials.map((social) => (
              <a href="#" className="social-link" key={social}>{social} ↗</a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="footer">
      <div className="container">
        <div className="footer__inner">
          <span className="footer__logo">[TÊN]</span>
          <span className="footer__copy">© 2025 [TÊN]. All rights reserved.</span>
          <a href="#hero" className="footer__back-top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  useEffect(() => {
    initPortfolio();
  }, []);

  return (
    <>
      <Loader />
      <Cursor />
      <Hero />
      <Marquee />
      <About />
      <Works />
      <Skills />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  );
}
