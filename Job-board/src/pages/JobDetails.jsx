import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../api";

function JobDetails() {

    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchJob = async () => {

            try {

                const res = await API.get(`/jobs/${id}`);

                const jobData = res.data;

                setJob({
                    id: jobData.id,
                    jobType: jobData.title,
                    companyName: jobData.company,
                    location: jobData.location,
                    employeeType: jobData.type,
                    experience: jobData.experience,
                    salary: jobData.salary,
                    jobDescription: jobData.description,
                    responsibilities: jobData.responsibilities || [],
                    skills: jobData.skills || [],
                    qualifications: jobData.qualifications || [],
                    datePosted: new Date(jobData.created_at).toLocaleDateString()
                });

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);

            }

        };

        fetchJob();

    }, [id]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="ms-2 mt-3">Loading Job Details...</p>
            </div>

        );
    }

    if (!job) {
        return (
            <div className="container job-notfound mt-5 text-center">
                <h2>Job Not Found</h2>
                <Link to="/" className="btn btn-primary">Back</Link>
            </div>
        );
    }

    return (
        <div className="home-bg">

            <div className="container py-5">

                {/* Page Header */}
                <div className="page-header">

                    <h1 className="page-title">Job Details</h1>

                    <Link to="/" className="back-btn">
                        <i className="fa-solid fa-arrow-left"></i> Back to Jobs
                    </Link>

                </div>


                {/* Job Hero Section */}
                <div className="job-hero">

                    <div className="hero-info">

                        <h2 className="job-titled">{job.jobType}</h2>

                        <p className="company">
                            <i className="fa-solid fa-building"></i> {job.companyName}
                        </p>

                        <div className="hero-meta">

                            <span>
                                <i className="fa-solid fa-location-dot"></i>
                                {job.location}
                            </span>

                            <span>
                                <i className="fa-solid fa-briefcase"></i>
                                {job.employeeType}
                            </span>

                            <span>
                                <i className="fa-solid fa-user-clock"></i>
                                {job.experience}
                            </span>

                            <span>
                                <i className="fa-solid fa-calendar-days"></i>
                                {job.datePosted}
                            </span>

                        </div>

                    </div>

                    <button className="apply-btn">
                        <i className="fa-solid fa-paper-plane"></i> Apply Now
                    </button>

                </div>


                {/* Main Content */}
                <div className="row mt-4">

                    {/* LEFT SECTION */}
                    <div className="col-lg-8">

                        <div className="details-card">

                            <h4>Description</h4>
                            <p>{job.jobDescription}</p>

                        </div>

                        <div className="details-card">

                            <h4>Responsibilities</h4>

                            <ul className="responsibility-list">

                                {job.responsibilities.map((res, i) => (
                                    <li key={i}>
                                        <i className="fa-solid fa-check"></i> {res}
                                    </li>
                                ))}

                            </ul>

                        </div>

                    </div>


                    {/* RIGHT SECTION */}
                    <div className="col-lg-4">

                        <div className="overview-card">

                            <h5>Job Overview</h5>

                            <p>
                                <i className="fa-solid fa-money-bill-wave"></i>
                                Salary: {job.salary}
                            </p>

                            <p>
                                <i className="fa-solid fa-user-clock"></i>
                                Experience: {job.experience}
                            </p>

                            <p>
                                <i className="fa-solid fa-graduation-cap"></i>
                                Qualification: {job.qualifications}
                            </p>

                            <p>
                                <i className="fa-solid fa-calendar-days"></i>
                                Posted: {job.datePosted}
                            </p>

                            <hr />

                            <h6>Skills</h6>

                            <div className="dskills">

                                {job.skills.map((skill, i) => (
                                    <span key={i} className="dskill-tag">
                                        {skill}
                                    </span>
                                ))}

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default JobDetails;