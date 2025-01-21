import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Api from "../api/index";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!username || !password || !confirmPassword) {
            toast.error("All fields are required!");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        try {
            setLoading(true);
            const response = await Api.registerUser({ username, password });
            toast.success("Registration Successful! Redirecting to Login...");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration Failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-lg shadow-md w-96">
                <h2 className="text-white text-2xl font-bold text-center mb-6">Register</h2>
                <form onSubmit={handleRegister}>
                    <div className="mb-4">
                        <label className="text-gray-300 block mb-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-orange-500"
                            placeholder="Enter username"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="text-gray-300 block mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-orange-500"
                            placeholder="Enter password"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="text-gray-300 block mb-1">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-orange-500"
                            placeholder="Confirm password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold hover:opacity-80 transition"
                        disabled={loading}
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>
                <p className="text-gray-400 text-center mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="text-orange-400 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
