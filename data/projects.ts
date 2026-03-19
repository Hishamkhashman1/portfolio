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
    title: "LinguaLogic",
    description: "Gamified coding learning platform.",
    stack: ["Full Stack", "Gamification"],
    image: "/projects/lingua.png",
    liveUrl: "https://lingualogic-4a902f58893e.herokuapp.com/",
    repoUrl: "https://github.com/Hishamkhashman1/lingualogic",
    category: "Current Projects"
  },
  {
    title: "Forecast Alpha",
    description: "Plug-and-play data analytics SaaS for SMBs.",
    stack: ["Analytics", "SaaS"],
    image: "/projects/forecast.png",
    liveUrl: "https://github.com/Hishamkhashman1/forecast-alpha",
    repoUrl: "https://github.com/Hishamkhashman1/forecast-alpha",
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
    image: "/projects/placeholder.svg",
    liveUrl: "https://github.com/Hishamkhashman1/stock-forecasting-lstm",
    repoUrl: "https://github.com/Hishamkhashman1/stock-forecasting-lstm",
    category: "Selected Work"
  },
  {
    title: "ML Data Analysis Suite",
    description: "Python-based analytics and automated reporting tool.",
    stack: ["Python", "Analytics"],
    image: "/projects/placeholder.svg",
    liveUrl: "https://github.com/Hishamkhashman1/ml-data-analysis-suite",
    repoUrl: "https://github.com/Hishamkhashman1/ml-data-analysis-suite",
    category: "Selected Work"
  },
  {
    title: "Who's Snooping",
    description: "Local IP detection and network monitoring tool.",
    stack: ["Networking", "Security"],
    image: "/projects/placeholder.svg",
    liveUrl: "https://github.com/Hishamkhashman1/whos_snooping",
    repoUrl: "https://github.com/Hishamkhashman1/whos_snooping",
    category: "Selected Work"
  },
  {
    title: "World Cup 2026 Tracker",
    description: "Real-time tracking web app.",
    stack: ["Web App", "Live Data"],
    image: "/projects/wc.png",
    liveUrl: "https://github.com/Hishamkhashman1/wc26-tracker",
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
