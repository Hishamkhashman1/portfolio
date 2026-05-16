import { projects as baseProjects } from "@/data/projects";

export const locales = ["en", "es", "ja"] as const;

export type Locale = (typeof locales)[number];

export type LocalizedProject = {
  title: string;
  description: string;
  badge?: string;
  liveLabel?: string;
  repoLabel?: string;
  privateLabel?: string;
};

type SiteContent = {
  hero: {
    eyebrow: string;
    title: string;
    role: string;
    summary: string;
    viewProjects: string;
    downloadCv: string;
    nowBuildingLabel: string;
  };
  forecast: {
    eyebrow: string;
    title: string;
    tagline: string;
    summary: string;
    cta: string;
  };
  projects: {
    eyebrow: string;
    title: string;
    summary: string;
    otherProjects: string;
    countSuffix: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    email: string;
    whatsapp: string;
    github: string;
    linkedin: string;
  };
  footer: {
    rights: string;
  };
  github: {
    eyebrow: string;
    aria: string;
    profileLabel: string;
    loading: string;
  };
  nowBuildingStatuses: string[];
  projectsList: LocalizedProject[];
};

const projectTranslations: Record<Locale, Record<string, LocalizedProject>> = {
  en: {
    "Kifor Match (MVP)": {
      title: "Kifor Match (MVP)",
      description:
        "Donor-to-charity matching workflow designed for a Japanese nonprofit with a Rails backend and structured PostgreSQL data layer.",
      badge: "Live MVP",
      liveLabel: "Open Live",
      repoLabel: "Repo",
      privateLabel: "Private"
    },
    "AI Personal Assistant": {
      title: "AI Personal Assistant",
      description:
        "AI meeting assistant with transcription, memory, summarization, and contextual Q&A workflows.",
      liveLabel: "Open Repo",
      repoLabel: "Repo",
      privateLabel: "Private"
    },
    "Stock Forecasting LSTM": {
      title: "Stock Forecasting LSTM",
      description:
        "Time-series forecasting pipeline for generating directional market signals from historical price data.",
      liveLabel: "Open Repo",
      repoLabel: "Repo",
      privateLabel: "Private"
    },
    BugSquancher: {
      title: "BugSquancher",
      description:
        "CLI workflow that captures failed shell commands, analyzes errors, and suggests corrective actions in real time.",
      liveLabel: "Open Repo",
      repoLabel: "Repo",
      privateLabel: "Private"
    },
    "Rick and Morty API (MVP)": {
      title: "Rick and Morty API (MVP)",
      description:
        "FastAPI service for character data with PostgreSQL persistence and a simple API surface.",
      liveLabel: "Open Live",
      repoLabel: "Repo",
      privateLabel: "Private"
    },
    LinguaLogic: {
      title: "LinguaLogic",
      description:
        "Gamified learning platform with role-based flows, interactive lessons, and Rails-powered progression.",
      liveLabel: "Open Live",
      repoLabel: "Repo",
      privateLabel: "Private"
    },
    "SEO Cyber Tool": {
      title: "SEO Cyber Tool",
      description:
        "SEO reporting tool for generating team-ready scorecards and technical audit snapshots.",
      liveLabel: "Open Live",
      repoLabel: "Repo",
      privateLabel: "Private"
    },
    "ML Data Analysis Suite": {
      title: "ML Data Analysis Suite",
      description:
        "Desktop analytics workflow for exploration, reporting, and exportable data insights.",
      liveLabel: "Open Repo",
      repoLabel: "Repo",
      privateLabel: "Private"
    },
    "Who's Snooping": {
      title: "Who's Snooping",
      description:
        "Local network visibility tool for detecting active IPs and monitoring traffic on a LAN.",
      liveLabel: "Open Repo",
      repoLabel: "Repo",
      privateLabel: "Private"
    },
    "World Cup 2026 Tracker": {
      title: "World Cup 2026 Tracker",
      description:
        "Lightweight live tracker for tournament updates, fixtures, and standings.",
      liveLabel: "Open Live",
      repoLabel: "Repo",
      privateLabel: "Private"
    },
    "Movie Favorite Watch List": {
      title: "Movie Favorite Watch List",
      description:
        "Rails app for browsing, saving, and managing movie watch lists with API integration.",
      liveLabel: "Open Live",
      repoLabel: "Repo",
      privateLabel: "Private"
    }
  },
  es: {
    "Kifor Match (MVP)": {
      title: "Kifor Match (MVP)",
      description:
        "Flujo de asignación entre donantes y organizaciones benéficas diseñado para una ONG japonesa, con backend en Rails y una capa de datos PostgreSQL estructurada.",
      badge: "MVP en vivo",
      liveLabel: "Abrir en vivo",
      repoLabel: "Repositorio",
      privateLabel: "Privado"
    },
    "AI Personal Assistant": {
      title: "Asistente Personal de IA",
      description:
        "Asistente de reuniones con transcripción, memoria, resumen y flujos de preguntas y respuestas contextuales.",
      liveLabel: "Abrir repositorio",
      repoLabel: "Repositorio",
      privateLabel: "Privado"
    },
    "Stock Forecasting LSTM": {
      title: "Pronóstico de Acciones LSTM",
      description:
        "Pipeline de pronóstico de series temporales para generar señales direccionales a partir de datos históricos de precios.",
      liveLabel: "Abrir repositorio",
      repoLabel: "Repositorio",
      privateLabel: "Privado"
    },
    BugSquancher: {
      title: "BugSquancher",
      description:
        "Flujo en CLI que captura comandos fallidos, analiza errores y sugiere correcciones en tiempo real.",
      liveLabel: "Abrir repositorio",
      repoLabel: "Repositorio",
      privateLabel: "Privado"
    },
    "Rick and Morty API (MVP)": {
      title: "Rick and Morty API (MVP)",
      description:
        "Servicio FastAPI para datos de personajes con persistencia PostgreSQL y una superficie de API simple.",
      liveLabel: "Abrir en vivo",
      repoLabel: "Repositorio",
      privateLabel: "Privado"
    },
    LinguaLogic: {
      title: "LinguaLogic",
      description:
        "Plataforma de aprendizaje gamificada con flujos por rol, lecciones interactivas y progresión impulsada por Rails.",
      liveLabel: "Abrir en vivo",
      repoLabel: "Repositorio",
      privateLabel: "Privado"
    },
    "SEO Cyber Tool": {
      title: "SEO Cyber Tool",
      description:
        "Herramienta de informes SEO para generar scorecards listas para el equipo y resúmenes técnicos de auditoría.",
      liveLabel: "Abrir en vivo",
      repoLabel: "Repositorio",
      privateLabel: "Privado"
    },
    "ML Data Analysis Suite": {
      title: "ML Data Analysis Suite",
      description:
        "Flujo de análisis de escritorio para exploración, reportes y exportación de insights de datos.",
      liveLabel: "Abrir repositorio",
      repoLabel: "Repositorio",
      privateLabel: "Privado"
    },
    "Who's Snooping": {
      title: "Who's Snooping",
      description:
        "Herramienta de visibilidad de red local para detectar IPs activas y monitorear tráfico en una LAN.",
      liveLabel: "Abrir repositorio",
      repoLabel: "Repositorio",
      privateLabel: "Privado"
    },
    "World Cup 2026 Tracker": {
      title: "World Cup 2026 Tracker",
      description:
        "Seguimiento en vivo ligero para actualizaciones del torneo, partidos y posiciones.",
      liveLabel: "Abrir en vivo",
      repoLabel: "Repositorio",
      privateLabel: "Privado"
    },
    "Movie Favorite Watch List": {
      title: "Movie Favorite Watch List",
      description:
        "Aplicación Rails para explorar, guardar y administrar listas de películas con integración de API.",
      liveLabel: "Abrir en vivo",
      repoLabel: "Repositorio",
      privateLabel: "Privado"
    }
  },
  ja: {
    "Kifor Match (MVP)": {
      title: "Kifor Match (MVP)",
      description:
        "Rails バックエンドと構造化された PostgreSQL データ層を備えた、日本の非営利団体向けの寄付者と支援先マッチングのワークフローです。",
      badge: "ライブ MVP",
      liveLabel: "ライブを開く",
      repoLabel: "リポジトリ",
      privateLabel: "非公開"
    },
    "AI Personal Assistant": {
      title: "AI パーソナルアシスタント",
      description:
        "文字起こし、メモリ、要約、文脈に応じた Q&A のワークフローを備えた会議アシスタントです。",
      liveLabel: "リポジトリを開く",
      repoLabel: "リポジトリ",
      privateLabel: "非公開"
    },
    "Stock Forecasting LSTM": {
      title: "株価予測 LSTM",
      description:
        "過去の価格データから方向性シグナルを生成する、時系列予測パイプラインです。",
      liveLabel: "リポジトリを開く",
      repoLabel: "リポジトリ",
      privateLabel: "非公開"
    },
    BugSquancher: {
      title: "BugSquancher",
      description:
        "失敗したシェルコマンドを取得し、エラーを分析し、リアルタイムで修正案を提示する CLI ワークフローです。",
      liveLabel: "リポジトリを開く",
      repoLabel: "リポジトリ",
      privateLabel: "非公開"
    },
    "Rick and Morty API (MVP)": {
      title: "Rick and Morty API (MVP)",
      description:
        "PostgreSQL に永続化されたキャラクターデータを扱う、シンプルな API を持つ FastAPI サービスです。",
      liveLabel: "ライブを開く",
      repoLabel: "リポジトリ",
      privateLabel: "非公開"
    },
    LinguaLogic: {
      title: "LinguaLogic",
      description:
        "ロールベースのフロー、対話型レッスン、Rails による進捗管理を備えたゲーム化学習プラットフォームです。",
      liveLabel: "ライブを開く",
      repoLabel: "リポジトリ",
      privateLabel: "非公開"
    },
    "SEO Cyber Tool": {
      title: "SEO Cyber Tool",
      description:
        "チーム向けスコアカードと技術監査の要約を生成する SEO レポートツールです。",
      liveLabel: "ライブを開く",
      repoLabel: "リポジトリ",
      privateLabel: "非公開"
    },
    "ML Data Analysis Suite": {
      title: "ML Data Analysis Suite",
      description:
        "探索、レポート作成、エクスポート可能なデータインサイトのためのデスクトップ分析ワークフローです。",
      liveLabel: "リポジトリを開く",
      repoLabel: "リポジトリ",
      privateLabel: "非公開"
    },
    "Who's Snooping": {
      title: "Who's Snooping",
      description:
        "LAN 上のアクティブな IP を検出し、トラフィックを監視するローカルネットワーク可視化ツールです。",
      liveLabel: "リポジトリを開く",
      repoLabel: "リポジトリ",
      privateLabel: "非公開"
    },
    "World Cup 2026 Tracker": {
      title: "World Cup 2026 Tracker",
      description:
        "大会の更新、試合日程、順位を軽量に追跡するライブトラッカーです。",
      liveLabel: "ライブを開く",
      repoLabel: "リポジトリ",
      privateLabel: "非公開"
    },
    "Movie Favorite Watch List": {
      title: "Movie Favorite Watch List",
      description:
        "API 連携を備えた、映画ウォッチリストの閲覧・保存・管理を行う Rails アプリです。",
      liveLabel: "ライブを開く",
      repoLabel: "リポジトリ",
      privateLabel: "非公開"
    }
  }
};

