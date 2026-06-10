import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../api";

function Favorites() {

    const [favoriteJobs, setFavoriteJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchFavorites = async () => {

            try {

                // Get favorite job IDs
                const favRes = await API.get("/favorites");

                const favoriteIds = favRes.data;

                // Get all jobs
                const jobsRes = await API.get("/jobs");

                const allJobs = jobsRes.data;

                // Filter favorite jobs
                const filteredFavorites = allJobs.filter((job) =>
                    favoriteIds.includes(job.id)
                );

                setFavoriteJobs(filteredFavorites);

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);

            }

        };

        fetchFavorites();

    }, []);

    // Remove favorite
    const removeFavorite = async (id) => {

        try {

            await API.post(`/favorites/${id}`);

            setFavoriteJobs((prev) =>
                prev.filter((job) => job.id !== id)
            );

        } catch (error) {

            console.log(error);

        }

    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "500px" }}>
                <div className="spinner-border text-primary" role="status">
                </div>
                <p className="ms-2 mt-3">Loading Favorite Jobs...</p>
            </div>
        );
    }

    return (
        <div className="home-bg">
            <div className="container py-5">

                <h1 className="page-title">Favorite Jobs</h1>

                {favoriteJobs.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-card text-center">

                            <div className="icon">
                                <i className="fa-regular fa-heart"></i>
                            </div>

                            <h2>No Favorite Jobs</h2>

                            <p>
                                You haven't added any jobs to your favorites yet.
                            </p>

                            <Link to="/" className="browse-btn">
                                Browse Jobs
                            </Link>

                        </div>

                    </div>

                ) : (

                    <div className="job-grid">

                        {favoriteJobs.map((job) => (

                            <div className="job-card" key={job.id}>

                                <div className="card-inner">

                                    <div className="job-card-top">

                                        <div className="job-title-section">

                                            <h3 className="job-title">
                                                {job.title}
                                            </h3>

                                            <p className="company-name">
                                                {job.company}
                                            </p>

                                        </div>

                                        <button
                                            className="remove-favorite-btn"
                                            onClick={() => removeFavorite(job.id)}
                                        >

                                            <i className="fa-solid fa-trash"></i>

                                        </button>

                                    </div>

                                    <div className="job-info">

                                        <span className="badge location">
                                            {job.location}
                                        </span>

                                        <span className="badge type">
                                            {job.type}
                                        </span>

                                        <span className="badge experience">
                                            {job.experience}
                                        </span>

                                    </div>

                                    <p className="salary">
                                        {job.salary}
                                    </p>

                                    {job.skills && job.skills.length > 0 && (
                                        <div className="skills-section">
                                            <div className="skills-list">
                                                {job.skills.slice(0, 3).map((skill, i) => (
                                                    <span key={i} className="skill-tag1">
                                                        {skill}
                                                    </span>
                                                ))}
                                                {job.skills.length > 3 && (
                                                    <span className="skill-tag-more1">
                                                        +{job.skills.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>
        </div>
    );
}

export default Favorites;