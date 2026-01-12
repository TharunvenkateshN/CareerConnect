const fs = require('fs');
const path = require('path');
const User = require("../models/User")

exports.updateProfile = async (req, res) => {

    try {
        const { name, avatar, companyName, companyDescription, companyLogo, resume } = req.body
        const user = await User.findById(req.user._id)
        if (!user) return res.status(404).json({ message: "User not found" });

        user.name = name || user.name;
        user.avatar = avatar || user.avatar;
        user.resume = resume || user.resume;

        if (user.role === "employer") {
            user.companyName = companyName || user.companyName;
            user.companyDescription = companyDescription || user.companyDescription;
            user.companyLogo = companyLogo || user.companyLogo;
        }

        await user.save()

        res.json({
            _id: user._id,
            name: user.name,
            avatar: user.avatar,
            role: user.role,
            companyName: user.companyName,
            companyDescription: user.companyDescription,
            companyLogo: user.companyLogo,
            resume: user.resume || '',
        })
    } catch (err) {
        res.status(500).json({ message: err.message });

    }
}

exports.deleteResume = async (req, res) => {

    try {
        const user = req.user; // Logged-in user
        const fileName = user.resume; // Stored resume filename

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.user_role !== "jobseeker") {
            return res
                .status(403)
                .json({ message: "Only jobseekers can delete resume" });
        }

        // Construct full file path
        const filePath = path.join(__dirname, "../uploads", fileName);

        // Check if file exists and delete it
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); // Delete file
        }

        // Clear resume field in DB
        user.resume = "";
        await user.save();

        res.json({ message: "Resume deleted successfully" });

    } catch (err) {
        res.status(500).json({ message: err.message });

    }
}

exports.getPublicProfile = async (req, res) => {

    try {
        const user = await User.findById(req.params.id).select("-password")
        if (!user) return res.status(404).json({ message: "User not found" })
        res.json(user)
    } catch (err) {
        res.status(500).json({ message: err.message });

    }
}

