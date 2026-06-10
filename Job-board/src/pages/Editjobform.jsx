import { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import API from "../api";

function Editjob() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [showPopup, setShowPopup] = useState(false);
    const [errors, setErrors] = useState({});
    const currentDate = new Date().toISOString().split("T")[0];

    const [job, setJob] = useState({
        company: "",
        type: "",
        location: "",
        title: "",
        experience: "",
        qualifications: "",
        salary: "",
        skills: "",
        description: "",
        responsibilities: "",
        datePosted: ""
    });

    // Load job data
    useEffect(() => {

        const fetchJob = async () => {

            try {

                const res = await API.get(`/jobs/${id}`);

                const jobData = res.data;

                setJob({
                    company: jobData.company || "",
                    type: jobData.type || "",
                    location: jobData.location || "",
                    title: jobData.title || "",
                    experience: jobData.experience || "",
                    qualifications: jobData.qualifications
                        ? jobData.qualifications.join(", ")
                        : "",
                    salary: jobData.salary || "",
                    skills: jobData.skills ? jobData.skills.join(", ") : "",
                    description: jobData.description || "",
                    responsibilities: jobData.responsibilities
                        ? jobData.responsibilities.join(", ")
                        : "",
                });

            } catch (error) {

                console.log(error);

            }

        };

        fetchJob();

    }, [id]);

    const handleChange = (e) => {
        setJob({
            ...job,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        setErrors({});

        let validationErrors = {};

        if (!job.type.trim()) {
            validationErrors.type = "Employee type is required";
        }

        // company validation
        if (!job.company.trim()) {
            validationErrors.company = "Company is required";
        } else if (job.company.length < 3) {
            validationErrors.company = "Company must be at least 3 characters long";
        } else if (job.company.length > 50) {
            validationErrors.company = "Company must be at most 50 characters long";
        } else if (!/^[a-zA-Z\s]+$/.test(job.company)) {
            validationErrors.company = "Company must only contain letters and spaces";
        }

        if (!job.location.trim()) {
            validationErrors.location = "Location is required";
        }

        // JobTitle validation
        if (!job.title.trim()) {
            validationErrors.title = "Job title is required";
        } else if (job.title.length < 3) {
            validationErrors.title = "Job title must be at least 3 characters long";
        } else if (job.title.length > 50) {
            validationErrors.title = "Job title must be at most 50 characters long";
        } else if (!/^[a-zA-Z\s]+$/.test(job.title)) {
            validationErrors.title = "Job title must only contain letters and spaces";
        }

        // Salary validation
        if (!job.salary.trim()) {
            validationErrors.salary = "Salary is required";
        }

        // Experience Validation
        if (!job.experience.trim()) {
            validationErrors.experience = "Experience is required";
        }

        // Qualifications Validation
        if (!job.qualifications || !job.qualifications.trim()) {
            validationErrors.qualifications = "Qualifications are required";
        } else if (job.qualifications.split(",").length < 1) {
            validationErrors.qualifications = "At least one qualification is required";
        } else if (job.qualifications.split(",").length > 9) {
            validationErrors.qualifications = "No more than nine qualifications are allowed";
        }

        // Skills Validation
        if (!job.skills.trim()) {
            validationErrors.skills = "Skills are required";
        } else if (job.skills.split(",").length < 2) {
            validationErrors.skills = "At least two skills are required";
        } else if (job.skills.split(",").length > 10) {
            validationErrors.skills = "No more than ten skills are allowed";
        }

        // Job Description validation
        if (!job.description.trim()) {
            validationErrors.description = "Job description is required";
        } else if (job.description.length < 20) {
            validationErrors.description = "Job description must be at least 20 characters long";
        } else if (job.description.length > 500) {
            validationErrors.description = "Job description must be at most 500 characters long";
        }

        // Responsibilities Validation
        if (!job.responsibilities.trim()) {
            validationErrors.responsibilities = "Responsibilities are required";
        } else if (job.responsibilities.split(",").length < 2) {
            validationErrors.responsibilities = "At least two responsibilities are required";
        } else if (job.responsibilities.split(",").length > 9) {
            validationErrors.responsibilities = "No more than nine responsibilities are allowed";
        }

        // if validation errors exist stop form submission
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await API.put(`/jobs/${id}`, {
                ...job,
                datePosted: currentDate,
                qualifications: job.qualifications.split(",").map((q) => q.trim()),
                skills: job.skills.split(",").map((s) => s.trim()),
                responsibilities: job.responsibilities.split(",").map((r) => r.trim())
            });

            setShowPopup(true);

        } catch (error) {

            console.log(error);

        }
    };

    return (
        <div className="form-bg">

            <div className="container py-3">

                <div className="form-card">

                    <h1 className="page-title">Edit Job</h1>

                    <form onSubmit={handleSubmit} className="job-form">

                        <div className="form-grid">

                            <div className="form-group">
                                <label>Company Name</label>
                                <input
                                    type="text"
                                    name="company"
                                    value={job.company}
                                    onChange={handleChange}
                                />
                                {errors.company && <p className="error">{errors.company}</p>}
                            </div>

                            <div className="form-group">
                                <label>Employee Type</label>
                                <select
                                    name="type"
                                    value={job.type}
                                    onChange={handleChange}
                                >
                                    <option value="">Select</option>
                                    <option>Full Time</option>
                                    <option>Part Time</option>
                                    <option>Remote</option>
                                    <option>Internship</option>
                                </select>
                                {errors.type && <p className="error">{errors.type}</p>}
                            </div>

                            <div className="form-group">
                                <label>Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={job.location}
                                    onChange={handleChange}
                                />
                                {errors.location && <p className="error">{errors.location}</p>}
                            </div>

                            <div className="form-group">
                                <label>Job Type</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={job.title}
                                    onChange={handleChange}
                                />
                                {errors.title && <p className="error">{errors.title}</p>}
                            </div>

                            <div className="form-group">
                                <label>Experience</label>
                                <input
                                    type="text"
                                    name="experience"
                                    value={job.experience}
                                    onChange={handleChange}
                                />
                                {errors.experience && <p className="error">{errors.experience}</p>}
                            </div>

                            <div className="form-group">
                                <label>Qualifications</label>
                                <input
                                    type="text"
                                    name="qualifications"
                                    value={job.qualifications}
                                    onChange={handleChange}
                                />
                                {errors.qualifications && <p className="error">{errors.qualifications}</p>}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="pt-3 pb-1">Salary</label>
                            <input
                                type="text"
                                name="salary"
                                value={job.salary}
                                onChange={handleChange}
                            />
                            {errors.salary && <p className="error">{errors.salary}</p>}
                        </div>

                        <div className="form-group">
                            <label className="pt-3 pb-1">Skills (comma separated)</label>
                            <textarea
                                name="skills"
                                rows="4"
                                placeholder="React, JavaScript, HTML"
                                value={job.skills}
                                onChange={handleChange}
                            ></textarea>
                            {errors.skills && <p className="error">{errors.skills}</p>}
                        </div>

                        <div className="form-group">
                            <label className="pt-3 pb-1">Job Description</label>
                            <textarea
                                name="description"
                                rows="4"
                                value={job.description}
                                onChange={handleChange}
                            ></textarea>
                            {errors.description && <p className="error">{errors.description}</p>}
                        </div>

                        <div className="form-group">
                            <label className="pt-3 pb-1">Responsibilities</label>
                            <textarea
                                name="responsibilities"
                                rows="4"
                                value={job.responsibilities}
                                onChange={handleChange}
                            ></textarea>
                            {errors.responsibilities && <p className="error">{errors.responsibilities}</p>}
                        </div>

                        <div className="form-actions">

                            <button type="submit" className="submit-btn">
                                Update Job
                            </button>

                            <Link to="/profile" className="cancel-btn">
                                Cancel
                            </Link>

                        </div>

                    </form>

                </div>

            </div >

            {showPopup && (

                <div className="popup-overlay">

                    <div className="popup-card">

                        <i className="fa-solid fa-circle-check success-icon"></i>

                        <h2>Job Updated Successfully</h2>

                        <p>Your job has been updated successfully.</p>

                        <button
                            className="popup-button"
                            onClick={() => navigate("/")}
                        >
                            Go to Jobs
                        </button>

                    </div>

                </div>

            )
            }

        </div >
    );
}

export default Editjob;