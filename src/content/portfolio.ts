export type PortfolioExperience = {
  role: string
  company: string
  location: string
  date: string
  url: string
  accentColor: string
  glowColor: string[]
  desc: string
  stack: string[]
  videoHighlights: string[]
}

export type PortfolioTestimonial = {
  id: number
  quote: string
  name: string
  role: string
  company: string
  imgSrc: string
}

export const profile = {
  name: "Sarthak Pawar",
  tagline: "I don't ship promises. I ship AI Agents and Software Products.",
  roleLine: "Software Engineer // AI Engineer // India",
  contactHeading: "Begin Transmission",
  contactBody:
    "Scaling a product, solving a hard technical problem, or need a Software Engineer and AI Engineer from India who shows up every day with the same intensity? Specializing in Artificial Intelligence, Voice Agents, React Next, and Flutter - let's build.",
  contactEmail: "sarthakrajesh777@gmail.com",
}

export const experienceEntries: PortfolioExperience[] = [
  {
    role: "Software Engineer",
    company: "Buzz.me",
    location: "San Francisco, CA (Remote)",
    date: "Feb 2025 - Present",
    url: "https://webapp.buzzme.site/public-events",
    glowColor: [
      "radial-gradient(ellipse 120% 100% at 50% 40%, rgba(255, 20, 147, 0.18), transparent 70%)",
      "radial-gradient(ellipse 100% 120% at 30% 65%, rgba(255, 140, 0, 0.15), transparent 65%)",
      "radial-gradient(ellipse 90% 100% at 75% 55%, rgba(233, 30, 99, 0.12), transparent 60%)",
    ],
    accentColor: "#FF1493",
    desc: "Migrated the web app from React to Next.js - SSR and SSG cut page loads by 40%. Built an AI voice agent with LiveKit, Deepgram, Gemini, and LangGraph so premium users create events 3x faster through natural conversation. Engineered a concurrency-safe RSVP system with waitlist management and deep linking for 100+ weekly users. Shipped cross-platform features across Flutter and React, including media albums, chat, push notifications, and AI-powered event content generation adopted in 90%+ of events.",
    stack: ["Next.js", "Flutter", "LiveKit", "LangGraph", "Deepgram", "Gemini", "Twilio", "FCM", "PostgreSQL"],
    videoHighlights: [
      "Migrated React to Next.js",
      "Cut page loads by 40%",
      "Built AI voice agent for 3x faster event creation",
    ],
  },
  {
    role: "Full-Stack Engineer",
    company: "Polar AI",
    location: "Delhi, India (Remote)",
    date: "Oct 2024 - Jan 2025",
    url: "https://gopolar.io",
    glowColor: [
      "radial-gradient(ellipse 120% 100% at 50% 45%, rgba(108, 92, 231, 0.18), transparent 65%)",
      "radial-gradient(ellipse 100% 110% at 25% 55%, rgba(72, 52, 212, 0.15), transparent 60%)",
      "radial-gradient(ellipse 90% 100% at 75% 50%, rgba(162, 155, 254, 0.1), transparent 55%)",
    ],
    accentColor: "#6C5CE7",
    desc: "Built B2B chatbots with LangGraph for complex state management and multi-turn conversation flows. Implemented RAG pipelines with Pinecone and streaming APIs for real-time answers. Developed a React admin dashboard for workflow management and analytics, and optimized the shared framework so domain bot integrations shipped 50% faster.",
    stack: ["Next.js", "LangGraph", "Pinecone", "OpenAI", "Firebase", "Streaming APIs"],
    videoHighlights: [
      "Built LangGraph chatbot systems",
      "Shipped RAG with Pinecone",
      "Cut integration time by 50%",
    ],
  },
  {
    role: "Technical Trainee",
    company: "Traveazy",
    location: "Pune, India",
    date: "Jul 2024 - Sep 2024",
    url: "https://umrahme.com",
    glowColor: [
      "radial-gradient(ellipse 120% 100% at 50% 45%, rgba(45, 27, 105, 0.2), transparent 65%)",
      "radial-gradient(ellipse 100% 110% at 35% 60%, rgba(155, 89, 182, 0.15), transparent 60%)",
      "radial-gradient(ellipse 90% 100% at 70% 50%, rgba(245, 166, 35, 0.12), transparent 55%)",
    ],
    accentColor: "#F5A623",
    desc: "Built responsive frontend interfaces with ASP.NET MVC, Razor Pages, and jQuery. Integrated REST APIs with a .NET Core backend for large-scale S3 image assets and implemented image optimization that improved page load performance.",
    stack: [".NET Core", "ASP.NET MVC", "Razor Pages", "jQuery", "AWS S3", "MongoDB"],
    videoHighlights: [
      "Built responsive .NET interfaces",
      "Integrated REST APIs with S3 media flows",
      "Improved page performance with image optimization",
    ],
  },
  {
    role: "Full-Stack Development Intern",
    company: "Polar AI",
    location: "Delhi, India (Remote)",
    date: "Oct 2023 - May 2024",
    url: "https://gopolar.io",
    glowColor: [
      "radial-gradient(ellipse 120% 100% at 50% 45%, rgba(108, 92, 231, 0.18), transparent 65%)",
      "radial-gradient(ellipse 100% 110% at 25% 55%, rgba(72, 52, 212, 0.15), transparent 60%)",
      "radial-gradient(ellipse 90% 100% at 75% 50%, rgba(162, 155, 254, 0.1), transparent 55%)",
    ],
    accentColor: "#6C5CE7",
    desc: "Built a backend inference pipeline with Express, Firebase, Pinecone, and OpenAI APIs powering 4+ production chatbots. Developed a React admin dashboard for workflow management and analytics reporting, then deployed and monitored the backend on AWS EC2.",
    stack: ["Express.js", "Firebase", "Pinecone", "OpenAI", "AWS EC2", "React"],
    videoHighlights: [
      "Powered 4+ production chatbots",
      "Built inference pipelines on Express and Pinecone",
      "Deployed and monitored services on AWS EC2",
    ],
  },
]

