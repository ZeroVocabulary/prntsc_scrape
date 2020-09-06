const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');


const orderedGenerator = generateOrderedId("ql4ixp", "qlgg3x");

const DIRECTORY = "data/images_ordered";
const GENERATION_METHOD = () => orderedGenerator.next().value;
const AMOUNT_TO_SCRAPE = Infinity;

run();
async function run(){
    for(i=0; i < AMOUNT_TO_SCRAPE; i++){
        //await sleep(5000); // easy way to lighten up load on internet connection
        let id = GENERATION_METHOD();
        try {
            await downloadImageById(id);
            console.log(id);
        } catch (e) {
            console.log(e);
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function* generateOrderedId(startId, endId){
    start = convertFromIdFormat(startId);
    end = convertFromIdFormat(endId);
    for(let i = start; i < end; i++){
        id = convertToIdFormat(i);
        yield id;
    }
    console.log("Finished");
    process.exit();
}

function convertToIdFormat(i){
    return i.toString(36);
}

function convertFromIdFormat(s){
    return parseInt(s, 36);
}



function generateRandomId() {
    // The images are uploaded in order, they are currently at "ql####" in 1/8/2020
    // so only generate ids below ql#### (p#### is fine)
    // Also only generate ids above 0#####
    // we can generate different ranges to get different time periods but we are just choosing randomly here
    let parts = [];
    parts.push(generateRandomString("123456789abcdefghijklmnop", 1));
    parts.push(generateRandomString("0123456789abcdefghijklmnopqrstuvwxyz", 5));
    return parts.join("");
}

// generateRandomString("0123456789abcdefghijklmnopqrstuvwxyz", 6)
// Example output: asd42e
function generateRandomString(characters, length) {
    let result = '';
    let charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


async function downloadImageById(id) {
    try {
        let filePath = path.resolve(DIRECTORY, `${id}.png`);
        let page = await loadInitialPage(id);
        let imageUrl = await getImageUrl(page);
        await downloadImage(imageUrl, filePath);
    } catch (e) {
        console.log(`Error: ${e.message}`);
    }
}

async function loadInitialPage(id) {
    let url = `https://prnt.sc/${id}`;
    let res = await axios.get(url);
    return cheerio.load(res.data);
}

const ERROR_IMAGE_URL = "//st.prntscr.com/2019/11/26/0154/img/0_173a7b_211be8ff.png";
async function getImageUrl($) {
    let url = $("#screenshot-image").attr("src");
    if(url == ERROR_IMAGE_URL){
        throw new Error("Invalid id");
    }else{
        return url;
    }
}

async function downloadImage(url, path) {
    const writer = fs.createWriteStream(path);
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}