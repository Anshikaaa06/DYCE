"use client";
import React, { useState } from "react";
import {
  ArrowRight,
  Loader,
  Mail,
  MapPin,
} from "lucide-react";
import ProgressBar from "@/components/Progressbar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { axiosClient } from "@/lib/axios-client";

const BRANCHS = [
  "Computer Science and Engineering",
  "Information Technology",
  "Electronics and Communication Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Instrumentation and Control Engineering",
  "Manufacturing Process and Automation Engineering",
  "Biotechnology",
  "Civil Engineering",
  "Mathematics and Computing",
  "Computer Engineering",
  "Artificial Intelligence",
  "Artificial Intelligence and Data Science",
  "Software Engineering",
];

const CampusIdentityPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    branch: "",
    age: 18,
    height: "",
    gender: "male",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.branch || !formData.age || !formData.height) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setIsLoading(true);
    try {
      const resp = await axiosClient.put("/profile", {
        branch: formData.branch,
        age: formData.age,
        height: formData.height,
        gender: formData.gender,
      });
      console.log(resp.data);

      if (resp.status !== 200) {
        toast.error("Failed to update profile. Please try again.");
        return;
      }

      router.push("/profile/campus");
    } catch (error) {
      toast.error(
        "An error occurred while updating your profile. Please try again."
      );
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark text-light px-4 py-6">
      <div className="max-w-md mx-auto">
        <ProgressBar currentStep={1} totalSteps={5} />

        {/* Main Content */}
        <div className="bg-light/5 backdrop-blur-sm rounded-3xl p-6 border border-light/10">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl text-primary mb-2">
              Basic Information
            </h1>
            <p className="text-light/70 text-sm">
              Tell us a bit about yourself to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Branch *
              </label>
              <select
                name="branch"
                id="branch"
                value={formData.branch}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              >
                <option value="" disabled>
                  Select your branch
                </option>
                {BRANCHS.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                <Mail className="w-4 h-4 inline mr-2" />
                Age
              </label>
              <input
                type="number"
                id="age"
                min={16}
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email address"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                <Mail className="w-4 h-4 inline mr-2" />
                Gender
              </label>
              <select
                name="gender"
                id="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="others">Others</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                <MapPin className="w-4 h-4 inline mr-2" />
                Height
              </label>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your height (in cm). Example: 170"
              />
            </div>

            <button
              className="w-full mt-8 py-4 rounded-2xl font-rounded font-medium text-lg transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-emotional text-white hover:shadow-xl hover:scale-105"
              type="submit"
              disabled={!formData.branch || !formData.age || !formData.height || isLoading}
            >
              Continue
              {isLoading ? (
                <Loader className="w-5 h-5 animate-spin inline-block ml-2" />
              ) : (
                <ArrowRight className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CampusIdentityPage;
