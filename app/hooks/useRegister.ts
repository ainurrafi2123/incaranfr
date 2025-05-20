import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export function useRegister() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    agreeTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (!formData.agreeTerms) {
      setError("You must agree to the Terms of Service & Privacy Policy");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "user",
      });

      setSuccess(response.data.message || "Registration successful!");
      setFormData({
        name: "",
        email: "",
        password: "",
        agreeTerms: false,
      });

      router.push("/login");
    } catch (err) {
      setError(
        (err as any).response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    error,
    success,
    handleChange,
    handleSubmit,
  };
}
