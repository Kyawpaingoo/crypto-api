interface ValidationError {
    field: string;
    message: string;
}

interface JsonResponse<T> {
    success: boolean;
    data?: T;
    validationErrors?: ValidationError[];
    message?: string;
}

export { ValidationError, JsonResponse };