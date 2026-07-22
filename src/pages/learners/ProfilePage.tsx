'use client'

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { User as UserType } from "@/src/types";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

import { motion } from "framer-motion";
import { User, Lock, Camera, X, ArrowRight } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/src/components/ui/avatar";
import { toast } from 'sonner';

import { changePassword, updateProfile } from "@/src/services/student/profile";
import { encrypt } from "@/src/utils/encryption";
import { useAuth } from "@/src/providers/AuthProvider";
import DashboardHeader from "@/src/components/learners/DashboardHeader";
import { SettingsSkeleton } from "@/src/components/learners/LMSSkeletons";
import LoadingButton from "@/src/components/website/LoadingButton";

const mapDbRecordsToForm = (user: any) => {
    return {
        name: user.name,
        email: user.email,
        phone: user?.phone ?? '',
        country: user?.country ?? '',
        state: user?.state ?? '',
        city: user?.city ?? '',
        gender: user?.gender ?? '',
        avatar: user?.image ?? '',
    }
}

const ProfilePage = () => {
    const { user, loading, updateUser } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [updating, setUpdating] = useState<boolean>(false);
    const [updatingPassword, setUpdatingPassword] = useState<boolean>(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null | undefined>(user?.image);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        country: "",
        state: "",
        city: "",
        gender: "",
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
    })

    const returnUrl = searchParams?.get("return");

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };    
    const handlePasswordInput = (field: string, value: any) => {
        setPasswordData((prev) => ({ ...prev, [field]: value }));
    };

    useEffect(() => {
        const initializeFormData = () => {
            if (user) {
                setFormData(mapDbRecordsToForm(user))
                setAvatarUrl(user.image)
            };
        }

        initializeFormData();
    }, [user]);

    const handleFormSubmission = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const payload = {
            name: (formData.name || user?.name || "").trim(),
            phone: (formData.phone || user?.phone || "").trim(),
            country: (formData.country || user?.country || "").trim(),
            state: (formData.state || user?.state || "").trim(),
            city: (formData.city || user?.city || "").trim(),
            gender: (formData.gender || user?.gender || "female") as any,
        };   

        if (
            !payload.name ||
            !payload.phone ||
            !payload.country ||
            !payload.state ||
            !payload.city
        ) {
            toast.error("Please fill in all required fields.");
            return;
        }

        setUpdating(true);

        try {
            const result = await updateProfile(user?.id as string, formData);

            if (!result.success) {
                toast.error(result.message);
                return;
            }
            
            toast.success(result.message);

            const storageKey = process.env.NEXT_PUBLIC_LOCAL_STORAGE_AUTH_KEY;
            const mergedUser: UserType | null =
                result.user && user
                ? { ...(user as UserType), ...(result.user as Partial<UserType>) }
                : (result.user as unknown as UserType | null);
            if (typeof window !== "undefined" && storageKey && mergedUser) {
                const encryptedUser = await encrypt<UserType>(mergedUser);
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
                setAvatarUrl(mergedUser.image);
            }

            setUpdating(false);

            if (returnUrl) {
                router.push(decodeURIComponent(returnUrl));
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong. Please try again.");
            setUpdating(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();

        const passwordPayload = {
            currentPassword: passwordData.currentPassword.trim(),
            newPassword: passwordData.newPassword.trim(),
        };

        if (!passwordPayload.currentPassword || !passwordPayload.newPassword) {
            toast.error('Please fill required fields.');
            return;
        }

        setUpdatingPassword(true);

        try {
            const passwordResult = await changePassword(user?.id as string, passwordPayload);

            if (!passwordResult.success) {
                toast.error(passwordResult.message);
                return;
            }

            toast.success(passwordResult.message);
            setPasswordData({
                currentPassword: "",
                newPassword: "",
            });
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong. Please try again later.');
        } finally {
            setUpdatingPassword(false);
        }
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        // Validate size (2MB max)
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image must be less than 2MB");
            return;
        }

        // Validate type
        if (!file.type.startsWith("image/")) {
            toast.error("Only image files are allowed");
            return;
        }

        setFormData((prev) => ({
            ...prev,
            avatar: file
        }));
        setAvatarUrl(URL.createObjectURL(file)); // Image Preview
    };

    const removeAvatar = () => {
        setAvatarUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    if (loading) {
        return (
            <>
                <DashboardHeader title='Settings' />
                <h1 className="text-xl font-display font-bold text-foreground mb-4 md:hidden">Settings</h1>
                <SettingsSkeleton />
            </>
        );
    }

    return (
        <>
            <DashboardHeader title='Settings' />

            <div className="p-4 md:p-8">
                <h1 className="text-xl font-display font-bold text-foreground mb-4 md:hidden">Settings</h1>

                <div className="max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Profile Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-background rounded-2xl border border-border p-5 md:p-6"
                    >
                        <h2 className="font-display font-bold text-foreground mb-5 flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" /> Profile
                        </h2>

                        {/* Avatar */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="relative">
                                <Avatar className="h-20 w-20">
                                    {avatarUrl ? (
                                        <AvatarImage src={avatarUrl} alt="Profile" />
                                    ) : (
                                        <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">JD</AvatarFallback>
                                    )}
                                </Avatar>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm hover:bg-primary/90 transition-colors cursor-pointer"
                                >
                                    <Camera className="h-3.5 w-3.5" />
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground">Profile Picture</p>
                                <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
                                {avatarUrl && (
                                    <button
                                        onClick={removeAvatar}
                                        className="text-xs text-destructive hover:underline mt-1 flex items-center gap-1 cursor-pointer"
                                    >
                                        <X className="h-3 w-3" /> Remove
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Full Name <sup className='text-red-500'>*</sup></Label>
                                <Input 
                                    id="name"  
                                    className="mt-1" 
                                    value={formData.name !== "" ? formData.name : (user?.name ?? "")}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Email <sup className='text-red-500'>*</sup></Label>
                                <Input 
                                    id="email" 
                                    type="email" 
                                    className="mt-1" 
                                    value={formData.email !== "" ? formData.email : (user?.email ?? "")}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    readOnly
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="phone">Phone Number <sup className='text-red-500'>*</sup></Label>
                                <Input 
                                    id="phone" 
                                    type="tel" 
                                    placeholder="+1 (555) 000-0000" 
                                    className="mt-1" 
                                    value={formData.phone !== "" ? formData.phone : (user?.phone ?? "")}
                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="gender">Gender <sup className='text-red-500'>*</sup></Label>
                                <select
                                    id="gender"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-1"
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
                            <div>
                                <Label htmlFor="address">City <sup className='text-red-500'>*</sup></Label>
                                <Input 
                                    id="address" 
                                    placeholder="123 Main Street" 
                                    className="mt-1" 
                                    value={
                                        formData.city !== "" ? formData.city : (user?.city ?? "")
                                    }
                                    onChange={(e) => handleInputChange("city", e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="state">State / Province <sup className='text-red-500'>*</sup></Label>
                                <Input 
                                    id="state" 
                                    placeholder="NY" 
                                    className="mt-1" 
                                    value={
                                        formData.state !== "" ? formData.state : (user?.state ?? "")
                                    }
                                    onChange={(e) => handleInputChange("state", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <Label htmlFor="country">Country <sup className='text-red-500'>*</sup></Label>
                                <Input 
                                    id="country" 
                                    placeholder="United States" 
                                    className="mt-1" 
                                    value={
                                        formData.country !== ""
                                        ? formData.country
                                        : (user?.country ?? "")
                                    }
                                    onChange={(e) => handleInputChange("country", e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <LoadingButton 
                            variant="hero"
                            onClick={handleFormSubmission} 
                            size="sm" 
                            className="mt-5 cursor-pointer" 
                            loading={updating} 
                            type="submit"
                        >
                            Save Changes <ArrowRight className="h-4 w-4" />
                        </LoadingButton>
                    </motion.div>

                    {/* Change Password */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-background rounded-2xl border border-border p-5 md:p-6"
                    >
                        <h2 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
                            <Lock className="h-5 w-5 text-primary" /> Change Password
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="current">Current Password <sup className='text-red-500'>*</sup></Label>
                                <Input 
                                    id="current" 
                                    type="password" 
                                    className="mt-1" 
                                    onChange={(e) => handlePasswordInput("currentPassword", e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="new">New Password <sup className='text-red-500'>*</sup></Label>
                                <Input 
                                    id="new" 
                                    type="password" 
                                    className="mt-1" 
                                    onChange={(e) => handlePasswordInput("newPassword", e.target.value)}
                                />
                            </div>
                                                        
                            <LoadingButton 
                                variant="outline" 
                                size="sm" 
                                onClick={handlePasswordChange}
                                className="cursor-pointer" 
                                loading={updatingPassword} 
                                type="submit"
                            >
                                Update Password <ArrowRight className="h-4 w-4" />
                            </LoadingButton>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    )
}
export default ProfilePage