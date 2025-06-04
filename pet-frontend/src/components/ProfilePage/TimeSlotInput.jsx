const TimeSlotInput = ({ day, slots, onChange, errors }) => {
  const handleTimeChange = (index, field, value) => {
    const updatedSlots = [...slots];
    updatedSlots[index] = { ...updatedSlots[index], [field]: value };
    onChange(updatedSlots);
  };

  // const addSlot = () => {
  //   onChange([...slots, { from: "", to: "" }]);
  // };

  return (
    <div className='border border-gray-300 dark:border-slate-600 rounded-lg p-4 bg-gray-50 dark:bg-slate-700 shadow-sm w-full box-border'>
      <h4 className='text-sm font-semibold text-text-light dark:text-text-dark mb-2'>
        Availble Time on {day} 
      </h4>
      {slots.map((slot, index) => (
        <div
          key={index}
          className='flex items-center gap-3 mt-2 w-full flex-wrap'
        >
          <input
            type='time'
            value={slot.from}
            onChange={(e) => handleTimeChange(index, "from", e.target.value)}
            className={`flex-1 min-w-[100px] max-w-[150px] px-2 py-1 rounded-md border ${
              errors[`time_${day}_${index}`]
                ? "border-red-500"
                : "border-gray-300 dark:border-slate-600"
            } focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-900 text-text-light dark:text-text-dark transition-all duration-200 box-border`}
            aria-invalid={errors[`time_${day}_${index}`] ? "true" : "false"}
            aria-describedby={
              errors[`time_${day}_${index}`]
                ? `time_${day}_${index}-error`
                : undefined
            }
          />
          <input
            type='time'
            value={slot.to}
            onChange={(e) => handleTimeChange(index, "to", e.target.value)}
            className={`flex-1 min-w-[100px] max-w-[150px] px-2 py-1 rounded-md border ${
              errors[`time_${day}_${index}`]
                ? "border-red-500"
                : "border-gray-300 dark:border-slate-600"
            } focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-900 text-text-light dark:text-text-dark transition-all duration-200 box-border`}
            aria-invalid={errors[`time_${day}_${index}`] ? "true" : "false"}
            aria-describedby={
              errors[`time_${day}_${index}`]
                ? `time_${day}_${index}-error`
                : undefined
            }
          />
          {errors[`time_${day}_${index}`] && (
            <p
              id={`time_${day}_${index}-error`}
              className='text-red-600 dark:text-red-400 mt-1 text-sm flex items-center break-words w-full'
            >
              <svg
                className='w-4 h-4 mr-1'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                  clipRule='evenodd'
                />
              </svg>
              {errors[`time_${day}_${index}`]}
            </p>
          )}
        </div>
      ))}
      {/* <button
        type='button'
        onClick={addSlot}
        className='mt-3 text-sm px-3 py-1 rounded bg-blue-600 text-white hover:bg-primary-700 font-semibold shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500'
      >
        + Add Slot
      </button> */}
    </div>
  );
};

export default TimeSlotInput;
