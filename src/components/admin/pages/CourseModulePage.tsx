'use client'

import PageLoader from "@/src/components/website/PageLoader"
import { addModule, deleteModule, fetchAllModules, updateModule } from "@/src/services/admin/course_module"
import { Prisma } from "@prisma/client"
import { useCallback, useEffect, useState } from "react"
import { toast } from "react-toastify"
import CustomModal from "../CustomModal"
import DeleteModal from "../DeleteModal"
import CourseModuleCreationForm from "../CourseModuleCreationForm"
import { CreateModuleInterface } from "@/src/types"
import Link from "next/link"
import { adminCoursesUrl, adminDashboardUrl, moduleComponentUrl } from "@/src/utils/url"

type DBModulesInterface = Prisma.CourseModuleGetPayload<{
    include: {
        moduleComponents: true;
    };
}>;

const CourseModulePage = ({courseId}: {courseId: string}) => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    const [tableIsLoading, setTableIsLoading] = useState(false);
    const [modules, setModules] = useState<DBModulesInterface[] | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [moduleToEdit, setModuleToEdit] = useState<DBModulesInterface | null>(null);
    const [moduleId, setModuleId] = useState('');

    const fetchModules = useCallback(async () => {
        setTableIsLoading(true);

        try {
            const result = await fetchAllModules(courseId);
            setModules(result.modules as DBModulesInterface[]);
        } 
        catch (error) {
            console.log('Error loading the courses: ', error);
            toast.error('Failed to load all modules of this course');
        }
        finally {
            setTableIsLoading(false);
        }
    }, [courseId]);

    useEffect(() => {
        fetchModules();
    }, [fetchModules]);

    const handleModuleCreation = async (data: CreateModuleInterface) => {
        if (!data.name.trim()) {
            toast.error('Please submit the name of the module');
            return;
        }

        const result = await addModule(courseId, data);

        if (!result.success) {
            toast.error(result.message);
            return;
        }

        setShowCreateModal(false);
        toast.success(result.message);
        fetchModules();
    }

    const handleEditModal = (id: string)  => {
        const courseModule = modules?.find(c => c.id == id) || '';

        if (courseModule) {
            console.log(courseModule);
            setModuleId(id);
            setModuleToEdit(courseModule);
            setShowEditModal(true);
        }
    }

    const handleModuleEditSubmission = async (data: CreateModuleInterface) => {
        if (!data.name.trim()) {
            toast.error('Please fill all required fields');
            return;
        }

        if (!moduleId) {
            toast.error('Please select a module to edit');
            return;
        }

        const result = await updateModule(moduleId, data);

        if (!result.success) {
            toast.error(result.message);
            return;
        }

        setShowEditModal(false);
        toast.success(result.message);
        fetchModules();
    }

    const handleDeleteModal = (id: string) => {
        const courseModule = modules?.find(c => c.id == id) || '';

        if (courseModule) {
            setModuleId(id);
            setModuleToEdit(courseModule);
            setShowDeleteModal(true);
        }
    }

    const deleteDaModule = async () => {
        if (!moduleId) return;

        try {
            const deleted = await deleteModule(moduleId);

            if (!deleted.success) {
                toast.error(deleted.message);
            }

            setShowDeleteModal(false);
            toast.success(deleted.message);

            setModuleToEdit(null);
            setModuleId('');
            fetchModules();
        } 
        catch (error) {
            console.log(error);
            toast.error('Failed to delete the course, please try again');
        }
    }


    return (
        <>
            <div className="col-lg-9 col-md-12 col-sm-12">
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 pb-4">
                        <nav aria-label="breadcrumb" className="d-flex justify-content-between align-center">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link href={adminDashboardUrl}>Dashboard</Link>
                                </li>
                                <li className="breadcrumb-item">
                                    <Link href={adminCoursesUrl}>Courses</Link>
                                </li>
                                <li className="breadcrumb-item active" aria-current="page">
                                    Course Modules
                                </li>
                            </ol>

                            <Link href={adminCoursesUrl}><i className="bi bi-arrow-left" /> Back</Link>
                        </nav>
                    </div>
                </div>
                
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12">
                        <div className="card border bg-transparent rounded-3">
                            <div className="card-header border-bottom">
                                <div className="d-flex align-items-center justify-content-between w-100">
                                    <h4 className="mb-2 mb-sm-0">Course Modules</h4>

                                    <button onClick={() => setShowCreateModal(true)} className="btn btn-main btn-sm">Add New Module</button>
                                </div>
                            </div>
                            
                            <div className="card-body">

                                {tableIsLoading ? <PageLoader /> : (
                                    <>
                                        <div className="table-responsive border-0 rounded-3">
                                            {
                                                !modules?.length ?
                                                    <div className="text-center p-5">
                                                        <img
                                                            src={`${appUrl}/assets/img/empty.svg`}
                                                            alt="Empty State"
                                                            className="img-fluid mb-4"
                                                            style={{ maxWidth: 260, opacity: "0.9" }}
                                                        />
                                                        <h4 className="fw-bold">No Modules Found</h4>
                                                        <p className="text-muted mb-4">
                                                            It's either we're unable to fetch the modules or you haven't addded any yet.
                                                            If you've added a module already and it's not listed here, kindly contact tech support.
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
                                                                Name
                                                            </th>
                                                            <th scope="col" className="border-0">
                                                                Duration
                                                            </th>
                                                            <th scope="col" className="border-0 text-center">
                                                                Components
                                                            </th>
                                                            <th scope="col" className="border-0 rounded-end">
                                                                Action
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            modules?.map((module, index) => (
                                                            <tr key={module.id}>
                                                                <td>
                                                                    <h6 className="mb-0 fw-semibold table-responsive-title">{ index + 1 }</h6>
                                                                </td>
                                                                <td>{ module.name }</td>
                                                                <td>{ module.totalDuration } minutes</td>
                                                                <td className="text-center">{ module.moduleComponents?.length }</td>
                                                        
                                                                <td>
                                                                    <button onClick={() => handleEditModal(module.id)}
                                                                        className="btn btn-sm btn-gray me-1 mb-0"
                                                                    >
                                                                        <i className="bi bi-pencil-square"></i>
                                                                    </button>
                                                                    <Link 
                                                                        href={`${moduleComponentUrl}/${module.id}`} 
                                                                        className="btn btn-sm btn-success me-1 mb-0"
                                                                        title="Manage Components"
                                                                    >
                                                                        <i className="bi bi-table" />
                                                                    </Link>
                                                                    <button onClick={() => handleDeleteModal(module.id)} className="btn btn-sm btn-light-red mb-0">
                                                                        <i className="bi bi-trash3"></i>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            }
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CustomModal 
                isOpen={showCreateModal}
                title=""
                onClose={() => setShowCreateModal(false)}
                size="modal-xl"
            >
                <CourseModuleCreationForm 
                    mode="add"
                    formTitle="Create Module"
                    formText=""
                    onFormSubmit={handleModuleCreation}
                />
            </CustomModal>

            <CustomModal
                isOpen={showEditModal}
                title={`Edit Module: ${moduleToEdit?.name}`}
                onClose={() => setShowEditModal(false)}
                size="modal-xl"
            >
                <CourseModuleCreationForm 
                    mode="edit"
                    formTitle="Edit Module"
                    formText=""
                    onFormSubmit={handleModuleEditSubmission}
                    initialValues={moduleToEdit}
                />
            </CustomModal>

            <DeleteModal 
                isOpen={showDeleteModal}
                title={`⚠️ Delete Module: ${moduleToEdit?.name}`}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={deleteDaModule}
                item={moduleToEdit?.name || ''}
            />
        </>
    )
}
export default CourseModulePage