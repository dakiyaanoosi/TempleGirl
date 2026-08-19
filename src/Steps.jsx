// Steps.jsx — purely presentational; no hooks needed
import KolamBorder from './KolamBorder';
import './Steps.css';

const stepsData = [
  {
    step: '01',
    title: 'Subscribe',
    subtitle: 'Begin the journey',
    desc: 'Choose a monthly or annual plan and open the door to a growing collection of stories from India\'s temples.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#F2B84B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    )
  },
  {
    step: '02',
    title: 'Download',
    subtitle: 'Keep them close',
    desc: 'Get Temple Girl Kids on your phone, sign in, and keep your favourite stories close wherever you go.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#F2B84B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="5" y="2" width="14" height="20" rx="3" />
        <path d="M12 18h.01" />
        <path d="M12 7v6m-3-3l3 3 3-3" />
      </svg>
    )
  },
  {
    step: '03',
    title: 'Listen',
    subtitle: 'Let stories unfold',
    desc: 'Listen to Namratha bring each story to life, with two new tales added every week.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#F2B84B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </svg>
    )
  }
];

const Steps = () => {
  return (
    <section className="steps-section" id="how-to-start">
      {/* Top Kolam Wave Border — shared component */}
      <KolamBorder svgClassName="steps-page-wave" />

      {/* Section Title */}
      <div className="steps-header-block">
        <h2 className="steps-main-title">How it works</h2>
      </div>

      <div className="steps-container">
        <div className="steps-grid">
          {stepsData.map((item) => (
            <div key={item.step} className="step-card">
              <div className="step-card-header">
                <div className="step-icon-badge">
                  {item.icon}
                </div>
                <span className="step-number">{item.step}</span>
              </div>
              <h3 className="step-card-title">
                {item.title} <span className="step-card-subtitle">— {item.subtitle}</span>
              </h3>
              <p className="step-card-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Steps;
