'use client';

import { CreateModuleInterface } from "@/src/types";
import { CourseModule } from "@prisma/client"
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TextEditor from "./TextEditor";
import ButtonLoader from "./ButtonLoader";

type DBModuleInterface = CourseModule;

interface formprops {
    formTitle: string;
    formText: string;
    onFormSubmit: (data: CreateModuleInterface) => Promise<void>;
    initialValues?: DBModuleInterface | null;
    mode: 'add' | 'edit';
}

const mapDbRecordsToForm = (module: DBModuleInterface): CreateModuleInterface => {
    return {
        name: module.name,
        description: module.description ?? '',
        totalDuration: module.totalDuration ?? 0,
    }
}

const CourseModuleCreationForm = ({formTitle, formText, onFormSubmit, initialValues, mode}: formprops) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CreateModuleInterface>({
        name: '',
        description: '',
        totalDuration: 30,
    });

    useEffect(() => {
        if (initialValues) {
            setFormData(mapDbRecordsToForm(initialValues));
        }
    }, [initialValues]);

    const handleInputChange = <K extends keyof CreateModuleInterface>(
        field: K, 
        value: CreateModuleInterface[K]
    ) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmission = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);

        try {
            await onFormSubmit(formData);
        } 
        catch (error) {
            console.log('Error while creating the module', error);
            toast.error('Something went wrong, please try again.');
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmission}>
            <div className="mb-4">
                <h5 className="text-darks mb-0 lh-base">{ formTitle }</h5>
                <p className="text-muted">{ formText }</p>
            </div>
            <div className="form-group mb-3">
                <label className="form-label">Module Name <span className="text-danger">*</span></label>
                <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Enter module name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                />
                <small className="text-muted">
                    Maximum of 191 character module.
                </small>
            </div>
            
            <div className="form-group mb-3">
                <label className="form-label">Total Duration (In Minutes) <span className="text-danger">*</span></label>
                <input
                    type="number"
                    name="totalDuration"
                    value={formData.totalDuration ?? 0}
                    className="form-control"
                    required
                    onChange={(e) => handleInputChange('totalDuration', parseInt(e.target.value))}
                />
            </div>            
            
            <div className="form-group mb-3">
                <label className="form-label">Description <span className="text-danger">*</span></label>
                <TextEditor 
                    value={formData.description ?? ''}
                    onChange={(value) => handleInputChange('description', value)}
                />
            </div>
            
            <div className="d-flex justify-content-between mt-4">
                <button type="submit" className="btn btn-main px-4" disabled={loading}>
                    { loading ? 
                        <ButtonLoader /> :  
                        mode == 'add' ? 'Submit' : 'Save Changes'
                    }
                </button>
            </div>
        </form>
    )
}
export default CourseModuleCreationForm