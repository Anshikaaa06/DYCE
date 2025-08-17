import { FiltersType } from "@/app/(protected)/matching/page";
import { PERSONALITY_TYPES } from "@/constants/campus_options";
import { X } from "lucide-react";
import React from "react";

const FilterModal = ({
  filters,
  setFilters,
  setShowFilters,
}: {
  filters: FiltersType;
  setFilters: React.Dispatch<React.SetStateAction<FiltersType>>;
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <>
      <div className="fixed inset-0 bg-dark/90 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-light/5 backdrop-blur-sm rounded-3xl p-6 border border-light/10 max-w-md mx-4 w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl text-primary">
              Refine Your Vibe
            </h2>
            <button
              onClick={() => setShowFilters(false)}
              className="p-2 hover:bg-light/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* College Filter */}
            <div>
              <label className="block text-light/80 font-medium mb-2">
                College
              </label>
              <select
                value={filters.college}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, college: e.target.value }))
                }
                className="w-full p-3 bg-light/10 border border-light/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-light"
              >
                <option value="">All Colleges</option>
                <option value="NSUT">NSUT</option>
                <option value="IGDTUW">IGDTUW</option>
              </select>
            </div>

            {/* Age Range */}
            <div>
              <label className="block text-light/80 font-medium mb-2">
                Age Range: {filters.ageRange[0]} - {filters.ageRange[1]}
              </label>
              <div className="flex gap-4">
                <input
                  type="range"
                  min="18"
                  max="30"
                  value={filters.ageRange[0]}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      ageRange: [parseInt(e.target.value), prev.ageRange[1]],
                    }))
                  }
                  className="flex-1"
                />
                <input
                  type="range"
                  min="18"
                  max="30"
                  value={filters.ageRange[1]}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      ageRange: [prev.ageRange[0], parseInt(e.target.value)],
                    }))
                  }
                  className="flex-1"
                />
              </div>
            </div>

            {/* Interests */}
            <div>
              <label className="block text-light/80 font-medium mb-2">
                Personality
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PERSONALITY_TYPES.map((type, ind) => {
                  const isSelected = filters.personality.includes(type.id);

                  return (
                    <button
                      key={ind}
                      onClick={() => {
                        setFilters((prev) => ({
                          ...prev,
                          personality: isSelected
                            ? prev.personality.filter((id) => id !== type.id)
                            : [...prev.personality, type.id],
                        }));
                      }}
                      className={`p-2 rounded-2xl text-sm font-rounded transition-colors ${
                        isSelected
                          ? "bg-primary/20 text-primary border border-primary/40"
                          : "bg-light/10 text-light/70 border border-light/20"
                      }`}
                    >
                      {type.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() =>
                setFilters({
                  college: "",
                  ageRange: [18, 25],
                  personality: [],
                })
              }
              className="flex-1 py-3 bg-light/10 rounded-2xl text-light/70 font-rounded"
            >
              Reset Filters
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="flex-1 py-3 bg-gradient-to-r from-primary to-emotional rounded-2xl text-white font-rounded"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterModal;
