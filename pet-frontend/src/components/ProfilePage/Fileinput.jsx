const FileInput = ({ label, id, onChange }) => {
  return (
    <div className='relative w-full'>
      <label
        htmlFor={id}
        className='block text-sm font-medium text-text-light dark:text-text-dark mb-1'
      >
        {label}
      </label>
      <input
        id={id}
        type='file'
        onChange={(e) => onChange(e.target.files[0])}
        className='block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-text-light dark:text-text-dark file:bg-blue-50 dark:file:bg-slate-700 file:border-none file:px-3 file:py-1 file:rounded file:text-blue-600 dark:file:text-blue-300 file:cursor-pointer hover:file:bg-blue-100 dark:hover:file:bg-slate-600 transition-all duration-200 box-border'
      />
    </div>
  );
};

export default FileInput;
