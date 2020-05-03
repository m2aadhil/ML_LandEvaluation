import { DBManager } from "../database/database.manager";
import { APIService } from "./api.service";
import { CountyCodeMapCA } from "../data/models/county-map-ca";

export class CityService {

    private transist: number = 3 / 6;
    private walkability: number = 2 / 6;
    private bikablity: number = 1 / 6;


    getCitiesofCounty = async (county: string) => {
        let result = null;
        let dbManager: DBManager = new DBManager();
        await dbManager.connect('land_evaluation');
        county = CountyCodeMapCA.find(i => i.code == county).name;
        county = county.slice(0, county.length - 7);
        result = await dbManager.getDocuments('db.citycodes', { County: county, CityName: { $not: { $eq: '' } } });
        result = result.map(x => { return { CityCode: x.CityCode, CityName: x.CityName } });
        dbManager.closeConnection();
        return result;
    }

    getPricesCity = async (cityCode: string) => {
        let result = null;
        let dbManager: DBManager = new DBManager();
        await dbManager.connect('land_evaluation');
        result = await dbManager.getDocuments('db.citycodes', { CityCode: cityCode, CityName: { $not: { $eq: '' } } });
        result = result.map(x => { return x.MedianSoldPrice });
        dbManager.closeConnection();
        return result;
    }

    //Get price for google map location
    getPriceLocation = async (address: string, laty: string, longt: string, year: string, cityCode: string) => {
        let apiService: APIService = new APIService();
        let apiResponse = await apiService.executeWalkScoreRequest(address, laty, longt);
        let overAllScore: number = 0;
        if (apiResponse) {
            console.log(apiResponse);
            if (apiResponse.walkscore) {
                overAllScore += apiResponse.walkscore * this.walkability
            }

            if (apiResponse.transit && apiResponse.transit.score) {
                overAllScore += apiResponse.transit.score * this.transist;
            }

            if (apiResponse.bike && apiResponse.bike.score) {
                overAllScore += apiResponse.bike.score * this.bikablity;
            }

        }

        let dbManager: DBManager = new DBManager();
        let result = null;
        await dbManager.connect('land_evaluation');
        result = await dbManager.getDocuments('db.citycodes', { CityCode: cityCode, CityName: { $not: { $eq: '' } } });
        result = result.map(x => { return x.MedianSoldPrice });
        dbManager.closeConnection();
        let price = null;
        price = result[0][year] / 2 + result[0][year] * (overAllScore / 100);
        return price;

    }

}