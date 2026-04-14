export type Project = {
  title: string;
  description: string;
  stack: string[];
  image: string;
  liveUrl: string;
  repoUrl?: string;
  category: "Current Projects" | "Selected Work";
  subCategory?: "Full-Stack" | "Data" | "Security & Network" | "CLI Tools";
  badge?: string;
};

export const projects: Project[] = [
  {
    title: "Kifor Match (MVP)",
    description: "Donor–charity matching MVP built for a Japanese nonprofit.",
    stack: ["Full Stack","Ruby on Rails", "PostgreSQL"],
    image: "/projects/kiforwip.png",
    liveUrl: "",
    repoUrl: "https://github.com/kwood6319/kifor-match",
    category: "Current Projects"
  },
  {
    title: "Rick and Morty API (MVP)",
    description: "FastAPI + PostgreSQL API for Rick and Morty character data.",
    stack: ["FastAPI", "Python", "PostgreSQL"],
    image: "/projects/api.png",
    liveUrl: "https://rick-and-morty-api-9871cc72.fastapicloud.dev/",
    repoUrl: "https://github.com/Hishamkhashman1/rick-and-morty-api",
    category: "Current Projects"
  },
   {
    title: "BugSquancher",
    description: "Squanch the bug. Ship the fix. CLI tool that captures failed shell commands, analyzes errors, and suggests fixes in real time.",
    stack: ["Python","Shell","PostgreSQL"],
    image: "/projects/bugsquancher.png",
    liveUrl: "",
    repoUrl: "https://github.com/Hishamkhashman1/bug-squancher",
    category: "Current Projects",
    subCategory: "CLI Tools"
  },
  {
    title: "LinguaLogic",
    description: "Gamified coding learning platform.",
    stack: ["Full Stack","Ruby on Rails", "i18n","phaser.js", "devise", "stimulus.js","turbo", "postgreSQL"],
    image: "/projects/lingua.png",
    liveUrl: "https://lingualogic-4a902f58893e.herokuapp.com/",
    repoUrl: "https://github.com/Hishamkhashman1/lingualogic",
    category: "Selected Work",
    subCategory: "Full-Stack"
  },
  {
    title: "SEO Cyber Tool",
    description: "SEO score report tool built to share with teams.",
    stack: ["Full Stack", "Ruby on Rails", "Nokogiri", "JavaScript", "CSS"],
    image: "/projects/SEO-screenshot.png",
    liveUrl: "https://mysterious-sands-38628-1e67da485e8d.herokuapp.com/",
    repoUrl: "https://github.com/Hishamkhashman1/seo-tool",
    category: "Selected Work",
    subCategory: "Full-Stack"
  },
  // {
  //   title: "Fraud Detection Dashboard",
  //   description:
  //     "Identified real fraud cases using anomaly detection models (Python + React).",
  //   stack: ["Python", "React", "Anomaly Detection"],
  //   image: "/projects/placeholder.svg",
  //   liveUrl: "#contact",
  //   category: "Selected Work",
  //   badge: "Confidential"
  // },
  {
    title: "Stock Forecasting LSTM",
    description: "Time-series prediction pipeline using deep learning.",
    stack: ["Python", "Keras", "Pandas","Numpy", "Scikit-learn"],
    image: "/projects/Screenshot from 2026-03-24 15-14-26.png",
    liveUrl: "",
    repoUrl: "https://github.com/Hishamkhashman1/stock-forecasting-lstm",
    category: "Selected Work",
    subCategory: "Data"
  },
  {
    title: "ML Data Analysis Suite",
    description: "Python-based analytics and automated reporting tool.",
    stack: ["Python", "Pandas", "Matplotlib", "Seaborn", "Scikit-learn","PyQt5","FPDF"],
    image: "/projects/ml-data.png",
    liveUrl: "",
    repoUrl: "https://github.com/Hishamkhashman1/ml-data-analysis-suite",
    category: "Selected Work",
    subCategory: "Data"
  },
  {
    title: "Who's Snooping",
    description: "Local IP detection and network monitoring tool.",
    stack: ["Networking", "Security"],
    image: "/projects/whos_snooping.png",
    liveUrl: "",
    repoUrl: "https://github.com/Hishamkhashman1/whos_snooping",
    category: "Selected Work",
    subCategory: "Security & Network"
  },
  {
    title: "World Cup 2026 Tracker",
    description: "Real-time tracking web app.",
    stack: ["JavaScript", "JSON", "HTML", "CSS"],
    image: "/projects/wc.png",
    liveUrl: "https://hishamkhashman1.github.io/wc26-tracker/",
    repoUrl: "https://github.com/Hishamkhashman1/wc26-tracker",
    category: "Selected Work",
    subCategory: "Full-Stack"
  },
  {
    title: "Movie Favorite Watch List",
    description: "Rails app with API integration.",
    stack: ["Full Stack", "Ruby on Rails", "jbuilder API", "postgreSQL","stimulus.js", "turbo"],
    image: "/projects/movie.png",
    liveUrl: "https://hisham-watch-list-aad8d178a962.herokuapp.com/",
    category: "Selected Work",
    subCategory: "Full-Stack"
  },
];
