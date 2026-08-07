/**
 * Frontend Helper for standardized API Response envelopes.
 * Unpacks { success, message, data, meta, timestamp, errors } payloads.
 */

export const parseApiResponse = (response) => {
    const resData = response?.data || response;
    return {
        success: resData?.success ?? true,
        message: resData?.message || "",
        data: resData?.data !== undefined ? resData.data : resData,
        meta: resData?.meta || null,
        errors: resData?.errors || null,
        timestamp: resData?.timestamp || null,
        raw: resData,
    };
};

export const getApiErrorMessage = (error, defaultMessage = "An unexpected error occurred") => {
    return (
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        defaultMessage
    );
};
