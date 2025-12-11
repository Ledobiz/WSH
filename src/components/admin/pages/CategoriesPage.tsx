'use client'

import { useCallback, useEffect, useState } from "react"
import NavBreadcrumb from "../NavBreadcrumb"
import { toast } from "react-toastify";
import ButtonLoader from "../ButtonLoader";
import PageLoader from "../../website/PageLoader";
import { createCategory, fetchAllCategories } from "@/src/services/admin/category";

interface CategoryInterface {
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
}

const CategoriesPage = () => {
    const [loading, setLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [name, setName] = useState('');
    const [categories, setCategories] = useState<CategoryInterface[] | null>(null);

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

            const modalElement = document.getElementById('createCategory');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);

            // Hide the modal
            if (modalInstance) {
                modalInstance.hide();
            }

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

                                    <button data-bs-toggle="modal" data-bs-target="#createCategory" data-bs-dismiss="modal" className="btn btn-main btn-sm">Add New Category</button>
                                </div>
                            </div>
                            
                            <div className="card-body">

                                {tableLoading ? <PageLoader /> : (
                                    <>
                                        <div className="table-responsive border-0 rounded-3">
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
                                                        <tr key={category.slug}>
                                                            <td>
                                                                <h6 className="mb-0 fw-semibold table-responsive-title">{ index + 1 }</h6>
                                                            </td>
                                                            <td>{ category.name }</td>
                                                    
                                                            <td>
                                                                <a href="#" className="btn btn-sm btn-gray me-1 mb-0"><i className="bi bi-pencil-square"></i></a>
                                                                <button className="btn btn-sm btn-light-red mb-0"><i className="bi bi-trash3"></i></button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="modal fade"
                id="createCategory"
                tabIndex={-1}
                role="dialog"
                aria-labelledby="sign-up"
                aria-hidden="true"
            >
                <div
                    className="modal-dialog modal-dialog-centered login-pop-form"
                    role="document"
                >
                    <div className="modal-content" id="signup">
                        <div className="position-absolute end-0 top-0 mt-3 me-3 z-1">
                            <span
                            className="square--30 circle bg-light z-2"
                            data-bs-dismiss="modal"
                            aria-hidden="true"
                            >
                            <i className="bi bi-x" />
                            </span>
                        </div>
                        <div className="modal-body p-4">
                            <div className="login-caps mb-4">
                                <div className="text-center">
                                    <h2 className="fw-semibold m-0">Create New Category</h2>
                                </div>
                            </div>
                            
                            <div className="login-form">
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
                                        <button disabled={loading} type="submit" className="btn btn-main btn-sm w-100">
                                            { loading ? <ButtonLoader /> : 'Submit' }
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default CategoriesPage