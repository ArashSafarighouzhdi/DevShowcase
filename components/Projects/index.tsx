"use client";

import { useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import { HomeProjectType } from "@/lib/supabase/queries";

type ProjectsProps = {
  projects: (HomeProjectType[number] & {
    averageRating: number;
    ratingsCount: number;
  })[];
};

const categories = [
  "All",
  "Frontend",
  "Backend",
  "FullStack",
  "AI & Machine Learning",
  "Other",
];

const Projects = ({ projects }: ProjectsProps) => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  return (
    <section id="projects" className="px-6 py-12">
      <div className="mb-8 flex flex-wrap gap-3 justify-center">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setSelectedCategory(category)}
            className={`rounded-full border  border-blue-100 px-4 py-2 text-sm transition-colors   ${
              selectedCategory === category
                ? "border-primary bg-primary text-white"
                : "hover:border-primary hover:text-primary"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            description={project.description ?? ""}
            category={project.category}
            author={project.author?.username ?? "Unknown"}
            slug={project.slug}
            averageRating={project.averageRating}
            ratingsCount={project.ratingsCount}
            images={project.images}
            avatar={project.author?.avatar ?? null}
          />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <p className="py-8 text-center text-muted">
          No projects found in this category.
        </p>
      )}
    </section>
  );
};

export default Projects;
