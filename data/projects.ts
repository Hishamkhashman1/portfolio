export type Project = {
  title: string;
  description: string;
  stack: string[];
  image: string;
  liveUrl: string;
  repoUrl?: string;
  category: "Current Projects" | "Selected Work";
  badge?: string;
};

export const projects: Project[] = [
  {
    title: "Kifor Match (MVP)",
    description: "Kifor Match is an MVP for a Japanese Charity that matches donors and charities to help them fulfill their needs.",
    stack: ["Full Stack"],
    image: "/projects/placeholder.svg",
    liveUrl: "https://github.com/kwood6319/kifor-match",
    repoUrl: "https://github.com/kwood6319/kifor-match",
    category: "Current Projects"
  },
  {
    title: "Rick and Morty API (MVP)",
    description: "A lightweight REST API built with FastAPI serving Rick and Morty character data. (in development)",
    stack: ["FastAPI", "Python"],
    image: "/projects/api.png",
    liveUrl: "https://hishamkhashman1.com/rick-and-morty-api",
    category: "Current Projects"
  },
  {
    title: "LinguaLogic",
    description: "Gamified coding learning platform.",
    stack: ["Full Stack", "Gamification"],
    image: "/projects/lingua.png",
    liveUrl: "https://lingualogic-4a902f58893e.herokuapp.com/",
    repoUrl: "https://github.com/Hishamkhashman1/lingualogic",
    category: "Current Projects"
  },
  {
    title: "SEO Cyber Tool",
    description: "SEO score report tool built to share with teams.",
    stack: ["SEO", "Reporting"],
    image: "/projects/SEO-screenshot.png",
    liveUrl: "https://mysterious-sands-38628-1e67da485e8d.herokuapp.com/",
    category: "Current Projects"
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
    stack: ["Python", "LSTM", "Time Series"],
    image: "/projects/Screenshot from 2026-03-24 15-14-26.png",
    liveUrl: "https://github.com/Hishamkhashman1/stock-forecasting-lstm",
    repoUrl: "https://github.com/Hishamkhashman1/stock-forecasting-lstm",
    category: "Selected Work"
  },
  {
    title: "ML Data Analysis Suite",
    description: "Python-based analytics and automated reporting tool.",
    stack: ["Python", "Analytics"],
    image: "/projects/ml-data.png",
    liveUrl: "https://github.com/Hishamkhashman1/ml-data-analysis-suite",
    repoUrl: "https://github.com/Hishamkhashman1/ml-data-analysis-suite",
    category: "Selected Work"
  },
  {
    title: "Who's Snooping",
    description: "Local IP detection and network monitoring tool.",
    stack: ["Networking", "Security"],
    image: "/projects/whos_snooping.png",
    liveUrl: "https://github.com/Hishamkhashman1/whos_snooping",
    repoUrl: "https://github.com/Hishamkhashman1/whos_snooping",
    category: "Selected Work"
  },
  {
    title: "World Cup 2026 Tracker",
    description: "Real-time tracking web app.",
    stack: ["Web App", "Live Data"],
    image: "/projects/wc.png",
    liveUrl: "https://hishamkhashman1.github.io/wc26-tracker/",
    repoUrl: "https://github.com/Hishamkhashman1/wc26-tracker",
    category: "Selected Work"
  },
  {
    title: "Movie Favorite Watch List",
    description: "Deployed app with API integration.",
    stack: ["API", "Web App"],
    image: "/projects/movie.png",
    liveUrl: "https://hisham-watch-list-aad8d178a962.herokuapp.com/",
    category: "Selected Work"
  }
];
