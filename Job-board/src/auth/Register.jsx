import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const checkPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
        if (password.match(/\d/)) strength++;
        if (password.match(/[^a-zA-Z\d]/)) strength++;
        return strength;
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPasswordStrength(checkPasswordStrength(newPassword));
        if (errors.password) setErrors({ ...errors, password: null });
    };

    const submit = async (e) => {
        e.preventDefault();

        const newErrors = {};

        if (!name) newErrors.name = "Name is required";
        if (!email) newErrors.email = "Email is required";
        if (!password) newErrors.password = "Password is required";
        if (!confirmPassword) newErrors.confirmPassword = "Confirm password is required";

        if (password && confirmPassword && password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (passwordStrength < 3 && password) {
            newErrors.password = "Please use a stronger password (at least 8 characters, mix of cases, numbers & symbols)";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);

        try {
            const res = await API.post("/register", {
                name,
                email,
                password,
                password_confirmation: confirmPassword
            });

            localStorage.setItem("token", res.data.token);
            navigate("/");

        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: "Registration Failed. Please try again." });
                setTimeout(() => setErrors({}), 3000);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <div className="register-header">
                    <div className="register-icon">
                        <i className="fa-solid fa-briefcase"></i>
                    </div>
                    <h2>Create Account</h2>
                    <p className="register-subtitle">Join Talentry and start your journey</p>
                </div>

                <form onSubmit={submit}>
                    <div className="input-group">
                        <div className="input-field">
                            <i className="fa-solid fa-user input-icon"></i>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    if (errors.name) setErrors({ ...errors, name: null });
                                }}
                                placeholder=" "
                                className={errors.name ? "error-input" : ""}
                            />
                            <label>Full Name</label>
                        </div>
                        {errors.name && <p className="error-message">{errors.name}</p>}
                    </div>

                    <div className="input-group">
                        <div className="input-field">
                            <i className="fa-solid fa-envelope input-icon"></i>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (errors.email) setErrors({ ...errors, email: null });
                                }}
                                placeholder=" "
                                className={errors.email ? "error-input" : ""}
                            />
                            <label>Email Address</label>
                        </div>
                        {errors.email && <p className="error-message">{errors.email}</p>}
                    </div>

                    <div className="input-group">
                        <div className="input-field">
                            <i className="fa-solid fa-key input-icon"></i>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={handlePasswordChange}
                                placeholder=" "
                                className={errors.password ? "error-input" : ""}
                            />
                            <label>Password</label>
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                            </button>
                        </div>


                        {errors.password && <p className="error-message">{errors.password}</p>}
                    </div>

                    <div className="input-group">
                        <div className="input-field">
                            <i className="fa-solid fa-check-double input-icon"></i>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
                                }}
                                placeholder=" "
                                className={errors.confirmPassword ? "error-input" : ""}
                            />
                            <label>Confirm Password</label>
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <i className={`fa-solid ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                            </button>
                        </div>
                        {confirmPassword && password !== confirmPassword && (
                            <div className="error-hint">
                                <i className="fa-solid fa-exclamation-triangle"></i>
                                Passwords do not match
                            </div>
                        )}
                        {confirmPassword && password === confirmPassword && password && (
                            <div className="success-hint">
                                <i className="fa-solid fa-check-circle"></i>
                                Passwords match
                            </div>
                        )}
                        {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
                    </div>

                    <button type="submit" disabled={isLoading} className="register-btn">
                        {isLoading ? (
                            <>
                                <i className="fa-solid fa-spinner fa-spin"></i>
                                Creating Account...
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-user-plus"></i>
                                Create Account
                            </>
                        )}
                    </button>
                </form>

                <div className="login-link">
                    <p>Already have an account?</p>
                    <Link to="/login" className="login-link">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Register;