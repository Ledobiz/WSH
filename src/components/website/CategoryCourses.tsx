'use client'

import { Prisma } from "@prisma/client";
import CourseCard from "./CourseCard";

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

const CategoryCourses = ({courses}: {courses: DBCourseInterface[]}) => {
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
                            {courses?.map((course) => (
                                <CourseCard 
                                    key={course.id} 
                                    course={course}
                                    slug={course.slug}
                                    title={course.title}
                                    lectures={getTotalLectures(course)}
                                    originalPrice={course.originalFee}
                                    discountedPrice={course.discountedFee}
                                    image={course.thumbnail ?? ''}
                                    isFree={course.isFree}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default CategoryCourses