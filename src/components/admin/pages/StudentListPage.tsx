'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import NavBreadcrumb from "../NavBreadcrumb"
import { getAllStudents } from "@/src/services/admin/student";
import PageLoader from "@/src/components/website/PageLoader";
import Pagination from "../Pagination";
import { formatDateAndTime } from "@/src/utils/client_functions";
import CustomModal from "../CustomModal";
import Link from "next/link";

const coursesCompleted = (user: any): number => {
    if (!user.students || user.students.length === 0) return 0;

    return user.students.reduce((total: number, student: any) => {
        return student.lecturesCompleted ? total + 1 : total;
    }, 0);
}

const StudentListPage = () => {
    const searchParams = useSearchParams();
    const pathName = usePathname();
    const { replace } = useRouter();

    // 1. Get initial values from URL or defaults
    const currentPage = Number(searchParams.get('page')) || 1;
    const searchTerm = searchParams.get('q') || '';
    
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState(0);
    const [totalEntries, setTotalEntries] = useState(0);
    const [searchInput, setSearchInput] = useState(searchTerm);
    const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
    const [studentDetails, setStudentDetails] = useState<any>(null);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const pageSize = 20; // Items per page

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
        setSearchInput(searchTerm);
    }, [searchTerm]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            // Only update URL if the search input differs from current searchTerm
            if (searchInput !== searchTerm) {
                handleUrlChange('q', searchInput);
            }
        }, 500); // Wait 500ms after user stops typing

        return () => clearTimeout(delayDebounceFn);
    }, [searchInput]); // Only depend on searchInput

    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            
            try {
                const result = await getAllStudents(currentPage, pageSize, searchTerm);
                setStudents('data' in result ? result.data : result.students);
                
                if ('pagination' in result) {
                    setTotalPages(result.pagination.totalPages);
                    setTotalEntries(result.pagination.totalCount);
                } else {
                    setTotalPages(0);
                    setTotalEntries(0);
                }
            } catch (error) {
                console.error("Error fetching students:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [currentPage, searchTerm]);

    const handleStudentModal = (studentId: string) => {
        setShowDetailsModal(true);

        const student = students.find(s => s.id === studentId);
        setStudentDetails(student);
    }

    return (
        <>
            <div className="col-lg-9 col-md-12 col-sm-12">
                <NavBreadcrumb page="Students" />
                
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12">
                        <div className="card border bg-transparent rounded-3">
                            <div className="card-header border-bottom">
                                <div className="d-flex align-items-center justify-content-between w-100">
                                    <h4 className="mb-2 mb-sm-0">All Students</h4>
                                </div>
                            </div>
                            
                            <div className="card-body">
                                <div className="row g-3 align-items-center justify-content-between mb-4">
                                    <div className="col-md-7">
                                        <form onSubmit={(e) => e.preventDefault()} className="rounded position-relative">
                                            <input
                                                className="form-control pe-5 bg-transparent"
                                                type="search"
                                                placeholder="Search name, email or course"
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

                                {loading ? <PageLoader /> : (
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
                                                        <h4 className="fw-bold">No student found</h4>
                                                        <p className="text-muted mb-4">
                                                            It's either we're unable to fetch the students or none have registered yet.
                                                            If you've added a student already and it's not listed here, kindly contact tech support.
                                                        </p>
                                                    </div>
                                                : 
                                                <table className="table align-middle p-4 mb-0">
                                                    <thead className="table-dark">
                                                        <tr>
                                                            <th scope="col" className="border-0 rounded-start">
                                                                Student Name
                                                            </th>
                                                            <th scope="col" className="border-0">
                                                                Courses Completed
                                                            </th>
                                                            <th scope="col" className="border-0">
                                                                Courses Enrolled
                                                            </th>
                                                            <th scope="col" className="border-0">
                                                                Date Registered
                                                            </th>
                                                            <th scope="col" className="border-0 rounded-end">
                                                                Action
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {students.map((student, index) => (
                                                            <tr key={index}>
                                                                <td>
                                                                    <div className="d-flex align-items-center gap-2">
                                                                        <div className="w-15">
                                                                            <img
                                                                                src={`${student?.gender === 'male' ? `${appUrl}/assets/img/male-avatar.webp` : `${appUrl}/assets/img/female-avatar.webp`}`}
                                                                                className="img-fluid rounded"
                                                                                alt=""
                                                                            />
                                                                        </div>
                                                                        <div className="student-info">
                                                                            <h6 className="mb-0 fw-semibold table-responsive-title">
                                                                                <a href="#">{student.name}</a>
                                                                            </h6>
                                                                            <small className="text-muted-2">{student.email}</small>
                                                                            <div className="d-flex gap-2">
                                                                                <p className="mb-0 text-muted-2 me-1">
                                                                                    <i className="bi bi-geo-alt-fill me-1" />
                                                                                    {student.country || 'Unknown Location'}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <span className="text-muted-2">{coursesCompleted(student)}</span>
                                                                </td>
                                                                <td>
                                                                    <span className="text-muted-2">{student.students.length}</span>
                                                                </td>
                                                                <td>
                                                                    <span className="text-muted-2">{ formatDateAndTime(student.createdAt) }</span>
                                                                </td>
                                                                <td>
                                                                    <button
                                                                        className="btn btn-sm btn-gray me-1 mb-0"
                                                                        onClick={() => handleStudentModal(student.id)}
                                                                        title="View Details"
                                                                    >
                                                                        <i className="bi bi-eye" />
                                                                    </button>
                                                                    <Link
                                                                        href={`/admin/students/courses/${student.id}`}
                                                                        className="btn btn-sm btn-light-red mb-0"
                                                                        data-bs-toggle="tooltip"
                                                                        data-bs-title="Block"
                                                                        title="View Courses"
                                                                    >
                                                                        <i className="bi bi-table" />
                                                                    </Link>
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

            <CustomModal 
                isOpen={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
                title="Student Details"
            >
                {studentDetails ? (
                    <div className="p-3">
                        <h5 className="fw-bold">{studentDetails.name}</h5>
                        <p className="text-muted mb-2">Email: {studentDetails.email}</p>
                        <p className="text-muted mb-2">Phone: {studentDetails.phone || 'Unknown'}</p>
                        <p className="text-muted mb-2">Country: {studentDetails.country || 'Unknown'}</p>
                        <p className="text-muted mb-2">City: {studentDetails.city || 'Unknown'}</p>
                        <p className="text-muted mb-2">State: {studentDetails.state || 'Unknown'}</p>
                        <p className="text-muted mb-2">Gender: {studentDetails.gender || 'Unknown'}</p>

                        <h6 className="mt-4">Courses Enrolled</h6>
                        {studentDetails.students && studentDetails.students.length > 0 ? (
                            <ul className="list-group">
                                {studentDetails.students.map((student: any, index: number) => (
                                    <li key={index} className="list-group-item">
                                        {student.course?.title || 'Unknown Course'}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted">No courses enrolled.</p>
                        )}

                        <h6 className="mt-4">Courses Completed</h6>
                        <p className="text-muted">{coursesCompleted(studentDetails)}</p>
                    </div>
                ) : (
                    <div className="text-center p-5">
                        <p className="text-muted">No student details available.</p>
                    </div>
                )}
            </CustomModal>
        </>
    )
}
export default StudentListPage