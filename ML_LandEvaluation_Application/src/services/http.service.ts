const request = require('request-promise');

export const getData = async (url: string) => {
    try {
        //https://storage.googleapis.com/tfjs-tutorials/carsData.json
        const options = {
            uri: url,
            method: 'GET',
            json: true
        };
        var result = await request(options);


        return result.map(car => ({
            mpg: car.Miles_per_Gallon,
            horsepower: car.Horsepower,
        }))
            .filter(car => (car.mpg != null && car.horsepower != null));

    } catch (err) {
        console.log(err);
    }
}