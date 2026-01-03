'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */

import styles from './LectureContentSidebar.module.css'
import { durationInHourMinutesAndSeconds } from '@/src/utils/client_functions';

const totalCompletedLectures = (module: any) => {
    if (!module?.components || module.components.length === 0) return 0;

    return module.components.reduce((total: number, component: any) => {
        return total + (component.lectureStatus && component.lectureStatus === 'completed' ? 1 : 0);
    }, 0);
}

const LectureContentSidebar = ({
    lectures,
    onSelectLecture,
    activeModuleId,
    activeComponentId,
}: {
    lectures: any[];
    onSelectLecture?: (moduleId: string, componentId: string) => void;
    activeModuleId?: string | null;
    activeComponentId?: string | null;
}) => {
    return (
        <div className="col-lg-4">
            <div className="bg-white rounded-4 shadow-sm">
                <h3 className="fw-bold mb-0">Course Content</h3>
                <h4 className="text-muted small mb-4">{lectures?.length} {lectures?.length === 1 ? 'module' : 'modules'}</h4>
                
                <div className={styles.courseScroll}>
                    {lectures?.map((module: any, moduleIndex: number) => (
                        <div key={module.id} className={`mb-4 ${moduleIndex !== 0 ? 'border-top' : ''}`}>
                            <button
                                className="btn w-100 fw-semibold mb-2 px-0 d-flex justify-content-between align-items-center module-toggle"
                                data-bs-toggle="collapse"
                                data-bs-target={`#module${moduleIndex}`}
                                aria-expanded="true"
                            >
                                {module.name} &nbsp;&nbsp;
                                <i className="bi bi-chevron-down toggle-arrow"></i>
                            </button>

                            <h3 className="text-muted small mb-2">{totalCompletedLectures(module)}/{module?.components?.length} completed</h3>
                            
                            <div id={`module${moduleIndex}`} className="collapse show">
                                {module.components?.map((component: any, componentIndex: number) => {
                                    const moduleOffset = (lectures?.slice(0, moduleIndex) || []).reduce((sum: number, prevModule: any) => {
                                        return sum + (prevModule?.components?.length || 0);
                                    }, 0);
                                    const lessonNumber = moduleOffset + componentIndex + 1;
                                    return (
                                        <div
                                            key={component.id}
                                            className={`lesson-item p-3 mb-2 rounded-3 ${activeModuleId && activeComponentId && module.id === activeModuleId && component.id === activeComponentId ? styles.activeLesson : ''}`}
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => onSelectLecture?.(module.id, component.id)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    onSelectLecture?.(module.id, component.id);
                                                }
                                            }}
                                        >
                                            <div className="d-flex align-items-center">
                                                <div className="lesson-number me-3">{ lessonNumber }</div>
                                                <div>
                                                    <p className="mb-0 fw-semibold">
                                                        { component.name}
                                                    </p>
                                                    <span className="text-muted small">{durationInHourMinutesAndSeconds(component.duration || 30 )}</span>
                                                </div>
                                                <div className="ms-auto">
                                                    {(!component.lectureStatus || component.lectureStatus === 'pending') && <span className="lesson-dot" />}
                                                    {component.lectureStatus && component.lectureStatus === 'completed' && <span className="lesson-dot completed" />}
                                                    {component.lectureStatus && component.lectureStatus === 'ongoing' && <span className="lesson-dot ongoing" />}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default LectureContentSidebar