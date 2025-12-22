'use client'

import PageLoader from "@/src/components/website/PageLoader"
import { ModuleComponent } from "@prisma/client"
import { useCallback, useEffect, useState } from "react"
import { toast } from "react-toastify"
import CustomModal from "../CustomModal"
import DeleteModal from "../DeleteModal"
import CourseModuleCreationForm from "../CourseModuleCreationForm"
import { CreateModuleComponentInterface } from "@/src/types"
import Link from "next/link"
import { adminCoursesUrl, adminDashboardUrl, componentPreviewUrl, courseModules } from "@/src/utils/url"
import { addComponent, deleteComponent, fetchAllComponents, updateComponent } from "@/src/services/admin/module_component"
import { CreateComponentValidation } from "@/src/validations/CourseValidation"
import * as z from "zod"
import ComponentCreationForm from "../ComponentCreationForm"

type DBComponentsInterface = ModuleComponent;

const ModuleComponentsPage = ({moduleId}: {moduleId: string}) => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    const [tableIsLoading, setTableIsLoading] = useState(false);
    const [components, setComponents] = useState<DBComponentsInterface[] | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [componentToEdit, setComponentToEdit] = useState<DBComponentsInterface | null>(null);
    const [componentId, setComponentId] = useState('');

    const fetchComponents = useCallback(async () => {
        setTableIsLoading(true);

        try {
            const result = await fetchAllComponents(moduleId);
            setComponents(result.components as DBComponentsInterface[]);
        } 
        catch (error) {
            console.log('Error loading the component: ', error);
            toast.error('Failed to load all components of this module');
        }
        finally {
            setTableIsLoading(false);
        }
    }, [moduleId]);

    useEffect(() => {
        fetchComponents();
    }, [fetchComponents]);

    const handleCreationModal = () => {
        setShowCreateModal(true);
        setComponentId('');
        setComponentToEdit(null);
    }

    const handleComponentCreation = async (data: CreateModuleComponentInterface) => {
        if (!data.name.trim() || !data.description.trim() || !data.duration || 
            !data.isPrerequisite || !data.type.trim()
        ) {
            toast.error('Please submit the name of the component');
            return;
        }

        const result = await addComponent(moduleId, data as unknown as z.infer<typeof CreateComponentValidation>);

        if (!result.success) {
            toast.error(result.message);
            return;
        }

        setShowCreateModal(false);
        toast.success(result.message);
        fetchComponents();
    }

    const handleEditModal = (id: string)  => {
        const courseModule = components?.find(c => c.id == id) || '';

        if (courseModule) {
            setComponentId(id);
            setComponentToEdit(courseModule);
            setShowEditModal(true);
        }
    }

    const handleComponentEditSubmission = async (data: CreateModuleComponentInterface) => {
        if (!data.name.trim() || !data.description.trim() || !data.duration || 
            !data.isPrerequisite || !data.type.trim()
        ) {
            toast.error('Please fill all required fields');
            return;
        }

        if (!componentId) {
            toast.error('Please select a component to edit');
            return;
        }

        const result = await updateComponent(componentId, data as unknown as z.infer<typeof CreateComponentValidation>);

        if (!result.success) {
            toast.error(result.message);
            return;
        }

        setShowEditModal(false);
        setComponentId('');
        setComponentToEdit(null);
        toast.success(result.message);
        fetchComponents();
    }

    const handleDeleteModal = (id: string) => {
        const component = components?.find(c => c.id == id) || '';

        if (component) {
            setComponentId(id);
            setComponentToEdit(component);
            setShowDeleteModal(true);
        }
    }

    const deleteDaComponent = async () => {
        if (!componentId) return;

        try {
            const deleted = await deleteComponent(componentId);

            if (!deleted.success) {
                toast.error(deleted.message);
            }

            setShowDeleteModal(false);
            toast.success(deleted.message);

            setComponentToEdit(null);
            setComponentId('');
            fetchComponents();
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
                        <nav aria-label="breadcrumb" className="d-flex justify-content-between align-items-center">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link href={adminDashboardUrl}>Dashboard</Link>
                                </li>
                                <li className="breadcrumb-item">
                                    <Link href={adminCoursesUrl}>Courses</Link>
                                </li>
                                <li className="breadcrumb-item">
                                    <Link href={`${courseModules}/${moduleId}`}>Course Module</Link>
                                </li>
                                <li className="breadcrumb-item active" aria-current="page">
                                    Module Component
                                </li>
                            </ol>

                            <Link href={`${courseModules}/${moduleId}`}>
                                <i className="bi bi-arrow-left" /> Back
                            </Link>
                        </nav>
                    </div>
                </div>
                
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12">
                        <div className="card border bg-transparent rounded-3">
                            <div className="card-header border-bottom">
                                <div className="d-flex align-items-center justify-content-between w-100">
                                    <h4 className="mb-2 mb-sm-0">Module Component</h4>

                                    <button onClick={handleCreationModal} className="btn btn-main btn-sm">Add New Component</button>
                                </div>
                            </div>
                            
                            <div className="card-body">

                                {tableIsLoading ? <PageLoader /> : (
                                    <>
                                        <div className="table-responsive border-0 rounded-3">
                                            {
                                                !components?.length ?
                                                    <div className="text-center p-5">
                                                        <img
                                                            src={`${appUrl}/assets/img/empty.svg`}
                                                            alt="Empty State"
                                                            className="img-fluid mb-4"
                                                            style={{ maxWidth: 260, opacity: "0.9" }}
                                                        />
                                                        <h4 className="fw-bold">No Components Found</h4>
                                                        <p className="text-muted mb-4">
                                                            It's either we're unable to fetch the components or you haven't addded any yet.
                                                            If you've added a component already and it's not listed here, kindly contact tech support.
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
                                                                Type
                                                            </th>
                                                            <th scope="col" className="border-0 rounded-end">
                                                                Action
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            components?.map((component, index) => (
                                                            <tr key={component.id}>
                                                                <td>
                                                                    <h6 className="mb-0 fw-semibold table-responsive-title">{ index + 1 }</h6>
                                                                </td>
                                                                <td>{ component.name }</td>
                                                                <td>{ component.duration } minutes</td>
                                                                <td className="text-center">
                                                                    {String(component.type) === 'pdf' ? 'PDF Document' : String(component.type) === 'word' ? 'Word Document' : String(component.type)}
                                                                </td>
                                                        
                                                                <td>
                                                                    <button onClick={() => handleEditModal(component.id)}
                                                                        className="btn btn-sm btn-gray me-1 mb-0"
                                                                    >
                                                                        <i className="bi bi-pencil-square"></i>
                                                                    </button>
                                                                    <Link 
                                                                        href={`${componentPreviewUrl}/${component.id}`} 
                                                                        className="btn btn-sm btn-success me-1 mb-0"
                                                                        title="Preview Component"
                                                                    >
                                                                        <i className="bi bi-eye" />
                                                                    </Link>
                                                                    <button onClick={() => handleDeleteModal(component.id)} className="btn btn-sm btn-light-red mb-0">
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
                <ComponentCreationForm 
                    mode="add"
                    formTitle="Create Component"
                    formText=""
                    onFormSubmit={handleComponentCreation}
                />
            </CustomModal>

            <CustomModal
                isOpen={showEditModal}
                title={`Edit Component: ${componentToEdit?.name}`}
                onClose={() => setShowEditModal(false)}
                size="modal-xl"
            >
                <ComponentCreationForm 
                    mode="edit"
                    formTitle="Edit Component"
                    formText=""
                    onFormSubmit={handleComponentEditSubmission}
                    initialValues={componentToEdit}
                />
            </CustomModal>

            <DeleteModal 
                isOpen={showDeleteModal}
                title={`⚠️ Delete Component: ${componentToEdit?.name}`}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={deleteDaComponent}
                item={componentToEdit?.name || ''}
            />
        </>
    )
}
export default ModuleComponentsPage