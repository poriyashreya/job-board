import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const submit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!email) newErrors.email = ['Email is required'];
        if (!password) newErrors.password = ['Password is required'];

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);

        try {
            const res = await axios.post("http://127.0.0.1:8000/api/login", {
                email: email.trim(),
                password
            });

            if (res.data.token) {
                localStorage.setItem("token", res.data.token);
            }

            if (res.data.user) {
                localStorage.setItem("user", JSON.stringify(res.data.user));
            }

            setErrors({});

            navigate("/");

        } catch (error) {

            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({
                    general: error.response?.data?.message || "Login Failed. Please try again."
                });
            }

            setTimeout(() => setErrors({}), 3000);

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="login-icon">
                        <i className="fa-solid fa-briefcase"></i>
                    </div>
                    <h2>Welcome Back</h2>
                    <p className="login-subtitle">Login to your Talentry account</p>
                </div>

                <form onSubmit={submit}>
                    <div className="input-group">
                        <div className="input-field">
                            <i className="fa-solid fa-envelope input-icon"></i>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);

                                    // ✅ remove only email error
                                    setErrors(prev => {
                                        const newErr = { ...prev };
                                        delete newErr.email;
                                        return newErr;
                                    });
                                }}
                                placeholder=" "
                                className={errors.email ? "error-input" : ""}
                                required
                            />
                            <label>Email Address</label>
                        </div>
                        {errors.email && <p className="error-message">{errors.email[0]}</p>}
                    </div>

                    <div className="input-group">
                        <div className="input-field">
                            <i className="fa-solid fa-lock input-icon"></i>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);

                                    setErrors(prev => {
                                        const newErr = { ...prev };
                                        delete newErr.password;
                                        return newErr;
                                    });
                                }}
                                placeholder=" "
                                className={errors.password ? "error-input" : ""}
                                required
                            />
                            <label>Password</label>
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {/* <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i> */}
                            </button>
                        </div>
                        {errors.password && <p className="error-message">{errors.password[0]}</p>}

                        <div className="login-options">
                            <Link to="/forgot-password" className="forgot-password-link">
                                Forgot Password?
                            </Link>
                        </div>
                    </div>

                    {errors.general && (
                        <div className="error-message general-error">
                            <i className="fa-solid fa-exclamation-circle"></i>
                            {errors.general}
                        </div>
                    )}

                    <button type="submit" disabled={isLoading} className="login-btn">
                        {isLoading ? (
                            <>
                                <i className="fa-solid fa-spinner fa-spin"></i>
                                Logging in...
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-arrow-right-to-bracket"></i>
                                Login
                            </>
                        )}
                    </button>
                </form>

                <div className="register-link">
                    <p>Don't have an account?</p>
                    <Link to="/register" className="register-btn1">
                        Create Account <i className="fa-solid fa-arrow-right"></i>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;