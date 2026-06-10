import { useState } from "react";
import axios from "axios";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        try {
            const res = await axios.post("http://127.0.0.1:8000/api/forgot-password", {
                email
            });

            setMessage(res.data.message);
            setIsSuccess(true);
            setEmail("");

        } catch (error) {
            setMessage(error.response?.data?.message || "Something went wrong");
            setIsSuccess(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-card">
                {/* <button
                    onClick={() => window.history.back()}
                    className="back-button"
                >

                    <i className="fa-solid fa-arrow-left"></i>
                    Back
                </button> */}

                <div className="icon-wrapper">
                    <i className="fa-solid fa-envelope"></i>
                </div>

                <h2>Forgot Password?</h2>
                <p className="subtitle">
                    No worries! Enter your email address and we'll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="reset-form">
                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                            className="email-input"
                        />
                    </div>

                    <button
                        type="submit"
                        className={`submit-button ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner"></span>
                                Sending...
                            </>
                        ) : (
                            'Send Reset Link'
                        )}
                    </button>
                </form>

                {message && (
                    <div className={`message ${isSuccess ? 'success' : 'error'}`}>
                        {isSuccess ? <i className="fa-solid fa-circle-check"></i> : <i className="fa-solid fa-circle-exclamation"></i>}
                        <p>{message}</p>
                    </div>
                )}

                <div className="login-link">
                    <p>Remember your password? <a href="/login">Back to Login</a></p>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;