import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Navbar from "./components/Navbar";
import Me from "./assets/heng.jpg";
import "./App.css";
import FolderFloat from "./components/FolderFloat";
const sections = [
  {
    id: "sec-1",
    title: "Home",
    content: (
      <div className="section section-1">
        <div className="profile">
          <div>hi</div>
          <p>hi</p>
        </div>
      </div>
    ),
  },
  {
    id: "sec-2",
    title: "Rewards",
    content: (
      <div className="section section-2">
        <FolderFloat
          items={[
            "Try a warmer palette",
            "Tighten the spacing",
            "Logo feels small",
            "Love the new hero",
          ]}
          label="Design feedback"
          sublabel="4 notes"
          trigger="none" // <-- Changed from "hover" to autoplay on screen view
          defaultOpen={true} // <-- Ensures it opens when intersecting the viewport
          closeOnSelect={false}
          physics
          drift={0.5}
          onSelect={(value, index) => console.log(value, index)}
          folderColor="#3f3f46"
          frontColor="#52525b"
          paperColor="#f5f5f5"
          itemColor="#f5f5f5"
          itemTextColor="#18181b"
          labelColor="#f5f5f5"
          width={200}
          height={148}
          radius={14}
          spread={180}
          lift={26}
          tilt={8}
          flapAngle={34}
          restAngle={16}
          openDuration={520}
          stagger={45}
          bounce={0.3}
        />
      </div>
    ),
  },
  {
    id: "sec-3",
    title: "Intro",
    content: (
      <div className="section section-3">
        <h1>Intro</h1>
        <p>This is the third section.</p>
      </div>
    ),
  },
  {
    id: "sec-4",
    title: "Section 4",
    content: (
      <div className="section section-4">
        <h1>Section 4</h1>
        <p>This is the fourth section.</p>
      </div>
    ),
  },
  {
    id: "sec-5",
    title: "Section 5",
    content: (
      <div className="section section-5">
        <h1>Section 5</h1>
        <p>This is the fifth section.</p>
      </div>
    ),
  },
];

function App() {
  const [active, setActive] = useState(0);
  const currentIndex = useRef(0);
  const isAnimating = useRef(false);
  const containerRef = useRef(null);

  // Velocity & Touch refs
  const prevDeltaY = useRef(0);
  const touchStartY = useRef(0);

  const slideTo = (index) => {
    const target = Math.max(0, Math.min(sections.length - 1, index));

    if (target === currentIndex.current || isAnimating.current) return;

    isAnimating.current = true;
    currentIndex.current = target;
    setActive(target);

    // Fast, responsive GPU transition (0.15s)
    gsap.to(containerRef.current, {
      yPercent: -100 * target,
      duration: 0.15,
      ease: "power2.out",
      overwrite: "all",
      onComplete: () => {
        isAnimating.current = false;
      },
    });
  };

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();

      const absDelta = Math.abs(e.deltaY);

      if (absDelta < 4) return;

      const isAccelerating = absDelta >= Math.abs(prevDeltaY.current);
      prevDeltaY.current = e.deltaY;

      if ((isAccelerating || absDelta > 20) && !isAnimating.current) {
        if (e.deltaY > 0) {
          slideTo(currentIndex.current + 1);
        } else {
          slideTo(currentIndex.current - 1);
        }
      }
    };

    const handleTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (isAnimating.current) return;
      const touchEndY = e.touches[0].clientY;
      const deltaY = touchStartY.current - touchEndY;

      if (Math.abs(deltaY) > 15) {
        if (deltaY > 0) {
          slideTo(currentIndex.current + 1);
        } else {
          slideTo(currentIndex.current - 1);
        }
        touchStartY.current = touchEndY;
      }
    };

    const handleKeyDown = (e) => {
      if (["ArrowDown", "PageDown"].includes(e.key)) {
        slideTo(currentIndex.current + 1);
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        slideTo(currentIndex.current - 1);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="viewport">
      <Navbar sections={sections} active={active} onNavigate={slideTo} />

      <div className="sliding-container" ref={containerRef}>
        {sections.map((s, i) => (
          <section key={s.id || i} className="slide">
            {s.content}
          </section>
        ))}
      </div>
    </div>
  );
}

export default App;
