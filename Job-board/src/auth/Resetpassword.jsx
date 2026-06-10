import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ResetPassword() {
    const { token } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
        password_confirmation: ""
    });

    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    useEffect(() => {
        const emailFromUrl = searchParams.get("email");
        if (emailFromUrl) {
            setForm((prev) => ({
                ...prev,
                email: emailFromUrl
            }));
        }
    }, [searchParams]);

    const checkPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
        if (password.match(/\d/)) strength++;
        if (password.match(/[^a-zA-Z\d]/)) strength++;
        return strength;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });

        if (name === "password") {
            setPasswordStrength(checkPasswordStrength(value));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.password_confirmation) {
            setMessage("Passwords do not match");
            setIsSuccess(false);
            setTimeout(() => setMessage(""), 3000);
            return;
        }

        if (passwordStrength < 3) {
            setMessage("Please use a stronger password (at least 8 characters, mix of cases, numbers & symbols)");
            setIsSuccess(false);
            setTimeout(() => setMessage(""), 3000);
            return;
        }

        setIsLoading(true);
        setMessage("");

        try {
            const res = await axios.post("http://127.0.0.1:8000/api/reset-password", {
                token,
                email: form.email,
                password: form.password,
                password_confirmation: form.password_confirmation
            });

            setMessage(res.data.message);
            setIsSuccess(true);

            setTimeout(() => navigate("/login"), 2000);

        } catch (error) {
            setMessage(error.response?.data?.message || "Reset failed. Please try again.");
            setIsSuccess(false);
            setTimeout(() => setMessage(""), 3000);
        } finally {
            setIsLoading(false);
        }
    };
    5
    return (
        <div className="rp-container">
            <div className="rp-card">
                <div className="rp-header">
                    <div className="rp-icon">
                        <i className="fa-solid fa-lock"></i>
                    </div>
                    <h2>Reset Password</h2>
                    <p className="rp-subtitle">Create a new secure password for your account</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="rp-input-group">
                        <div className="rp-input-field">
                            <i className="fa-solid fa-envelope"></i>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                readOnly
                                className="rp-readonly"
                            />
                            <label className={form.email ? "filled" : ""}>Email Address</label>
                        </div>
                    </div>

                    <div className="rp-input-group">
                        <div className="rp-input-field">
                            <i className="fa-solid fa-key"></i>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                            <label className={form.password ? "filled" : ""}>New Password</label>
                            <button
                                type="button"
                                className="rp-toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {/* <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i> */}
                            </button>
                        </div>


                    </div>

                    <div className="rp-input-group">
                        <div className="rp-input-field">
                            <i className="fa-solid fa-check-double"></i>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="password_confirmation"
                                value={form.password_confirmation}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                            <label className={form.password_confirmation ? "filled" : ""}>Confirm Password</label>
                            <button
                                type="button"
                                className="rp-toggle-password"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {/* <i className={`fa-solid ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i> */}
                            </button>
                        </div>
                        {form.password_confirmation && form.password !== form.password_confirmation && (
                            <div className="rp-error-hint">
                                <i className="fa-solid fa-exclamation-triangle"></i>
                                Passwords do not match
                            </div>
                        )}
                        {form.password_confirmation && form.password === form.password_confirmation && form.password && (
                            <div className="rp-success-hint">
                                <i className="fa-solid fa-check-circle"></i>
                                Passwords match
                            </div>
                        )}
                    </div>

                    <button type="submit" disabled={isLoading} className="rp-submit-btn">
                        {isLoading ? (
                            <>
                                <i className="fa-solid fa-spinner fa-spin"></i>
                                Resetting Password...
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-arrow-right-to-bracket"></i>
                                Reset Password
                            </>
                        )}
                    </button>
                </form>

                {message && (
                    <div className={`rp-message ${isSuccess ? "success" : "error"}`}>
                        <i className={`fa-solid ${isSuccess ? "fa-check-circle" : "fa-exclamation-circle"}`}></i>
                        <p>{message}</p>
                    </div>
                )}

                <div className="rp-footer">
                    <a href="/login" className="rp-back-link">
                        <i className="fa-solid fa-arrow-left"></i>
                        Back to Login
                    </a>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;