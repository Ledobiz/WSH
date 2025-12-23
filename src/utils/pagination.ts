/* eslint-disable @typescript-eslint/no-explicit-any */

export interface PaginatedResult<T> {
    success: boolean;
    message: string;
    data: T[];
    pagination: {
        totalCount: number;
        totalPages: number;
        currentPage: number;
        pageSize: number;
    };
}

export async function paginate<T>(
    model: any,
    args: any = {},
    page: number = 1,
    pageSize: number = 20
): Promise<PaginatedResult<T>> {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    try {
        // Run the count and the data fetch in parallel
        const [data, totalCount] = await Promise.all([
            model.findMany({
                ...args,
                skip,
                take,
            }),
            model.count({
                where: args.where || {},
            }),
        ]);

        return {
            success: true,
            message: 'Success',
            data,
            pagination: {
                totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
                currentPage: page,
                pageSize,
            },
        };
    } catch (error) {
        console.error("Pagination Error:", error);
        return {
            success: false,
            message: 'No result found',
            data: [],
            pagination: { totalCount: 0, totalPages: 0, currentPage: page, pageSize },
        };
    }
}