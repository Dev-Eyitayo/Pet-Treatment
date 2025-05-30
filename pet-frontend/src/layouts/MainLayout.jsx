import Navigation from "../components/Navigation";
import ThemeToggle from "../components/ThemeToggle";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark transition-colors duration-300 flex">
      <Navigation />

      <main className="flex-1 md:ml-64 pt-4 pb-20 md:pb-4 px-4">
        <div className="fixed top-4 right-4 z-50">
          {/* <ThemeToggle /> */}
        </div>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
