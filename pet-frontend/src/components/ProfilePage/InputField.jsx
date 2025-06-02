const InputField = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  error,
  required,
  placeholder,
  rows,
  min,
}) => {
  return (
    <div className='relative w-full'>
      <label
        htmlFor={id}
        className='block text-sm font-medium text-text-light dark:text-text-dark mb-1'
      >
        {label} {required && <span className='text-red-500'>*</span>}
      </label>
      {type === "textarea" ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className={`w-full px-3 py-2 rounded-md border ${
            error ? "border-red-500" : "border-gray-300 dark:border-slate-600"
          } focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-900 text-text-light dark:text-text-dark placeholder-gray-400 dark:placeholder-slate-500 transition-all duration-200 box-border`}
          placeholder={placeholder}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
          required={required}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) =>
            onChange(
              type === "number" ? parseInt(e.target.value) : e.target.value
            )
          }
          min={min}
          className={`w-full px-3 py-2 rounded-md border ${
            error ? "border-red-500" : "border-gray-300 dark:border-slate-600"
          } focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-900 text-text-light dark:text-text-dark placeholder-gray-400 dark:placeholder-slate-500 transition-all duration-200 box-border`}
          placeholder={placeholder}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
          required={required}
        />
      )}
      {error && (
        <p
          id={`${id}-error`}
          className='text-red-600 dark:text-red-400 mt-1 text-sm flex items-center break-words w-full'
        >
          <svg className='w-4 h-4 mr-1' fill='currentColor' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
              clipRule='evenodd'
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;
