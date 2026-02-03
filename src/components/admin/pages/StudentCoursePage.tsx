'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import PageLoader from "@/src/components/website/PageLoader";
import { assignCourseToStudent, getStudentCourses } from "@/src/services/admin/student";
import NavBreadcrumb from "@/src/components/admin/NavBreadcrumb";
import { formatDateAndTime } from "@/src/utils/client_functions";
import CustomModal from "../CustomModal";
import ButtonLoader from "../ButtonLoader";
import { toast } from "react-toastify";
import ConfirmationModal from "../../ConfirmationModal";
import { giveStudentNewlyAvailableLectureContents } from "@/src/services/student/course";
import { adminStudentsUrl } from "@/src/utils/url";
import { courseProgress } from "@/src/utils/server_functions";

const totalLectures = (course: any): number => {
    if (!course.studentModules) return 0;
    return course.studentModules.reduce((total: number, module: any) => {
        return total + (module.studentModuleComponents?.length || 0);
    }, 0);
};

const StudentCoursePage = ({userId}: {userId: string}) => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    const [loading, setLoading] = useState<boolean>(false);
    const [courses, setCourses] = useState<any[]>([]);
    const [otherCourses, setOtherCourses] = useState<any[]>([]);
    const [showAssignCourseModal, setShowAssignCourseModal] = useState<boolean>(false);
    const [processing, setProcessing] = useState<boolean>(false);
    const [courseId, setCourseId] = useState<string>('');
    const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
    const [lectureProgressData, setLectureProgressData] = useState<Record<string, number>>({});

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);

            try {
                const response = await getStudentCourses(userId);
                setCourses(response.courses);
                setOtherCourses(response.otherCourses);

                const progress: Record<string, number> = {};

                for (const course of response.courses ?? []) {
                    const lectureProgress = await courseProgress(userId, course.course.id);
                    
                    progress[course.course.id] = lectureProgress.lecturesCompleted;
                }
                setLectureProgressData(progress);
            } catch (error) {
                console.error("Error fetching student courses:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchCourses();
    }, [userId])

    const processCourseProgress = async (courses: any[]) => {
        const progress: Record<string, number> = {};

        for (const course of courses ?? []) {
            const lectureProgress = await courseProgress(userId, course.course.id);
            
            progress[course.course.id] = lectureProgress.lecturesCompleted;
        }
        setLectureProgressData(progress);
    }

    const handleCourseAssigning = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        try {
            // Call your service to assign course to student
            const result = await assignCourseToStudent(userId, courseId);
            
            if (!result.success) {
                toast.error(result.message || "Failed to assign course to student");
                return;
            }
            
            toast.success(result.message);
            
            // After successful assignment, you might want to refresh the course list
            const response = await getStudentCourses(userId);
            setCourses(response.courses);
            setOtherCourses(response.otherCourses);
            setShowAssignCourseModal(false);
            setCourseId('');

            await processCourseProgress(response.courses);
        } catch (error) {
            console.error("Error assigning course to student:", error);
        } finally {
            setProcessing(false);
        }
    }

    const handleConfirmationModal = (courseId: string) => {
        setCourseId(courseId);
        setShowConfirmationModal(true);
    }

    const handleCourseUpdateForStudent = async () => {
        if (!courseId || !userId) return;

        try {
            const response = await giveStudentNewlyAvailableLectureContents(userId, courseId);
            if (response.success) {
                toast.success(response.message);

                // After successful assignment, you might want to refresh the course list
                const result = await getStudentCourses(userId);
                setCourses(result.courses);
                setOtherCourses(result.otherCourses);
                setCourseId('');
                
                await processCourseProgress(result.courses);
            } else {
                toast.error(response.message);
            }
        }
        catch (error) {
            console.log("Error ignoring review:", error);
            toast.error("Failed update the lectures for this student. Please try again.");
        }
        finally {
            setCourseId('');
            setShowConfirmationModal(false);
        }
    }

    return (
        <>
            <div className="col-lg-9 col-md-12 col-sm-12">
                <NavBreadcrumb 
                    page="Student Courses"
                    back={adminStudentsUrl}
                />
                
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12">
                        <div className="card border bg-transparent rounded-3">
                            <div className="card-header border-bottom">
                                <div className="d-flex align-items-center justify-content-between w-100">
                                    <h4 className="mb-2 mb-sm-0">Student Course</h4>
                                    <button onClick={() => setShowAssignCourseModal(true)} className="btn btn-main btn-sm">Assign New Course</button>
                                </div>
                            </div>
                            
                            <div className="card-body">
                                {loading ? <PageLoader /> : (
                                    <>
                                        <div className="table-responsive border-0 rounded-3">
                                            {!courses.length && (
                                                <div className="text-center p-5">
                                                    <img
                                                        src={`${appUrl}/assets/img/empty.svg`}
                                                        alt="Empty State"
                                                        className="img-fluid mb-4"
                                                        style={{ maxWidth: 260, opacity: "0.9" }}
                                                    />
                                                    <h4 className="fw-bold">No course yet</h4>
                                                </div>
                                            )}

                                            { courses.length > 0 && (
                                                <table className="table align-middle p-4 mb-0">
                                                    <thead className="table-dark">
                                                        <tr>
                                                            <th scope="col" className="border-0 rounded-start">
                                                                Course Name
                                                            </th>
                                                            <th scope="col" className="border-0">
                                                                Total Lectures
                                                            </th>
                                                            <th scope="col" className="border-0">
                                                                Lectures Completed
                                                            </th>
                                                            <th scope="col" className="border-0">
                                                                Enrolment Date
                                                            </th>
                                                            <th scope="col" className="border-0">
                                                                Status
                                                            </th>
                                                            <th scope="col" className="border-0">
                                                                Action
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {courses.map((course) => (
                                                            <tr key={course.id}>
                                                                <td>
                                                                    <div className="d-flex align-items-center">
                                                                        <h6 className="mb-0 fw-semibold ms-2 table-responsive-title">
                                                                            <a href="#">{ course.course.title }</a>
                                                                        </h6>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <span className="ms-2">{ totalLectures(course) }</span>
                                                                </td>
                                                                <td>
                                                                    <span className="ms-2">{ lectureProgressData[course.course.id] }</span>
                                                                </td>
                                                                <td>
                                                                    <span className="ms-2">{ formatDateAndTime(course.createdAt) }</span>
                                                                </td>
                                                                <td>
                                                                    <span className={`badge bg-opacity-10 ${totalLectures(course) > 0 && lectureProgressData[course.course.id] == totalLectures(course) ? 'bg-success text-success' : 'bg-danger text-danger'}`}>
                                                                        {totalLectures(course) > 0 && lectureProgressData[course.course.id] == totalLectures(course) ? 'Completed' : 'In Progress'}
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <button
                                                                        className="btn btn-sm btn-gray me-1 mb-0"
                                                                        onClick={() => handleConfirmationModal(course.course.id)}
                                                                        title="Update Student Course"
                                                                    >
                                                                        <i className="bi bi-arrow-clockwise" />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        )) }
                                                    </tbody>
                                                </table>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CustomModal isOpen={showAssignCourseModal}
                onClose={() => setShowAssignCourseModal(false)}
                title="Assign New Course"
            >
                <form onSubmit={handleCourseAssigning}>
                    <div className="form-group mb-3">
                        <label className="form-label">Course <span className="text-danger">*</span></label>
                        <select name="courseId" className="form-control"
                            value={courseId}
                            onChange={(e) => setCourseId(e.target.value)}
                            required
                        >
                            <option value="">-- Choose --</option>
                            {otherCourses?.map(course => (
                                <option key={course.id} value={course.id}>{course.title}</option>
                            ))}
                        </select>
                    </div>

                    <div className="d-flex justify-content-between mt-4">
                        <button type="submit" className="btn btn-main btn-sm px-4" disabled={processing}>
                            { processing ? 
                                <ButtonLoader /> :  
                                'Assign Course'
                            }
                        </button>
                    </div>
                </form>
            </CustomModal>

            <ConfirmationModal 
                text='⚠️ Are you sure you want to update the lectures for the student? The student will get the available updated contents immediately.'
                isOpen={showConfirmationModal}
                isForDelete={false}
                onClose={() => setShowConfirmationModal(false)}
                onConfirm={handleCourseUpdateForStudent}
            />
        </>
    )
}
export default StudentCoursePage;