export const siteContentByLocale: Record<Locale, SiteContent> = {
  en: {
    hero: {
      eyebrow: "Technical founder & full-stack engineer",
      title: "Hisham Khashman",
      role: "Technical Founder & Full-Stack Engineer",
      summary:
        "Building AI-powered software, operational intelligence systems, and scalable SaaS products.",
      viewProjects: "View Projects",
      downloadCv: "Download CV",
      nowBuildingLabel: "Now Building"
    },
    forecast: {
      eyebrow: "Business Venture",
      title: "Forecast Alpha",
      tagline: "Operational intelligence for connected business data",
      summary:
        "Connect live business data, detect anomalies, forecast operational trends, and generate AI-assisted KPI systems from a single workspace.",
      cta: "View Platform"
    },
    projects: {
      eyebrow: "Projects",
      title: "Selected builds",
      summary:
        "Product-oriented software, AI workflows, and data systems built to solve business problems.",
      otherProjects: "Other projects",
      countSuffix: "projects"
    },
    contact: {
      eyebrow: "Contact",
      title: "Let's Connect.",
      email: "Email",
      whatsapp: "WhatsApp",
      github: "GitHub",
      linkedin: "LinkedIn"
    },
    footer: {
      rights: "All rights reserved."
    },
    github: {
      eyebrow: "BUILDING ACTIVITY",
      aria: "Recent GitHub contribution activity for Hisham Khashman, starting in October 2025.",
      profileLabel: "View GitHub profile",
      loading: "Loading activity..."
    },
    nowBuildingStatuses: [
      "Forecast Alpha",
      "SaaS billing system",
      "anomaly detection workflows",
      "collaborative analytics",
      "operational intelligence tooling",
      "AI-assisted KPI systems"
    ],
    projectsList: baseProjects.map((project) => ({
      title: projectTranslations.en[project.title]?.title || project.title,
      description: projectTranslations.en[project.title]?.description || project.description,
      badge: projectTranslations.en[project.title]?.badge || project.badge,
      liveLabel: projectTranslations.en[project.title]?.liveLabel,
      repoLabel: projectTranslations.en[project.title]?.repoLabel,
      privateLabel: projectTranslations.en[project.title]?.privateLabel
    }))
  },
  es: {
    hero: {
      eyebrow: "Fundador técnico e ingeniero full stack",
      title: "Hisham Khashman",
      role: "Fundador técnico e ingeniero full stack",
      summary:
        "Construyendo software impulsado por IA, sistemas de inteligencia operativa y productos SaaS escalables.",
      viewProjects: "Ver proyectos",
      downloadCv: "Descargar CV",
      nowBuildingLabel: "Construyendo ahora"
    },
    forecast: {
      eyebrow: "Venture de negocio",
      title: "Forecast Alpha",
      tagline: "Inteligencia operativa para datos empresariales conectados",
      summary:
        "Conecta datos empresariales en tiempo real, detecta anomalías, pronostica tendencias operativas y genera sistemas de KPI asistidos por IA desde un solo espacio de trabajo.",
      cta: "Ver plataforma"
    },
    projects: {
      eyebrow: "Proyectos",
      title: "Selección destacada",
      summary:
        "Software orientado al producto, flujos de trabajo con IA y sistemas de datos creados para resolver problemas de negocio.",
      otherProjects: "Otros proyectos",
      countSuffix: "proyectos"
    },
    contact: {
      eyebrow: "Contacto",
      title: "Conectemos.",
      email: "Correo",
      whatsapp: "WhatsApp",
      github: "GitHub",
      linkedin: "LinkedIn"
    },
    footer: {
      rights: "Todos los derechos reservados."
    },
    github: {
      eyebrow: "ACTIVIDAD EN GITHUB",
      aria: "Actividad reciente de contribuciones en GitHub de Hisham Khashman, a partir de octubre de 2025.",
      profileLabel: "Ver perfil de GitHub",
      loading: "Cargando actividad..."
    },
    nowBuildingStatuses: [
      "Forecast Alpha",
      "sistema de facturación SaaS",
      "flujos de detección de anomalías",
      "analítica colaborativa",
      "herramientas de inteligencia operativa",
      "sistemas de KPI asistidos por IA"
    ],
    projectsList: baseProjects.map((project) => ({
      title: projectTranslations.es[project.title]?.title || project.title,
      description: projectTranslations.es[project.title]?.description || project.description,
      badge: projectTranslations.es[project.title]?.badge || project.badge,
      liveLabel: projectTranslations.es[project.title]?.liveLabel,
      repoLabel: projectTranslations.es[project.title]?.repoLabel,
      privateLabel: projectTranslations.es[project.title]?.privateLabel
    }))
  },
  ja: {
    hero: {
      eyebrow: "テクニカルファウンダー / フルスタックエンジニア",
      title: "Hisham Khashman",
      role: "テクニカルファウンダー / フルスタックエンジニア",
      summary:
        "AI 駆動のソフトウェア、業務インテリジェンスシステム、拡張可能な SaaS 製品を構築しています。",
      viewProjects: "プロジェクトを見る",
      downloadCv: "CV をダウンロード",
      nowBuildingLabel: "現在構築中"
    },
    forecast: {
      eyebrow: "ビジネスベンチャー",
      title: "Forecast Alpha",
      tagline: "接続された業務データのためのオペレーショナルインテリジェンス",
      summary:
        "ライブの業務データを接続し、異常を検知し、運用トレンドを予測し、AI 支援の KPI システムを 1 つのワークスペースから生成します。",
      cta: "プラットフォームを見る"
    },
    projects: {
      eyebrow: "プロジェクト",
      title: "厳選した制作物",
      summary:
        "ビジネス課題を解決するために作られた、プロダクト志向のソフトウェア、AI ワークフロー、データシステムです。",
      otherProjects: "その他のプロジェクト",
      countSuffix: "件のプロジェクト"
    },
    contact: {
      eyebrow: "お問い合わせ",
      title: "つながりましょう。",
      email: "メール",
      whatsapp: "WhatsApp",
      github: "GitHub",
      linkedin: "LinkedIn"
    },
    footer: {
      rights: "すべての権利を保有します。"
    },
    github: {
      eyebrow: "GitHub の活動",
      aria: "2025年10月以降の Hisham Khashman の最近の GitHub コントリビューション活動。",
      profileLabel: "View GitHub profile",
      loading: "アクティビティを読み込み中..."
    },
    nowBuildingStatuses: [
      "Forecast Alpha",
      "SaaS の請求システム",
      "異常検知ワークフロー",
      "共同分析",
      "オペレーショナルインテリジェンスツール",
      "AI 支援 KPI システム"
    ],
    projectsList: baseProjects.map((project) => ({
      title: projectTranslations.ja[project.title]?.title || project.title,
      description: projectTranslations.ja[project.title]?.description || project.description,
      badge: projectTranslations.ja[project.title]?.badge || project.badge,
      liveLabel: projectTranslations.ja[project.title]?.liveLabel,
      repoLabel: projectTranslations.ja[project.title]?.repoLabel,
      privateLabel: projectTranslations.ja[project.title]?.privateLabel
    }))
  }
};

export function getSiteContent(locale: Locale) {
  return siteContentByLocale[locale] ?? siteContentByLocale.en;
}
