// @ts-nocheck
import { Button } from '@/components/ui/button';
import { useFirebase } from '@/Services/context';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/Services/Firebase.config';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, gooleSignIn, user, loading } = useFirebase();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  const email = watch('email');
  if (user) {
    navigate('/');
  }

  const onSubmit = async (data) => {
    await signIn(data.email, data.password);
  };

  const handleForgotPassword = async () => {
    if (!email) return toast.error('Please enter your email to reset password.');
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent!');
    } catch (error) {
      console.error('Error sending reset email:', error);
      alert('Failed to send reset email');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Welcome Back</h2>

        {/* Google Sign In */}
        <button
          className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-xl py-2 hover:bg-gray-100 transition cursor-pointer"
          onClick={gooleSignIn}
        >
          <FcGoogle className="text-xl" />
          <span className="text-sm font-medium text-gray-700">Sign in with Google</span>
        </button>

        <div className="flex items-center gap-4">
          <hr className="flex-1 border-gray-300" />
          <span className="text-gray-400 text-sm">or</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Email and Password Form */}
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Enter a valid email'
                }
              })}
              className="w-full px-4 py-2 mt-1 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              className="w-full px-4 py-2 mt-1 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <div className="text-right">
            <button type="button" onClick={handleForgotPassword} className="text-sm text-blue-500 hover:underline">
              Forgot password?
            </button>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <Button type="submit" className="bg-green-400 cursor-pointer hover:bg-green-300" disabled={loading}>
              {loading ? (
                <div className="animate-spin">
                  <img src="/loader2.svg" className="w-3 h-3" />
                </div>
              ) : (
                'Login'
              )}
            </Button>
            <p className="cursor-pointer text-sm text-gray-600 hover:underline" onClick={() => navigate('/register')}>
              Sign Up?
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
