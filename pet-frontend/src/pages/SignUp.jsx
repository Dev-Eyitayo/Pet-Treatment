import InputField from "../components/InputField";
import Checkbox from "../components/CheckBox";
import Button from "../components/Button";
import GoogleAuthButton from "../components/GoogleAuthButton";

export default function SignUp() {
  return (
    <div className='min-h-screen bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark flex items-center justify-center px-4 transition-colors duration-300'>
      <div className='max-w-md w-full space-y-6'>
        <div className='text-center'>
          {/* Show image only on small/mobile devices */}
          <img
            src='/signup-graphic.png'
            alt='Header Art'
            className='w-full rounded-md mb-4 block md:hidden'
          />
          <h2 className='text-2xl font-bold text-text-light dark:text-text-dark'>
            Sign up to continue
          </h2>
        </div>

        <form className='space-y-4'>
          <InputField
            placeholder='Enter your email'
            name='email'
            type='email'
          />
          <InputField placeholder='First Name' name='firstName' />
          <InputField placeholder='Last Name' name='lastName' />
          <InputField placeholder='Password' name='password' type='password' />

          <Checkbox id='terms' />

          <Button type='submit' label='Create Account' />
        </form>

        <div className='flex items-center justify-center'>
          <span className='text-sm text-text-light dark:text-text-dark opacity-70'>
            or
          </span>
        </div>

        <GoogleAuthButton onClick={() => console.log("Google signup")} />

        <p className='text-center text-sm text-text-light dark:text-text-dark opacity-70'>
          Already have an account?{" "}
          <a
            href='/login'
            className='text-primary font-medium dark:text-primary-dark'
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
