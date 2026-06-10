import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import { toast, Toaster } from "react-hot-toast";

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: "",
        email: ""
    });
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeleteJobModal, setShowDeleteJobModal] = useState(false);
    const [editForm, setEditForm] = useState({
        name: "",
        email: ""
    });

    useEffect(() => {
        fetchProfile();
        fetchJobs();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await API.get("/profile");
            setUser({
                name: res.data.name,
                email: res.data.email
            });
            setEditForm({
                name: res.data.name,
                email: res.data.email
            });
            setLoading(false);
        } catch (error) {
            console.log(error);
            toast.error("Failed to load profile");
        }
    };

    const fetchJobs = async () => {
        try {
            const res = await API.get("/my-jobs");
            setJobs(res.data);
        } catch (error) {
            console.log(error);
            toast.error("Failed to load jobs");
        }
    };

    const handleEditChange = (e) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        });
    };

    const updateProfile = async (e) => {
        e.preventDefault();

        try {
            await API.put("/profile", editForm);
            setUser(editForm);
            setIsEditing(false);
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.log(error);
            toast.error("Failed to update profile");
        }
    };

    const deleteProfile = async () => {
        try {
            await API.delete("/profile");

            // ✅ remove token
            localStorage.removeItem("token");

            toast.success("Profile deleted successfully");

            setTimeout(() => {
                navigate("/login"); // better than /logout
            }, 1500);

        } catch (error) {
            console.log(error);
            toast.error("Failed to delete profile");
        } finally {
            setShowDeleteModal(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <h5 className="loading-text">Loading Profile...</h5>
                </div>
            </div>
        );
    }

    const editJob = (id) => {
        navigate(`/edit-job/${id}`);
    };

    const deleteJob = async () => {

        try {

            await API.delete(`/jobs/${selectedJobId}`);

            setJobs(jobs.filter(job => job.id !== selectedJobId));

            toast.success("Job deleted successfully");

        } catch (error) {

            console.log(error);
            toast.error("Failed to delete job");

        } finally {

            setShowDeleteJobModal(false);
            setSelectedJobId(null);

        }
    };

    return (
        <>
            <Toaster position="top-right" />

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-dialog-custom">
                        <div className="modal-content-custom">
                            <div className="modal-header-custom">
                                <h5 className="modal-title">Delete Account</h5>
                                <button
                                    type="button"
                                    className="modal-close"
                                    onClick={() => setShowDeleteModal(false)}
                                >
                                    ×
                                </button>
                            </div>
                            <div className="modal-body-custom">
                                <div className="modal-icon">
                                    <i className="fa-solid fa-exclamation-triangle"></i>
                                </div>
                                <p className="modal-text">
                                    Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.
                                </p>
                            </div>
                            <div className="modal-footer-custom">
                                <button
                                    className="btn-cancel"
                                    onClick={() => setShowDeleteModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn-delete"
                                    onClick={deleteProfile}
                                >
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteJobModal && (
                <div className="modal-overlay">
                    <div className="modal-dialog-custom">
                        <div className="modal-content-custom">
                            <div className="modal-header-custom">
                                <h5 className="modal-title">Delete Job</h5>
                                <button
                                    type="button"
                                    className="modal-close"
                                    onClick={() => setShowDeleteJobModal(false)}
                                >
                                    ×
                                </button>
                            </div>
                            <div className="modal-body-custom">
                                <div className="modal-icon">
                                    <i className="fa-solid fa-exclamation-triangle"></i>
                                </div>
                                <p className="modal-text">
                                    Are you sure you want to delete this job? This action cannot be undone and all your data will be permanently lost.
                                </p>
                            </div>
                            <div className="modal-footer-custom">
                                <button
                                    className="btn-cancel"
                                    onClick={() => setShowDeleteJobModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn-delete"
                                    onClick={deleteJob}
                                >
                                    Delete Job
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="profile-container">
                <div className="profile-wrapper">

                    {/* Profile Card */}
                    <div className="profile-card">
                        <div className="profile-header">
                            <div className="profile-avatar-wrapper">
                                <div className="profile-avatar-circle">
                                    <i className="fa-solid fa-user"></i>
                                </div>
                            </div>
                            <h4 className="profile-name">{user.name}</h4>
                            <p className="profile-email">{user.email}</p>
                        </div>

                        <div className="profile-body">
                            {isEditing ? (
                                <form onSubmit={updateProfile} className="edit-form">
                                    <div className="form-group">
                                        <label className="form-label">
                                            <i className="fa-solid fa-user"></i>
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="form-input"
                                            value={editForm.name}
                                            onChange={handleEditChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            <i className="fa-solid fa-envelope"></i>
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-input"
                                            value={editForm.email}
                                            onChange={handleEditChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-actions">
                                        <button type="submit" className="btn-save">
                                            <i className="fa-solid fa-save me-2"></i>
                                            Save Changes
                                        </button>
                                        <button
                                            type="button"
                                            className="btn-cancel-secondary"
                                            onClick={() => setIsEditing(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className="info-section">
                                        <div className="info-header">
                                            <h5 className="info-title">Account Information</h5>
                                            <div className="action-buttons">
                                                <button
                                                    className="btn-edit"
                                                    onClick={() => setIsEditing(true)}
                                                >
                                                    <i className="fa-solid fa-pen me-2"></i>
                                                    Edit Profile
                                                </button>
                                                <button
                                                    className="btn-delete-profile"
                                                    onClick={() => setShowDeleteModal(true)}
                                                >
                                                    <i className="fa-solid fa-trash me-2"></i>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>

                                        <div className="info-item">
                                            <div className="info-icon">
                                                <i className="fa-solid fa-user"></i>
                                            </div>
                                            <div className="info-content">
                                                <small className="info-label">Full Name</small>
                                                <strong className="info-value">{user.name}</strong>
                                            </div>
                                        </div>

                                        <div className="info-item">
                                            <div className="info-icon">
                                                <i className="fa-solid fa-envelope"></i>
                                            </div>
                                            <div className="info-content">
                                                <small className="info-label">Email Address</small>
                                                <strong className="info-value">{user.email}</strong>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="alert-info">
                                        <i className="fa-solid fa-shield-alt"></i>
                                        Your account is secure. Update your information anytime.
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Posted Jobs Section */}
                    <div className="jobs-card">
                        <div className="jobs-header">
                            <div>
                                <h4 className="jobs-title">
                                    <i className="fa-solid fa-briefcase"></i>
                                    My Posted Jobs
                                </h4>
                                <p className="jobs-subtitle">Manage and track your job listings</p>
                            </div>
                            <span className="jobs-count">
                                {jobs.length} Job{jobs.length !== 1 ? 's' : ''}
                            </span>
                        </div>

                        <div className="jobs-body">
                            {jobs.length === 0 ? (
                                <div className="empty-states">
                                    <i className="fa-solid fa-clipboard-list"></i>
                                    <h5>No Jobs Posted Yet</h5>
                                    <p>Start posting jobs to attract candidates</p>
                                    <button onClick={() => navigate("/addjob")} className="btn-post-job">
                                        <i className="fa-solid fa-plus"></i>
                                        <span>Post a Job</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="jobs-grid">
                                    {jobs.map((job) => (
                                        <div className="job-item" key={job.id}>
                                            <div className="job-content">
                                                <div className="job-header">
                                                    <h5 className="job-title">{job.title}</h5>
                                                    <p className="job-company">{job.company}</p>
                                                </div>

                                                <div className="job-tags">
                                                    <span className="tag tag-location">
                                                        <i className="fa-solid fa-location-dot"></i>
                                                        {job.location}
                                                    </span>
                                                    <span className="tag tag-type">
                                                        <i className="fa-solid fa-clock"></i>
                                                        {job.type}
                                                    </span>
                                                    <span className="tag tag-experience">
                                                        <i className="fa-solid fa-chart-line"></i>
                                                        {job.experience}
                                                    </span>
                                                    <span className="tag tag-salary">
                                                        <i className="fa-solid fa-dollar-sign"></i>
                                                        {job.salary}
                                                    </span>
                                                </div>

                                                {job.skills && job.skills.length > 0 && (
                                                    <div className="skills-section">
                                                        <small className="skills-label">Required Skills:</small>
                                                        <div className="skills-list">
                                                            {job.skills.slice(0, 4).map((skill, i) => (
                                                                <span key={i} className="skill-tag">
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                            {job.skills.length > 4 && (
                                                                <span className="skill-tag-more">
                                                                    +{job.skills.length - 4} more
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="job-actions">

                                                <Link to={`/job/${job.id}`} className="btn-view-job">
                                                    <i className="fa-solid fa-eye me-2"></i> View
                                                </Link>
                                                <Link
                                                    to={`/Editjob/${job.id}`}
                                                    className="btn-edit-job"
                                                    onClick={() => editJob(job.id)}
                                                >
                                                    <i className="fa-solid fa-pen"></i> Edit
                                                </Link>

                                                <button
                                                    className="btn-delete-job"
                                                    onClick={() => {
                                                        setSelectedJobId(job.id);
                                                        setShowDeleteJobModal(true);
                                                    }}
                                                >
                                                    <i className="fa-solid fa-trash"></i> Delete
                                                </button>

                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profile;