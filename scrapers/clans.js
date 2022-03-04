const axios = require('axios');
const cheerio = require('cheerio');
const Clans = require('../models/clans');



const getClansPageNames = async () => {
    const url = "https://naruto.fandom.com/wiki/Clans";
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const categories = $('div.toc > ul')
    const clanPageNames = [];
    for (let i = 0; i < categories.length; i++) {
        const ul = categories[i];
        const clanLIs = $(ul).find('li.toclevel-1');
        for (let j = 0; j < clanLIs.length - 2; j++) {
            const li = clanLIs[j];
            const name = $(li).find('span[class="toctext"]').text().trim() || "";
            clanPageNames.push(name);
        }
    }
    return clanPageNames;
}


const getClanInfo = async (clanName) => {
    const baseUrl = 'https://naruto.fandom.com/wiki/';
    const url = encodeURI(`${baseUrl}${clanName}`);
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const name = $('h1[class="page-header__title"]').text().trim();
    const affiliation = $('th:contains("Affiliation")').next().text().trim() || "No info about Affiliation";
    const clanMembers = [];
    const clanMembersLIs = $('tr:contains("Known Members")').find('li');
    for (let i = 0; i < clanMembersLIs.length; i++) {
        const li = clanMembersLIs[i];
        const characterName = $(li).find('a').text().trim() || "";
        clanMembers.push(characterName);
    }
    const clanImage = $('a[class="image"]').attr('href') || "No image found";
    const clanJutsuList = [];
    const clanJutsuLIs = $('tr:contains("Jutsu")').find('li');
    for (let i = 0; i < clanJutsuLIs.length; i++) {
        const li = clanJutsuLIs[i];
        const jutsuName = $(li).find('a').text().trim() || "No jutsu found for this clan";
        clanJutsuList.push(jutsuName);
    }
    const clanInfo = {
        name,
        affiliation,
        clanMembers,
        clanImage,
        clanJutsuList
    }
    return clanInfo;
}

// const loadClans = async () => {
//     const clanPageNames = await getClansPageNames();
//     const clanInfoPromises = clanPageNames.map(clanName => getClanInfo(clanName));
//     const clans = await Promise.all(clanInfoPromises);
//     Clans.insertMany(clans)
//         .then(characters => {
//             console.log("Clans added to the database");
//         }
//         )
//         .catch(err => {
//             console.log(err);
//         });
// }

//loadClans()

