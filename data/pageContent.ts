import type { Locale } from "@/data/siteContent";

type ServicesPageContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroSummary: string;
  heroLocation: string;
  heroSupport: string;
  sectionEyebrow: string;
  sectionTitle: string;
  services: Array<{
    title: string;
    description: string;
  }>;
  supportEyebrow: string;
  supportTitle: string;
  supportSummary: string;
  supportPoints: string[];
  supportPlanLabel: string;
  ctaEyebrow: string;
  ctaTitle: string;
  ctaSummary: string;
  whatsappCta: string;
  linkedinCta: string;
};

type AboutPageContent = {
  title: string;
  summary: string;
};

const servicesPage: Record<Locale, ServicesPageContent> = {
  en: {
    heroEyebrow: "Services",
    heroTitle: "Technical Systems & Infrastructure Support",
    heroSummary:
      "I help companies keep their systems stable, scalable, and running smoothly with practical backend, DevOps, and AI solutions.",
    heroLocation: "Worked with teams across LATAM, USA, the Middle East, and Japan.",
    heroSupport:
      "Supporting growing businesses that need reliable systems without building a full internal tech team.",
    sectionEyebrow: "Services",
    sectionTitle: "What I Do",
    services: [
      {
        title: "AI Systems & Automation",
        description:
          "AI-powered tools, workflow automation, and LLM integrations that improve efficiency and decision-making."
      },
      {
        title: "DevOps & Deployment",
        description:
          "CI/CD pipelines, cloud deployments, and production issue resolution to keep systems reliable."
      },
      {
        title: "Backend Systems Development",
        description:
          "API development, performance optimization, and integrations for scalable backend systems."
      },
      {
        title: "Data & Process Automation",
        description:
          "Data pipelines and automation that reduce manual work and streamline operations."
      },
      {
        title: "ERP Systems & Implementation",
        description:
          "Custom ERP workflows, system setup, system development and integrations aligned with your business processes."
      }
    ],
    supportEyebrow: "Ongoing Technical Support",
    supportTitle: "Ongoing Technical Support",
    supportSummary:
      "I work with companies on a monthly retainer to ensure their systems remain stable, efficient, and well-maintained without the need for a full-time hire.",
    supportPoints: [
      "Ongoing backend and infrastructure support",
      "Bug fixes and continuous improvements",
      "Fast response when issues arise"
    ],
    supportPlanLabel: "Plans start from $987/month",
    ctaEyebrow: "Let's Work Together",
    ctaTitle: "Let's Work Together",
    ctaSummary:
      "If you're looking for reliable technical support and a long-term partner, let's talk.",
    whatsappCta: "WhatsApp Me",
    linkedinCta: "Connect on LinkedIn"
  },
  es: {
    heroEyebrow: "Servicios",
    heroTitle: "Soporte técnico para sistemas e infraestructura",
    heroSummary:
      "Ayudo a las empresas a mantener sus sistemas estables, escalables y funcionando sin problemas con soluciones prácticas de backend, DevOps e IA.",
    heroLocation: "He trabajado con equipos en LATAM, EE. UU., Medio Oriente y Japón.",
    heroSupport:
      "Apoyo a empresas en crecimiento que necesitan sistemas confiables sin construir un equipo técnico interno completo.",
    sectionEyebrow: "Servicios",
    sectionTitle: "Lo que hago",
    services: [
      {
        title: "Sistemas de IA y automatización",
        description:
          "Herramientas impulsadas por IA, automatización de flujos e integraciones LLM que mejoran la eficiencia y la toma de decisiones."
      },
      {
        title: "DevOps y despliegue",
        description:
          "Pipelines de CI/CD, despliegues en la nube y resolución de incidentes de producción para mantener sistemas confiables."
      },
      {
        title: "Desarrollo backend",
        description:
          "Desarrollo de APIs, optimización de rendimiento e integraciones para sistemas backend escalables."
      },
      {
        title: "Automatización de datos y procesos",
        description:
          "Pipelines de datos y automatización que reducen el trabajo manual y agilizan las operaciones."
      },
      {
        title: "Sistemas ERP e implementación",
        description:
          "Flujos ERP personalizados, configuración de sistemas, desarrollo e integraciones alineadas con tus procesos de negocio."
      }
    ],
    supportEyebrow: "Soporte técnico continuo",
    supportTitle: "Soporte técnico continuo",
    supportSummary:
      "Trabajo con empresas bajo retainer mensual para asegurar que sus sistemas se mantengan estables, eficientes y bien mantenidos sin necesidad de contratar a tiempo completo.",
    supportPoints: [
      "Soporte continuo de backend e infraestructura",
      "Corrección de errores y mejoras continuas",
      "Respuesta rápida cuando surgen problemas"
    ],
    supportPlanLabel: "Los planes comienzan desde $987/mes",
    ctaEyebrow: "Trabajemos juntos",
    ctaTitle: "Trabajemos juntos",
    ctaSummary:
      "Si buscas soporte técnico confiable y un socio a largo plazo, hablemos.",
    whatsappCta: "Escríbeme por WhatsApp",
    linkedinCta: "Conectar en LinkedIn"
  },
  ja: {
    heroEyebrow: "サービス",
    heroTitle: "技術システムとインフラのサポート",
    heroSummary:
      "実践的なバックエンド、DevOps、AI ソリューションで、システムを安定・拡張可能・スムーズに保つ支援を行います。",
    heroLocation: "LATAM、米国、中東、日本のチームと仕事をしてきました。",
    heroSupport:
      "専任の社内技術チームを持たずに、信頼できるシステムを必要とする成長企業を支援しています。",
    sectionEyebrow: "サービス",
    sectionTitle: "提供内容",
    services: [
      {
        title: "AI システムと自動化",
        description:
          "効率と意思決定を向上させる、AI 駆動ツール、ワークフロー自動化、LLM 連携を提供します。"
      },
      {
        title: "DevOps とデプロイ",
        description:
          "信頼性を保つための CI/CD パイプライン、クラウドデプロイ、障害対応を行います。"
      },
      {
        title: "バックエンド開発",
        description:
          "拡張可能なバックエンドシステム向けの API 開発、性能改善、連携対応を行います。"
      },
      {
        title: "データと業務の自動化",
        description:
          "手作業を減らし、業務を効率化するデータパイプラインと自動化を構築します。"
      },
      {
        title: "ERP システムと導入支援",
        description:
          "業務プロセスに合わせたカスタム ERP ワークフロー、システム設定、開発、連携を提供します。"
      }
    ],
    supportEyebrow: "継続的な技術サポート",
    supportTitle: "継続的な技術サポート",
    supportSummary:
      "月額契約で企業と協力し、専任のフルタイム採用なしでシステムを安定・効率的・適切に保守できるよう支援します。",
    supportPoints: [
      "バックエンドとインフラの継続サポート",
      "バグ修正と継続的改善",
      "問題発生時の迅速な対応"
    ],
    supportPlanLabel: "プランは月額 $987 から",
    ctaEyebrow: "一緒に進めましょう",
    ctaTitle: "一緒に進めましょう",
    ctaSummary:
      "信頼できる技術サポートと長期的なパートナーを探しているなら、ぜひご相談ください。",
    whatsappCta: "WhatsApp で連絡する",
    linkedinCta: "LinkedIn でつながる"
  }
};

const aboutPage: Record<Locale, AboutPageContent> = {
  en: {
    title: "About Me",
    summary:
      "Hisham is a technical founder and full-stack engineer with 10+ years across consulting, finance, operations, and software engineering."
  },
  es: {
    title: "Sobre mí",
    summary:
      "Hisham es un fundador técnico e ingeniero full stack con más de 10 años en consultoría, finanzas, operaciones e ingeniería de software."
  },
  ja: {
    title: "自己紹介",
    summary:
      "Hisham は、コンサルティング、金融、オペレーション、ソフトウェア開発の分野で 10 年以上の経験を持つテクニカルファウンダー兼フルスタックエンジニアです。"
  }
};

export function getServicesPageContent(locale: Locale) {
  return servicesPage[locale] ?? servicesPage.en;
}

export function getAboutPageContent(locale: Locale) {
  return aboutPage[locale] ?? aboutPage.en;
}
