const { Op } = require("sequelize");
const { Weather, createConnection } = require("../model/weathers.model");
const config = require("../config/db.config").config;

createConnection();

exports.getWeathersURL = async () => {

    let topURL;
    let lastURL;
    const weatherLgn = "&units=metric&lang=pt"
    const weatherApi = "&APPID=" + "bced2d2f8445517b5b82cc8caae06301";

    // get from database the top five searched weathers
    let topFive = await new Promise(
        async (resolve, reject) => {
            let weathers = await Weather.findAll(
                {
                    order: [
                        ['searched', 'DESC'],
                        ['last_update', 'DESC']
                    ],
                    limit: 5
                }
            );

            if (weathers)
                resolve(weathers)
            else
                reject([])
        }
    )

    //make top searched cities URL
    topURL = "http://api.openweathermap.org/data/2.5/group?id=";
    topFive.forEach((city, i) => {
        topURL += city.id;
        if ((topFive.length - 1) != i)
            topURL += ',';
    });
    topURL += weatherLgn + weatherApi;
    // console.log(topURL);


    //get from database the last searched weathers
    let lastFive = await new Promise(
        async (resolve, reject) => {
            let weathers = await Weather.findAll(
                {
                    order: [
                        ['last_update', 'DESC']
                    ],
                    limit: 5
                }
            );

            if (weathers)
                resolve(weathers)
            else
                reject([])
        }
    );

    //make last searched cities URL
    lastURL = "http://api.openweathermap.org/data/2.5/group?id=";
    lastFive.forEach((city, i) => {
        lastURL += city.id;
        if ((lastFive.length - 1) != i)
            lastURL += ',';
    });
    lastURL += weatherLgn + weatherApi;
    // console.log(lastURL);


    return new Promise((resolve) => {
        resolve({ 'top': topURL, 'last': lastURL });
    })
}

exports.insert = async (req) => {
    return new Promise(
        async (resolve, reject) => {
            await Weather.create(
                {
                    id: req.body.id,
                    name: req.body.name,
                    last_update: Date(),
                    searched: 1
                }
            );

            let createdWeather = await Weather.findByPk(req.body.id);
            if (createdWeather) {
                resolve(createdWeather);
            } else {
                reject(createdWeather);
            }
        }
    );
}

exports.update = async (req) => {
    return new Promise(
        async (resolve, reject) => {

            await Weather.update(
                {
                    id: req.body.id,
                    name: req.body.name,
                    last_update: Date()
                },
                {
                    where: { id: req.body.id }
                }
            )
            await Weather.increment('searched', { by: 1, where: { id: req.body.id } })
            let updatedWeather = await Weather.findByPk(req.body.id);
            if (updatedWeather) {
                resolve(updatedWeather)
            } else {
                reject([])
            }
        }
    )
}

