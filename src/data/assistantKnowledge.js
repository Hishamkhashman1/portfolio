export const assistantKnowledge = {
  profile: {
    name: "Hisham Khashman",
    title: "Technical Founder & Full-Stack Engineer",
    summary:
      "Building AI-powered software, operational intelligence systems, and scalable SaaS products.",
    background:
      "10+ years across consulting, finance, operations, and software engineering. He builds products that connect business context with practical engineering execution."
  },
  availability: {
    status: "Open to consulting and product work",
    note:
      "Best reached through email, WhatsApp, GitHub, or LinkedIn. For serious project inquiries, direct contact is the fastest route."
  },
  languages: [
    "English (Native Level)",
    "Spanish (Native Level)",
    "Japanese (Limited Working)",
    "Arabic (Native)",
    "Portuguese (Working Proficiency)"
  ],
  techStack: [
    "Python",
    "Ruby",
    "Ruby on Rails",
    "JavaScript",
    "SQL",
    "FastAPI",
    "Linux",
    "AI & ML",
    "Git"
  ],
  contactLinks: {
    email: "hisham.khashman@gmail.com",
    github: "https://github.com/Hishamkhashman1",
    linkedin: "https://www.linkedin.com/in/hishamkhashman",
    whatsapp: "https://wa.me/525551065958",
    cv: "/download/cv"
  },
  education: [
    "Le Wagon Tokyo - AI Software Full-Stack Development Bootcamp (2025-2026, graduated March 2026)",
    "Durham University - MA Financial Management with Merit (2011-2013)",
    "Al Yamamah University - BBA Finance with Honors (2007-2010)"
  ],
  certificates: [
    "Boot.dev - Backend Development (Python) (2024)",
    "Google - Machine Learning Core Modules (2024)",
    "Google - Agile Project Management (2023)"
  ],
  projects: {
    forecastAlpha: {
      title: "Forecast Alpha",
      summary:
        "An AI-powered operational intelligence platform for connected business data, with OAuth authentication, AI-generated KPI recommendations, anomaly detection, forecasting, dashboards, alerts, onboarding workflows, and multi-source integrations.",
      keywords: [
        "forecast",
        "alpha",
        "market",
        "analysis",
        "forecasting",
        "platform"
      ]
    },
    kiforMatch: {
      title: "Kifor Match",
      summary:
        "A Ruby on Rails donor and charity management platform with request workflows, offer approvals, and inventory-style fulfillment tracking.",
      keywords: ["kifor", "match", "mvp", "rails", "matching"]
    },
    stockForecastingLstm: {
      title: "Stock Forecasting LSTM",
      summary:
        "A time-series forecasting system using LSTM networks, feature engineering, and automated prediction pipelines built with TensorFlow, Keras, and Pandas.",
      keywords: [
        "stock",
        "forecasting",
        "lstm",
        "machine learning",
        "pandas",
        "keras",
        "timeseries"
      ]
    },
    aiPersonalAssistant: {
      title: "AI Personal Assistant",
      summary:
        "An AI meeting and knowledge assistant with transcription, memory, summarization, and contextual Q&A workflows.",
      keywords: [
        "ai",
        "assistant",
        "meeting",
        "transcription",
        "memory",
        "summarization",
        "q&a"
      ]
    }
  },
  intents: [
    {
      name: "experience",
      keywords: ["experience", "background", "about", "who is", "profile"],
      answer:
        "Hisham is a technical founder and full-stack engineer with 10+ years across consulting, finance, operations, and software engineering."
    },
    {
      name: "tech stack",
      keywords: ["tech stack", "stack", "tools", "technologies", "skills"],
      answer:
        "His core stack includes Python, Ruby, Ruby on Rails, JavaScript, SQL, FastAPI, Linux, AI/ML, and Git."
    },
    {
      name: "forecast alpha",
      keywords: ["forecast alpha", "forecast", "alpha"],
      answer:
        "Forecast Alpha is a live product focused on forecasting and analysis. It reflects his product-minded approach to building useful, polished tooling."
    },
    {
      name: "projects",
      keywords: ["projects", "portfolio", "work", "built", "made"],
      answer:
        "Key projects include Forecast Alpha, Kifor Match, Stock Forecasting LSTM, and the AI Personal Assistant."
    },
    {
      name: "ai work",
      keywords: ["ai", "artificial intelligence", "assistant", "llm", "ml"],
      answer:
        "His AI work includes the AI Personal Assistant and data-driven software that uses machine learning concepts in practical products."
    },
    {
      name: "consulting background",
      keywords: ["consulting", "consultant", "client work", "background"],
      answer:
        "He has more than a decade of consulting, finance, and operations experience, which shapes how he scopes, prioritizes, and ships software."
    },
    {
      name: "availability",
      keywords: ["availability", "available", "open", "hire", "consulting"],
      answer:
        "He is open to consulting and product work. If you're serious about a project, reach out directly via email or LinkedIn."
    },
    {
      name: "contact",
      keywords: ["contact", "email", "reach", "message", "whatsapp"],
      answer:
        "You can contact him by email, GitHub, LinkedIn, or WhatsApp. Email is usually the fastest route for detailed inquiries."
    },
    {
      name: "languages",
      keywords: ["languages", "english", "spanish", "japanese", "arabic"],
      answer:
        "He works in English (native level), Spanish (native level), Japanese (limited working), Arabic (native), and Portuguese (working proficiency)."
    },
    {
      name: "education",
      keywords: ["education", "degree", "university", "bootcamp", "credentials"],
      answer:
        "His background includes Le Wagon Tokyo's AI Software Full-Stack Development Bootcamp, an MA in Financial Management from Durham University, and a BBA in Finance from Al Yamamah University."
    },
    {
      name: "certificates",
      keywords: ["certificate", "certificates", "certifications", "boot.dev", "google"],
      answer:
        "Relevant certificates include Backend Development (Python) from Boot.dev, Google machine learning core modules, and Google Agile Project Management."
    },
    {
      name: "cv",
      keywords: ["cv", "resume", "r?sum", "download"],
      answer:
        "His CV is available from the portfolio and can be downloaded directly from the site."
    },
    {
      name: "github",
      keywords: ["github", "code", "repo", "repositories"],
      answer:
        "His GitHub profile is linked in the portfolio and contains the project repositories shown here."
    },
    {
      name: "linkedin",
      keywords: ["linkedin", "linkedin profile", "profile"],
      answer:
        "His LinkedIn profile is linked in the portfolio contact section."
    }
  ],
  fallback:
    "I’m not fully sure from the portfolio context, but you can contact Hisham directly."
};
