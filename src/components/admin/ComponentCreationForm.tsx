'use client';

import { CreateModuleComponentInterface } from "@/src/types";
import { ModuleComponent } from "@prisma/client"
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import TextEditor from "./TextEditor";
import ButtonLoader from "./ButtonLoader";

type DBModuleComponentInterface = ModuleComponent;

const ALLOWED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface formprops {
    formTitle: string;
    formText: string;
    onFormSubmit: (data: CreateModuleComponentInterface) => Promise<void>;
    initialValues?: DBModuleComponentInterface | null;
    mode: 'add' | 'edit';
}

const mapDbRecordsToForm = (component: DBModuleComponentInterface): CreateModuleComponentInterface => {
    return {
        name: component.name,
        description: component.description ?? '',
        type: component.type,
        vimeoVideoUrl: component.vimeoVideoUrl ?? '',
        fileName: null,
        filePreviewUrl: component.fileName ?? '',
        isPrerequisite: component.isPrerequisite,
        isFree: component.isFree,
        duration: component.duration ?? 0,
        isActive: component.isActive,
    }
}

const ComponentCreationForm = ({formTitle, formText, onFormSubmit, initialValues, mode}: formprops) => {
    const fileRef = useRef<HTMLInputElement | null>(null);
    const [loading, setLoading] = useState(false);
    const [fileError, setFileError] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [formData, setFormData] = useState<CreateModuleComponentInterface>({
        name: '',
        description: '',
        duration: 30,
        type: 'video',
        vimeoVideoUrl: '',
        fileName: null,
        filePreviewUrl: '',
        isPrerequisite: true,
        isFree: false,
        isActive: true,
    });

    useEffect(() => {
        if (initialValues) {
            setFormData(mapDbRecordsToForm(initialValues));
            setFileName(initialValues.fileName);
        }
    }, [initialValues]);

    const handleInputChange = <K extends keyof CreateModuleComponentInterface>(
        field: K, 
        value: CreateModuleComponentInterface[K]
    ) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        
        if (!file) {
            clearFile();
            return;
        }

        // Validate file type for document components
        if (formData.type === 'file' && !ALLOWED_FILE_TYPES.includes(file.type)) {
            setFileError('Only PDF or Word document files are allowed.');
            clearFile();
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setFileError('File size must not exceed 10MB.');
            clearFile();
            return;
        }

        setFileError(null);
        handleInputChange('fileName', file);
        setFileName(file.name);
    }

    const clearFile = () => {
        handleInputChange('fileName', null);
        setFileName(null);
        setFileError(null);

        if (fileRef.current) {
            fileRef.current.value = '';
        }
    }

    const handleSubmission = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);

        try {
            await onFormSubmit(formData);
        } 
        catch (error) {
            console.log('Error while creating the component', error);
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
                <label className="form-label">Component Name <span className="text-danger">*</span></label>
                <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Enter component name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                />
                <small className="text-muted">
                    Maximum of 191 character component.
                </small>
            </div>
            
            <div className="form-group mb-3">
                <label className="form-label">Component Type <span className="text-danger">*</span></label>
                <select
                    name="type"
                    className="form-control"
                    value={formData.type}
                    onChange={(e) => {
                        handleInputChange('type', e.target.value);
                    }}
                    required
                >
                    <option value="video">Video</option>
                    <option value="file">File</option>
                </select>
            </div>

            <div className="form-group mb-3">
                <label className="form-label">Duration (In Minutes) <span className="text-danger">*</span></label>
                <input
                    type="number"
                    name="duration"
                    value={formData.duration ?? 0}
                    className="form-control"
                    required
                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                />
            </div>    

            <div className="mb-4">
                {formData.type == 'file' ? (
                    <>
                        <label className="form-label">
                            Upload the File <span className="text-danger">*</span>
                        </label>
                        <div className="border rounded d-flex align-items-center justify-content-between p-3">
                            <div className="d-flex align-items-center flex-grow-1">
                                <i className="bi bi-file-earmark-word fs-4 text-custom me-3" />
                                <div className="flex-grow-1">
                                    <input
                                        type="file"
                                        ref={fileRef}
                                        id="fileInput"
                                        className="form-control"
                                        accept="application/pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                        onChange={handleFileChange}
                                    />
                                    {fileError && (
                                        <small className="text-danger d-block mt-1">
                                            {fileError}
                                        </small>
                                    )}
                                    {fileName && !fileError && (
                                        <small className="text-success d-block mt-1">
                                            Selected: {fileName}
                                        </small>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <label className="form-label">Video URL <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            name="vimeoVideoUrl"
                            value={formData.vimeoVideoUrl ?? ''}
                            className="form-control"
                            placeholder="Enter lecture video URL"
                            onChange={(e) => handleInputChange('vimeoVideoUrl', e.target.value)}
                        />
                    </>
                )}
            </div>
            
            <div className="form-group mb-3">
                <label className="form-label">Description <span className="text-danger">*</span></label>
                <TextEditor 
                    value={formData.description ?? ''}
                    onChange={(value) => handleInputChange('description', value)}
                />
            </div>

            <div className="form-group mb-3">
                <label className="form-label">Is this component a prerequisite? <span className="text-danger">*</span></label>
                <div className="form-check">
                    <input
                        id="isPrerequisite"
                        className="form-check-input"
                        name="isPrerequisite"
                        type="checkbox"
                        checked={formData.isPrerequisite == true}
                        onChange={(e) => handleInputChange('isPrerequisite', e.target.checked)}
                    />
                    <label
                        htmlFor="isPrerequisite"
                        className="form-check-label text-muted-2"
                    >
                        Make sure they cannot proceed to next lecture without completing this one.
                    </label>
                </div>
            </div>

            <div className="form-group mb-3">
                <label className="form-label">Is this as a free component? <span className="text-danger">*</span></label>
                <div className="form-check">
                    <input
                        id="isFree"
                        className="form-check-input"
                        name="isFree"
                        type="checkbox"
                        checked={formData.isFree == true}
                        onChange={(e) => handleInputChange('isFree', e.target.checked)}
                    />
                    <label
                        htmlFor="isFree"
                        className="form-check-label text-muted-2"
                    >
                        Check if this component should be viewed for free (Useful for preview videos).
                    </label>
                </div>
            </div>   

            <div className="form-group mb-3">
                <label className="form-label">Is available to the public? <span className="text-danger">*</span></label>
                <div className="form-check">
                    <input
                        id="isActive"
                        className="form-check-input"
                        name="isActive"
                        type="checkbox"
                        checked={formData.isActive == true}
                        onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    />
                    <label
                        htmlFor="isActive"
                        className="form-check-label text-muted-2"
                    >
                        Check if the component should be available to the students who enrolled.
                    </label>
                </div>
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
export default ComponentCreationForm