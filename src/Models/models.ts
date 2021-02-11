export class ApiResult{
    constructor(public isOk?: boolean, public data?: any, public message?: string){       
    }
}
export interface Loading{
    isLoading: boolean;
    hasFinished: boolean;
}
