import React, { useEffect, useRef, useState } from "react";

const sectionsData = [
  {
    id: 1,
    text: "Section 1",
    bg: "https://picsum.photos/id/412/1920/1080?grayscale",
  },
  {
    id: 2,
    text: "Section 2",
    bg: "https://picsum.photos/id/456/1920/1080?grayscale",
  },
  {
    id: 3,
    text: "Section 3",
    bg: "https://picsum.photos/id/166/1920/1080?grayscale",
  },
  {
    id: 4,
    text: "Section 4",
    bg: "https://picsum.photos/id/172/1920/1080?grayscale",
  },
  {
    id: 5,
    text: "Section 5",
    bg: "https://picsum.photos/id/230/1920/1080?grayscale",
  },
];

function App() {
  const bgRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setCurrentBgIndex] = useState(0);

  // Preload all images and set up hidden backgrounds
  useEffect(() => {
    let loadedCount = 0;
    sectionsData.forEach(({ bg }) => {
      const img = new Image();
      img.src = bg;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === sectionsData.length) {
          setLoading(false);
          // Set initial background
          if (bgRef.current) {
            bgRef.current.style.backgroundImage = `url('${sectionsData[0].bg}')`;
          }
        }
      };
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionIndex = sectionRefs.current.findIndex(
              (ref) => ref === entry.target
            );
            if (sectionIndex !== -1 && bgRef.current) {
              setCurrentBgIndex(sectionIndex);
              bgRef.current.style.backgroundImage = `url('${sectionsData[sectionIndex].bg}')`;
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden font-manrope">
      {loading && (
        <div className="fixed inset-0 z-[1000] bg-black/60 flex items-center justify-center">
          <div className="w-[60px] h-[60px] border-8 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}

      {/* Main visible background */}
      <div
        ref={bgRef}
        className="fixed top-0 left-0 w-full h-full -z-10 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
      />

      {/* Hidden image preloaders */}
      <div className="hidden">
        {sectionsData.map((section) => (
          <img
            key={`preload-${section.id}`}
            src={section.bg}
            alt=""
            aria-hidden="true"
          />
        ))}
      </div>

      {sectionsData.map((section, idx) => (
        <div
          key={section.id}
          ref={(el) => {
            sectionRefs.current[idx] = el;
          }}
          data-bg={section.bg}
          className="h-screen flex items-center justify-center text-4xl text-white text-shadow bg-black/40"
        >
          {section.text}
        </div>
      ))}
    </div>
  );
}

export default App;
