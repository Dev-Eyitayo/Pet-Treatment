export default function Button({ label, onClick, type = "button", disabled }) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className='w-full bg-primary dark:bg-primary-dark text-white py-3 rounded-lg font-semibold
                 hover:bg-primary-dark dark:hover:bg-primary transition disabled:opacity-50'
    >
      {label}
    </button>
  );
}
