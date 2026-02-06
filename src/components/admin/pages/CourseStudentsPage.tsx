'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useState } from "react"
import NavBreadcrumb from "../NavBreadcrumb"
import { getCourseStudents, bulkRemoveStudentsFromCourse, bulkUpdateStudentLectures } from "@/src/services/admin/student";
import { toast } from "react-toastify";
import PageLoader from "@/src/components/website/PageLoader";
import { formatDateAndTime } from "@/src/utils/client_functions";
import Pagination from "../Pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { adminCoursesUrl } from "@/src/utils/url";
import ConfirmationModal from "../../ConfirmationModal";

const CourseStudentsPage = ({ courseId }: { courseId: string }) => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const searchParams = useSearchParams();
    const pathName = usePathname();
    const { replace } = useRouter();

    // 1. Get initial values from URL or defaults
    const currentPage = Number(searchParams.get('page')) || 1;
    const searchTerm = searchParams.get('q') || '';

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

    const [tableIsLoading, setTableIsLoading] = useState(false);
    const [students, setStudents] = useState<any[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
    const [courseTitle, setCourseTitle] = useState<string>('');
    const [totalPages, setTotalPages] = useState(0);
    const [totalEntries, setTotalEntries] = useState(0);
    const [searchInput, setSearchInput] = useState(searchTerm);
    const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
    const [showBulkUpdateModal, setShowBulkUpdateModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const pageSize = 20; // Items per page

    const fetchStudents = useCallback(async () => {
        setTableIsLoading(true);

        try {
            const result = await getCourseStudents(courseId, currentPage, pageSize, searchTerm);
            
            if (result.success) {
                const studentsData = result.data as any[];
                setStudents(studentsData);
                setTotalPages(result.pagination.totalPages);
                setTotalEntries(result.pagination.totalCount);
                
                // Extract course title from first student if available
                if (studentsData.length > 0 && studentsData[0].course) {
                    setCourseTitle(studentsData[0].course.title);
                }
            } else {
                toast.error(result.message || 'Failed to load students');
                setStudents([]);
            }
        }
        catch (error) {
            console.log('Error loading the students: ', error);
            toast.error('Failed to load students');
            setStudents([]);
        }
        finally {
            setTableIsLoading(false);
        }
    }, [courseId, currentPage, searchTerm]);

    // Sync searchInput with URL when it changes externally (e.g., browser back/forward)
    useEffect(() => {
        setSearchInput(searchTerm);
    }, [searchTerm]);

    // Debounce search input to URL update
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            // Only update URL if the search input differs from current searchTerm
            if (searchInput !== searchTerm) {
                handleUrlChange('q', searchInput);
            }
        }, 500); // Wait 500ms after user stops typing

        return () => clearTimeout(delayDebounceFn);
    }, [searchInput]); // Only depend on searchInput

    // Fetch students when URL params change (after debounce)
    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    const handleSelectStudent = (studentId: string) => {
        setSelectedStudents(prev => {
            const newSet = new Set(prev);
            if (newSet.has(studentId)) {
                newSet.delete(studentId);
            } else {
                newSet.add(studentId);
            }
            return newSet;
        });
    };

    const handleSelectAll = () => {
        if (selectedStudents.size === students.length) {
            setSelectedStudents(new Set());
        } else {
            setSelectedStudents(new Set(students.map(s => s.id)));
        }
    };

    const handleBulkDelete = async () => {
        if (selectedStudents.size === 0) {
            toast.error('Please select at least one student');
            return;
        }

        setIsProcessing(true);
        try {
            const result = await bulkRemoveStudentsFromCourse(courseId, Array.from(selectedStudents));
            
            if (result.success) {
                toast.success(result.message);
                setSelectedStudents(new Set());
                fetchStudents();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.log('Error removing students:', error);
            toast.error('Failed to remove students. Please try again.');
        } finally {
            setIsProcessing(false);
            setShowBulkDeleteModal(false);
        }
    };

    const handleBulkUpdateLectures = async () => {
        if (selectedStudents.size === 0) {
            toast.error('Please select at least one student');
            return;
        }

        setIsProcessing(true);
        try {
            const result = await bulkUpdateStudentLectures(courseId, Array.from(selectedStudents));
            
            if (result.success) {
                toast.success(result.message);
                setSelectedStudents(new Set());
                fetchStudents();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.log('Error updating lectures:', error);
            toast.error('Failed to update lectures. Please try again.');
        } finally {
            setIsProcessing(false);
            setShowBulkUpdateModal(false);
        }
    };

    return (
        <>
            <div className="col-lg-9 col-md-12 col-sm-12">
                <NavBreadcrumb 
                    page={`Students - ${courseTitle || 'Loading...'}`}
                    back={adminCoursesUrl}
                />
                
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12">
                        <div className="card border bg-transparent rounded-3">
                            <div className="card-header border-bottom">
                                <div className="d-flex align-items-center justify-content-between w-100">
                                    <h4 className="mb-2 mb-sm-0">Course Students</h4>
                                    {selectedStudents.size > 0 && (
                                        <div className="d-flex gap-2">
                                            <span className="badge bg-primary align-self-center">
                                                {selectedStudents.size} selected
                                            </span>
                                            <button 
                                                onClick={() => setShowBulkUpdateModal(true)} 
                                                className="btn btn-sm btn-success"
                                                disabled={isProcessing}
                                                title="Update Lecture Contents"
                                            >
                                                <i className="bi bi-arrow-clockwise me-1" />
                                                Update Lecture
                                            </button>
                                            <button 
                                                onClick={() => setShowBulkDeleteModal(true)} 
                                                className="btn btn-sm btn-light-red"
                                                disabled={isProcessing}
                                                title="Remove Students"
                                            >
                                                <i className="bi bi-trash3 me-1" />
                                                Remove Student
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="card-body">
                                <div className="row g-3 align-items-center justify-content-between mb-4">
                                    <div className="col-md-5">
                                        <form onSubmit={(e) => e.preventDefault()} className="rounded position-relative">
                                            <input
                                                className="form-control pe-5 bg-transparent"
                                                type="search"
                                                placeholder="Search students..."
                                                aria-label="Search"
                                                value={searchInput}
                                                onChange={(e) => setSearchInput(e.target.value)}
                                            />
                                            <button
                                                className="bg-transparent p-2 position-absolute top-50 end-0 translate-middle-y border-0 text-primary-hover text-reset"
                                                type="submit"
                                            >
                                                <i className="bi bi-search text-muted opacity-75 fs-6 " />
                                            </button>
                                        </form>
                                    </div>
                                </div>

                                {tableIsLoading ? <PageLoader /> : (
                                    <>
                                        <div className="table-responsive border-0 rounded-3">
                                            {
                                                !students?.length ? 
                                                    <div className="text-center p-5">
                                                        <img
                                                            src={`${appUrl}/assets/img/empty.svg`}
                                                            alt="Empty State"
                                                            className="img-fluid mb-4"
                                                            style={{ maxWidth: 260, opacity: "0.9" }}
                                                        />
                                                        <h4 className="fw-bold">No students found</h4>
                                                        <p className="text-muted mb-4">
                                                            No students are enrolled in this course yet.
                                                        </p>
                                                    </div>
                                                : 
                                                <table className="table align-middle p-4 mb-0">
                                                    <thead className="table-dark">
                                                        <tr>
                                                            <th scope="col" className="border-0 rounded-start" style={{ width: '50px' }}>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedStudents.size === students.length && students.length > 0}
                                                                    onChange={handleSelectAll}
                                                                    className="form-check-input"
                                                                />
                                                            </th>
                                                            <th scope="col" className="border-0">
                                                                S/N
                                                            </th>
                                                            <th scope="col" className="border-0">
                                                                Student Name
                                                            </th>
                                                            <th scope="col" className="border-0">
                                                                Email
                                                            </th>
                                                            <th scope="col" className="border-0">
                                                                Total Lectures
                                                            </th>
                                                            <th scope="col" className="border-0">
                                                                Lectures Completed
                                                            </th>
                                                            <th scope="col" className="border-0">
                                                                Enrollment Date
                                                            </th>
                                                            <th scope="col" className="border-0">
                                                                Status
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {students.map((student, index) => (
                                                            <tr key={student.id}>
                                                                <td>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedStudents.has(student.id)}
                                                                        onChange={() => handleSelectStudent(student.id)}
                                                                        className="form-check-input"
                                                                    />
                                                                </td>
                                                                <td>{index + 1 + (currentPage - 1) * pageSize}</td>
                                                                <td>
                                                                    <div className="d-flex align-items-center gap-2">
                                                                        <div className="w-15">
                                                                            <img
                                                                                src={`${student?.user?.gender === 'male' ? `${appUrl}/assets/img/male-avatar.webp` : `${appUrl}/assets/img/female-avatar.webp`}`}
                                                                                className="img-fluid rounded"
                                                                                alt=""
                                                                            />
                                                                        </div>
                                                                        <div className="student-info">
                                                                            <h6 className="mb-0 fw-semibold table-responsive-title">
                                                                                {student.user?.name || 'Unknown'}
                                                                            </h6>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <span className="text-muted-2">{student.user?.email || 'N/A'}</span>
                                                                </td>
                                                                <td>
                                                                    <span className="text-muted-2">{student.totalLectures || 0}</span>
                                                                </td>
                                                                <td>
                                                                    <span className="text-muted-2">{student.lecturesCompleted || 0}</span>
                                                                </td>
                                                                <td>
                                                                    <span className="text-muted-2">{formatDateAndTime(student.createdAt)}</span>
                                                                </td>
                                                                <td>
                                                                    <span className={`badge ${student.totalLectures > 0 && student.lecturesCompleted === student.totalLectures ? 'bg-light-green text-green' : 'bg-light-yellow text-yellow'}`}>
                                                                        {student.totalLectures > 0 && student.lecturesCompleted === student.totalLectures ? 'Completed' : 'In Progress'}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            }
                                        </div>
                                        
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            totalEntries={totalEntries}
                                            pageSize={pageSize}
                                            onPageChange={(page) => handleUrlChange('page', page)}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmationModal 
                text={`⚠️ Are you sure you want to remove ${selectedStudents.size} student(s) from this course?`}
                isOpen={showBulkDeleteModal}
                isForDelete={true}
                onClose={() => setShowBulkDeleteModal(false)}
                onConfirm={handleBulkDelete}
            />

            <ConfirmationModal 
                text={`⚠️ Are you sure you want to update the lecture contents for ${selectedStudents.size} student(s)? The students will get the available updated contents immediately.`}
                isOpen={showBulkUpdateModal}
                isForDelete={false}
                onClose={() => setShowBulkUpdateModal(false)}
                onConfirm={handleBulkUpdateLectures}
            />
        </>
    )
}

export default CourseStudentsPage
