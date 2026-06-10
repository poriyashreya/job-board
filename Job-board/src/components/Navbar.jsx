import { Link, useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg job-navbar">

            <div className="container py-2">

                <Link className="navbar-brand logo" to="/">
                    <i className="fa-solid fa-briefcase me-2"></i>
                    Talentry
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">

                    <ul className="navbar-nav ms-auto">

                        {token && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/">
                                        <i className="fa-solid fa-house me-1"></i>
                                        Home
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link" to="/favorites">
                                        <i className="fa-solid fa-heart me-1"></i>
                                        Favorites
                                    </Link>
                                </li>

                                {/* PROFILE BUTTON */}
                                <li className="nav-item">
                                    <Link className="nav-link" to="/profile">
                                        <i className="fa-solid fa-user me-1"></i>
                                        Profile
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link className="btn post-btn ms-3" to="/addjob">
                                        <i className="fa-solid fa-plus me-1"></i>
                                        Post Job
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <button
                                        className="btn btn-danger ms-3"
                                        onClick={logout}
                                    >
                                        <i className="fa-solid fa-right-from-bracket me-1"></i>
                                        Logout
                                    </button>
                                </li>
                            </>
                        )}

                        {!token && (
                            <li className="nav-item">
                                <Link className="btn btn-primary ms-3" to="/login">
                                    Login
                                </Link>
                            </li>
                        )}

                    </ul>

                </div>

            </div>

        </nav>
    );
}

export default Navbar;