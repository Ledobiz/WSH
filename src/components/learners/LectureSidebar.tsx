'use client';

import { CheckCircle2, ChevronDown, ChevronLeft, File, FileSpreadsheet, FileText, HelpCircle, Play } from "lucide-react";
import { Progress } from "../ui/progress";
import { AnimatePresence, motion } from "framer-motion";
import { Lesson } from "@/src/views/learners/CourseLecturePage";
import { durationInHourMinutesAndSeconds } from '@/src/utils/client_functions';
import { studentDashboardUrl } from "@/src/utils/url";
import { useSmartBack } from "@/src/hooks/useSmartBack";

interface LectureSidebarProps {
    toggleModule: (moduleId: string) => void;
    expandedModules: string[];
    progress: number;
    lectures: any[];
    onSelectLecture?: (moduleId: string, componentId: string) => void;
    activeComponentId?: string | null;
    courseTitle?: string;
}

const totalCompletedLectures = (module: any) => {
    if (!module?.components || module.components.length === 0) return 0;

    return module.components.reduce((total: number, component: any) => {
        return total + (component.lectureStatus && component.lectureStatus === 'completed' ? 1 : 0);
    }, 0);
}

const LessonIcon = ({ lesson, isCompleted }: { lesson: Lesson; isCompleted: boolean }) => {
    if (isCompleted) return <CheckCircle2 className="h-4 w-4 text-success shrink-0" />;
    const iconMap: Record<string, React.ReactNode> = {
        video: <Play className="h-4 w-4 text-muted-foreground shrink-0" />,
        pdf: <FileText className="h-4 w-4 text-destructive shrink-0" />,
        word: <File className="h-4 w-4 text-primary shrink-0" />,
        spreadsheet: <FileSpreadsheet className="h-4 w-4 text-success shrink-0" />,
        text: <FileText className="h-4 w-4 text-muted-foreground shrink-0" />,
        quiz: <HelpCircle className="h-4 w-4 text-muted-foreground shrink-0" />,
    };
    return <>{iconMap[lesson.type] || <FileText className="h-4 w-4 text-muted-foreground shrink-0" />}</>;
};

const LectureSidebar = ({ toggleModule, expandedModules, progress, lectures, courseTitle, onSelectLecture, activeComponentId }: LectureSidebarProps) => {
    const goBack = useSmartBack(studentDashboardUrl);

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-border">
                <button onClick={goBack} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2 cursor-pointer">
                    <ChevronLeft className="h-3 w-3" /> Back
                </button>
                <h2 className="font-display font-bold text-sm text-foreground line-clamp-2">{courseTitle}</h2>
                <div className="flex items-center gap-2 mt-2">
                    <Progress value={progress} className="flex-1 h-1.5" />
                    <span className="text-xs font-semibold text-primary">{progress}%</span>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                {lectures?.map((module: any, moduleIndex: number) => {
                    const isExpanded = expandedModules.includes(module.id);
                    
                    return (
                        <div key={module.id} className="border-b border-border last:border-0">
                            <button
                                onClick={() => toggleModule(module.id)}
                                className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left cursor-pointer"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground mb-0.5">Module {moduleIndex + 1}</p>
                                    <p className="font-semibold text-sm text-foreground">{module.name}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{totalCompletedLectures(module)}/{module?.components?.length} lessons</p>
                                </div>
                                <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform cursor-pointer ${isExpanded ? "rotate-180" : ""}`} />
                            </button>
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        {module.components?.map((component: any) => (
                                            <button
                                                key={component.id}
                                                onClick={() => onSelectLecture?.(module.id, component.id)}
                                                className={`w-full flex items-center gap-3 px-4 py-3 pl-6 text-left transition-colors text-sm cursor-pointer ${
                                                activeComponentId === component.id
                                                    ? "bg-primary/10 text-primary border-l-2 border-primary"
                                                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                                }`}
                                            >
                                                <LessonIcon lesson={component} isCompleted={false} />
                                                
                                                <div className="flex-1 min-w-0">
                                                    <p className="truncate text-xs font-medium">{component.name}</p>
                                                    <p className="text-[10px] text-muted-foreground">{durationInHourMinutesAndSeconds(component.duration || 30)}</p>
                                                </div>
                                                
                                                {component.lectureStatus && component.lectureStatus === 'completed' && (
                                                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                                                )}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}
export default LectureSidebar