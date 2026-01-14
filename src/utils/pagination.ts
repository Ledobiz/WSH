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
    options: {
        page?: number;
        pageSize?: number;
        where?: any;
        orderBy?: any;
        include?: any;
        search?: string;
        searchFields?: string[]; // e.g., ['title', 'description']
    }
): Promise<PaginatedResult<T>> {
    const {
        page = 1,
        pageSize = 20,
        where = {},
        orderBy = { createdAt: 'desc' },
        include = {},
        search,
        searchFields = []
    } = options;

    const skip = (page - 1) * pageSize;

    // Build the search logic dynamically
    const searchConditions = search && searchFields.length > 0
        ? {
            OR: searchFields.map((field) => ({
                [field]: { contains: search, mode: 'insensitive' },
            })),
        }
        : {};

    // Combine static filters with search conditions
    const finalWhere = { ...where, ...searchConditions };

    try {
        // Run the count and the data fetch in parallel
        const [data, totalCount] = await Promise.all([
            model.findMany({
                where: finalWhere,
                orderBy,
                include,
                skip,
                take: pageSize,
            }),
            model.count({ where: finalWhere }),
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

/**
 * Generic pagination for custom queries.
 * Supply two callbacks: one to fetch paged data, and one to return total count.
 */
export async function paginateQuery<T>(options: {
    page?: number;
    pageSize?: number;
    dataQuery: (pagination: { skip: number; take: number }) => Promise<T[]>;
    countQuery: () => Promise<number>;
}): Promise<PaginatedResult<T>> {
    const {
        page = 1,
        pageSize = 20,
        dataQuery,
        countQuery,
    } = options;

    const currentPage = Math.max(1, page);
    const limit = Math.max(1, Math.min(pageSize, 100));
    const skip = (currentPage - 1) * limit;

    try {
        const [data, totalCount] = await Promise.all([
            dataQuery({ skip, take: limit }),
            countQuery(),
        ]);

        return {
            success: true,
            message: 'Success',
            data,
            pagination: {
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
                currentPage,
                pageSize: limit,
            },
        };
    } catch (error) {
        console.error('Pagination Error (custom query):', error);
        return {
            success: false,
            message: 'No result found',
            data: [],
            pagination: {
                totalCount: 0,
                totalPages: 0,
                currentPage,
                pageSize: limit,
            },
        };
    }
}