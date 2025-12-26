import { useState } from "react";
import { FaEye, FaEyeSlash, FaGoogle, FaApple, FaFacebookF } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { cn } from "../../components/lib/utils";
import "./Signup.css";
import { useAuth } from "./AuthContext";

const ElegantShape = ({ className, delay = 0, width = 400, height = 100, rotate = 0, gradient = "from-white/[0.08]" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
      animate={{ opacity: 1, y: 0, rotate: rotate }}
      transition={{ duration: 2.4, delay, ease: [0.23, 0.86, 0.39, 0.96], opacity: { duration: 1.2 } }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        style={{ width, height }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-white/[0.15]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]",
          )}
        />
      </motion.div>
    </motion.div>
  );
};

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userData = {
      username,
      email,
      password,
      role
    };
    try {
      const BaseURL = import.meta.env.VITE_BASE_API_URL;
      if (!BaseURL) {
        toast.error("API URL not configured. Please check your environment variables.");
        setLoading(false);
        return;
      }
      
      console.log('Attempting signup with:', { email: userData.email, username: userData.username, role: userData.role });
      console.log('API URL:', BaseURL);
      
      const res = await axios.post(`${BaseURL}/user/signup`, userData, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });
      
      const data = res.data;
      console.log('Signup response:', { status: res.status, data });
      
      // Check for success - handle both 200 and 201 status codes
      if ((res.status === 200 || res.status === 201) && data.status === "success" && data.token) {
        // Assuming backend returns { token, user, expiresIn, status }
        login(data.user, data.token, data.expiresIn || 3600);
        toast.success("Account created successfully!");
        setTimeout(() => {
          navigate("/app");
        }, 500);
      } else {
        // Handle error response even with 200 status
        const errorMsg = data.message || "Signup failed. Please try again.";
        console.error('Signup failed:', errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error('Signup Error Details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      
      let errorMessage = "An error occurred. Please try again.";
      
      if (err.response) {
        // Server responded with error status
        errorMessage = err.response.data?.message || err.response.data?.error || 
                      `Server error: ${err.response.status} ${err.response.statusText}`;
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = "Unable to connect to server. Please check if the backend is running on " + 
                      (import.meta.env.VITE_BASE_API_URL || "http://localhost:8084");
      } else {
        // Error in request setup
        errorMessage = err.message || "Network error. Please check your connection.";
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#030303] text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />
      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-indigo-500/[0.15]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />
        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-rose-500/[0.15]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />
        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-violet-500/[0.15]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />
        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-amber-500/[0.15]"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md transform transition-all">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-indigo-500/20 to-rose-500/20 rounded-3xl p-8 backdrop-blur-lg border border-white/10"
          >
            <div className="text-center space-y-2">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white to-rose-300"
              >
                Create Account
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-white/70 text-sm"
              >
                Join us to start your professional journey
              </motion.p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 mt-8">
              <div className="space-y-4">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="relative"
                >
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 rounded-lg text-white placeholder-white/50 border border-white/10 focus:border-white/20 transition-colors"
                    placeholder="Username"
                    required
                  />
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="relative"
                >
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 rounded-lg text-white placeholder-white/50 border border-white/10 focus:border-white/20 transition-colors"
                    placeholder="Email address"
                    required
                  />
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="relative"
                >
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 rounded-lg text-white placeholder-white/50 border border-white/10 focus:border-white/20 transition-colors"
                    placeholder="Password"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                  >
                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="relative"
                >
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 rounded-lg text-white placeholder-white/50 border border-white/10 focus:border-white/20 transition-colors"
                    required
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </motion.div>
                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-500 to-rose-500 text-white font-semibold py-3 px-4 rounded-lg disabled:opacity-50 transition-all"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  disabled={loading}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                >
                  {loading ? "Creating Account..." : "Sign Up"}
                </motion.button>
              </div>
            </form>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="my-6 text-center"
            >
              <span className="text-white/50">Or sign up with</span>
              <div className="flex justify-center space-x-4 mt-4">
                <motion.button
                  className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaGoogle className="w-5 h-5" />
                </motion.button>
                <motion.button
                  className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaApple className="w-5 h-5" />
                </motion.button>
                <motion.button
                  className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaFacebookF className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="mt-6 text-center text-white/70"
            >
              Already have an account?{" "}
              <span onClick={() => navigate("/login")} className="text-white cursor-pointer hover:underline">
                Log in
              </span>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;