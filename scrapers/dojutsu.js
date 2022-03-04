const axios = require('axios');
const cheerio = require('cheerio');
const Dojutsu = require('../models/dojutsu');



const getDojutsuInfo = async () => {
    const baseUrl = `https://naruto.fandom.com/wiki/Tenseigan`;
    //const { data } = await axios.get(`${baseUrl}${dojutsuName}`);
    const { data } = await axios.get(baseUrl);
    const $ = cheerio.load(data);
    const name = $('h1[class="page-header__title"]').text().trim();
    const literalMeaning = $('th:contains("Literal English")').next().text().trim() || "No info about Literal Meaning";
    const vizManga = $('th:contains("Viz manga")').next().text().trim() || "No info about Viz Manga";
    const clan = []
    const clanListLIs = $('tr:contains("Clan")').find('td').eq(0).find('li');
    for (let i = 0; i < clanListLIs.length; i++) {
        const li = clanListLIs[i];
        const clanName = $(li).find('a').text().trim();
        clan.push(clanName)
    }
    const classification = []
    const classificationListLIs = $('tr:contains("Classification")').find('td');
    for (let i = 0; i < classificationListLIs.length; i++) {
        const li = classificationListLIs[i];
        const classificationName = $(li).text().trim();
        classification.push(classificationName);
    }
    classification.forEach(c => {
        const classific = c.split(', ');
        classific.forEach(classs => {
            if (classs) {
                classification.push(classs);
            }
        })
    })
    classification.shift()
    const knownWielders = [];
    const knownWieldersListLIs = $('tr:contains("Known Wielders")').find('li');
    for (let i = 0; i < knownWieldersListLIs.length; i++) {
        const li = knownWieldersListLIs[i];
        const knownWielder = $(li).text().trim() || "No known wielder found for this dojutsu";
        knownWielders.push(knownWielder);
    }
    const jutsu = []
    const jutsuListLIs = $('tr:contains("Jutsu")').find('li');
    for (let i = 0; i < jutsuListLIs.length; i++) {
        const li = jutsuListLIs[i];
        const jutsuName = $(li).text().trim();
        jutsu.push(jutsuName);
    }
    const about = $(`p:contains("${name.split(' ')[0]}")`).eq(0).text().trim() || "No info about this Dojutsu";
    const image = $('a[class="image"]').attr('href') || "No image found";
    const dojutsuInfo = {
        name,
        literalMeaning,
        vizManga,
        clan,
        classification,
        knownWielders,
        jutsu,
        about,
        image
    }
    //uncomment return if u want to use other functions
    //return characterInfo;
    const newDojutsu = new Dojutsu(dojutsuInfo);
    await newDojutsu.save();
    console.log("Dojutsu saved to database")
}

//getDojutsuInfo()
