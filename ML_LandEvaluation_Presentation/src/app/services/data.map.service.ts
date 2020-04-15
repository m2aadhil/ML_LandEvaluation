import { Injectable } from "@angular/core";
import { HttpService } from './https.service';
import { environment } from 'src/environments/environment';
import { StateResponseDTO } from '../model/states.response.dto';
import { Subject } from 'rxjs';
import { ViewModel } from '../model/view.model';
import { CountyResponseDTO } from '../model/county.response.dto';

@Injectable()
export class DataMapService {

    selectedYear = new Subject<string>();
    viewModel = new Subject<ViewModel>();
    selectedLocation = new Subject<string>();
    drillDrown = new Subject<boolean>();

    constructor(private httpService: HttpService) {

    }

    getStateData = async () => {
        let url: string = environment.coreServiceUrl + "getstatevalues";

        return await this.httpService.get(url).then((res: StateResponseDTO[]) => {
            if (res) {
                return res;
            }
            return null;
        })
    }

    getCountyData = async (state: string) => {
        let url: string = environment.coreServiceUrl + "getcountyvalues/" + state;

        return await this.httpService.get(url).then((res: CountyResponseDTO[]) => {
            if (res) {
                return res;
            }
            return null;
        })
    }
}