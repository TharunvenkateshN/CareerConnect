import {
  Search,
  Users,
  FileText,
  MessageSquare,
  BarChart3,
  Shield,
  Clock,
  Award,
  Briefcase,
  Building2,
  LayoutDashboard,
  Plus,
  Bookmark as NavbarBookmark,
} from "lucide-react";

// Job Seeker Features
export const jobSeekerFeatures = [
  {
    icon: Search,
    title: "Smart Job Matching",
    description:
      "AI-powered algorithm matches you with relevant opportunities based on your skills and preferences.",
  },
  {
    icon: FileText,
    title: "Resume Builder",
    description:
      "Create professional resumes with our intuitive builder and templates designed by experts.",
  },
  {
    icon: MessageSquare,
    title: "Direct Communication",
    description:
      "Connect directly with hiring managers and recruiters through our secure messaging platform.",
  },
  {
    icon: Award,
    title: "Skill Assessment",
    description:
      "Showcase your abilities with verified skill tests and earn badges that employers trust.",
  },
];

// Employer Features
export const employerFeatures = [
  {
    icon: Users,
    title: "Talent Pool Access",
    description:
      "Access our vast database of pre-screened candidates and find the perfect fit for your team.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Track your hiring performance with detailed analytics and insights on candidate engagement.",
  },
  {
    icon: Shield,
    title: "Verified Candidates",
    description:
      "All candidates undergo background verification to ensure you're hiring trustworthy professionals.",
  },
  {
    icon: Clock,
    title: "Quick Hiring",
    description:
      "Streamlined hiring process reduces time-to-hire by 60% with automated screening tools.",
  },
];

// Navigation items configuration
// Navigation items configuration
export const EMPLOYER_MENU = [
  { id: "employer-dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "post-job", label: "Post Job", icon: Plus },
  { id: "manage-jobs", label: "Manage Jobs", icon: Briefcase },
  { id: "company-profile", label: "Company Profile", icon: Building2 },
];

export const JOB_SEEKER_MENU = [
  { id: "find-jobs", label: "Find Jobs", icon: Search },
  { id: "applied-jobs", label: "Applied Jobs", icon: FileText },
  { id: "saved-jobs", label: "Saved Jobs", icon: NavbarBookmark },
  { id: "profile", label: "My Profile", icon: Users },
];

// Categories and Job Types
export const CATEGORIES = [
  { value: "Engineering", label: "Engineering" },
  { value: "Design", label: "Design" },
  { value: "Marketing", label: "Marketing" },
  { value: "Sales", label: "Sales" },
  { value: "IT & Software", label: "IT & Software" },
  { value: "Customer Service", label: "Customer Service" },
  { value: "Product", label: "Product" },
  { value: "Operations", label: "Operations" },
  { value: "Finance", label: "Finance" },
  { value: "HR", label: "Human Resources" },
  { value: "Other", label: "Other" },
];

export const JOB_TYPES = [
  { value: "Remote", label: "Remote" },
  { value: "Full-Time", label: "Full-Time" },
  { value: "Part-Time", label: "Part-Time" },
  { value: "Contract", label: "Contract" },
  { value: "Internship", label: "Internship" },
];

export const SALARY_RANGES = [
  "$1000 - $15,000",
  "More than $15,000",
];

// Dummy data for when no jobs are found
export const DUMMY_JOBS = [
  {
    _id: '1',
    title: 'Senior React Developer',
    company: { _id: 'c1', name: 'TechCorp', companyName: 'TechCorp', companyLogo: 'https://ui-avatars.com/api/?name=TechCorp&background=random' },
    location: 'San Francisco, CA',
    jobType: 'Full-Time',
    experienceLevel: 'Senior Level',
    salary: { min: 120000, max: 160000 },
    type: 'Remote',
    description: 'We are looking for an experienced React developer to join our team. You will be working on cutting-edge technologies and building scalable applications.',
    requirements: ['5+ years of React experience', 'Node.js proficiency', 'Experience with cloud platforms'],
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
    title: 'Product Designer',
    company: { _id: 'c2', name: 'DesignStudio', companyName: 'DesignStudio', companyLogo: 'https://ui-avatars.com/api/?name=DesignStudio&background=random' },
    location: 'New York, NY',
    jobType: 'Full-Time',
    experienceLevel: 'Mid Level',
    salary: { min: 90000, max: 130000 },
    type: 'Hybrid',
    description: 'Join our award-winning design team to create beautiful user experiences. You will collaborate closely with product managers and engineers.',
    requirements: ['Portfolio demonstrating UI/UX skills', 'Figma mastery', 'User research experience'],
    createdAt: new Date().toISOString()
  },
  {
    _id: '3',
    title: 'Frontend Engineer',
    company: { _id: 'c3', name: 'StartupX', companyName: 'StartupX', companyLogo: 'https://ui-avatars.com/api/?name=StartupX&background=random' },
    location: 'Remote',
    jobType: 'Contract',
    experienceLevel: 'Entry Level',
    salary: { min: 50000, max: 80000 },
    type: 'Remote',
    description: 'Great opportunity for junior developers to learn and grow. You will work on customer-facing features and improve performance.',
    requirements: ['HTML/CSS/JS fundamentals', 'React basics', 'Willingness to learn'],
    createdAt: new Date().toISOString()
  }
];
