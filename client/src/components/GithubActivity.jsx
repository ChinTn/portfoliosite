import React from 'react';
import { GitHubCalendar } from 'react-github-calendar';

import { useTheme } from '../context/ThemeContext';

const GithubActivity = () => {
  const { theme } = useTheme();

  // Theme colors perfectly mapped to our site's aesthetic
  // Index 0 is 'no contributions', Index 4 is 'max contributions'
  const darkBlue = ['#3c3c3c', '#3d4070', '#4355a6', '#506fe8', '#6590ff'];
  const evilRed = ['#2a0000', '#5c0000', '#990000', '#cc0000', '#ff0000'];
  const lightBlue = ['#e4e4e7', '#93c5fd', '#60a5fa', '#3b82f6', '#1d4ed8']; // White/Light grey empty cells, blue blocks

  let activeColors = darkBlue;
  if (theme === 'evil') activeColors = evilRed;
  if (theme === 'light') activeColors = lightBlue;

  const explicitTheme = {
    light: activeColors,
    dark: activeColors,
  };

  return (
    <section className="py-24 px-6 border-t border-border-main">
      <div className="max-w-5xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-text-main mt-10 mb-8 border-l-4 border-highlight pl-4">
          GitHub <span className="text-[#fde68a]">Contributions</span>
        </h2>
        
        <div className="w-full flex flex-col p-4 md:p-6 overflow-hidden">
          <div className="w-full overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden" dir="rtl">
            <div dir="ltr" className="inline-block min-w-max">
              <GitHubCalendar 
                username="ChinTn" 
                blockSize={14}
                blockMargin={5}
                colorScheme="dark"
                theme={explicitTheme}
                fontSize={14}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GithubActivity;
