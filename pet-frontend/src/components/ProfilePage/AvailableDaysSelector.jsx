const AvailableDaysSelector = ({
  selectedDays,
  onChange,
  error,
  daysOfWeek,
}) => {
  const toggleDay = (day) => {
    const updated = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    onChange(updated);
  };

  return (
    <div className='relative w-full'>
      <h3 className='text-sm font-medium text-text-light dark:text-text-dark mb-2'>
        Available Days <span className='text-red-500'>*</span>
      </h3>
      <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
        {daysOfWeek.map((day) => (
          <label
            key={day}
            className='flex items-center space-x-2 text-text-light dark:text-text-dark text-sm'
          >
            <input
              type='checkbox'
              checked={selectedDays.includes(day)}
              onChange={() => toggleDay(day)}
              className='w-4 h-4 rounded border-gray-300 dark:border-slate-600 focus:ring-primary-500 bg-white dark:bg-slate-900 text-primary-500 transition-all duration-200'
            />
            <span>{day}</span>
          </label>
        ))}
      </div>
      {error && (
        <p
          id='available_days-error'
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

export default AvailableDaysSelector;
