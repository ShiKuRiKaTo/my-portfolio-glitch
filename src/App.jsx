import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { ExternalLink, X, Phone,Mail, Linkedin, Github, Download } from 'lucide-react'; // Added Icons
import './App.css';

/* --- KEEP DATA & HELPERS (BootSequence, GlitchText, SystemModal) AS IS --- */

/* --- 1. DATA CONFIGURATION --- */
const DATA = {
  name: "REHAN YASSIN SHAIKH",
  email: "shaikhrehanyasin7@gmail.com",
  phone: "+918828371736",
  github: "https://github.com/ShiKuRiKaTo", // REPLACE
  linkedin: "https://www.linkedin.com/in/rehan-yassin-shaikh-93838b242/", // REPLACE
  "skills": [
    "PYTHON",
    "SQL",
    "DATA_PIPELINES",
    "AUTO_SCRAPERS",
    "WEB_SCRAPING",
    "LLM_AGENTS",
    "AUTOMATION",
    "API_INTEGRATIONS",
    "NLP",
    "PREDICTIVE_MODELING"
  ],

  "experience": [
    {
      "id": 1,
      "role": "JUNIOR DATA ENGINEER",
      "company": "BUOYANT LABS",
      "year": "2024 - PRESENT",
      "short": "Engineering scalable, automated data systems.",
      "fullDesc": "Own the end-to-end lifecycle of high-volume data pipelines and lead the development of SENTIMENT_KILLER — an internal project that delivers automated review monitoring and LLM-driven analysis. Design resilient Python scrapers, implement ingestion and validation layers, and integrate model inference into production workflows. Focus on reliability, data quality, and operational observability for real-time analytics.",
      "tech": []
    },
    {
      "id": 2,
      "role": "DATA SCIENCE INTERN",
      "company": "COGNIFYZ",
      "year": "JUL - AUG 2024",
      "short": "Model optimization & data-driven insights.",
      "fullDesc": "Engineered high-signal features for demand forecasting models, significantly improving predictive stability. Performed in-depth EDA to uncover sales seasonality and behavioral trends. Produced actionable visual dashboards that influenced inventory planning and operational decision-making.",
      "tech": []
    }
  ],

  "projects": [
    {
      "id": 1,
      "title": "SENTIMENT_KILLER",
      "cat": "LLM / AUTOMATION",
      "desc": "In-production review-monitoring pipeline with LLM-driven sentiment extraction (work in progress).",
      "fullDetails": "An in-house production pipeline that continuously monitors e-commerce sites for product reviews, performs robust text cleaning and normalization, and applies LLM-driven sentiment classification and aspect extraction. I lead scraper architecture, data validation, and the model integration layer — iterating on reliability, evaluation, and deployment automation to ensure consistent, actionable outputs for product teams.",
      "stats": ["10k+ Rows/Day (pipeline capacity)", "Validation-stage performance", "Real-time"],
      "stack": ["Python", "LangChain", "OpenAI API", "BeautifulSoup"]
    },
    {
      "id": 2,
      "title": "SALES_PREDICTOR_V9",
      "cat": "ML / FORECASTING",
      "desc": "98% accuracy forecasting engine powering inventory decisions.",
      "fullDetails": "A production-grade forecasting system built using advanced time-series modeling. Automatically handles missing values, detects outliers, and incorporates seasonality, holiday effects, and trend shifts. Delivers actionable sales projections and supports automated inventory optimization through periodic retraining.",
      "stats": ["MAPE: 3.5", "R2 Score: 0.98", "Auto-Retraining"],
      "stack": ["XGBoost", "Pandas", "NumPy", "Plotly"]
    },
    {
      "id": 3,
      "title": "CHURN_DEFENSE",
      "cat": "AI / CLASSIFICATION",
      "desc": "Kaggle-level churn detection with high recall & precision.",
      "fullDetails": "A predictive classification system designed to identify users at high risk of churn. Processes behavioral indicators such as usage frequency, support interactions, and engagement metrics to assign a dynamic risk score. Helps businesses intervene early with data-driven retention strategies.",
      "stats": ["Top 5% Kaggle", "Recall: 0.92", "Precision: 0.89"],
      "stack": ["Logistic Regression", "Random Forest", "SMOTE"]
    }
  ]
};

