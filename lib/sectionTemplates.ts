export const sectionTemplates = [
  {
    id: 'full-width-banner',
    name: 'Full Width Banner',
    html: `<div class="full-width-banner">\n  <img src="[[img-1]]" alt="Describe your image here" class="banner-img">\n</div>`,
    css: `.full-width-banner{\n  width: 100%;\n  overflow: scroll;\n}\n\n.banner-img {\n  width: 100%;\n  height: 100%;\n  /* This prevents the image from looking squashed */\n  object-fit: cover; \n  /* This ensures the center of the image stays visible */\n  object-position: center;\n  display: block;\n}`
  },
  {
    id: 'professional-workflow',
    name: 'Process Flow (8 Steps)',
    html: `<section class="process-section">
  <div class="process-container">
    <h2 class="process-title"><span class="highlight">Our Optimized</span> Project Workflow</h2>
    <div class="process-grid">
      <!-- Step 1 -->
      <div class="process-step">
        <div class="step-badge">Step 1</div>
        <div class="icon-wrapper">
          <div class="blob shape-1"></div>
          <i class="fa-solid fa-comments icon"></i>
          <i class="fa-solid fa-arrow-right-long next-arrow"></i>
        </div>
        <h3 class="step-title">Initial Consultation</h3>
        <p class="step-desc">Connect with our specialized team to discuss your goals, requirements, and project vision.</p>
      </div>
      <!-- Step 2 -->
      <div class="process-step">
        <div class="step-badge">Step 2</div>
        <div class="icon-wrapper">
          <div class="blob shape-2"></div>
          <i class="fa-solid fa-magnifying-glass icon"></i>
          <i class="fa-solid fa-arrow-right-long next-arrow"></i>
        </div>
        <h3 class="step-title">Discovery & Analysis</h3>
        <p class="step-desc">We thoroughly evaluate your existing data and market landscape to build a precise project foundation.</p>
      </div>
      <!-- Step 3 -->
      <div class="process-step">
        <div class="step-badge">Step 3</div>
        <div class="icon-wrapper">
          <div class="blob shape-3"></div>
          <i class="fa-solid fa-compass-drafting icon"></i>
          <i class="fa-solid fa-arrow-right-long next-arrow"></i>
        </div>
        <h3 class="step-title">Strategic Planning</h3>
        <p class="step-desc">A detailed assessment is conducted to define the scope, timeline, and key performance indicators.</p>
      </div>
      <!-- Step 4 -->
      <div class="process-step">
        <div class="step-badge">Step 4</div>
        <div class="icon-wrapper">
          <div class="blob shape-4"></div>
          <i class="fa-solid fa-cubes icon"></i>
        </div>
        <h3 class="step-title">Solution Design</h3>
        <p class="step-desc">Developing the core structural design and technical specifications tailored to your needs.</p>
      </div>
      <!-- Step 5 -->
      <div class="process-step">
        <div class="step-badge">Step 5</div>
        <div class="icon-wrapper">
          <div class="blob shape-1"></div>
          <i class="fa-solid fa-bezier-curve icon"></i>
          <i class="fa-solid fa-arrow-right-long next-arrow"></i>
        </div>
        <h3 class="step-title">Design & Prototyping</h3>
        <p class="step-desc">Crafting high-fidelity visual representations and interactive models for early-stage review.</p>
      </div>
      <!-- Step 6 -->
      <div class="process-step">
        <div class="step-badge">Step 6</div>
        <div class="icon-wrapper">
          <div class="blob shape-2"></div>
          <i class="fa-solid fa-code icon"></i>
          <i class="fa-solid fa-arrow-right-long next-arrow"></i>
        </div>
        <h3 class="step-title">Development & Build</h3>
        <p class="step-desc">Translating designs into a functional reality using state-of-the-art engineering practices.</p>
      </div>
      <!-- Step 7 -->
      <div class="process-step">
        <div class="step-badge">Step 7</div>
        <div class="icon-wrapper">
          <div class="blob shape-3"></div>
          <i class="fa-solid fa-vial-circle-check icon"></i>
          <i class="fa-solid fa-arrow-right-long next-arrow"></i>
        </div>
        <h3 class="step-title">Testing & Quality Assurance</h3>
        <p class="step-desc">Rigorous validation across all parameters to ensure stability, performance, and excellence.</p>
      </div>
      <!-- Step 8 -->
      <div class="process-step">
        <div class="step-badge">Step 8</div>
        <div class="icon-wrapper">
          <div class="blob shape-4"></div>
          <i class="fa-solid fa-rocket icon"></i>
        </div>
        <h3 class="step-title">Launch & Optimization</h3>
        <p class="step-desc">Successful deployment followed by ongoing monitoring and strategic refinements for growth.</p>
      </div>
    </div>
  </div>
</section>`,
    css: `.process-section {
  padding: 60px 20px;
  background-color: transparent;
}

.process-container {
  max-width: 1200px;
  margin: 0 auto;
}

.process-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 50px;
  color: #1a1a1a;
}

.process-title .highlight {
  color: #ffd000;
}

.process-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px 20px;
}

.process-step {
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.step-badge {
  background: #1a1a1a;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
  position: absolute;
  top: 0;
  left: 10px;
  z-index: 2;
}

.icon-wrapper {
  position: relative;
  width: 90px;
  height: 90px;
  margin: 10px auto 25px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.blob {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #ffd000;
  z-index: 0;
  transition: transform 0.3s ease;
}

/* Organic blob border radius variations */
.shape-1 { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
.shape-2 { border-radius: 54% 46% 38% 62% / 49% 70% 30% 51%; }
.shape-3 { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
.shape-4 { border-radius: 65% 35% 45% 55% / 45% 65% 35% 55%; }

.icon-wrapper:hover .blob {
  transform: scale(1.05) rotate(5deg);
}

.icon-wrapper .icon {
  font-size: 2rem;
  color: #1a1a1a;
  z-index: 1;
}

.next-arrow {
  position: absolute;
  right: -30px;
  top: 50%;
  transform: translateY(-50%);
  color: #ccc;
  font-size: 1.2rem;
  font-weight: 300;
}

.step-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
}

.step-desc {
  font-size: 0.85rem;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

/* Hide arrow on the 4th and 8th items for desktop */
@media (min-width: 1024px) {
  .process-step:nth-child(4n) .next-arrow {
    display: none;
  }
}

/* Tablet Layout */
@media (max-width: 1023px) {
  .process-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 50px 30px;
  }
  .process-step:nth-child(2n) .next-arrow {
    display: none;
  }
  /* Restore arrows hidden by desktop rule if needed */
  .process-step:nth-child(4n) .next-arrow {
    display: none;
  }
}

/* Mobile Layout */
@media (max-width: 640px) {
  .process-grid {
    grid-template-columns: 1fr;
  }
  .next-arrow {
    /* Hide all horizontal arrows on mobile */
    display: none;
  }
  .step-badge {
    left: 50%;
    transform: translateX(-50%);
  }
  .process-title {
    font-size: 1.5rem;
  }
}
`
  }
];
