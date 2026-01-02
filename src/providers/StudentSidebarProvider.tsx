'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthProvider';
import { getUserProgressCounts } from '@/src/services/student/course';

type SidebarContextType = {
    coursesEnrolled: number;
    lecturesDone: number;
    setCoursesEnrolled: (value: number) => void;
    setLecturesDone: (value: number) => void;
};

const SidebarContext = createContext<SidebarContextType>({
    coursesEnrolled: 0,
    lecturesDone: 0,
    setCoursesEnrolled: () => {},
    setLecturesDone: () => {},
});

export const useProgressCounts = () => {
    const context = useContext(SidebarContext);

    if (!context) {
        throw new Error('useProgressCounts must be used within a SidebarProvider');
    }
    return context;
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [coursesEnrolled, setCoursesEnrolled] = useState(0);
    const [lecturesDone, setLecturesDone] = useState(0);
    const { user } = useAuth();

    useEffect(() => {
        const fetchCounts = async () => {
            if (!user?.id) return;
            const res = await getUserProgressCounts(user.id);
            if (res?.success) {
                setCoursesEnrolled(res.data.coursesCount);
                setLecturesDone(res.data.lecturesCompletedCount);
            }
        };
        fetchCounts();
    }, [user?.id]);

    return (
        <SidebarContext.Provider value={{coursesEnrolled, lecturesDone, setCoursesEnrolled, setLecturesDone}}>
            {children}
        </SidebarContext.Provider>
    )
}