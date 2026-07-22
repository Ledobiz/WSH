'use server';

import { myLecture } from "../services/student/course";

export const courseProgress = async (userId: string, courseId: string) => {
    const lectureData = await myLecture(userId, courseId);

    return {
        lecturesCompleted: lectureData.data.lecturesCompleted,
        totalLectures: lectureData.data.totalLectures,
    }
}
