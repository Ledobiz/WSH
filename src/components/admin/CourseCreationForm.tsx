'use client'

import { fetchAllCategories } from "@/src/services/admin/category";
import { CategoryInterface, CourseCreationInterface } from "@/src/types";
import { Course } from "@/prisma/generated/prisma/client";
import { useEffect, useRef, useState } from "react";

import TextEditor from "./TextEditor";
import ButtonLoader from "./ButtonLoader";
import { toast } from "react-toastify";

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE = 3 * 1024 * 1024; // 3MB

type DBCourseInterface = Course;

interface formProps {
    formTitle: string;
    formText: string;
    onFormSubmit: (data: CourseCreationInterface) => Promise<void>;
    initialValues?: DBCourseInterface | null;
    mode: 'add' | 'edit';
}

const mapDbRecordsToForm = (course: DBCourseInterface): CourseCreationInterface => {
    return {
        title: course.title,
        categoryId: course.categoryId,
        description: course.description ?? '',
        originalFee: course.originalFee,
        discountedFee: course.discountedFee,

        thumbnail: null,
        banner: null,

        previewVideo: course.previewVideo ?? '',
        isFree: course.isFree,

        seoTitle: course.seoTitle ?? '',
        seoDescription: course.seoDescription ?? '',
        seoKeywords: course.seoKeywords ?? '',

        isActive: course.isActive ?? false,
        whoIsCourseFor: course.whoIsCourseFor ?? '',
    };
}

