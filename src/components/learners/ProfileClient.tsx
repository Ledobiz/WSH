'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import ButtonLoader from "@/src/components/admin/ButtonLoader";
import Navbar from "@/src/components/dashboard/Navbar";
import NavBreadcrumb from "@/src/components/dashboard/NavBreadcrumb";
import Sidebar from "@/src/components/dashboard/Sidebar";
import Footer from "@/src/components/website/Footer";
import { useAuth } from "@/src/providers/AuthProvider";
import { updateProfile } from "@/src/services/student/profile";
import { encrypt } from "@/src/utils/encryption";
import type { User } from "@/src/types";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const ProfileClient = () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    const { user, updateUser } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        country: "",
        state: "",
        city: "",
        gender: "",
    });

    const returnUrl = searchParams.get("return");

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleFormSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = {
            name: (formData.name || user?.name || "").trim(),
            email: (formData.email || user?.email || "").trim(),
            phone: (formData.phone || user?.phone || "").trim(),
            country: (formData.country || user?.country || "").trim(),
            state: (formData.state || user?.state || "").trim(),
            city: (formData.city || user?.city || "").trim(),
            gender: (formData.gender || user?.gender || "female") as any,
        };

        if (
            !payload.name ||
            !payload.email ||
            !payload.phone ||
            !payload.country ||
            !payload.state ||
            !payload.city
        ) {
            toast.error("Please fill in all required fields.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        setLoading(true);

        try {
            const result = await updateProfile(user?.id as string, payload);

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            toast.success(result.message);

            const storageKey = process.env.NEXT_PUBLIC_LOCAL_STORAGE_AUTH_KEY;
            const mergedUser: User | null =
                result.user && user
                ? { ...(user as User), ...(result.user as Partial<User>) }
                : (result.user as unknown as User | null);
            if (typeof window !== "undefined" && storageKey && mergedUser) {
                const encryptedUser = await encrypt<User>(mergedUser);
                localStorage.setItem(storageKey, encryptedUser);
                window.dispatchEvent(
                    new CustomEvent("localStorageChange", {
                        detail: { key: storageKey, value: encryptedUser },
                    })
                );
            }

            if (mergedUser) {
                updateUser(mergedUser);
                setFormData({
                name: mergedUser.name || "",
                email: mergedUser.email || "",
                phone: mergedUser.phone || "",
                country: mergedUser.country || "",
                state: mergedUser.state || "",
                city: mergedUser.city || "",
                gender: (mergedUser.gender as any) || "female",
                });
            }

            setLoading(false);

            if (returnUrl) {
                router.push(decodeURIComponent(returnUrl));
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

  return (
    <>
        <Navbar />

        <section
            className="bg-cover p-0"
            style={{ background: `url(${appUrl}/assets/img/student-bg.jpg)no-repeat` }}
            data-overlay={4}
        >
            <div className="container-fluid px-0">
            <div className="ht-250" />
            </div>
        </section>

        <section className="pt-4">
            <div className="container">
                <div className="row gx-xl-5">
                    <Sidebar />

                    <div className="col-lg-9 col-md-12 col-sm-12">
                        <NavBreadcrumb page="Profile" />

                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12">
                                <div className="card border">
                                    <div className="card-body">
                                        <div className="form-section">
                                            <h4 className="mb-0">Personal Details</h4>
                                            <p className="text-muted mb-4">
                                                Edit your personal information and address.
                                            </p>
                                            <form onSubmit={handleFormSubmission} className="row g-3">
                                                <div className="col-12 col-md-6">
                                                    <label className="form-label">Name</label>
                                                    <input
                                                        type="text"
                                                        value={
                                                            formData.name !== "" ? formData.name : (user?.name ?? "")
                                                        }
                                                        className="form-control"
                                                        placeholder="Name"
                                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                                        required
                                                    />
                                                </div>

                                                <div className="col-12 col-md-6">
                                                    <label className="form-label">Email</label>
                                                    <input
                                                        className="form-control"
                                                        type="email"
                                                        placeholder="Your eMail"
                                                        value={
                                                            formData.email !== "" ? formData.email : (user?.email ?? "")
                                                        }
                                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                                        required
                                                    />
                                                </div>

                                                <div className="col-12 col-md-6">
                                                    <label className="form-label">Phone</label>
                                                    <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Phone"
                                                    value={
                                                        formData.phone !== "" ? formData.phone : (user?.phone ?? "")
                                                    }
                                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                                    required
                                                    />
                                                </div>

                                                <div className="col-12 col-md-6">
                                                    <label className="form-label">Gender</label>
                                                    <select
                                                    className="form-control"
                                                    id="gender"
                                                    data-select2-id="gender"
                                                    tabIndex={-1}
                                                    aria-hidden="true"
                                                    value={
                                                        formData.gender !== ""
                                                        ? formData.gender
                                                        : (user?.gender ?? "female")
                                                    }
                                                    onChange={(e) => handleInputChange("gender", e.target.value)}
                                                    required
                                                    >
                                                    <option value="female">Female</option>
                                                    <option value="male">Male</option>
                                                    </select>
                                                </div>

                                                <div className="col-12 col-md-6">
                                                    <label className="form-label">City</label>
                                                    <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="City"
                                                    value={
                                                        formData.city !== "" ? formData.city : (user?.city ?? "")
                                                    }
                                                    onChange={(e) => handleInputChange("city", e.target.value)}
                                                    required
                                                    />
                                                </div>

                                                <div className="col-12 col-md-6">
                                                    <label className="form-label">State</label>
                                                    <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="State"
                                                    value={
                                                        formData.state !== "" ? formData.state : (user?.state ?? "")
                                                    }
                                                    onChange={(e) => handleInputChange("state", e.target.value)}
                                                    required
                                                    />
                                                </div>

                                                <div className="col-12 col-md-6">
                                                    <label className="form-label">Country</label>
                                                    <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Country"
                                                    value={
                                                        formData.country !== ""
                                                        ? formData.country
                                                        : (user?.country ?? "")
                                                    }
                                                    onChange={(e) => handleInputChange("country", e.target.value)}
                                                    required
                                                    />
                                                </div>

                                                <div className="col-12">
                                                    <button className="btn btn-main px-5" type="submit">
                                                    {loading ? <ButtonLoader color="#ffffff" /> : "Save Changes"}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <Footer />
    </>
  );
};

export default ProfileClient;
