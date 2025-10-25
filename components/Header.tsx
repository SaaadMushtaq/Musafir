import { cn } from "lib/utils";
import { useLocation } from "react-router";

const Header = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  const location = useLocation();
  return (
    <header className="header">
      <article>
        <h1
          className={cn(
            "text-dark-100",
            location.pathname === "/"
              ? "text-2xl md:4xl font-bold"
              : "text-xl md:text-2xl font-semibold"
          )}
        >
          {title}
        </h1>
        <p
          className={cn(
            "text-dark-100 font-normal",
            location.pathname === "/"
              ? "text-base md:text-lg"
              : "text-sm md:text-base"
          )}
        >
          {description}
        </p>
      </article>
    </header>
  );
};

export default Header;
