export type Project = {
  title: string;
  description: string;
  stack: string[];
  image: string;
  liveUrl: string;
  repoUrl?: string;
  badge?: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    title: "Kifor Match (MVP)",
    description:
      "Donor-to-charity matching workflow designed for a Japanese nonprofit with a Rails backend and structured PostgreSQL data layer.",
    stack: ["Ruby on Rails", "PostgreSQL", "Full Stack"],
    image: "/projects/kiforwip.png",
    liveUrl: "",
    repoUrl: "https://github.com/kwood6319/kifor-match",
    badge: "Live MVP",
    featured: true
  },
  {
    title: "AI Personal Assistant",
    description:
      "AI meeting assistant with transcription, memory, summarization, and contextual Q&A workflows.",
    stack: ["Python", "FastAPI", "OpenAI"],
    image: "/projects/placeholder.svg",
    liveUrl: "",
    repoUrl: "https://github.com/hishamkhashman1/ai-personal-assistant",
    featured: true
  },
  {
    title: "Stock Forecasting LSTM",
    description:
      "Time-series forecasting pipeline for generating directional market signals from historical price data.",
    stack: ["Python", "Keras", "Pandas", "NumPy", "Scikit-learn"],
    image: "/projects/Screenshot from 2026-03-24 15-14-26.png",
    liveUrl: "",
    repoUrl: "https://github.com/Hishamkhashman1/stock-forecasting-lstm",
    featured: true
  },
  {
    title: "BugSquancher",
    description:
      "CLI workflow that captures failed shell commands, analyzes errors, and suggests corrective actions in real time.",
    stack: ["Python", "Shell", "PostgreSQL"],
    image: "/projects/bugsquancher.png",
    liveUrl: "",
    repoUrl: "https://github.com/Hishamkhashman1/bug-squancher",
    featured: true
  },
  {
    title: "Rick and Morty API (MVP)",
    description: "FastAPI service for character data with PostgreSQL persistence and a simple API surface.",
    stack: ["FastAPI", "Python", "PostgreSQL"],
    image: "/projects/api.png",
    liveUrl: "https://rick-and-morty-api-9871cc72.fastapicloud.dev/",
    repoUrl: "https://github.com/Hishamkhashman1/rick-and-morty-api"
  },
  {
    title: "LinguaLogic",
    description: "Gamified learning platform with role-based flows, interactive lessons, and Rails-powered progression.",
    stack: ["Ruby on Rails", "i18n", "Phaser.js", "Devise", "Stimulus.js", "Turbo", "PostgreSQL"],
    image: "/projects/lingua.png",
    liveUrl: "https://lingualogic-4a902f58893e.herokuapp.com/",
    repoUrl: "https://github.com/Hishamkhashman1/lingualogic"
  },
  {
    title: "SEO Cyber Tool",
    description: "SEO reporting tool for generating team-ready scorecards and technical audit snapshots.",
    stack: ["Ruby on Rails", "Nokogiri", "JavaScript", "CSS"],
    image: "/projects/SEO-screenshot.png",
    liveUrl: "https://www.seosignalconsole.com/"
  },
  {
    title: "ML Data Analysis Suite",
    description: "Desktop analytics workflow for exploration, reporting, and exportable data insights.",
    stack: ["Python", "Pandas", "Matplotlib", "Seaborn", "Scikit-learn", "PyQt5", "FPDF"],
    image: "/projects/ml-data.png",
    liveUrl: "",
    repoUrl: "https://github.com/Hishamkhashman1/ml-data-analysis-suite"
  },
  {
    title: "Who's Snooping",
    description: "Local network visibility tool for detecting active IPs and monitoring traffic on a LAN.",
    stack: ["Networking", "Security"],
    image: "/projects/whos_snooping.png",
    liveUrl: "",
    repoUrl: "https://github.com/Hishamkhashman1/whos_snooping"
  },
  {
    title: "World Cup 2026 Tracker",
    description: "Lightweight live tracker for tournament updates, fixtures, and standings.",
    stack: ["JavaScript", "JSON", "HTML", "CSS"],
    image: "/projects/wc.png",
    liveUrl: "https://hishamkhashman1.github.io/wc26-tracker/",
    repoUrl: "https://github.com/Hishamkhashman1/wc26-tracker"
  },
  {
    title: "Movie Favorite Watch List",
    description: "Rails app for browsing, saving, and managing movie watch lists with API integration.",
    stack: ["Ruby on Rails", "jbuilder API", "PostgreSQL", "Stimulus.js", "Turbo"],
    image: "/projects/movie.png",
    liveUrl: "https://hisham-watch-list-aad8d178a962.herokuapp.com/",
    repoUrl: "https://github.com/Hishamkhashman1/rails-watch-list"
  },
];
