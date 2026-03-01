import { useState } from 'react'
import api from '../../api'
import {useNavigate} from 'react-router-dom'

function Register() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        username: '',
        email : '',
        password: "",
        password2 : "",
        role : "",
    })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]:e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true)

        if(formData.password !== formData.password2){
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            await api.post('/accounts/register/', {
                username : formData.username,
                email: formData.email,
                password : formData.password,
                role : formData.role,
            });

            navigate('/login');
        }catch(err){
            console.log("FULL ERROR:", err);
            console.log("TYPE:", typeof err);
            console.log("ERR KEYS:", Object.keys(err || {}));

            setError("Test error message");
        }finally{
            setLoading(false);
        }
    }
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Create Account
                </h2>

                {error && (
                    <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
                        {String(error)}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1">Role</label>
                        <select 
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className='w-full border px-3 py-2 rounded'
                        >
                            <option value="">Select Role</option>
                            <option value="Applicant">Job Seeker</option>
                            <option value="Recruiter">Recruiter</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1">Confirm Password</label>
                        <input
                            type="password"
                            name="password2"
                            value={formData.password2}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <span
                        onClick={() => navigate("/login")}
                        className="text-blue-600 cursor-pointer"
                    >
                        Login
                    </span>
                </p>
            </div>
        </div>
    </>
  )
}

export default Register
