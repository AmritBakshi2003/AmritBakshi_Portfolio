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
              { id: "matplotlib", name: "Matplotlib", type: "library", visibility: true },
              { id: "seaborn", name: "Seaborn", type: "library", visibility: true },
              { id: "plotly", name: "Plotly", type: "library", visibility: true },
              { id: "openpyxl", name: "OpenPyXL", type: "library", visibility: true },
              { id: "faker", name: "Faker", type: "library", visibility: true },
              { id: "streamlit-py", name: "Streamlit", type: "framework", visibility: true },
              { id: "python-automation", name: "Automation", type: "concept", visibility: true }
            ]
          },
          {
            id: "excel",
            name: "Microsoft Excel",
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
            id: "tableau",
            name: "Tableau",
            type: "skill",
            experienceLevel: "Intermediate",
            visibility: true
          },
          {
            id: "bi-analytics-tools",
            name: "BI & Notebook Tools",
            type: "skill",
            visibility: true,
            children: [
              { id: "google-sheets", name: "Google Sheets", type: "tool", experienceLevel: "Advanced", visibility: true },
              { id: "jupyter-notebook", name: "Jupyter Notebook", type: "tool", experienceLevel: "Expert", visibility: true },
              { id: "kaggle", name: "Kaggle", type: "tool", experienceLevel: "Intermediate", visibility: true }
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
              { id: "html", name: "HTML5", type: "tool", visibility: true },
              { id: "css", name: "CSS3", type: "tool", visibility: true },
              { id: "javascript", name: "JavaScript", type: "tool", visibility: true },
              { id: "typescript", name: "TypeScript", type: "tool", experienceLevel: "Advanced", visibility: true },
              { id: "react", name: "React", type: "framework", visibility: true },
              { id: "nextjs", name: "Next.js", type: "framework", experienceLevel: "Advanced", visibility: true },
              { id: "tailwind", name: "Tailwind CSS", type: "framework", visibility: true }
            ]
          },
          {
            id: "backend",
            name: "Backend",
            type: "skill",
            visibility: true,
            children: [
              { id: "nodejs", name: "Node.js", type: "framework", visibility: true },
              { id: "expressjs", name: "Express.js", type: "framework", experienceLevel: "Advanced", visibility: true },
              { id: "fastapi", name: "FastAPI", type: "framework", visibility: true },
              { id: "streamlit", name: "Streamlit", type: "framework", visibility: true },
              { id: "mern-stack", name: "MERN Stack", type: "framework", experienceLevel: "Advanced", visibility: true },
              { id: "rest-apis", name: "REST APIs", type: "concept", visibility: true },
              { id: "postman", name: "Postman", type: "tool", experienceLevel: "Advanced", visibility: true },
              { id: "razorpay", name: "Razorpay", type: "tool", experienceLevel: "Intermediate", visibility: true },
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
              { id: "mongodb-atlas", name: "MongoDB Atlas", type: "database", experienceLevel: "Advanced", visibility: true },
              { id: "postgresql-dev", name: "PostgreSQL", type: "database", visibility: true },
              { id: "sqlite-dev", name: "SQLite", type: "database", visibility: true },
              { id: "redis", name: "Redis", type: "database", experienceLevel: "Beginner", visibility: true }
            ]
          },
          {
            id: "deployment",
            name: "Cloud & Deployment",
            type: "skill",
            visibility: true,
            children: [
              { id: "git", name: "Git", type: "tool", visibility: true },
              { id: "github", name: "GitHub", type: "tool", visibility: true },
              { id: "vscode", name: "VS Code", type: "tool", experienceLevel: "Expert", visibility: true },
              { id: "npm", name: "npm", type: "tool", experienceLevel: "Advanced", visibility: true },
              { id: "vite", name: "Vite", type: "tool", experienceLevel: "Advanced", visibility: true },
              { id: "docker", name: "Docker", type: "tool", experienceLevel: "Intermediate", visibility: true },
              { id: "github-actions", name: "GitHub Actions", type: "tool", experienceLevel: "Intermediate", visibility: true },
              { id: "aws", name: "AWS", type: "tool", visibility: true },
              { id: "s3", name: "AWS S3", type: "tool", visibility: true },
              { id: "cloudfront", name: "CloudFront", type: "tool", visibility: true },
              { id: "elastic-beanstalk", name: "Elastic Beanstalk", type: "tool", experienceLevel: "Intermediate", visibility: true },
              { id: "nginx", name: "Nginx", type: "tool", experienceLevel: "Intermediate", visibility: true },
              { id: "vercel", name: "Vercel", type: "tool", experienceLevel: "Advanced", visibility: true },
              { id: "cloudflare", name: "Cloudflare", type: "tool", experienceLevel: "Intermediate", visibility: true },
              { id: "netlify", name: "Netlify", type: "tool", experienceLevel: "Intermediate", visibility: true }
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
          { id: "chatgpt", name: "ChatGPT", type: "tool", experienceLevel: "Expert", visibility: true },
          { id: "claude", name: "Claude", type: "tool", experienceLevel: "Expert", visibility: true },
          { id: "gemini", name: "Gemini", type: "tool", experienceLevel: "Expert", visibility: true },
          { id: "cursor-ai", name: "Cursor AI", type: "tool", experienceLevel: "Expert", visibility: true },
          { id: "github-copilot", name: "GitHub Copilot", type: "tool", experienceLevel: "Advanced", visibility: true },
          { id: "openai-api", name: "OpenAI API", type: "tool", experienceLevel: "Advanced", visibility: true },
          { id: "gemini-api", name: "Gemini API", type: "tool", experienceLevel: "Advanced", visibility: true },
          { id: "langchain", name: "LangChain", type: "framework", experienceLevel: "Intermediate", visibility: true },
          { id: "ollama", name: "Ollama", type: "tool", experienceLevel: "Intermediate", visibility: true },
          { id: "synth-data", name: "Synthetic Data", type: "concept", visibility: true },
          { id: "data-annot", name: "Data Annotation", type: "concept", visibility: true },
          { id: "data-label", name: "Data Labeling", type: "concept", visibility: true },
          { id: "data-qual-assess", name: "Data Quality Assessment", type: "concept", visibility: true },
          { id: "prompt-eng", name: "Prompt Engineering", type: "skill", visibility: true },
          { id: "llm-workflows", name: "LLM Workflows", type: "skill", visibility: true },
          { id: "ai-assisted-dev", name: "AI-assisted Development", type: "skill", visibility: true }
        ]
      },

      // 4. UI / UX DESIGN
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
          { id: "framer", name: "Framer", type: "tool", experienceLevel: "Advanced", visibility: true },
          { id: "webflow", name: "Webflow", type: "tool", experienceLevel: "Intermediate", visibility: true },
          { id: "wordpress", name: "WordPress", type: "tool", experienceLevel: "Intermediate", visibility: true },
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
      techStack: ["Python", "Pandas", "NumPy", "Streamlit", "SQLite", "Faker", "OpenPyXL", "SciPy"],
      metrics: [
        { label: "Generation Speed", value: "100k+ records < 11s" },
        { label: "Data Quality Score", value: "94.3%" },
        { label: "Validation Dataset", value: "54.6k Records" },
        { label: "Export Formats", value: "CSV, Excel, JSON" }
      ],
      githubUrl: "https://github.com",
      liveUrl: "https://streamlit.io",
      mediaIds: ["media_profile_avatar"],
      tags: ["Data Engineering", "Synthetic Data", "Streamlit", "Python", "OpenPyXL"],
      visibility: true,
      sortOrder: 1,
      lastModified: "2026-08-01",
      featured: true
    },
    {
      id: "rocketrybox",
      title: "RocketryBox — E-Commerce & Subscription Management Platform",
      subtitle: "Full-stack MERN subscription application with Redis caching & Razorpay gateway",
      period: "Jun 2025 – Nov 2025",
      category: "Full-Stack Web Development",
      description: "Architected a full-stack e-commerce and subscription platform supporting automated billing, JWT-secured authentication, Redis caching, and MongoDB Atlas database clustering.",
      highlights: [
        "Implemented JWT authentication and role-based access control for subscription tier management.",
        "Integrated Razorpay payment gateway API for seamless checkout processing and automated webhooks.",
        "Configured MongoDB Atlas cloud database with Redis caching to optimize database queries.",
        "Deployed backend architecture on AWS Elastic Beanstalk with Nginx reverse proxy."
      ],
      techStack: ["React", "TypeScript", "Node.js", "Express.js", "MongoDB Atlas", "Redis", "JWT", "Razorpay", "AWS S3", "CloudFront", "Elastic Beanstalk", "Nginx"],
      metrics: [
        { label: "Architecture", value: "MERN Stack" },
        { label: "Database", value: "MongoDB Atlas" },
        { label: "Payments", value: "Razorpay Integrated" }
      ],
      githubUrl: "https://github.com",
      liveUrl: "#",
      mediaIds: [],
      tags: ["Full-Stack", "React", "Node.js", "MongoDB Atlas", "Razorpay", "Redis"],
      visibility: true,
      sortOrder: 2,
      lastModified: "2026-08-01",
      featured: true
    },
    {
      id: "aerwok-platform",
      title: "Aerwok — Web Engineering & Client Digital Suite",
      subtitle: "Next.js, Jamstack, and UI/UX design suite for startups & small businesses",
      period: "Sep 2024 – Dec 2025",
      category: "Web Engineering & Design",
      description: "Co-founded and engineered web applications and UI/UX design systems for client startups using modern full-stack web technologies including Next.js, Framer, Webflow, and WordPress.",
      highlights: [
        "Built high-performance web applications using Next.js, Framer, Webflow, and WordPress.",
        "Designed 20+ wireframes and responsive UI components in Figma and Canva.",
        "Managed deployment workflows on AWS, Vercel, and Cloudflare."
      ],
      techStack: ["Next.js", "MERN Stack", "Framer", "Webflow", "WordPress", "Figma", "AWS", "Cursor AI", "Cloudflare", "Vercel"],
      metrics: [
        { label: "Client Engagements", value: "5+ Projects" },
        { label: "Design System", value: "20+ Wireframes" },
        { label: "Framework", value: "Next.js / MERN" }
      ],
      githubUrl: "https://github.com",
      liveUrl: "#",
      mediaIds: [],
      tags: ["Next.js", "Framer", "WordPress", "Webflow", "UI/UX"],
      visibility: true,
      sortOrder: 3,
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
    skillHunt: true,
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
  projectLinks: [
    {
      id: "pl_pandas_synthslm",
      projectId: "synthslm",
      nodeId: "pandas",
      usage: "Core data manipulation library — used to load user-uploaded CSVs, profile column distributions, apply transformation pipelines, and export validated synthetic datasets in CSV/Excel/JSON formats."
    },
    {
      id: "pl_numpy_synthslm",
      projectId: "synthslm",
      nodeId: "numpy",
      usage: "Statistical sampling engine — used to generate numeric column values preserving original mean/std distributions, compute correlation matrices, and run outlier-detection thresholds."
    },
    {
      id: "pl_streamlit_synthslm",
      projectId: "synthslm",
      nodeId: "streamlit-py",
      usage: "Full interactive web UI — schema configuration wizard, generation parameter controls, side-by-side original vs. synthetic data comparison dashboard, and one-click export panel."
    },
    {
      id: "pl_sqlite_synthslm",
      projectId: "synthslm",
      nodeId: "sqlite-dev",
      usage: "Lightweight embedded database used to persist user sessions, schema definitions, and generation run history across app restarts without requiring a separate server."
    },
    {
      id: "pl_openpyxl_synthslm",
      projectId: "synthslm",
      nodeId: "openpyxl",
      usage: "Used for reading, writing, and formatting Excel (.xlsx) workbooks directly from synthetic generation pipelines."
    },
    {
      id: "pl_faker_synthslm",
      projectId: "synthslm",
      nodeId: "faker",
      usage: "Realistic fake-data provider for text and categorical columns — names, addresses, emails, and domain-specific strings generated to match schema type annotations."
    },
    {
      id: "pl_mongodb_rocketrybox",
      projectId: "rocketrybox",
      nodeId: "mongodb-atlas",
      usage: "Cloud database cluster for managing user accounts, product catalogs, order history, and subscription tiers."
    },
    {
      id: "pl_redis_rocketrybox",
      projectId: "rocketrybox",
      nodeId: "redis",
      usage: "In-memory data store for caching user session tokens and reducing database query load during peak traffic."
    },
    {
      id: "pl_razorpay_rocketrybox",
      projectId: "rocketrybox",
      nodeId: "razorpay",
      usage: "Payment gateway integration handling automated recurring subscription billing and webhook notifications."
    },
    {
      id: "pl_express_rocketrybox",
      projectId: "rocketrybox",
      nodeId: "expressjs",
      usage: "RESTful API backend framework powering authentication, order processing, and webhooks."
    },
    {
      id: "pl_typescript_rocketrybox",
      projectId: "rocketrybox",
      nodeId: "typescript",
      usage: "End-to-end type safety for API requests, state management, and database models."
    },
    {
      id: "pl_nextjs_aerwok",
      projectId: "aerwok-platform",
      nodeId: "nextjs",
      usage: "Server-side rendered web applications built for speed, SEO, and dynamic client user experiences."
    },
    {
      id: "pl_framer_aerwok",
      projectId: "aerwok-platform",
      nodeId: "framer",
      usage: "Interactive animations, prototype interactions, and fluid UI layout transitions across client web sites."
    },
    {
      id: "pl_webflow_aerwok",
      projectId: "aerwok-platform",
      nodeId: "webflow",
      usage: "Rapid visual web development platform used to deliver responsive landing pages for startup clients."
    },
    {
      id: "pl_wordpress_aerwok",
      projectId: "aerwok-platform",
      nodeId: "wordpress",
      usage: "Content management system setup and theme customization for client business sites."
    },
    {
      id: "pl_cursor_aerwok",
      projectId: "aerwok-platform",
      nodeId: "cursor-ai",
      usage: "AI-assisted IDE used for rapid prototyping, component generation, and full-stack code refactoring."
    }
  ],
  adminPasscode: "admin123"
};
