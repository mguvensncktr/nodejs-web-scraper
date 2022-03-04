const axios = require('axios');
const cheerio = require('cheerio');
const Character = require('../models/characters');
const router = require('express').Router();


router.get('/', (req, res) => {
    Character.find()
        .then(characters => res.json(characters))
        .catch(err => res.status(404).json({ noCharactersFound: 'No characters found' }));
})


// THIS FUNCTION GETS THE NAMES OF THE CHARACTERS IN GIVEN URL AND PUSHES THEM INTO AN ARRAY
const getCharacterPageNames = async () => {
    const url = "https://naruto.fandom.com/wiki/Category:Characters";
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const categories = $('ul.category-page__members-for-char');
    const characterPageNames = [];
    for (let i = 0; i < categories.length; i++) {
        const ul = categories[i];
        const charactersLIs = $(ul).find('li.category-page__member');
        for (let j = 0; j < charactersLIs.length; j++) {
            const li = charactersLIs[j];
            const path = $(li).find('a.category-page__member-link').attr('href') || "";
            const name = path.replace('/wiki/', '');
            characterPageNames.push(name);
        }
    }
    return characterPageNames;
}


//RUN THIS FUNCTION WITH A CHARACTER NAME AND IT GETS THE DATA ABOUT THAT CHARACTER
const getCharacterInfo = async (characterName) => {
    const baseUrl = 'https://naruto.fandom.com/wiki/';
    const { data } = await axios.get(`${baseUrl}${characterName}`);
    const $ = cheerio.load(data);
    const name = $('h1[class="page-header__title"]').text().trim();
    const sex = $('th:contains("Sex")').next().text().trim() || "No info about sex";
    const affiliation = []
    const affiliationListLIs = $('tr:contains("Affiliation")').find('li');
    for (let i = 0; i < affiliationListLIs.length; i++) {
        const li = affiliationListLIs[i];
        const affiliationName = $(li).text().trim();
        affiliation.push(affiliationName);
    }
    const affiliations = affiliation.filter(n => n)
    const birthdate = $('th:contains("Birthdate")').next().text().trim() || "No info about Birthdate";
    const age = []
    const ageListLIs = $('tr:contains("Age")').find('li');
    for (let i = 0; i < ageListLIs.length; i++) {
        const li = ageListLIs[i];
        const ageName = $(li).text().trim();
        age.push(ageName);
    }
    const bloodType = $('th:contains("Blood type")').next().text().trim() || "No info about Blood type";
    const status = $('th:contains("Status")').next().text().trim() || "No info about Status";
    const kekkeiGenkai = []
    const kekkeiGenkaiListLIs = $('tr:contains("Kekkei Genkai")').find('li');
    for (let i = 0; i < kekkeiGenkaiListLIs.length; i++) {
        const li = kekkeiGenkaiListLIs[i];
        const kekkeiGenkaiName = $(li).text().trim();
        kekkeiGenkai.push(kekkeiGenkaiName);
    }
    const classification = []
    const classificationListLIs = $('tr:contains("Classification")').find('li');
    for (let i = 0; i < classificationListLIs.length; i++) {
        const li = classificationListLIs[i];
        const classificationName = $(li).text().trim();
        classification.push(classificationName);
    }
    const tailedBeasts = []
    const tailedBeastsListLIs = $('tr:contains("Tailed Beast")').find('td').eq(0);
    for (let i = 0; i < tailedBeastsListLIs.length; i++) {
        const li = tailedBeastsListLIs[i];
        const tailedBeastName = $(li).text().trim().replace('(Forms)', '').trim();
        tailedBeasts.push(tailedBeastName);
    }
    tailedBeasts.forEach(tailedBeast => {
        const beast = tailedBeast.split(', ');
        beast.forEach(beast => {
            if (beast) {
                tailedBeasts.push(beast);
            }
        })
    })
    tailedBeasts.shift()
    const occupation = []
    const occupationListLIs = $('tr:contains("Occupation")').find('li');
    for (let i = 0; i < occupationListLIs.length; i++) {
        const li = occupationListLIs[i];
        const occupationName = $(li).text().trim();
        occupation.push(occupationName);
    }
    const team = []
    const teamListLIs = $('tr:contains("Team")').find('li');
    for (let i = 0; i < teamListLIs.length; i++) {
        const li = teamListLIs[i];
        const teamName = $(li).text().trim();
        team.push(teamName);
    }
    const clan = []
    const clanListLIs = $('tr:contains("Clan")').find('li');
    for (let i = 0; i < clanListLIs.length; i++) {
        const li = clanListLIs[i];
        const clanName = $(li).text().trim();
        clan.push(clanName)
    }
    const rank = {
        ninjaRank: [],
    }
    const ninjaRankListLIs = $('tr:contains("Ninja Rank")').find('li');
    for (let i = 0; i < ninjaRankListLIs.length; i++) {
        const li = ninjaRankListLIs[i];
        const ninjaRankName = $(li).text().trim();
        rank["ninjaRank"].push(ninjaRankName);
    }
    const gradAge = $('tr:contains("Academy Grad. Age")').find('td').text().trim() || "No info about Acadamy grad. Age";
    rank.acadGradAge = gradAge;
    const family = [];
    const familyListLIs = $('tr:contains("Family")').find('li');
    for (let i = 0; i < familyListLIs.length; i++) {
        const li = familyListLIs[i];
        const familyMember = $(li).text().trim() || "No family member found for this character";
        family.push(familyMember);
    }
    const image = $('a[class="image"]').attr('href') || "No image found";
    const about = $(`p:contains("${name.split(' ')[0]}")`).eq(0).text().trim() || "No info about this character";
    const natureType = []
    const natureTypeListLIs = $('tr:contains("Nature Type")').find('li');
    for (let i = 0; i < natureTypeListLIs.length; i++) {
        const li = natureTypeListLIs[i];
        const natureTypeName = $(li).text().trim();
        natureType.push(natureTypeName);
    }
    const jutsu = []
    const jutsuListLIs = $('tr:contains("Jutsu")').find('li');
    for (let i = 0; i < jutsuListLIs.length; i++) {
        const li = jutsuListLIs[i];
        const jutsuName = $(li).text().trim();
        jutsu.push(jutsuName);
    }
    const characterInfo = {
        name,
        sex,
        affiliations,
        birthdate,
        age,
        bloodType,
        status,
        kekkeiGenkai,
        classification,
        tailedBeasts,
        occupation,
        team,
        clan,
        rank,
        family,
        image,
        about,
        jutsu,
        natureType,
    }
    //uncomment return if u want to use other functions
    //return characterInfo;
    // const newCharacter = new Character(characterInfo);
    // await newCharacter.save();
    // console.log("Character saved to database")
}

// run this function with a name of a character to scrape
//getCharacterInfo('Fugaku');


//RUN THIS FUNCTION TO GET ALL THE CHARACTERS IN THE WIKI
// const loadCharacters = async () => {
//     const characterPageNames = await getCharacterPageNames();
//     const characterInfoPromises = characterPageNames.map(characterName => getCharacterInfo(characterName));
//     const characters = await Promise.all(characterInfoPromises);
//     //add characters into the database
//     Character.insertMany(characters)
//         .then(characters => {
//             console.log("characters added to the database");
//         }
//         )
//         .catch(err => {
//             console.log(err);
//         });
// }

//loadCharacters();

module.exports = router;