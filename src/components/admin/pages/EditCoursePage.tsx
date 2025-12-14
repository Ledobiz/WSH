'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */

import { CourseCreationInterface } from "@/src/types";
import CourseCreationForm from "../CourseCreationForm";

const EditCoursePage = ({course}:{ course: CourseCreationInterface }) => {
    const handleUpdateCourse = async (data: CourseCreationInterface) => {
        console.log('Updating course:', data);
        // call update API here
    };   

    return (
        <div className="col-xl-9 col-lg-12">
            <div className="card shadow-lg">
                <div className="card-body p-4 p-lg-5">
                    <CourseCreationForm 
                        formTitle="Edit Course"
                        formText="Fill basic information regarding your course."
                        onFormSubmit={handleUpdateCourse}
                        initialValues={course}
                    />
                </div>
            </div>
        </div>
    )
}
export default EditCoursePage