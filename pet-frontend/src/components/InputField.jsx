export default function InputField({ type = "text", placeholder, name }) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      className='w-full px-4 py-3 rounded-lg bg-primary/10 dark:bg-primary/20 
                 text-text-light dark:text-text-dark placeholder:text-gray-500 
                 focus:outline-none focus:ring-2 focus:ring-primary transition'
    />
  );
}
