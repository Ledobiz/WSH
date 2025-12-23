'use client'

import { useCallback, useEffect, useState } from "react"
import NavBreadcrumb from "../NavBreadcrumb"
import { createCourse, deleteCourse, fetchAllCourses, updateCourse } from "@/src/services/admin/course";
import { toast } from "react-toastify";
import { Course } from "@prisma/client";
import PageLoader from "../../website/PageLoader";
import Link from "next/link";
import { courseModules, coursesUrl } from "@/src/utils/url";
import { formatAmount } from "@/src/utils/client_functions";
import CustomModal from "../CustomModal";
import CourseCreationForm from "../CourseCreationForm";
import { CourseCreationInterface } from "@/src/types";
import DeleteModal from "../DeleteModal";

type DBCourseInterface = Course;

const CoursesPage = () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const [tableIsLoading, setTableIsLoading] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCourseCreationModal, setShowCourseCreationModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [courseId, setCourseId] = useState('');
    const [courses, setCourses] = useState<DBCourseInterface[] | null>(null);
    const [courseToEdit, setCourseToEdit] = useState<DBCourseInterface | null>(null);

    const fetchCourses = useCallback(async () => {
        setTableIsLoading(true);

        try {
            const result = await fetchAllCourses();
            setCourses(result.courses);
        }
        catch (error) {
            console.log('Error loading the courses: ', error);
            toast.error('Failed to load all courses');
        }
        finally {
            setTableIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    const handleCourseCreation = async (data: CourseCreationInterface) => {
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

        setShowCourseCreationModal(false);
        toast.success(result.message);
        fetchCourses();
    }

    const handleEditModal = (id: string)  => {
        const course = courses?.find(c => c.id == id) || '';

        if (course) {
            setCourseId(id);
            setCourseToEdit(course);
            setShowEditModal(true);
        }
    }

    const handleCourseEdit = async (data: CourseCreationInterface) => {
        if (
            !data.title.trim() || !data.categoryId.trim() || !data.description.trim() || 
            !data.discountedFee || !data.originalFee || !data.seoTitle.trim() || 
            !data.seoDescription.trim() || !data.seoKeywords.trim()
        ) {
            toast.error('Please fill all required fields');
            return;
        }

        const result = await updateCourse(courseId, data);

        if (!result.success) {
            toast.error(result.message);
            return;
        }

        setShowEditModal(false);
        setCourseToEdit(null);
        setCourseId('');
        toast.success(result.message);
        fetchCourses();
    }

    const handleDeleteModal = (id: string) => {
        const course = courses?.find(c => c.id == id) || '';

        if (course) {
            setCourseId(id);
            setCourseToEdit(course);
            setShowDeleteModal(true);
        }
    }

    const deleteDaCourse = async () => {
        if (!courseId) return;

        try {
            const deleted = await deleteCourse(courseId);

            if (!deleted.success) {
                toast.error(deleted.message);
            }

            setShowDeleteModal(false);
            toast.success(deleted.message);

            setCourseToEdit(null);
            setCourseId('');
            fetchCourses();
        } 
        catch (error) {
            console.log(error);
            toast.error('Failed to delete the course, please try again');
        }
    }

    return (
        <>
            <div className="col-lg-9 col-md-12 col-sm-12">
                <NavBreadcrumb page="Courses" />
                
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12">
                        <div className="card border bg-transparent rounded-3">
                            <div className="card-header border-bottom">
                                <div className="d-flex align-items-center justify-content-between w-100">
                                    <h4 className="mb-2 mb-sm-0">All Courses</h4>
                                    <button onClick={() => setShowCourseCreationModal(true)} className="btn btn-main btn-sm">Add New Course</button>
                                </div>
                            </div>
                            
                            <div className="card-body">

                                {tableIsLoading ? <PageLoader /> : (
                                    <>
                                        <div className="row g-3 align-items-center justify-content-between mb-4">
                                            <div className="col-md-7">
                                                <form className="rounded position-relative">
                                                    <input
                                                    className="form-control pe-5 bg-transparent"
                                                    type="search"
                                                    placeholder="Search"
                                                    aria-label="Search"
                                                    />
                                                    <button
                                                    className="bg-transparent p-2 position-absolute top-50 end-0 translate-middle-y border-0 text-primary-hover text-reset"
                                                    type="submit"
                                                    >
                                                    <i className="bi bi-search text-muted opacity-75 fs-6 " />
                                                    </button>
                                                </form>
                                            </div>
                                            
                                            <div className="col-md-3">
                                                <form>
                                                    <div className="position-relative">
                                                        <select id="sorting" className="form-control">
                                                            <option value="">&nbsp;</option>
                                                            <option value={1}>Free</option>
                                                            <option value={2}>Most Popular</option>
                                                            <option value={3}>Most Viewed</option>
                                                            <option value={4}>Newest</option>
                                                            <option value={5}>Trending</option>
                                                        </select>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>


                                        <div className="table-responsive border-0 rounded-3">
                                            {
                                                !courses?.length ? 
                                                    <div className="text-center p-5">
                                                        <img
                                                            src={`${appUrl}/assets/img/empty.svg`}
                                                            alt="Empty State"
                                                            className="img-fluid mb-4"
                                                            style={{ maxWidth: 260, opacity: "0.9" }}
                                                        />
                                                        <h4 className="fw-bold">No course found</h4>
                                                        <p className="text-muted mb-4">
                                                            It's either we're unable to fetch the courses or you haven't addded any yet.
                                                            If you've added a course already and it's not listed here, kindly contact tech support.
                                                        </p>
                                                    </div>
                                                : 
                                                <table className="table align-middle p-4 mb-0">
                                                    <thead className="table-dark">
                                                        <tr>
                                                            <th scope="col" className="border-0 rounded-start">
                                                                S/N
                                                            </th>
                                                            <th scope="col" className="border-0">
                                                                Course Title
                                                            </th>
                                                            <th scope="col" className="border-0">
                                                                Enrolled
                                                            </th>
                                                            <th scope="col" className="border-0">
                                                                Status
                                                            </th>
                                                            <th scope="col" className="border-0">
                                                                Price
                                                            </th>
                                                            <th scope="col" className="border-0 rounded-end">
                                                                Action
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {courses.map((course, index) => (
                                                            <tr key={course.id}>
                                                                <td>{ index + 1 }</td>
                                                                <td>
                                                                    <div className="d-flex align-items-center gap-2">
                                                                        <div className="w-15">
                                                                            <img
                                                                                src={course.thumbnail || ''}
                                                                                className="img-fluid rounded"
                                                                                alt=""
                                                                            />
                                                                        </div>
                                                                        <div className="courses-info">
                                                                            <h6 className="mb-0 fw-semibold table-responsive-title">
                                                                                <Link href={`${coursesUrl}/${course.slug}`} target="_blank">{course.title}</Link>
                                                                            </h6>
                                                                            <div className="d-flex gap-2">
                                                                                <p className="mb-0 text-muted-2 me-1">
                                                                                    <i className="bi bi-camera-video me-1" />
                                                                                    18 lectures
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                
                                                                <td>
                                                                    <span className="text-muted-2">625</span>
                                                                </td>
                                                                <td>
                                                                    <span className={ course.isActive ? 'badge bg-light-green text-green' : 'badge bg-light-red text-red'}>
                                                                        { course.isActive ? 'Live' : 'Draft' }
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <span className="text-muted-2">{formatAmount(course.discountedFee)}</span>
                                                                </td>
                                                                <td>
                                                                    <button onClick={() => handleEditModal(course.id)} className="btn btn-sm btn-gray me-1 mb-0">
                                                                        <i className="bi bi-pencil-square" />
                                                                    </button>
                                                                    <Link 
                                                                        href={`${courseModules}/${course.id}`} 
                                                                        className="btn btn-sm btn-success me-1 mb-0"
                                                                        title="Manage Modules"
                                                                    >
                                                                        <i className="bi bi-table" />
                                                                    </Link>
                                                                    <button onClick={() => handleDeleteModal(course.id)} className="btn btn-sm btn-light-red mb-0">
                                                                        <i className="bi bi-trash3" />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            }
                                        </div>
                                        
                                        
                                        <div className="d-sm-flex justify-content-sm-between align-items-sm-center mt-3">
                                            {/* Content */}
                                            <p className="mb-0 text-center text-sm-start text-muted">
                                            Showing 1 to 8 of 20 entries
                                            </p>
                                            {/* Pagination */}
                                            <nav
                                            className="d-flex justify-content-center mb-0"
                                            aria-label="navigation"
                                            >
                                                <ul className="pagination pagination-sm pagination-primary-soft d-inline-block d-md-flex rounded mb-0">
                                                    <li className="page-item mb-0">
                                                    <a className="page-link" href="#" tabIndex={-1}>
                                                        <i className="fas fa-angle-left" />
                                                    </a>
                                                    </li>
                                                    <li className="page-item mb-0">
                                                    <a className="page-link" href="#">
                                                        1
                                                    </a>
                                                    </li>
                                                    <li className="page-item mb-0 active">
                                                    <a className="page-link" href="#">
                                                        2
                                                    </a>
                                                    </li>
                                                    <li className="page-item mb-0">
                                                    <a className="page-link" href="#">
                                                        3
                                                    </a>
                                                    </li>
                                                    <li className="page-item mb-0">
                                                    <a className="page-link" href="#">
                                                        4
                                                    </a>
                                                    </li>
                                                    <li className="page-item mb-0">
                                                    <a className="page-link" href="#">
                                                        <i className="fas fa-angle-right" />
                                                    </a>
                                                    </li>
                                                </ul>
                                            </nav>
                                        </div>
                                    </>
                                )}
                            </div>
                            {/* Card body START */}
                        </div>
                    </div>
                </div>
                {/* /Row */}
            </div>

            <CustomModal
                isOpen={showCourseCreationModal}
                title=""
                onClose={() => setShowCourseCreationModal(false)}
                size="modal-xl"
            >
                <CourseCreationForm 
                    mode="add"
                    formTitle="Create Course"
                    formText="Fill basic information regarding your course."
                    onFormSubmit={handleCourseCreation}
                />
            </CustomModal>

            <CustomModal
                isOpen={showEditModal}
                title={`Edit Course: ${courseToEdit?.title}`}
                onClose={() => setShowEditModal(false)}
                size="modal-xl"
            >
                <CourseCreationForm 
                    mode="edit"
                    formTitle="Edit Course"
                    formText="Fill basic information regarding your course."
                    onFormSubmit={handleCourseEdit}
                    initialValues={courseToEdit}
                />
            </CustomModal>

            <DeleteModal 
                isOpen={showDeleteModal}
                title={`⚠️ Delete Course: ${courseToEdit?.title}`}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={deleteDaCourse}
                item={courseToEdit?.title || ''}
            />
        </>
    )
}
export default CoursesPage