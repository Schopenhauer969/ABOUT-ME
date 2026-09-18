import React from "react";
import "./Navbar.css";

const Navbar = ({ sections, active, onNavigate }) => {
  return (
    <nav className="navbar">
      <div className="nav-logo">PORTFOLIO</div>

      <ul className="nav-links">
        {sections.map((section, index) => {
          // Extract title from section content or fallback to slide number
          const label = section.title || `Slide ${index + 1}`;
          const isActive = active === index;

          return (
            <li key={section.id || index}>
              <button
                onClick={() => onNavigate(index)}
                className={`nav-link ${isActive ? "active" : ""}`}
                aria-label={`Navigate to ${label}`}
              >
                {label}
                <span className="nav-indicator" />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navbar;
