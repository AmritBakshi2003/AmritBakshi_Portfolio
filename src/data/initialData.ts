import type { PortfolioData } from '../types/portfolio';

export const INITIAL_PORTFOLIO_DATA: PortfolioData = {
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
    resumeUrl: "#",
    lookingForRole: "Entry-level Data Analyst / Business Intelligence / Analytics Engineer"
  },
  categories: [
    {
      id: "data-analytics",
      name: "Data & Analytics",
      color: "#00f3ff",
      glowColor: "rgba(0, 243, 255, 0.4)",
      description: "Data validation, ETL, statistical modeling, BI dashboards, data profiling, & data storytelling.",
      iconName: "BarChart3"
    },
    {
      id: "development-cloud",
      name: "Development & Cloud",
      color: "#3b82f6",
      glowColor: "rgba(59, 130, 246, 0.4)",
      description: "Frontend & Backend web application engineering, REST APIs, Streamlit dashboards, & Cloud hosting.",
      iconName: "Code2"
    },
    {
      id: "databases",
      name: "Databases & Storage",
      color: "#a855f7",
      glowColor: "rgba(168, 85, 247, 0.4)",
      description: "Relational & NoSQL database architecture, SQL joins, aggregations, data profiling, & schema design.",
      iconName: "Database"
    },
    {
      id: "tools-ai",
      name: "Tools & AI Workflows",
      color: "#ec4899",
      glowColor: "rgba(236, 72, 153, 0.4)",
      description: "Modern AI-assisted development tools, prompt engineering, Figma prototyping, & IDEs.",
      iconName: "Cpu"
    },
    {
      id: "professional",
      name: "Professional & Soft Skills",
      color: "#eab308",
      glowColor: "rgba(234, 179, 8, 0.4)",
      description: "Requirement analysis, stakeholder management, cross-functional leadership, & problem solving.",
      iconName: "Briefcase"
    }
  ],
  skills: [
    // --- Data & Analytics ---
    {
      id: "python",
      name: "Python",
      categoryId: "data-analytics",
      proficiency: 95,
      levelName: "Expert",
      description: "Primary language for data manipulation, synthetic data generation pipelines, statistical analysis, and web scripting.",
      libraries: [
        { name: "Pandas", description: "Dataframes, cleaning, aggregation, & statistical transformations" },
        { name: "NumPy", description: "Numerical operations, array computations, & matrix algebra" },
        { name: "Faker", description: "Synthetic record generation with realistic distributions" },
        { name: "SciPy", description: "Statistical hypothesis testing & correlation analysis" }
      ],
      crossDomains: ["development-cloud"],
      projectsUsedIn: ["synthslm"]
    },
    {
      id: "sql",
      name: "SQL",
      categoryId: "data-analytics",
      proficiency: 92,
      levelName: "Expert",
      description: "Complex queries, window functions, CTEs, multi-table joins, subqueries, and aggregation pipelines.",
      libraries: [
        { name: "PostgreSQL", description: "Relational database querying & schema design" },
        { name: "SQLite", description: "Embedded database engine for synthetic data storage" },
        { name: "Database Design", description: "Entity relationship modeling & normalization" }
      ],
      crossDomains: ["databases"],
      projectsUsedIn: ["synthslm"]
    },
    {
      id: "excel",
      name: "Advanced Excel",
      categoryId: "data-analytics",
      proficiency: 90,
      levelName: "Advanced",
      description: "XLOOKUP/VLOOKUP, Pivot Tables, Power Query data transformation, conditional formatting, and dashboard summaries.",
      libraries: [
        { name: "Power Query", description: "ETL & data transformation within Excel" },
        { name: "Pivot Tables", description: "Multi-dimensional summaries & key metrics breakdown" }
      ],
      crossDomains: ["professional"],
      projectsUsedIn: ["synthslm"]
    },
    {
      id: "power-bi",
      name: "Power BI & Tableau",
      categoryId: "data-analytics",
      proficiency: 85,
      levelName: "Advanced",
      description: "Interactive dashboard development, KPI cards, DAX measures, visual data storytelling, and executive reporting.",
      libraries: [
        { name: "DAX Measures", description: "Dynamic calculated columns & custom aggregation rules" },
        { name: "Tableau Visuals", description: "Interactive charts & distribution breakdown dashboards" }
      ],
      crossDomains: [],
      projectsUsedIn: []
    },
    {
      id: "eda-analytics",
      name: "EDA & Statistical Analysis",
      categoryId: "data-analytics",
      proficiency: 88,
      levelName: "Advanced",
      description: "Exploratory Data Analysis, statistical distribution analysis, correlation matrix heatmaps, outlier detection, and data profiling.",
      libraries: [
        { name: "Feature Importance", description: "Identifying key driver variables in datasets" },
        { name: "Outlier Detection", description: "Z-score & IQR based anomaly detection" },
        { name: "Distribution Matching", description: "Kolmogorov-Smirnov & Chi-square statistical validation" }
      ],
      crossDomains: [],
      projectsUsedIn: ["synthslm"]
    },

    // --- Development & Cloud ---
    {
      id: "streamlit",
      name: "Streamlit",
      categoryId: "development-cloud",
      proficiency: 92,
      levelName: "Expert",
      description: "Rapid data application frontend framework for interactive analytics dashboards, dataset uploads, and live schema validation tools.",
      libraries: [
        { name: "Streamlit Components", description: "Custom UI widgets, charts, and file downloaders" },
        { name: "Session State", description: "Stateful pipeline execution & multi-page navigation" }
      ],
      crossDomains: ["data-analytics"],
      projectsUsedIn: ["synthslm"]
    },
    {
      id: "react",
      name: "React.js",
      categoryId: "development-cloud",
      proficiency: 82,
      levelName: "Intermediate",
      description: "Modern single-page web app architecture, component lifecycle, custom hooks, state management, and responsive layouts.",
      libraries: [
        { name: "HTML5 & CSS3", description: "Semantic layout, Flexbox, Grid, & modern animations" },
        { name: "JavaScript / ES6+", description: "Async operations, Promises, & DOM manipulation" }
      ],
      crossDomains: [],
      projectsUsedIn: ["aerwok-clients"]
    },
    {
      id: "rest-apis",
      name: "REST APIs & Web Services",
      categoryId: "development-cloud",
      proficiency: 84,
      levelName: "Advanced",
      description: "API design, HTTP methods, JSON data exchange, backend route handlers, and client-server integration.",
      libraries: [
        { name: "JSON Data Formats", description: "Structured data exchange & schema payload validation" }
      ],
      crossDomains: ["data-analytics"],
      projectsUsedIn: ["synthslm"]
    },
    {
      id: "aws-cloud",
      name: "AWS & Cloud Deployment",
      categoryId: "development-cloud",
      proficiency: 78,
      levelName: "Proficient",
      description: "Cloud hosting, domain configuration, server deployment workflows, web app optimization, and static asset delivery.",
      libraries: [
        { name: "AWS EC2 / S3", description: "Hosting client web platforms & file storage" },
        { name: "Git & GitHub", description: "Version control, branching, PR review, & CI/CD release workflow" }
      ],
      crossDomains: ["tools-ai"],
      projectsUsedIn: ["aerwok-clients"]
    },

    // --- Databases ---
    {
      id: "postgresql",
      name: "PostgreSQL & Relational DBs",
      categoryId: "databases",
      proficiency: 88,
      levelName: "Advanced",
      description: "Relational schema design, foreign key constraints, indexes, query plan optimization, and data integrity validation.",
      libraries: [
        { name: "SQL Joins & Aggregations", description: "Inner/outer joins, GROUP BY, HAVING, and window functions" },
        { name: "Data Profiling", description: "Column nullability checks, distinct counts, & schema typing" }
      ],
      crossDomains: ["data-analytics"],
      projectsUsedIn: ["synthslm"]
    },
    {
      id: "mongodb",
      name: "MongoDB & NoSQL",
      categoryId: "databases",
      proficiency: 75,
      levelName: "Intermediate",
      description: "Document store architecture, JSON-like document querying, aggregation pipelines, and schema-less flexibility.",
      libraries: [],
      crossDomains: [],
      projectsUsedIn: []
    },

    // --- Tools & AI Workflows ---
    {
      id: "ai-assisted-dev",
      name: "AI & Prompt Engineering",
      categoryId: "tools-ai",
      proficiency: 94,
      levelName: "Expert",
      description: "Leveraging Claude, ChatGPT, Cursor AI, and LLM prompt engineering to rapidly scaffold codebases, automate data pipelines, and analyze complex schemas.",
      libraries: [
        { name: "Cursor AI", description: "AI-native IDE for accelerated full-stack & Python development" },
        { name: "Claude & ChatGPT", description: "Prompt engineering for data modeling & architectural design" }
      ],
      crossDomains: ["development-cloud"],
      projectsUsedIn: ["aerwok-clients", "synthslm"]
    },
    {
      id: "figma-canva",
      name: "Figma & Canva UI/UX",
      categoryId: "tools-ai",
      proficiency: 85,
      levelName: "Advanced",
      description: "Designing wireframes, interactive UI prototypes, brand visual assets, design tokens, and user flow diagrams.",
      libraries: [
        { name: "Wireframing", description: "High-fidelity UX design & component systems" }
      ],
      crossDomains: ["development-cloud"],
      projectsUsedIn: ["aerwok-clients"]
    },

    // --- Professional Skills ---
    {
      id: "req-analysis",
      name: "Requirement Analysis & BI",
      categoryId: "professional",
      proficiency: 90,
      levelName: "Advanced",
      description: "Translating ambiguous business problems into structured data metrics, KPI definitions, and technical solution blueprints.",
      libraries: [],
      crossDomains: ["data-analytics"],
      projectsUsedIn: ["synthslm", "aerwok-clients"]
    },
    {
      id: "stakeholder-mgmt",
      name: "Stakeholder Communication",
      categoryId: "professional",
      proficiency: 88,
      levelName: "Advanced",
      description: "Client account management, cross-functional team direction, project timeline tracking, and data storytelling presentations.",
      libraries: [],
      crossDomains: [],
      projectsUsedIn: ["aerwok-clients", "avinyx-internship"]
    }
  ],
  edges: [
    { id: "e1", sourceNodeId: "python", targetNodeId: "streamlit", label: "Dashboard Engine", type: "dependency" },
    { id: "e2", sourceNodeId: "python", targetNodeId: "eda-analytics", label: "Pandas/NumPy Analysis", type: "shared_tech" },
    { id: "e3", sourceNodeId: "sql", targetNodeId: "postgresql", label: "Relational Queries", type: "shared_tech" },
    { id: "e4", sourceNodeId: "sql", targetNodeId: "eda-analytics", label: "Data Extraction", type: "data_flow" },
    { id: "e5", sourceNodeId: "streamlit", targetNodeId: "react", label: "UI Component Paradigm", type: "shared_tech" },
    { id: "e6", sourceNodeId: "ai-assisted-dev", targetNodeId: "python", label: "Code Scaffolding", type: "shared_tech" },
    { id: "e7", sourceNodeId: "figma-canva", targetNodeId: "react", label: "UI Wireframes", type: "data_flow" },
    { id: "e8", sourceNodeId: "req-analysis", targetNodeId: "power-bi", label: "KPI Metric Definitions", type: "data_flow" }
  ],
  projects: [
    {
      id: "synthslm",
      title: "SynthSLM — Synthetic Data Generation Platform",
      subtitle: "Enterprise-grade synthetic data generator & statistical quality validation suite",
      period: "Jan 2026 – Jun 2026",
      category: "Data Engineering & Analytics",
      description: "Engineered an end-to-end synthetic data generation platform capable of producing statistically representative synthetic datasets from user-defined schemas. Validated against real-world enterprise datasets with integrated quality scoring.",
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
      documentationUrl: "#",
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
      proofMediaType: "link",
      proofMediaUrl: "#"
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
        "Deployed and hosted a client website on AWS, gaining hands-on experience with cloud infrastructure and deployment workflows.",
        "Leveraged AI-assisted tools (Claude, ChatGPT, Cursor) to rapidly scaffold website structures and iterate on client requirements."
      ],
      skillsUsed: ["Project Planning", "Client Management", "Figma", "AWS Hosting", "Cursor AI", "Team Leadership"],
      proofTitle: "Aerwok Client Case Study & Portfolio Showcase",
      proofMediaType: "link",
      proofMediaUrl: "#"
    }
  ],
  certifications: [
    {
      id: "oracle-next-level",
      title: "Databases for Developers: Next Level",
      issuer: "Oracle",
      issueDate: "Jul 2026",
      credentialUrl: "https://oracle.com",
      skillsValidated: ["Advanced SQL", "Indexing", "Query Optimization", "Database Architecture"]
    },
    {
      id: "oracle-foundations",
      title: "Databases for Developers: Foundations",
      issuer: "Oracle",
      issueDate: "Jul 2026",
      credentialUrl: "https://oracle.com",
      skillsValidated: ["Database Design", "SQL Basics", "Table Normalization", "Relational Modeling"]
    },
    {
      id: "deloitte-analytics",
      title: "Data Analytics Job Simulation",
      issuer: "Deloitte Australia via Forage",
      issueDate: "Jun 2026",
      credentialUrl: "https://theforage.com",
      skillsValidated: ["Data Analysis", "Data Visualization", "Client Presentation", "Strategic Insights"]
    }
  ],
  education: [
    {
      id: "sit-btech",
      degree: "B.Tech, Computer Science & Engineering",
      institution: "Siliguri Institute of Technology",
      period: "Apr 2022 – Jun 2026",
      details: "Focus on Data Analytics, Relational Database Management Systems, Software Engineering, and AI-assisted workflows."
    },
    {
      id: "cbse-xii",
      degree: "Senior Secondary (CBSE, Class XII)",
      institution: "Central Board of Secondary Education",
      period: "Jan 2022",
      grade: "74%"
    },
    {
      id: "cbse-x",
      degree: "Secondary (CBSE, Class X)",
      institution: "Central Board of Secondary Education",
      period: "Jan 2020",
      grade: "72%"
    }
  ],
  adminPasscode: "admin123"
};