const CourseCreationForm = ({formTitle, formText, onFormSubmit, initialValues, mode}: formProps) => {
    const thumbnailRef = useRef<HTMLInputElement | null>(null)
    const bannerRef = useRef<HTMLInputElement | null>(null)
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<CategoryInterface[] | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [bannerPreview, setBannerPreview] = useState<string | null>(null)
    const [fileError, setFileError] = useState<string | null>(null)
    const [bannerError, setBannerError] = useState<string | null>(null)
    const [formData, setFormData] = useState<CourseCreationInterface>({
        title: '',
        categoryId: '',
        description: '',
        originalFee: 5000,
        discountedFee: 3000,
        thumbnail: null,
        banner:  null,
        previewVideo: '',
        isFree: false,
        seoTitle: '',
        seoDescription: '',
        seoKeywords: '',
        isActive: false,
        whoIsCourseFor: '',
    });

    useEffect(() => {
        if (initialValues) {
            setFormData(mapDbRecordsToForm(initialValues));
            setImagePreview(initialValues.thumbnail);
            setBannerPreview(initialValues.banner);
        }
    }, [initialValues]);
    
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const result = await fetchAllCategories();
                setCategories(result.categories);
            } 
            catch (error) {
                console.log('Error loading the categories: ', error);
            }
        }

        fetchCategories();
    }, []);

    const handleInputChange = <K extends keyof CourseCreationInterface>(
        field: K, 
        value: CourseCreationInterface[K]
    ) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            clearThumbnail();
            return;
        }

        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            setFileError('Only JPG, PNG or WEBP images are allowed.');
            clearThumbnail();
            return
        }

        if (file.size > MAX_IMAGE_SIZE) {
            setFileError('Image size must not exceed 3MB.');
            clearThumbnail();
            return
        }

        setFileError(null);
        handleInputChange('thumbnail', file);

        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
    }

    const clearThumbnail = () => {
        handleInputChange('thumbnail', null)
        setImagePreview(null)
        setFileError(null)

        if (thumbnailRef.current) {
            thumbnailRef.current.value = '';
        }
    }

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            clearBanner();
            return;
        }

        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            setBannerError('Only JPG, PNG or WEBP images are allowed.');
            clearBanner();
            return
        }

        if (file.size > MAX_IMAGE_SIZE) {
            setBannerError('Image size must not exceed 3MB.');
            clearBanner();
            return
        }

        setBannerError(null);
        handleInputChange('banner', file);

        const previewUrl = URL.createObjectURL(file);
        setBannerPreview(previewUrl);
    }

    const clearBanner = () => {
        handleInputChange('banner', null)
        setBannerPreview(null)
        setBannerError(null)

        if (bannerRef.current) {
            bannerRef.current.value = '';
        }
    }

    const handleSubmission = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);

        try {
            await onFormSubmit(formData);
        } 
        catch (error) {
            console.log('Error while creating the course', error);
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
                <label className="form-label">Course Title <span className="text-danger">*</span></label>
                <input
                    type="text"
                    name="title"
                    className="form-control"
                    placeholder="Enter course title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                />
                <small className="text-muted">
                    Maximum of 191 character course title.
                </small>
            </div>

            <div className="form-group mb-3">
                <label className="form-label">Courses category <span className="text-danger">*</span></label>
                <select name="categoryId" className="form-control"
                    value={formData.categoryId}
                    onChange={(e) => handleInputChange('categoryId', e.target.value)}
                    required
                >
                    <option value="">-- Choose --</option>
                    {categories?.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
            </div>

            <div className="form-group mb-3">
                <label className="form-label">Is this as a free course? <span className="text-danger">*</span></label>
                <div className="form-check">
                    <input
                        id="freecourse"
                        className="form-check-input"
                        name="isFree"
                        type="checkbox"
                        checked={formData.isFree == true}
                        onChange={(e) => handleInputChange('isFree', e.target.checked)}
                    />
                    <label
                        htmlFor="freecourse"
                        className="form-check-label text-muted-2"
                    >
                        Check if this is a free course.
                    </label>
                </div>
            </div>

            <div className="form-group mb-3">
                <label className="form-label">Original Fee (&#8358;) <span className="text-danger">*</span></label>
                <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalFee}
                    className="form-control"
                    placeholder="e.g., 99"
                    required
                    onChange={(e) => handleInputChange('originalFee', parseInt(e.target.value))}
                />
            </div>

            <div className="form-group mb-3">
                <label className="form-label">DIscounted Fee (&#8358;) <span className="text-danger">*</span></label>
                <input
                    type="number"
                    name="discountedPrice"
                    value={formData.discountedFee}
                    className="form-control"
                    placeholder="e.g., 99"
                    required
                    onChange={(e) => handleInputChange('discountedFee', parseInt(e.target.value))}
                />
            </div>
            
            {/* Thumbnail Upload */}
            <div className="mb-4">
                <label className="form-label">
                    Course Thumbnail <span className="text-danger">*</span>
                </label>
                <div className="border rounded d-flex align-items-center justify-content-between p-3">
                    <div className="d-flex align-items-center">
                        <i className="bi bi-image fs-4 text-custom me-3" />
                        <input
                            type="file"
                            ref={thumbnailRef}
                            id="thumbnailInput"
                            className="form-control"
                            accept="image/*"
                            onChange={handleThumbnailChange}
                        />
                        {fileError && (
                            <small className="text-danger d-block mt-1">
                                {fileError}
                            </small>
                        )}
                    </div>
                    {imagePreview && (
                        <img
                            id="thumbnailPreview"
                            src={imagePreview}
                            className="img-thumbnail ms-3"
                            alt="Preview"
                            style={{width: 100}}
                        />
                    )}
                </div>
                <small className="text-muted d-block mt-2">
                    Allowed file type: JPG, PNG, JPEG, webp
                </small>
            </div>

            {/* Banner Upload */}
            <div className="mb-4">
                <label className="form-label">
                    Course Banner <span className="text-danger">*</span>
                </label>
                <div className="border rounded d-flex align-items-center justify-content-between p-3">
                    <div className="d-flex align-items-center">
                        <i className="bi bi-image fs-4 text-custom me-3" />
                        <input
                            type="file"
                            ref={bannerRef}
                            id="bannerInput"
                            className="form-control"
                            accept="image/*"
                            onChange={handleBannerChange}
                        />
                        {bannerError && (
                            <small className="text-danger d-block mt-1">
                                {bannerError}
                            </small>
                        )}
                    </div>
                    {bannerPreview && (
                        <img
                            id="bannerPreview"
                            src={bannerPreview}
                            className="img-thumbnail ms-3"
                            style={{width: 100}}
                            alt="Preview"
                        />
                    )}
                </div>
                <small className="text-muted d-block mt-2">
                    Allowed file type: JPG, PNG, JPEG, webp
                </small>
            </div>

            {/* Preview Video Upload */}
            <div className="mb-4">
                <label className="form-label">Preview Video URL</label>
                <input
                    type="text"
                    name="previewVideo"
                    value={formData.previewVideo ?? ''}
                    className="form-control"
                    placeholder="Enter course preview video URL"
                    onChange={(e) => handleInputChange('previewVideo', e.target.value)}
                />
            </div>
            
            <div className="form-group mb-3">
                <label className="form-label">SEO Meta Title <span className="text-danger">*</span></label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., Advance Java Script"
                    value={formData.seoTitle}
                    required
                    onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                />
                <span className="text-muted text-mid">
                    Use max 65 characters only.
                </span>
            </div>
            <div className="form-group mb-3">
                <label className="form-label">SEO Description <span className="text-danger">*</span></label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., Meta Description"
                    value={formData.seoDescription}
                    required
                    onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                />
                <span className="text-muted text-mid">
                    Use max 150 characters only.
                </span>
            </div>
            <div className="form-group mb-3">
                <label className="form-label">SEO Keywords <span className="text-danger">*</span></label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., Design, Figma, Java"
                    value={formData.seoKeywords}
                    required
                    onChange={(e) => handleInputChange('seoKeywords', e.target.value)}
                />
                <span className="text-muted text-mid">Use keywords with commas.</span>
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
                        Check if the course should appear on the website.
                    </label>
                </div>
            </div>

            
            
            <div className="form-group mb-3">
                <label className="form-label">Course Description <span className="text-danger">*</span></label>
                <TextEditor 
                    value={formData.description}
                    onChange={(value) => handleInputChange('description', value)}
                />
            </div>
            
            <div className="form-group mb-3">
                <label className="form-label">Who is the course for</label>
                <TextEditor 
                    value={formData.whoIsCourseFor ?? ''}
                    onChange={(value) => handleInputChange('whoIsCourseFor', value)}
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
export default CourseCreationForm