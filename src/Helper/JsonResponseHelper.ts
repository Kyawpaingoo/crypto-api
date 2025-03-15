import { Request, Response } from "express";
import { ValidationError, JsonResponse } from "../Dtos/JsonReponse";

const createResponse = <T>(
    isSuccess: boolean,
    data?: T,
    validationErrors: ValidationError[] = [],
    message: string = ""
): JsonResponse<T> => ({
    success: isSuccess,
    data: isSuccess ? data : undefined,
    validationErrors: isSuccess ? undefined : validationErrors,
    message: message || undefined,
});

const createSuccessResponse = <T>(res: any, data: T, message: string = "Operation succeeded"): JsonResponse<T> =>
    res.status(200).json(createResponse(true, data, [], message));

const createFailureResponse = <T = never>(res: any,message: string = "Operation failed", validationErrors: ValidationError[] = [], statusCode: number = 400): JsonResponse<T> =>
    res.status(statusCode).json(createResponse<T>(false, undefined, validationErrors, message));

export { createResponse, createSuccessResponse, createFailureResponse };