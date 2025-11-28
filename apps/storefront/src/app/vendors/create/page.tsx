"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Building2, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface RegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface VendorData {
  businessName: string;
  businessType: string;
  description: string;
  contactPhone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export default function CreateVendorPage() {
  const [step, setStep] = useState(1); // 1: Registration, 2: Vendor Profile
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [vendorData, setVendorData] = useState<VendorData>({
    businessName: "",
    businessType: "",
    description: "",
    contactPhone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegistrationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegistrationData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVendorChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setVendorData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate passwords match
    if (registrationData.password !== registrationData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: registrationData.email,
          password: registrationData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user ID for next step
        setToken(data.token);
        setUserId(data.user.id);
        setStep(2);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVendorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3002/vendor/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(vendorData),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to vendor-portal admin with vendor ID
        window.location.href = `http://localhost:3003/vendors/${data.vendor.id}/admin?token=${token}`;
      } else {
        if (response.status === 401) {
          setError("Authentication failed. Please try again.");
          setStep(1);
        } else {
          setError(data.message || "Failed to create vendor profile");
        }
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 px-8 py-10 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              {step === 1 ? "Create Your Account" : "Set Up Your Business"}
            </h1>
            <p className="text-indigo-100 text-lg">
              {step === 1
                ? "Start your journey as a vendor on our platform"
                : "Tell us about your business to complete setup"}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="bg-slate-50 border-b border-slate-200 px-8 py-4">
            <div className="flex items-center justify-center space-x-4">
              <div className={`flex items-center ${step >= 1 ? "text-indigo-600" : "text-slate-400"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  step >= 1 ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-300"
                }`}>
                  {step > 1 ? <CheckCircle2 className="h-5 w-5" /> : "1"}
                </div>
                <span className="ml-2 text-sm font-semibold">Account</span>
              </div>
              <div className={`w-16 h-0.5 ${step >= 2 ? "bg-indigo-600" : "bg-slate-300"}`}></div>
              <div className={`flex items-center ${step >= 2 ? "text-indigo-600" : "text-slate-400"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  step >= 2 ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-300"
                }`}>
                  2
                </div>
                <span className="ml-2 text-sm font-semibold">Business</span>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12">
            {step === 1 ? (
              <form onSubmit={handleRegistrationSubmit} className="space-y-6 max-w-md mx-auto">
                <div className="space-y-4">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    label="Email Address"
                    placeholder="your@email.com"
                    value={registrationData.email}
                    onChange={handleRegistrationChange}
                    required
                  />

                  <Input
                    id="password"
                    name="password"
                    type="password"
                    label="Password"
                    placeholder="Create a strong password"
                    value={registrationData.password}
                    onChange={handleRegistrationChange}
                    required
                  />

                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    value={registrationData.confirmPassword}
                    onChange={handleRegistrationChange}
                    required
                  />
                </div>

                {error && (
                  <div className="text-red-600 text-sm bg-red-50 p-4 rounded-lg border border-red-100">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  isLoading={loading}
                >
                  Continue to Business Setup <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                
                <p className="text-center text-sm text-slate-500 mt-4">
                  Already have an account? <a href="/login" className="text-indigo-600 hover:underline font-medium">Sign in</a>
                </p>
              </form>
            ) : (
              <form onSubmit={handleVendorSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    id="businessName"
                    name="businessName"
                    label="Business Name"
                    placeholder="Your business name"
                    value={vendorData.businessName}
                    onChange={handleVendorChange}
                    required
                  />
                  <Input
                    id="businessType"
                    name="businessType"
                    label="Business Type"
                    placeholder="e.g., Retail, Manufacturing"
                    value={vendorData.businessType}
                    onChange={handleVendorChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium leading-6 text-slate-900 mb-1.5">
                    Business Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Tell us about your business..."
                    value={vendorData.description}
                    onChange={handleVendorChange}
                    rows={4}
                    className="block w-full rounded-lg border-0 py-2.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all duration-200"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    type="tel"
                    label="Contact Phone"
                    placeholder="+1 (555) 000-0000"
                    value={vendorData.contactPhone}
                    onChange={handleVendorChange}
                  />
                  <Input
                    id="address"
                    name="address"
                    label="Street Address"
                    placeholder="123 Business St"
                    value={vendorData.address}
                    onChange={handleVendorChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Input
                    id="city"
                    name="city"
                    label="City"
                    placeholder="City"
                    value={vendorData.city}
                    onChange={handleVendorChange}
                    required
                  />
                  <Input
                    id="state"
                    name="state"
                    label="State"
                    placeholder="State"
                    value={vendorData.state}
                    onChange={handleVendorChange}
                    required
                  />
                  <Input
                    id="zipCode"
                    name="zipCode"
                    label="ZIP Code"
                    placeholder="12345"
                    value={vendorData.zipCode}
                    onChange={handleVendorChange}
                    required
                  />
                  <Input
                    id="country"
                    name="country"
                    label="Country"
                    placeholder="Country"
                    value={vendorData.country}
                    onChange={handleVendorChange}
                    required
                  />
                </div>

                {error && (
                  <div className="text-red-600 text-sm bg-red-50 p-4 rounded-lg border border-red-100">
                    {error}
                  </div>
                )}

                <div className="flex gap-4 pt-4 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    isLoading={loading}
                  >
                    Complete Setup <CheckCircle2 className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
