import { FcGoogle } from "react-icons/fc";

export default function GoogleAuthButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className='w-full flex items-center justify-center border border-primary rounded-lg py-3 space-x-3
                 hover:bg-primary/10 dark:hover:bg-primary/20 transition'
    >
      <FcGoogle className='text-xl' />
      <span className='text-text-light dark:text-text-dark font-medium'>
        Sign up with Google
      </span>
    </button>
  );
}
