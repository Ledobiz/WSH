'use client'

import { allCoursesForWebsite } from "@/src/services/website/course";
import { Prisma } from "@prisma/client";
import { useEffect, useState } from "react"
import CourseCard from "./CourseCard";
import ButtonLoader from "../admin/ButtonLoader";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import WebsitePagination from "./WebsitePagination";

type DBCourseInterface = Prisma.CourseGetPayload<{
    include: {
        courseModules: {
            include: {
                moduleComponents: true;
            };
        };
    }
}>;

const getTotalLectures = (course: DBCourseInterface): number => {
    if (!course.courseModules) return 0;
    return course.courseModules.reduce((total, module) => {
        return total + (module.moduleComponents?.length || 0);
    }, 0);
};


const CoursesPage = () => {
    const searchParams = useSearchParams();
    const pathName = usePathname();
    const { replace } = useRouter();
    const [courses, setCourses] = useState<DBCourseInterface[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 20; // Items per page

    // 1. Get initial values from URL or defaults
    const currentPage = Number(searchParams.get('page')) || 1;

    // 2. Function to update the URL
    const handleUrlChange = (name: string, value: string | number) => {
        const params = new URLSearchParams(searchParams);
        
        if (value) {
            params.set(name, value.toString().trim());
        } else {
            params.delete(name);
        }

        // Reset to page 1 if searching
        if (name === 'q') params.set('page', '1');

        replace(`${pathName}?${params.toString()}`);
    };

    useEffect(() => {
        const allCourses = async () => {
            const result = await allCoursesForWebsite(currentPage, pageSize);

            if (result.success) {
                setCourses(result.data as DBCourseInterface[]);
                setTotalPages(result.pagination.totalPages);
                setLoading(false);
            }
        }

        allCourses();
    }, [currentPage]);

    return (
        <section className="py-5">
            <div className="container">
                <div className="row">
                    <div className="col-xxl-12 col-lg-12 col-12">
                        <div className="row align-items-center g-3 mb-3">
                            <div className="col-xxl-9 col-xl-8 col-lg-9 col-md-6 col-sm-12 col-12">
                                We found <strong>{courses?.length}</strong> {courses && courses.length > 1 ? 'courses' : 'course'} for you
                            </div>
                        </div>
                        
                        <div className="row justify-content-center g-xl-3 g-4 mb-5 align-items-stretch">
                            {loading ? <ButtonLoader /> : (
                                courses?.map((course) => (
                                    <CourseCard 
                                        key={course.id} 
                                        slug={course.slug}
                                        title={course.title}
                                        lectures={getTotalLectures(course)}
                                        level="Advanced"
                                        originalPrice={course.originalFee}
                                        discountedPrice={course.discountedFee}
                                        image={course.thumbnail ?? ''}
                                    />
                                ))
                            )}
                        </div>
                        
                        <WebsitePagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => handleUrlChange('page', page)}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
export default CoursesPage