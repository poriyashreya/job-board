import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

function AddJob() {

    const navigate = useNavigate();

    const [showPopup, setShowPopup] = useState(false);
    const [errors, setErrors] = useState({});

    const [job, setJob] = useState({
        companyName: "",
        employeeType: "",
        location: "",
        jobType: "",
        experience: "",
        qualifications: "",
        salary: "",
        skills: "",
        jobDescription: "",
        responsibilities: "",
        datePosted: ""
    });

    const handleChange = (e) => {
        setJob({
            ...job,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        let validationErrors = {};

        if (!job.employeeType.trim()) {
            validationErrors.employeeType = "Employee type is required";
        }

        // companyName validation
        if (!job.companyName.trim()) {
            validationErrors.companyName = "Company name is required";
        } else if (job.companyName.length < 3) {
            validationErrors.companyName = "Company name must be at least 3 characters long";
        } else if (job.companyName.length > 50) {
            validationErrors.companyName = "Company name must be at most 50 characters long";
        } else if (!/^[a-zA-Z\s]+$/.test(job.companyName)) {
            validationErrors.companyName = "Company name must only contain letters and spaces";
        }

        if (!job.location.trim()) {
            validationErrors.location = "Location is required";
        }

        // JobType validation
        if (!job.jobType.trim()) {
            validationErrors.jobType = "Job type is required";
        } else if (job.jobType.length < 3) {
            validationErrors.jobType = "Job type must be at least 3 characters long";
        } else if (job.jobType.length > 50) {
            validationErrors.jobType = "Job type must be at most 50 characters long";
        } else if (!/^[a-zA-Z\s]+$/.test(job.jobType)) {
            validationErrors.jobType = "Job type must only contain letters and spaces";
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
        if (!job.qualifications.trim()) {
            validationErrors.qualifications = "Qualifications are required";
        } else if (job.qualifications.split(",").length < 1) {
            validationErrors.qualifications = "At least one qualification is required";
        } else if (job.qualifications.split(",").length > 9) {
            validationErrors.qualifications = "No more than nine qualifications are allowed";
        } else if (!/^[A-Za-z\s!@#$%^&*(),.?":{}|<>_\-+=/\\[\];'`~]*$/.test(job.qualifications)) {
            validationErrors.qualifications = "Numbers are not allowed in job qualifications";
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
        if (!job.jobDescription.trim()) {
            validationErrors.jobDescription = "Job description is required";
        } else if (job.jobDescription.length < 20) {
            validationErrors.jobDescription = "Job description must be at least 20 characters long";
        } else if (job.jobDescription.length > 500) {
            validationErrors.jobDescription = "Job description must be at most 500 characters long";
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

            await API.post("/jobs", {
                title: job.jobType,
                company: job.companyName,
                location: job.location,
                type: job.employeeType,
                qualifications: job.qualifications.split(",").map(q => q.trim()),
                experience: job.experience,
                salary: job.salary,
                description: job.jobDescription,
                responsibilities: job.responsibilities.split(",").map(q => q.trim()),
                skills: job.skills.split(",").map(s => s.trim())
            });

            setShowPopup(true);

        } catch (error) {

            console.log(error.response);

            if (error.response && error.response.data) {
                alert(error.response.data.message);
            } else {
                alert("Server error while adding job");
            }

        }
    };

    return (
        <div className="form-bg">

            <div className="container py-3">

                <div className="form-card">

                    <h1 className="page-title">Add New Job</h1>

                    <form onSubmit={handleSubmit} method="post" className="job-form">

                        <div className="form-grid">

                            <div className="form-group">
                                <label>Company Name</label>
                                <input type="text" name="companyName" onChange={handleChange} />
                                {errors.companyName && <p className="error">{errors.companyName}</p>}
                            </div>

                            <div className="form-group">
                                <label>Employee Type</label>
                                <select name="employeeType" onChange={handleChange} >
                                    <option value="">Select</option>
                                    <option>Full Time</option>
                                    <option>Part Time</option>
                                    <option>Remote</option>
                                    <option>Internship</option>
                                </select>

                                {errors.employeeType && <p className="error">{errors.employeeType}</p>}
                            </div>

                            <div className="form-group">
                                <label>Location</label>
                                <input type="text" name="location" onChange={handleChange} />

                                {errors.location && <p className="error">{errors.location}</p>}
                            </div>

                            <div className="form-group">
                                <label>Job Type</label>
                                <input type="text" name="jobType" onChange={handleChange} />

                                {errors.jobType && <p className="error">{errors.jobType}</p>}
                            </div>

                            <div className="form-group">
                                <label >Experience</label>
                                <input type="text" name="experience" onChange={handleChange} />

                                {errors.experience && <p className="error">{errors.experience}</p>}
                            </div>

                            <div className="form-group">
                                <label >Qualifications</label>
                                <input type="text" name="qualifications" onChange={handleChange} />

                                {errors.qualifications && <p className="error">{errors.qualifications}</p>}
                            </div>

                        </div>
                        <div className="form-group">
                            <label className="pt-3 pb-1" >Salary</label>
                            <input type="text" name="salary" onChange={handleChange} />

                            {errors.salary && <p className="error">{errors.salary}</p>}
                        </div>

                        <div className="form-group">
                            <label className="pt-3 pb-1">Skills (comma separated)</label>
                            <input type="text" name="skills" onChange={handleChange} />

                            {errors.skills && <p className="error">{errors.skills}</p>}
                        </div>

                        <div className="form-group">
                            <label className="pt-3 pb-1">Job Description</label>
                            <textarea name="jobDescription" rows="4" onChange={handleChange}></textarea>

                            {errors.jobDescription && <p className="error">{errors.jobDescription}</p>}
                        </div>

                        <div className="form-group">
                            <label className="pt-3 pb-1">Responsibilities (comma separated)</label>
                            <textarea name="responsibilities" rows="4" onChange={handleChange}></textarea>

                            {errors.responsibilities && <p className="error">{errors.responsibilities}</p>}
                        </div>

                        <div className="form-actions">

                            <button type="submit" className="submit-btn">
                                Add Job
                            </button>

                            <Link to="/" className="cancel-btn">
                                Cancel
                            </Link>

                        </div>

                    </form>

                </div>

            </div>

            {/* SUCCESS POPUP */}

            {showPopup && (

                <div className="popup-overlay">

                    <div className="popup-card">

                        <i className="fa-solid fa-circle-check success-icon"></i>

                        <h2>Job Added Successfully</h2>

                        <p>Your job has been posted successfully.</p>

                        <button
                            className="popup-button"
                            onClick={() => navigate("/")}
                        >
                            Go to Jobs
                        </button>

                    </div>

                </div>

            )}

        </div>
    );
}

export default AddJob;