// ... (Include BootSequence, GlitchText, SystemModal components here as before) ...
// IF YOU NEED ME TO RE-PASTE THOSE, LET ME KNOW. OTHERWISE ASSUMING THEY ARE THERE.

const BootSequence = ({ onComplete }) => { /* ... use previous code ... */ 
  useEffect(() => { setTimeout(onComplete, 100); }, []); // Shortened for testing
  return <div className="fixed inset-0 bg-black z-[9999]" />; 
};
const GlitchText = ({ text }) => (
  <div className="glitch-title">
    <span className="glitch-layer red">{text}</span>
    <span className="glitch-layer blue">{text}</span>
    <span className="relative z-10">{text}</span>
  </div>
);
const SystemModal = ({ item, onClose, type }) => {
    // ... use previous SystemModal code ...
    if (!item) return null;
    return (
        <motion.div className="modal-overlay" onClick={onClose}>
            <motion.div className="modal-crt" onClick={e => e.stopPropagation()}
                initial={{scaleY:0}} animate={{scaleY:1}} exit={{scaleY:0}}>
                <div className="modal-header">
                    <span>SYSTEM_OVERRIDE // {item.title || item.role}</span>
                    <button onClick={onClose}><X /></button>
                </div>
                <div className="modal-body">
                    <h2 className="text-4xl font-bold text-white mb-4">{item.title || item.role}</h2>
                    <p className="text-gray-300 mb-4">{item.fullDesc || item.fullDetails}</p>
                    <div className="flex gap-2 flex-wrap">
                        {(item.tech || item.stack).map(t => <span key={t} className="border border-green-500 text-green-500 px-2 text-sm">{t}</span>)}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
};


export default function Portfolio() {
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(null);

  const { scrollY } = useScroll();
  const scrollVelocity = useSpring(scrollY, { stiffness: 100, damping: 30 });
  const skewY = useTransform(scrollVelocity, [0, 1000], [0, 2]); 
  
  const cursorRef = useRef(null);
  useEffect(() => {
    const move = (e) => {
      if(cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px';
        cursorRef.current.style.top = e.clientY + 'px';
      }
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  const cursorHover = () => cursorRef.current?.classList.add('hovered');
  const cursorLeave = () => cursorRef.current?.classList.remove('hovered');

  const openModal = (item, type) => {
    setSelectedItem(item);
    setModalType(type);
  };

  if (loading) return <BootSequence onComplete={() => setLoading(false)} />;

  return (
    <>
      <div className="cursor" ref={cursorRef}></div>

      <AnimatePresence>
        {selectedItem && (
          <SystemModal 
            item={selectedItem} 
            type={modalType} 
            onClose={() => setSelectedItem(null)} 
          />
        )}
      </AnimatePresence>

      <motion.div style={{ skewY, transformOrigin: "top center" }}>
        
        {/* --- HERO SECTION --- */}
        <section className="min-h-[90vh] flex items-center pb-20 pt-32">
          <div className="container">
            <div className="flex justify-between border-b border-gray-800 pb-4 mb-8 font-mono text-sm md:text-base">
               <span className="text-green-500">JR_DATA_ENGINEER - </span>
               <span>MUMBAI</span>
            </div>

            <div onMouseEnter={cursorHover} onMouseLeave={cursorLeave}>
              <GlitchText text={DATA.name.split(" ")[0]} />
              <GlitchText text={DATA.name.split(" ")[1]} />
              <GlitchText text={DATA.name.split(" ")[2]} />
            </div>

            {/* FIXED BUTTONS */}
            <div className="hero-btns mt-16 flex gap-6">
               <button 
                 onClick={() => document.getElementById('projects').scrollIntoView({behavior: 'smooth'})} 
                 className="cyber-btn primary"
                 onMouseEnter={cursorHover} onMouseLeave={cursorLeave}
               >
                 INITIATE_PROJECTS
               </button>
               <button 
                 onClick={() => document.getElementById('contact').scrollIntoView({behavior: 'smooth'})} 
                 className="cyber-btn outline"
                 onMouseEnter={cursorHover} onMouseLeave={cursorLeave}
               >
                 CONTACT_ME
               </button>
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <div className="marquee-container">
          <div className="marquee-content">
             {DATA.skills.map(s => <span key={s} className="mx-8">{s} /// </span>)}
             {DATA.skills.map(s => <span key={s} className="mx-8">{s} /// </span>)}
          </div>
        </div>

        {/* EXPERIENCE */}
        <section id="experience" className="py-32">
          <div className="container">
             <h2 className="section-title">DATA_LOGS (EXP)</h2>
             <div className="grid gap-8">
                {DATA.experience.map((exp) => (
                  <motion.div 
                    key={exp.id} 
                    className="cyber-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                    whileInView={{ opacity: 1, x: 0 }}
                    initial={{ opacity: 0, x: -50 }}
                    viewport={{ once: true }}
                    onClick={() => openModal(exp, 'exp')}
                    onMouseEnter={cursorHover} onMouseLeave={cursorLeave}
                  >
                     <div>
                        <div className="text-green-500 font-mono mb-1">@{exp.company} // {exp.year}</div>
                        <h3 className="text-4xl md:text-5xl font-[Teko] m-0 leading-none">{exp.role}</h3>
                     </div>
                     <div className="flex items-center gap-2 text-gray-500 font-mono text-sm">
                        ACCESS_DETAILS <ExternalLink size={16} />
                     </div>
                  </motion.div>
                ))}
             </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="py-20">
          <div className="container">
            <h2 className="section-title">DEPLOYMENTS</h2>
            <div className="grid gap-16">
              {DATA.projects.map((p, i) => (
                <motion.div 
                  key={i}
                  className="cyber-card"
                  initial={{ x: i % 2 === 0 ? -100 : 100, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  onClick={() => openModal(p, 'project')}
                  onMouseEnter={cursorHover} onMouseLeave={cursorLeave}
                >
                  <div className="flex justify-between border-b border-gray-800 pb-4 mb-4">
                    <span className="text-green-500 font-mono">0{i+1}</span>
                    <ExternalLink size={20} />
                  </div>
                  <h3 className="text-5xl md:text-7xl font-[Teko] m-0 leading-none mb-2">{p.title}</h3>
                  <span className="bg-gray-900 text-white px-2 py-1 text-sm font-mono">{p.cat}</span>
                  <p className="text-xl text-gray-400 mt-4">{p.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- FOOTER FIXED --- */}
        <section id="contact" className="footer-section">
          <div className="container">
            <h2 className="glitch-title" style={{ fontSize: '10vw' }}>ESTABLISH<br/>CONNECTION</h2>
            
            <div className="footer-links">
              <a 
                href={`mailto:${DATA.email}`} 
                className="cyber-btn primary"
                onMouseEnter={cursorHover} onMouseLeave={cursorLeave}
              >
                <Mail className="w-6 h-6" /> EMAIL_ME
              </a>
              <a 
    href={`tel:${DATA.phone}`} 
    className="cyber-btn primary"
    onMouseEnter={cursorHover} onMouseLeave={cursorLeave}
>
    <Phone className="w-6 h-6" /> CALL_ME
</a>
              <a 
                href={DATA.linkedin} 
                target="_blank" 
                rel="noreferrer" 
                className="cyber-btn outline"
                onMouseEnter={cursorHover} onMouseLeave={cursorLeave}
              >
                <Linkedin className="w-6 h-6" /> LINKEDIN
              </a>
              <a 
                href={DATA.github} 
                target="_blank" 
                rel="noreferrer" 
                className="cyber-btn outline"
                onMouseEnter={cursorHover} onMouseLeave={cursorLeave}
              >
                <Github className="w-6 h-6" /> GITHUB
              </a>
            </div>

            <div className="mt-12 text-gray-500 font-mono text-sm">
              // SYSTEM_ID: REHAN_YASSIN_SHAIKH //  +918828371736
            </div>
          </div>
        </section>

      </motion.div>
    </>
  );
}
