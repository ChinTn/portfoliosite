import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GithubRepos = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch top 6 recently updated public repositories
    axios.get('https://api.github.com/users/ChinTn/repos?sort=updated&per_page=6')
      .then(res => {
        setRepos(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching GitHub repos:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return null;

  return (
    <section className="pb-24 px-6">
      <div className="max-w-5xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-text-main mt-10 mb-8 border-l-4 border-highlight pl-4">
          Latest Repositories
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repos.map(repo => (
            <a 
              key={repo.id} 
              href={repo.html_url} 
              target="_blank" 
              rel="noreferrer"
              className="bg-card-bg-light border border-border-dim p-6 flex flex-col group hover:border-highlight/50 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-highlight to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-highlight group-hover:text-text-main transition-colors truncate pr-4">
                  {repo.name}
                </h3>
                <i className="fab fa-github text-text-dim text-xl group-hover:text-highlight transition-colors"></i>
              </div>
              
              <p className="text-text-dim text-sm mb-6 flex-grow line-clamp-3">
                {repo.description || "No description provided."}
              </p>
              
              <div className="flex items-center gap-4 text-xs font-medium text-text-dim/80 mt-auto pt-4 border-t border-border-dim/50">
                {repo.language && (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-highlight"></span>
                    {repo.language}
                  </span>
                )}
                <span className="flex items-center gap-1 hover:text-highlight transition-colors">
                  <i className="fas fa-star"></i> {repo.stargazers_count}
                </span>
                <span className="flex items-center gap-1 hover:text-highlight transition-colors">
                  <i className="fas fa-code-branch"></i> {repo.forks_count}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GithubRepos;