export const testimonials: PortfolioTestimonial[] = [
  {
    id: 0,
    quote:
      "Although his specialization was in React, he jumped into mobile development and became very proficient at it. His extra mile in researching how AI technologies could be infused within the product reflects a certain maturity in approach which is admirable.",
    name: "Rahul Naik",
    role: "Founder",
    company: "Buzz.me",
    imgSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
  },
  {
    id: 1,
    quote:
      "Sarthak demonstrated exceptional technical skills and a strong commitment to his work. He is a true team player with a positive, can-do attitude that uplifts those around him. Given the opportunity, I would not hesitate to hire him again.",
    name: "Jatin",
    role: "CEO",
    company: "Polar AI",
    imgSrc: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop",
  },
  {
    id: 2,
    quote:
      "He didn't just build what was asked - he anticipated how the platform should function to support growth and improve lead generation. If you're looking for someone who combines technical skill with business awareness and proactive problem-solving, Sarthak is an excellent choice.",
    name: "Aditya Magdum",
    role: "Founder",
    company: "OwlNest.in",
    imgSrc: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
  },
  {
    id: 3,
    quote:
      "As an intern, Sarthak was always reliable and resourceful. His work exceeded our goals for six months. I've always prioritised leadership and problem-solving among my team members, and Sarthak has never failed to deliver on both fronts.",
    name: "Dhruv",
    role: "CEO",
    company: "Polar AI",
    imgSrc: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
  },
  {
    id: 4,
    quote:
      "We greatly appreciate your dedication, hard work, and the value you brought to the team during your time with us. It has been a pleasure working with you, and we wish you all the best in your future endeavors.",
    name: "Nipun Walia",
    role: "CTO",
    company: "Polar AI",
    imgSrc: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=150&auto=format&fit=crop",
  },
]

export const socialLinks = [
  {
    href: "https://github.com/Grumppie",
    label: "Github",
  },
  {
    href: "https://x.com/Grumppie1",
    label: "Twitter / X",
  },
  {
    href: "https://www.linkedin.com/in/sarthak-pawar-b679481a9/",
    label: "LinkedIn",
  },
  {
    href: `mailto:${profile.contactEmail}`,
    label: "Email",
  },
]
