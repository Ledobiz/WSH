'use client'

import NavBreadcrumb from "@/src/components/admin/NavBreadcrumb"
import PageLoader from "@/src/components/website/PageLoader"
import { useCallback, useState } from "react"

const CourseModules = () => {
    const [tableIsLoading, setTableIsLoading] = useState(false);
    const [modules, setModules] = useState();

    const fetchModules = useCallback(async () => {
        setTableIsLoading(true);

        try {
            
        } catch (error) {
            
        }
    }, []);



    return (
        <>
            <div className="col-lg-9 col-md-12 col-sm-12">
                <NavBreadcrumb page="Course Modules" />
                
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12">
                        <div className="card border bg-transparent rounded-3">
                            <div className="card-header border-bottom">
                                <div className="d-flex align-items-center justify-content-between w-100">
                                    <h4 className="mb-2 mb-sm-0">Course Modules</h4>

                                    <button className="btn btn-main btn-sm">Add New Module</button>
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
                                                                <td>{ module.name }</td>
                                                        
                                                                <td>
                                                                    <button 
                                                                        className="btn btn-sm btn-gray me-1 mb-0"
                                                                    >
                                                                        <i className="bi bi-pencil-square"></i>
                                                                    </button>
                                                                    <button className="btn btn-sm btn-light-red mb-0">
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
        </>
    )
}
export default CourseModules