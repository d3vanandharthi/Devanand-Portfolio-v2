import { Experience, Project } from './types';

export const RESUME_CONTENT = `
DEVANAND MALLESH HARTHI
Full-Stack .NET Developer | Enterprise Software Engineer
Location: Bangalore, India
Contact: d3vanandharthi@gmail.com | LinkedIn: linkedin.com/in/devanandharthi | GitHub: github.com/d3vanandharthi

PROFESSIONAL SUMMARY
Full-Stack .NET Developer with 4+ years of experience architecting enterprise-grade web applications for Fortune 500 banking institutions. Expert in .NET Core, C#, Razor Pages, microservices architecture, and AI-driven automation. Proven track record reducing deployment time by 83%, implementing sophisticated Risk Rating Models. Specialized in Clean Architecture, TDD, RESTful APIs, and Snowflake Data Cloud.

TECHNICAL SKILLS
Core: C#, .NET Core, ASP.NET Core, ASP.NET MVC, Razor Pages, RESTful APIs, EF Core, LINQ
DevOps: GitHub Actions, Docker, Infrastructure as Code
Databases: SQL Server, Snowflake Data Cloud, MongoDB
Patterns: Clean Architecture, Microservices, Factory Pattern, SOLID, DDD
Financial Tech: Moody's CreditLens, Ncino CRM, Risk Rating Models

EXPERIENCE
SLK | Senior Software Engineer (Dec 2024 - Present)
- Delivered robust .NET Core APIs powering high-traffic FinTech operations
- Rebuilt complex business queries using AI, reducing execution time from 10 minutes to 7 seconds
- Integrated GitHub Copilot, boosting team code productivity and quality
- Agile sprints, mentoring 3+ junior devs in .NET, AI, and best practices
- Improved system reliability by implementing advanced debugging and testing tools
- Architected full-stack .NET Core solutions for enterprise banking workflows (10,000+ credit assessments annually).
- Designed Risk Rating Models (PD & LGD) using Factory Pattern, reducing calculation time by 40%.
- Engineered automated synchronization between Ncino and Moody's CreditLens.
- Built high-performance Snowflake data extraction utilities.
- Integrated AI-powered automation reducing task time by 60%.

Software Engineer | Parallel Process Technologies (Jan 2022 - Dec 2024)
- Developed .NET applications serving 500+ concurrent users with 99.5% uptime.
- Led end-to-end SDLC, delivering projects 10% under budget.
- Key Projects: Vessel Profiler, SmartPricer ($50M+ daily transactions), Optimile, REZOVO.

Frontend Developer | CyclingZens Pvt Ltd (July 2021 - Dec 2021)
- Developed responsive web interfaces using HTML5, CSS3, JS.

EDUCATION & CERTIFICATIONS
BCA (2021)
Certifications: AI Skills (Microsoft), C# (Microsoft), Generative AI (LinkedIn), GitHub Copilot, .NET Full Stack Foundation, SQL.
Planned: Azure Fundamentals, Azure Developer Associate, Azure DevOps Expert.
`;

export const UX_CONFIG_HASH = "vj7Z50VXs3kljEV7Fp;I}X:UX745PiIbD|Vd}LD";

export const EXPERIENCES: Experience[] = [
  {
    id: 'slk',
    role: 'Software Engineer',
    company: 'SLK Software Services',
    location: 'Panjim, Goa',
    period: 'Dec 2024 – Present',
    description: [
      'Architected full-stack .NET Core solutions for enterprise banking workflows, processing 10,000+ credit assessments annually.',
      'Designed sophisticated Risk Rating Models (PD & LGD) using Factory Pattern and Clean Architecture.',
      'Reduced risk calculation time by 40% and improved accuracy by 25%.',
      'Engineered automated nightly entity synchronization between Ncino and Moody\'s CreditLens.',
      'Optimized SQL Server queries achieving 50% performance improvement.',
    ],
    tech: ['.NET Core', 'C#', 'Snowflake', "Moody's CreditLens", 'Ncino', 'GitHub Actions']
  },
  {
    id: 'parallel-se',
    role: 'Software Engineer',
    company: 'Parallel Process Technologies',
    location: 'Panjim, Goa',
    period: 'Jan 2022 – Dec 2024',
    description: [
      'Delivered 15+ enterprise web applications serving 500+ concurrent users with 99.5% uptime.',
      'Implemented Clean Architecture using Repository and Factory patterns.',
      'Reduced code duplication by 40% and improved maintainability by 50%.',
      'Designed RESTful APIs handling 10,000+ daily requests.',
    ],
    tech: ['.NET Core', 'ASP.NET MVC', 'MongoDB', 'SQL Server', 'Microservices']
  },
  {
    id: 'cyclingzens',
    role: 'Frontend Developer',
    company: 'CyclingZens Pvt Ltd',
    location: 'Panjim, Goa',
    period: 'July 2021 – Dec 2021',
    description: [
      'Developed responsive web interfaces using HTML5, CSS3, JavaScript.',
      'Achieved 95+ Google Lighthouse scores.',
      'Reduced page load times by 40%.'
    ],
    tech: ['MD Bootstrap', 'DevExtreme', 'Kendo UI', 'Responsive Design']
  }
];

export const PROJECTS: Project[] = [
  {
    id: 'vessel',
    title: 'Vessel Profiler',
    category: 'Maritime',
    description: 'Tracked 1,000+ daily ship movements with real-time analytics.',
    stats: '1k+ Daily Movements'
  },
  {
    id: 'smartpricer',
    title: 'SmartPricer',
    category: 'FinTech',
    description: 'Loan Trading platform handling $50M+ in daily transactions.',
    stats: '$50M+ Daily Vol'
  },
  {
    id: 'optimile',
    title: 'Optimile',
    category: 'Logistics',
    description: 'Container Tracking system utilizing SignalR for real-time updates.',
    stats: 'Real-time SignalR'
  },
  {
    id: 'rezovo',
    title: 'REZOVO',
    category: 'Entertainment',
    description: 'Platform managing 1,000+ daily bookings for entertainment venues.',
    stats: '1k+ Daily Bookings'
  }
];

export const SKILL_DATA = [
  { id: 'C#', group: 1, radius: 40, color: '#9333ea' }, // Purple
  { id: '.NET Core', group: 1, radius: 45, color: '#9333ea' },
  { id: 'Clean Arch', group: 4, radius: 38, color: '#2563eb' }, // Blue
  { id: 'Microservices', group: 4, radius: 35, color: '#2563eb' },
  { id: 'SQL Server', group: 2, radius: 35, color: '#059669' }, // Green
  { id: 'Snowflake', group: 2, radius: 32, color: '#06b6d4' }, // Cyan
  { id: 'React', group: 3, radius: 30, color: '#e11d48' }, // Rose
  { id: 'Azure', group: 2, radius: 35, color: '#0ea5e9' }, // Sky
  { id: 'Docker', group: 2, radius: 30, color: '#0ea5e9' },
  { id: 'TDD', group: 4, radius: 25, color: '#64748b' },
  { id: 'GenAI', group: 5, radius: 38, color: '#f59e0b' }, // Amber
  { id: 'SOLID', group: 4, radius: 28, color: '#64748b' },
  { id: 'GitHub Actions', group: 2, radius: 30, color: '#ea580c' },
  { id: 'SignalR', group: 1, radius: 28, color: '#9333ea' },
];