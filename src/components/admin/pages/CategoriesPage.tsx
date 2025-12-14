'use client'

import { useCallback, useEffect, useState } from "react"
import NavBreadcrumb from "../NavBreadcrumb"
import { toast } from "react-toastify";
import ButtonLoader from "../ButtonLoader";
import PageLoader from "../../website/PageLoader";
import { createCategory, deleteCategory, editCategory, fetchAllCategories } from "@/src/services/admin/category";
import CustomModal from "../CustomModal";
import { CategoryInterface } from "@/src/types";
import DeleteModal from "../DeleteModal";

const CategoriesPage = () => {
    const [loading, setLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [name, setName] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState<CategoryInterface[] | null>(null);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    const fetchCategories = useCallback(async () => {
        setTableLoading(true);

        try {
            const result = await fetchAllCategories();
            setCategories(result.categories);
        } 
        catch (error) {
            console.log('Error loading the categories: ', error);
            toast.error('Failed to load all categories');
        }
        finally {
            setTableLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories])

    const handleCategoryCreation = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error('You must submit a name for the category');
            return;
        }

        setLoading(true);

        try {
            const result = await createCategory(name);

            if (!result.success) {
                toast.error(result.errors);
                return;
            }

            setOpenCreateModal(false);
            toast.success(result.message);

            setName('');
            fetchCategories();
        }
        catch (error) {
            console.log(error);
            toast.error('Failed to add category, please try again');
        }
        finally {
            setLoading(false);
        }
    }

    const handleShowingEditModal = (id: string) => {
        const daCategory = categories?.find(category => category.id == id) || '';

        if (daCategory) {
            setName(daCategory.name);
            setShowEditModal(true);
            setCategoryId(daCategory.id);
        }
    }

    const handleCategoryEdits = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error('You must submit a name for the category');
            return;
        }
        console.log(name);

        setLoading(true);

        try {
            const result = await editCategory(categoryId, name);

            if (!result.success) {
                toast.error(result.errors);
                return;
            }

            setShowEditModal(false);
            toast.success(result.message);

            setName('');
            setCategoryId('');
            fetchCategories();
        }
        catch (error) {
            console.log(error);
            toast.error('Failed to add category, please try again');
        }
        finally {
            setLoading(false);
        }
    }

    const prepareConfirmationModal = (id: string) => {
        const category = categories?.find(category => category.id == id) || '';

        if (category) {
            setName(category.name);
            setCategoryId(category.id);
            setShowDeleteModal(true);
        }
    }

    const confirmDelete = async () => {
        if (!categoryId) return;

        try {
            const deleted = await deleteCategory(categoryId);

            if (!deleted.success) {
                toast.error(deleted.message);
            }

            setShowDeleteModal(false);
            toast.success(deleted.message);

            setName('');
            setCategoryId('');
            fetchCategories();
        } 
        catch (error) {
            console.log(error);
            toast.error('Failed to delete category, please try again');
        }
    }

    return (
        <>
            <div className="col-lg-9 col-md-12 col-sm-12">
                <NavBreadcrumb page="Course Categories" />
                
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12">
                        <div className="card border bg-transparent rounded-3">
                            <div className="card-header border-bottom">
                                <div className="d-flex align-items-center justify-content-between w-100">
                                    <h4 className="mb-2 mb-sm-0">Categories</h4>

                                    <button onClick={() => setOpenCreateModal(true)} className="btn btn-main btn-sm">Add New Category</button>
                                </div>
                            </div>
                            
                            <div className="card-body">

                                {tableLoading ? <PageLoader /> : (
                                    <>
                                        <div className="table-responsive border-0 rounded-3">
                                            {
                                                !categories?.length ?
                                                    <div className="text-center p-5">
                                                        <img
                                                            src={`${appUrl}/assets/img/empty.svg`}
                                                            alt="Empty State"
                                                            className="img-fluid mb-4"
                                                            style={{ maxWidth: 260, opacity: "0.9" }}
                                                        />
                                                        <h4 className="fw-bold">No categories</h4>
                                                        <p className="text-muted mb-4">
                                                            It's either we're unable to fetch the categories or you haven't addded any yet.
                                                            If you've added a category already and it's not listed here, kindly contact tech support.
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
                                                            <th scope="col" className="border-0 rounded-end">
                                                                Action
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            categories?.map((category, index) => (
                                                            <tr key={category.id}>
                                                                <td>
                                                                    <h6 className="mb-0 fw-semibold table-responsive-title">{ index + 1 }</h6>
                                                                </td>
                                                                <td>{ category.name }</td>
                                                        
                                                                <td>
                                                                    <button 
                                                                        onClick={() => handleShowingEditModal(category.id)} 
                                                                        className="btn btn-sm btn-gray me-1 mb-0"
                                                                    >
                                                                        <i className="bi bi-pencil-square"></i>
                                                                    </button>
                                                                    <button className="btn btn-sm btn-light-red mb-0"
                                                                        onClick={() => prepareConfirmationModal(category.id)}
                                                                    >
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
                isOpen={openCreateModal}
                title='Create Category'
                onClose={() => setOpenCreateModal(false)}
            >
                <form onSubmit={handleCategoryCreation}>
                    <div className="form-group mb-3">
                        <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-control"
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group mb-3">
                        <button disabled={loading} type="submit" className="btn btn-main btn-md w-100">
                            { loading ? <ButtonLoader /> : 'Submit' }
                        </button>
                    </div>
                </form>
            </CustomModal>

            <CustomModal
                isOpen={showEditModal}
                title='Edit Category'
                onClose={() => setShowEditModal(false)}
            >
                <form onSubmit={handleCategoryEdits}>
                    <div className="form-group mb-3">
                        <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-control"
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group mb-3">
                        <button disabled={loading} type="submit" className="btn btn-main btn-md w-100">
                            { loading ? <ButtonLoader /> : 'Save Changes' }
                        </button>
                    </div>
                </form>
            </CustomModal>

            <DeleteModal 
                isOpen={showDeleteModal}
                title={`⚠️ Delete category: ${name}`}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                item={name}
            />
        </>
    )
}
export default CategoriesPage