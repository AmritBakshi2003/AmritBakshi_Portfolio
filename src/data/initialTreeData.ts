import type { PortfolioCMSData } from '../types/cms';

export const INITIAL_CMS_DATA: PortfolioCMSData = {
  profile: {
    name: "Amrit Bakshi",
    title: "Data Analyst & Business Intelligence Specialist",
    tagline: "Bridging Data Analytics, Python Pipelines, & Full-Stack Application Engineering",
    summary: "B.Tech Computer Science graduate (2026) with hands-on experience in data analysis, data validation, and data-driven application development using Python, SQL, and Excel. Built an end-to-end synthetic data generation platform covering data profiling, schema validation, and quality checks. Skilled at translating business requirements into structured data solutions.",
    email: "amritbakshi2003@gmail.com",
    phone: "+91 9933552758",
    location: "Siliguri, West Bengal, India",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    avatarUrl: "/profile.jpg",
    avatarMediaId: "media_profile_avatar",
    resumeUrl: "/Amrit_Bakshi_Resume.pdf",
    lookingForRole: "Entry-level Data Analyst / Business Intelligence / Analytics Engineer"
  },
  skillTree: {
    id: "root-amrit-bakshi",
    name: "AMRIT BAKSHI",
    type: "domain",
    color: "#ffffff",
    visibility: true,
    isExpanded: true,
    children: [
      // 1. DATA ANALYTICS
      {
        id: "domain-data-analytics",
        name: "Data Analytics",
        type: "domain",
        color: "#00f3ff",
        visibility: true,
        isExpanded: true,
        children: [
          {
            id: "sql",
            name: "SQL",
            type: "skill",
            experienceLevel: "Expert",
            visibility: true,
            children: [
              { id: "sql-select", name: "SELECT", type: "concept", visibility: true },
              { id: "sql-where", name: "WHERE", type: "concept", visibility: true },
              { id: "sql-groupby", name: "GROUP BY", type: "concept", visibility: true },
              { id: "sql-joins", name: "JOINS", type: "concept", visibility: true },
              { id: "sql-aggregations", name: "Aggregations", type: "concept", visibility: true },
              { id: "sql-views", name: "Views", type: "concept", visibility: true },
              { id: "sql-db-design", name: "Database Design", type: "concept", visibility: true },
              { id: "sql-postgres", name: "PostgreSQL", type: "database", visibility: true },
              { id: "sql-sqlite", name: "SQLite", type: "database", visibility: true }
            ]
          },
          {
            id: "python-da",
            name: "Python",
            type: "skill",
            experienceLevel: "Expert",
            visibility: true,
            children: [
              {
                id: "pandas",
                name: "Pandas",
                type: "library",
                experienceLevel: "Expert",
                visibility: true,
                children: [
                  { id: "pandas-clean", name: "Data Cleaning", type: "concept", visibility: true },
                  { id: "pandas-wrangle", name: "Data Wrangling", type: "concept", visibility: true },
                  { id: "pandas-validate", name: "Data Validation", type: "concept", visibility: true },
                  { id: "pandas-profile", name: "Data Profiling", type: "concept", visibility: true },
                  { id: "pandas-csv", name: "CSV Processing", type: "concept", visibility: true }
                ]
              },
              { id: "numpy", name: "NumPy", type: "library", visibility: true },
              { id: "faker", name: "Faker", type: "library", visibility: true },
              { id: "streamlit-py", name: "Streamlit", type: "framework", visibility: true },
              { id: "python-automation", name: "Automation", type: "concept", visibility: true }
            ]
          },
          {
            id: "excel",
            name: "Excel",
            type: "skill",
            experienceLevel: "Advanced",
            visibility: true,
            children: [
              { id: "excel-clean", name: "Data Cleaning", type: "concept", visibility: true },
              { id: "excel-pivots", name: "Pivot Tables", type: "concept", visibility: true },
              { id: "excel-xlookup", name: "XLOOKUP", type: "concept", visibility: true },
              { id: "excel-vlookup", name: "VLOOKUP", type: "concept", visibility: true },
              { id: "excel-charts", name: "Charts", type: "concept", visibility: true },
              { id: "excel-[#00f3ff]cond", name: "Conditional Formatting", type: "concept", visibility: true }
            ]
          },
          {
            id: "power-bi",
            name: "Power BI",
            type: "skill",
            experienceLevel: "Advanced",
            visibility: true,
            children: [
              { id: "pbi-dashboards", name: "Dashboard Development", type: "concept", visibility: true },
              { id: "pbi-viz", name: "Data Visualization", type: "concept", visibility: true },
              { id: "pbi-kpi", name: "KPI Reporting", type: "concept", visibility: true },
              { id: "pbi-powerquery", name: "Power Query", type: "tool", visibility: true },
              { id: "pbi-modeling", name: "Data Modeling", type: "concept", visibility: true },
              { id: "pbi-dax", name: "DAX", type: "concept", visibility: true }
            ]
          },
          {
            id: "statistics",
            name: "Statistics",
            type: "skill",
            experienceLevel: "Advanced",
            visibility: true,
            children: [
              { id: "stat-desc", name: "Descriptive Statistics", type: "concept", visibility: true },
              { id: "stat-hypothesis", name: "Hypothesis Testing", type: "concept", visibility: true },
              { id: "stat-corr", name: "Correlation Analysis", type: "concept", visibility: true },
              { id: "stat-dist", name: "Distribution Analysis", type: "concept", visibility: true },
              { id: "stat-outliers", name: "Outlier Detection", type: "concept", visibility: true }
            ]
          },
          {
            id: "etl",
            name: "ETL",
            type: "skill",
            experienceLevel: "Advanced",
            visibility: true,
            children: [
              { id: "etl-extract", name: "Extract", type: "concept", visibility: true },
              { id: "etl-transform", name: "Transform", type: "concept", visibility: true },
              { id: "etl-load", name: "Load", type: "concept", visibility: true },
              { id: "etl-schema", name: "Schema Validation", type: "concept", visibility: true },
              { id: "etl-quality", name: "Data Quality", type: "concept", visibility: true }
            ]
          },
          {
            id: "business-analytics",
            name: "Business Analytics",
            type: "skill",
            experienceLevel: "Advanced",
            visibility: true,
            children: [
              { id: "ba-kpi", name: "KPI Design", type: "concept", visibility: true },
              { id: "ba-req", name: "Requirement Analysis", type: "concept", visibility: true },
              { id: "ba-stakeholder", name: "Stakeholder Management", type: "concept", visibility: true },
              { id: "ba-problem", name: "Business Problem Solving", type: "concept", visibility: true },
              { id: "ba-storytelling", name: "Data Storytelling", type: "concept", visibility: true }
            ]
          }
        ]
      },

      // 2. SOFTWARE DEVELOPMENT
      {
        id: "domain-software-dev",
        name: "Software Development",
        type: "domain",
        color: "#3b82f6",
        visibility: true,
        isExpanded: true,
        children: [
          {
            id: "frontend",
            name: "Frontend",
            type: "skill",
            visibility: true,
            children: [
              { id: "html", name: "HTML", type: "tool", visibility: true },
              { id: "css", name: "CSS", type: "tool", visibility: true },
              { id: "javascript", name: "JavaScript", type: "tool", visibility: true },
              { id: "react", name: "React", type: "framework", visibility: true },
              { id: "tailwind", name: "Tailwind", type: "framework", visibility: true }
            ]
          },
          {
            id: "backend",
            name: "Backend",
            type: "skill",
            visibility: true,
            children: [
              { id: "rest-apis", name: "REST APIs", type: "concept", visibility: true },
              { id: "fastapi", name: "FastAPI", type: "framework", visibility: true },
              { id: "nodejs", name: "Node.js", type: "framework", visibility: true },
              { id: "jwt", name: "JWT", type: "concept", visibility: true },
              { id: "api-integration", name: "API Integration", type: "concept", visibility: true }
            ]
          },
          {
            id: "dev-databases",
            name: "Databases",
            type: "skill",
            visibility: true,
            children: [
              { id: "mongodb", name: "MongoDB", type: "database", visibility: true },
              { id: "postgresql-dev", name: "PostgreSQL", type: "database", visibility: true },
              { id: "sqlite-dev", name: "SQLite", type: "database", visibility: true }
            ]
          },
          {
            id: "deployment",
            name: "Deployment",
            type: "skill",
            visibility: true,
            children: [
              { id: "git", name: "Git", type: "tool", visibility: true },
              { id: "github", name: "GitHub", type: "tool", visibility: true },
              { id: "aws", name: "AWS", type: "tool", visibility: true },
              { id: "cloudfront", name: "CloudFront", type: "tool", visibility: true },
              { id: "s3", name: "S3", type: "tool", visibility: true }
            ]
          }
        ]
      },

      // 3. AI & DATA
      {
        id: "domain-ai-data",
        name: "AI & Data",
        type: "domain",
        color: "#10b981",
        visibility: true,
        isExpanded: true,
        children: [
          { id: "synth-data", name: "Synthetic Data", type: "concept", visibility: true },
          { id: "data-annot", name: "Data Annotation", type: "concept", visibility: true },
          { id: "data-label", name: "Data Labeling", type: "concept", visibility: true },
          { id: "data-qual-assess", name: "Data Quality Assessment", type: "concept", visibility: true },
          { id: "prompt-eng", name: "Prompt Engineering", type: "skill", visibility: true },
          { id: "llm-workflows", name: "LLM Workflows", type: "skill", visibility: true },
          { id: "ai-assisted-dev", name: "AI-assisted Development", type: "skill", visibility: true }
        ]
      },

      // 4. UI / UX
      {
        id: "domain-ui-ux",
        name: "UI / UX Design",
        type: "domain",
        color: "#a855f7",
        visibility: true,
        isExpanded: true,
        children: [
          {
            id: "figma",
            name: "Figma",
            type: "tool",
            visibility: true,
            children: [
              { id: "wireframes", name: "Wireframes", type: "concept", visibility: true },
              { id: "prototypes", name: "Prototypes", type: "concept", visibility: true },
              { id: "components", name: "Components", type: "concept", visibility: true },
              { id: "design-systems", name: "Design Systems", type: "concept", visibility: true }
            ]
          },
          { id: "canva", name: "Canva", type: "tool", visibility: true },
          {
            id: "user-experience",
            name: "User Experience",
            type: "skill",
            visibility: true,
            children: [
              { id: "accessibility", name: "Accessibility", type: "concept", visibility: true },
              { id: "responsive-design", name: "Responsive Design", type: "concept", visibility: true },
              { id: "user-flows", name: "User Flows", type: "concept", visibility: true }
            ]
          }
        ]
      },

      // 5. PROFESSIONAL SKILLS
      {
        id: "domain-professional",
        name: "Professional Skills",
        type: "domain",
        color: "#f59e0b",
        visibility: true,
        isExpanded: true,
        children: [
          { id: "req-gather", name: "Requirement Gathering", type: "professional_skill", visibility: true },
          { id: "client-comm", name: "Client Communication", type: "professional_skill", visibility: true },
          { id: "proj-plan", name: "Project Planning", type: "professional_skill", visibility: true },
          { id: "stakeholder-mgmt", name: "Stakeholder Management", type: "professional_skill", visibility: true },
          { id: "team-lead", name: "Team Leadership", type: "professional_skill", visibility: true },
          { id: "cross-collab", name: "Cross-functional Collaboration", type: "professional_skill", visibility: true },
          { id: "documentation", name: "Documentation", type: "professional_skill", visibility: true },
          { id: "bus-analysis", name: "Business Analysis", type: "professional_skill", visibility: true }
        ]
      },

      // 6. DOMAINS EXPLORED
      {
        id: "domain-domains-explored",
        name: "Domains Explored",
        type: "domain",
        color: "#f43f5e",
        visibility: true,
        isExpanded: true,
        children: [
          { id: "exp-da", name: "Data Analytics", type: "concept", visibility: true },
          { id: "exp-bi", name: "Business Intelligence", type: "concept", visibility: true },
          { id: "exp-de", name: "Data Engineering", type: "concept", visibility: true },
          { id: "exp-sd", name: "Synthetic Data", type: "concept", visibility: true },
          { id: "exp-ai-eval", name: "AI Evaluation", type: "concept", visibility: true },
          { id: "exp-saas", name: "SaaS", type: "concept", visibility: true },
          { id: "exp-webdev", name: "Web Development", type: "concept", visibility: true },
          { id: "exp-startup", name: "Startup Operations", type: "concept", visibility: true },
          { id: "exp-product", name: "Product Development", type: "concept", visibility: true },
          { id: "exp-client-mgmt", name: "Client Management", type: "concept", visibility: true }
        ]
      }
    ]
  },
  projects: [
    {
      id: "synthslm",
      title: "SynthSLM — Synthetic Data Generation Platform",
      subtitle: "Enterprise-grade synthetic data generator & statistical quality validation suite",
      period: "Jan 2026 – Jun 2026",
      category: "Data Engineering & Analytics",
      description: "Engineered an end-to-end synthetic data generation platform producing statistically representative synthetic datasets from user-defined schemas. Validated against real-world enterprise datasets with integrated statistical quality scoring.",
      highlights: [
        "Engineered synthetic data generation pipeline producing representative datasets from user schemas — generating up to 100,000+ records in under 11 seconds.",
        "Built interactive Streamlit web application enabling users to upload datasets, configure generation parameters, validate outputs, and export in CSV, Excel, and JSON formats.",
        "Validated pipeline against FIFA World Cup 2026 Player Performance Dataset (Kaggle, 54,600 records), achieving a 94.3% overall data quality score while preserving statistical distributions.",
        "Integrated analytics dashboard comparing original vs. synthetic datasets through statistical distribution, correlation matrix analysis, feature importance, and outlier detection."
      ],
      techStack: ["Python", "Pandas", "NumPy", "Streamlit", "SQLite", "Faker", "SciPy"],
      metrics: [
        { label: "Generation Speed", value: "100k+ records < 11s" },
        { label: "Data Quality Score", value: "94.3%" },
        { label: "Validation Dataset", value: "54.6k Records" },
        { label: "Export Formats", value: "CSV, Excel, JSON" }
      ],
      githubUrl: "https://github.com",
      liveUrl: "https://streamlit.io",
      mediaIds: ["media_profile_avatar"],
      tags: ["Data Engineering", "Synthetic Data", "Streamlit", "Python"],
      visibility: true,
      sortOrder: 1,
      lastModified: "2026-08-01",
      featured: true
    }
  ],
  experiences: [
    {
      id: "avinyx-internship",
      role: "Data Operations & Annotation Intern",
      company: "Avinyx AI",
      period: "Mar 2026 – May 2026",
      location: "Remote / Hybrid",
      bullets: [
        "Manually sourced and entered 200+ records daily through online research as part of data monitoring and annotation workflows, ensuring accuracy and consistency for downstream analysis.",
        "Compiled daily data collection findings into structured presentations for internal review using Microsoft PowerPoint and Excel.",
        "Used data visualization tools to organize and validate collected data before reporting to the lead team.",
        "Supported data quality checks on annotated datasets to maintain labeling accuracy and consistency across daily submissions."
      ],
      skillsUsed: ["Data Validation", "Advanced Excel", "Data Cleaning", "PowerPoint", "Quality Assurance"],
      proofTitle: "Avinyx AI Internship Completion Certificate",
      proofUrl: "#",
      mediaIds: [],
      visibility: true,
      sortOrder: 1,
      lastModified: "2026-08-01"
    },
    {
      id: "aerwok-co-founder",
      role: "Co-Founder & Operations Lead",
      company: "Aerwok",
      period: "Sep 2024 – Dec 2025",
      location: "Siliguri, India",
      bullets: [
        "Led requirement gathering, project planning, and client communication for 5 web development and UI/UX engagements — including one major client account — for startups and small businesses.",
        "Directed a cross-functional team of 5 designers and developers, ensuring on-time delivery across all client projects.",
        "Designed 20+ wireframes, prototypes, and visual assets in Figma and Canva, maintaining usability, accessibility, and brand consistency.",
        "Optimized page structure and content strategy across client sites, contributing to measurable SEO and user experience gains.",
        "Deployed and hosted a client website on AWS, gaining hands-on experience with cloud infrastructure and deployment workflows."
      ],
      skillsUsed: ["Project Planning", "Client Management", "Figma", "AWS Hosting", "Cursor AI", "Team Leadership"],
      proofTitle: "Aerwok Client Case Study & Portfolio Showcase",
      proofUrl: "#",
      mediaIds: [],
      visibility: true,
      sortOrder: 2,
      lastModified: "2026-08-01"
    }
  ],
  certifications: [
    {
      id: "oracle-next-level",
      title: "Databases for Developers: Next Level",
      issuer: "Oracle",
      issueDate: "Jul 2026",
      credentialUrl: "https://oracle.com",
      mediaIds: [],
      skillsValidated: ["Advanced SQL", "Indexing", "Query Optimization", "Database Architecture"],
      visibility: true,
      sortOrder: 1,
      lastModified: "2026-08-01"
    },
    {
      id: "oracle-foundations",
      title: "Databases for Developers: Foundations",
      issuer: "Oracle",
      issueDate: "Jul 2026",
      credentialUrl: "https://oracle.com",
      mediaIds: [],
      skillsValidated: ["Database Design", "SQL Basics", "Table Normalization", "Relational Modeling"],
      visibility: true,
      sortOrder: 2,
      lastModified: "2026-08-01"
    },
    {
      id: "deloitte-analytics",
      title: "Data Analytics Job Simulation",
      issuer: "Deloitte Australia via Forage",
      issueDate: "Jun 2026",
      credentialUrl: "https://theforage.com",
      mediaIds: [],
      skillsValidated: ["Data Analysis", "Data Visualization", "Client Presentation", "Strategic Insights"],
      visibility: true,
      sortOrder: 3,
      lastModified: "2026-08-01"
    }
  ],
  education: [
    {
      id: "sit-btech",
      degree: "B.Tech, Computer Science & Engineering",
      institution: "Siliguri Institute of Technology",
      period: "Apr 2022 – Jun 2026",
      details: "Focus on Data Analytics, Relational Database Management Systems, Software Engineering, and AI-assisted workflows.",
      achievements: ["Built SynthSLM — end-to-end synthetic data platform as final project", "Active and interested in data analytics and science coursework"],
      mediaIds: [],
      visibility: true,
      sortOrder: 1
    },
    {
      id: "cbse-xii",
      degree: "Senior Secondary (CBSE, Class XII)",
      institution: "Central Board of Secondary Education",
      period: "Jan 2022",
      grade: "74%",
      mediaIds: [],
      visibility: true,
      sortOrder: 2
    },
    {
      id: "cbse-x",
      degree: "Secondary (CBSE, Class X)",
      institution: "Central Board of Secondary Education",
      period: "Jan 2020",
      grade: "72%",
      mediaIds: [],
      visibility: true,
      sortOrder: 3
    }
  ],
  achievements: [
    {
      id: "ach-synthslm",
      title: "Built SynthSLM — Synthetic Data Platform",
      description: "Engineered a full-stack synthetic data generation platform achieving 94.3% data quality score on 54.6k FIFA 2026 records, generating 100k+ records in under 11 seconds.",
      icon: "⚡",
      link: "#",
      mediaIds: [],
      tags: ["Python", "Data Engineering", "Open Source"],
      visibility: true,
      sortOrder: 1
    },
    {
      id: "ach-aerwok",
      title: "Co-Founded Aerwok — Technology Startup",
      description: "Co-founded and led operations at Aerwok, managing client relationships, project delivery, and cross-functional teams for SaaS and web development projects.",
      icon: "🚀",
      link: "#",
      mediaIds: [],
      tags: ["Entrepreneurship", "Leadership", "SaaS"],
      visibility: true,
      sortOrder: 2
    },
    {
      id: "ach-oracle",
      title: "Oracle Database Dual Certification",
      description: "Earned both Oracle Databases for Developers: Foundations and Next Level certifications, validating advanced SQL and database architecture knowledge.",
      icon: "🏆",
      link: "https://oracle.com",
      mediaIds: [],
      tags: ["SQL", "Oracle", "Certification"],
      visibility: true,
      sortOrder: 3
    }
  ],
  sectionVisibility: {
    hero: true,
    about: true,
    skills: true,
    projects: true,
    experience: true,
    certifications: true,
    education: true,
    achievements: true,
    contact: true
  },
  mediaLibrary: [
    {
      id: "media_profile_avatar",
      name: "Amrit_Bakshi_Profile.jpg",
      url: "/profile.jpg",
      type: "image",
      uploadDate: "2026-08-01",
      altText: "Amrit Bakshi Headshot Photo",
      caption: "Profile Avatar"
    }
  ],
  adminPasscode: "admin123"
};
