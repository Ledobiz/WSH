'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */

import { CourseCreationInterface } from "@/src/types";
import CourseCreationForm from "../CourseCreationForm";
import { toast } from "react-toastify";
import { createCourse } from "@/src/services/admin/course";
import { useRouter } from "next/navigation";
import { adminCoursesUrl } from "@/src/utils/url";

const CreateCoursePage = () => {
    const router = useRouter();

    const handleCourseCreation = async (data: CourseCreationInterface) => {
        console.log(data);
        if (
            !data.title.trim() || !data.categoryId.trim() || !data.description.trim() || 
            !data.discountedFee || !data.originalFee || !data.thumbnail || !data.banner ||
            !data.seoTitle.trim() || !data.seoDescription.trim() || !data.seoKeywords.trim()
        ) {
            toast.error('Please fill all required fields');
            return;
        }

        const result = await createCourse(data);

        if (!result.success) {
            toast.error(result.message);
            return;
        }

        toast.success(result.message);
        router.push(adminCoursesUrl);
    }    

    return (
        <div className="col-xl-9 col-lg-12">
            <div className="card shadow-lg">
                <div className="card-body p-4 p-lg-5">
                    <CourseCreationForm 
                        formTitle="Create Course"
                        formText="Fill basic information regarding your course."
                        onFormSubmit={handleCourseCreation}
                    />
                </div>
            </div>
        </div>
    )
}
export default CreateCoursePage