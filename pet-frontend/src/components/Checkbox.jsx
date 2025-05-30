export default function Checkbox({ label, id, onChange }) {
  return (
    <label className='flex items-center space-x-2 text-sm text-text-light dark:text-text-dark'>
      <input
        id={id}
        type='checkbox'
        className='accent-primary dark:accent-primary-dark'
        onChange={onChange}
      />
      <span>
        I agree to the{" "}
        <a
          href='#'
          className='text-primary dark:text-primary-dark font-medium underline'
        >
          Terms and Conditions
        </a>
      </span>
    </label>
  );
}
