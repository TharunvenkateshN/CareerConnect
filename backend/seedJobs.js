const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('./models/Job');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const seedJobs = async () => {
    try {
        await connectDB();
        console.log('MongoDB Connected for seeding');

        // Find or create a demo employer
        let employer = await User.findOne({ email: 'demo@employer.com' });
        if (!employer) {
            employer = await User.create({
                name: 'Demo Employer',
                email: 'demo@employer.com',
                password: 'password123',
                role: 'employer',
                companyName: 'Tech Giants Inc.',
                companyLogo: 'https://ui-avatars.com/api/?name=Tech+Giants',
                companyDescription: 'Leading the future of tech.'
            });
            console.log('Demo employer created');
        }

        const jobs = [
            {
                title: 'Senior React Developer',
                company: employer._id,
                location: 'San Francisco, CA',
                jobType: 'Full-Time',
                experienceLevel: 'Senior Level',
                salary: { min: 120000, max: 160000 },
                description: 'We are looking for an experienced React developer to join our team. You will be working on cutting-edge technologies and building scalable applications.',
                requirements: '5+ years of React experience\nNode.js proficiency\nExperience with cloud platforms',
                category: 'Engineering',
                positions: 3,
                isClosed: false
            },
            {
                title: 'Product Designer',
                company: employer._id,
                location: 'New York, NY',
                jobType: 'Full-Time',
                experienceLevel: 'Mid Level',
                salary: { min: 90000, max: 130000 },
                description: 'Join our award-winning design team to create beautiful user experiences. You will collaborate closely with product managers and engineers.',
                requirements: 'Portfolio demonstrating UI/UX skills\nFigma mastery\nUser research experience',
                category: 'Design',
                positions: 1,
                isClosed: false
            },
            {
                title: 'Frontend Engineer',
                company: employer._id,
                location: 'Remote',
                jobType: 'Contract',
                experienceLevel: 'Entry Level',
                salary: { min: 50000, max: 80000 },
                description: 'Great opportunity for junior developers to learn and grow. You will work on customer-facing features and improve performance.',
                requirements: 'HTML/CSS/JS fundamentals\nReact basics\nWillingness to learn',
                category: 'Engineering',
                positions: 5,
                isClosed: false
            }
        ];

        await Job.deleteMany({}); // Clear existing jobs
        await Job.insertMany(jobs);
        console.log('Database seeded with 3 jobs');

        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedJobs();
