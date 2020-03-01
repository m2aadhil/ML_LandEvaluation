import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";

@Injectable()
export class HttpService {

    constructor(private http: HttpClient) { }

    get(dataUrl: string): Promise<any> {
        return this.http.get(dataUrl)
            .toPromise()
            .then((response: JSON) => response)
            .catch(this.handleError);
    }

    post(dataUrl: string, body: any): Promise<any> {

        return this.http.post(dataUrl
            , body)
            .toPromise()
            .then((response: JSON) => response)
            .catch(this.handleError);
    }

    delete(dataUrl: string, body: any) {
        return this.http.delete(dataUrl)
            .toPromise()
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}