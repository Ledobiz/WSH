'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthProvider';

const SidebarContext = createContext({
    coursesDone: 0,
    lecturesDone: 0,
});

export const useProgressCounts = () => {
    const context = useContext(SidebarContext);

    if (!context) {
        throw new Error('useProgressCounts must be used within a SidebarProvider');
    }
    return context;
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [coursesDone, setCoursesDone] = useState(0);
    const [lecturesDone, setLecturesDone] = useState(0);
    const { user } = useAuth();

    useEffect(() => {
        // TODO:: Calculations for lectures done and courses done.
    }, []);

    return (
        <SidebarContext.Provider value={{coursesDone, lecturesDone}}>
            {children}
        </SidebarContext.Provider>
    )
}