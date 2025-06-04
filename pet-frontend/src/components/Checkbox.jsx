export default function Checkbox({ id, checked, onChange, label }) {
  return (
    <div className='flex items-center space-x-2'>
      <input
        id={id}
        type='checkbox'
        checked={checked}
        onChange={onChange}
        className='h-4 w-4 accent-primary dark:accent-primary-dark focus:ring-primary border-gray-300 rounded'
      />
      <label
        htmlFor={id}
        className='text-sm text-text-light dark:text-text-dark font-normal'
      >
        {label || (
          <>
            I agree to the{" "}
            <a
              href='/terms'
              className='text-primary dark:text-primary-dark font-medium underline hover:text-primary-dark'
            >
              Terms and Conditions
            </a>
          </>
        )}
      </label>
    </div>
  );
}
