import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

function Home() {

    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState("");
    const [favorites, setFavorites] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true); // loading state

    const jobsPerPage = 6;

    // Fetch jobs
    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        const fetchData = async () => {
            try {
                const [jobsRes, favRes] = await Promise.all([
                    API.get("/jobs"),
                    API.get("/favorites")
                ]);

                setJobs(jobsRes.data);
                setFavorites(favRes.data);

            } catch (error) {

                if (error.response?.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/login");
                }

                console.log(error);

            } finally {
                setLoading(false);
            }
        };

        fetchData();

    }, [navigate]);



    // Reset page on search
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);



    // Toggle favorite
    const toggleFavorite = async (id) => {
        try {
            await API.post(`/favorites/${id}`);

            setFavorites((prev) =>
                prev.includes(id)
                    ? prev.filter((f) => f !== id)
                    : [...prev, id]
            );

        } catch (error) {
            console.log(error);
        }
    };



    // Search filter
    const filteredJobs = jobs.filter((job) =>
        job.title?.toLowerCase().includes(search.toLowerCase()) ||
        job.company?.toLowerCase().includes(search.toLowerCase()) ||
        job.location?.toLowerCase().includes(search.toLowerCase()) ||
        job.type?.toLowerCase().includes(search.toLowerCase())
    );



    // Pagination
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;

    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);



    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };



    return (

        <div className="home-bg">

            <div className="container py-5">

                <h1 className="page-title">Job Listings</h1>

                <div className="top-bar">

                    <div className="search-container">

                        <div className="search-box">

                            <i className="fa-solid fa-magnifying-glass search-icon"></i>

                            <input
                                type="text"
                                placeholder="Search job, company, location, type..."
                                className="search-input"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                        </div>

                    </div>

                    <Link to="/addjob" className="add-btn">
                        Add Job
                    </Link>

                </div>


                {/* Loading Spinner */}
                {loading ? (

                    <div className="d-flex justify-content-center align-items-center" style={{ height: "500px" }}>
                        <div className="spinner-border text-primary" role="status">
                        </div>
                        <p className="ms-2 mt-3">Loading All Jobs...</p>
                    </div>

                ) : (

                    <div className="job-grid">

                        {filteredJobs.length === 0 ? (

                            <div className="text-center mt-5">
                                <h3>No Jobs Found</h3>
                            </div>

                        ) : (

                            currentJobs.map((job) => (

                                <div
                                    className="job-card"
                                    key={job.id}
                                    onClick={() => navigate(`/job/${job.id}`)}
                                >

                                    <div className="card-inner">

                                        <div className="job-card-top">

                                            <div className="job-title-section">

                                                <h3 className="job-title">{job.title}</h3>

                                                <p className="company-name">{job.company}</p>

                                            </div>


                                            <div className="card-actions">

                                                <button
                                                    className={`favorite-btn ${favorites.includes(job.id) ? "active" : ""}`}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        toggleFavorite(job.id);
                                                    }}
                                                >

                                                    <i
                                                        className={
                                                            favorites.includes(job.id)
                                                                ? "fa-solid fa-heart"
                                                                : "fa-regular fa-heart"
                                                        }
                                                    ></i>

                                                </button>

                                            </div>

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

                            ))

                        )}

                    </div>

                )}



                {/* Pagination */}

                {totalPages > 1 && !loading && (

                    <div className="pagination-container">

                        <button
                            className="page-btn"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            Prev
                        </button>

                        {[...Array(totalPages)].map((_, index) => (

                            <button
                                key={index}
                                className={`page-btn ${currentPage === index + 1 ? "active" : ""}`}
                                onClick={() => paginate(index + 1)}
                            >
                                {index + 1}
                            </button>

                        ))}

                        <button
                            className="page-btn"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            Next
                        </button>

                    </div>

                )}

            </div>

        </div>

    );

}

export default Home;