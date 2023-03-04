import { Response } from 'express';

export interface IResponse {
    res: Response;
    code?: number;
    message?: string;
    data?: any;
    custom?: boolean;
}

export interface IResponseError {
    res: Response;
    code: number;
    error?: string;
    custom?: boolean;
}
