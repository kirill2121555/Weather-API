const db = require('./db/db')
const axios = require('axios')

class Controller {
    async getweather(req, res) {
        const city = req.query.city
        let now = Date.now();
        const cortege = await db.query(`SELECT * FROM weaserdb WHERE city = $1`, [city])
        if (cortege.rows.length !== 0) {
            if (cortege.rows[0].time > now) {
                return res.json(cortege.rows[0].data)
            }
            else {
                await db.query(`DELETE FROM weaserdb WHERE id = $1`, [cortege.rows[0].id])
            }
        }
        try {
            const weaser = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid={token}`)
        }
        catch (e) {
           return res.json('Error')
        }
        let wind = weaser.data.wind.speed
        let pressure = (weaser.data.main.pressure / 1.333).toFixed(0)
        let temp = (weaser.data.main.temp - 273.15).toFixed(1)
        const data = 'pressure: ' + pressure + ', wind: ' + wind + ', temp: ' + temp;
        await db.query(`INSERT INTO weaserdb (city, data,  time) values($1,$2,$3) RETURNING *`, [city, data, now + 1800000])
        res.json(data)
    }
}
module.exports = new Controller()
