'use client'

import PageLoader from "@/src/components/website/PageLoader"
import { Prisma } from "@prisma/client"
import { useCallback, useEffect, useState } from "react"
import { toast } from "react-toastify"
import Link from "next/link"
import { adminCoursesUrl, adminDashboardUrl, courseModules, moduleComponentUrl } from "@/src/utils/url"
import { fetchComponentById } from "@/src/services/admin/module_component"
import VideoPlayer from "@/src/components/dashboard/VideoPlayer"

type DBComponentInterface = Prisma.ModuleComponentGetPayload<{
    include: {
        courseModule: {
            include: {
                course: true;
            };
        };
    };
}>;

const ComponentPreviewPage = ({componentId}: {componentId: string}) => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    const [videoIsLoading, setvideoIsLoading] = useState(false);
    const [component, setComponent] = useState<DBComponentInterface | null>(null);

    const fetchComponent = useCallback(async () => {
        setvideoIsLoading(true);

        try {
            const result = await fetchComponentById(componentId);

            if (result.component?.type !== 'video') {
                toast.error('Invalid request! You can only preview component that are videos through this medium');
                return;
            }

            setComponent(result.component as DBComponentInterface);
        } 
        catch (error) {
            console.log('Error loading the component: ', error);
            toast.error('Failed to fetch the selected component');
        }
        finally {
            setvideoIsLoading(false);
        }   
    }, [componentId]);

    useEffect(() => {
        fetchComponent();
    }, [fetchComponent]);

    return (
        <>
            <div className="col-lg-9 col-md-12 col-sm-12">
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 pb-4">
                        <nav aria-label="breadcrumb" className="d-flex justify-content-between align-items-middle">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link href={adminDashboardUrl}>Dashboard</Link>
                                </li>
                                <li className="breadcrumb-item">
                                    <Link href={adminCoursesUrl}>Courses</Link>
                                </li>
                                <li className="breadcrumb-item">
                                    <Link href={`${courseModules}/${component?.courseModule?.courseId}`}>Course Module</Link>
                                </li>
                                <li className="breadcrumb-item">
                                    <Link href={`${moduleComponentUrl}/${component?.courseModuleId}`}>Module Components</Link>
                                </li>
                                <li className="breadcrumb-item active" aria-current="page">
                                    Preview Component
                                </li>
                            </ol>

                            <Link href={`${moduleComponentUrl}/${component?.courseModuleId}`}>
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
                                    <h4 className="mb-2 mb-sm-0">{component?.name}</h4>
                                </div>
                            </div>
                            
                            <div className="card-body">

                                {videoIsLoading ? <PageLoader /> : (
                                    <>
                                        <div className="table-responsive border-0 rounded-3">
                                            {
                                                !component ?
                                                    <div className="text-center p-5">
                                                        <img
                                                            src={`${appUrl}/assets/img/empty.svg`}
                                                            alt="Empty State"
                                                            className="img-fluid mb-4"
                                                            style={{ maxWidth: 260, opacity: "0.9" }}
                                                        />
                                                        <h4 className="fw-bold">No Component Found</h4>
                                                        <p className="text-muted mb-4">
                                                            It's either we're unable to fetch the components or you haven't addded any yet.
                                                            If you've added a component already and it's not listed here, kindly contact tech support.
                                                        </p>
                                                    </div>
                                                :
                                                <div className="card shadow-sm border rounded-4 overflow-hidden">
                                                    <VideoPlayer url={component.vimeoVideoUrl ?? ''} />
                                                </div>
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
export default ComponentPreviewPage