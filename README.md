# Background

[prnt.sc (Lightshot)](https://prnt.sc/) is a website/program for taking screenshots and snippets and sharing them online. When uploading images, it creates a short link to the image that can be shared with others, such as this one:

https://prnt.sc/uccqun

What many users of the tool do not realize is that since the website creates a short link to the image, an attacker can randomly try combinations, and access other peoples' images without receiving a link. In other words, all images are publicly accessible, and easy to discover. There is a lot of people who do not know this, and post screenshots filled with private information. These screenshots can be scraped and downloaded by hackers, and searched for sensitive data via manual searching or vision techniques (most commonly OCR).

There are various tricks I found through investigation.
* The image ids (ex. "uccqun" in https://prnt.sc/uccqun) are generated in order, so you can get recent images by uploading an image yourself, taking the id, and scraping ids that are "near" to that id. For example,  uccquk, uccqul, and uccqum are the images uploaded before uccqun.
* You can also use the ordering to estimate the time a screenshot was taken, because nearby screenshots may have dates/times on them. The best thing to look for is the date/time that typically appears on the bottom right of windows computers.

More details about the tricks and info I discovered are mentioned in the notes.txt file.


# printsc_scrape

This tool scrapes prnt.sc and downloads images.
There are two intended purposes for this tool:
1. To show the danger of posting private information on prnt.sc.
2. To build image datasets for machine learning.

This tool is not intended for blackhat/malicious purposes, but if it is used for those purposes, read the warning if you are unskilled, and I recommend reconsidering if you realize there are more clever hackers out there than you.

After cloning, install like this:
```
npm install
```
It can be run by calling scrape.js:
```
node scrape.js
```

This tool was intended to be customized by modifying the source code, since that gave the most flexibility for a small WIP project like this. The particular code I recommend editing is the DIRECTORY, GENERATION_METHOD, and AMOUNT_TO_SCRAPE variables.
```
const DIRECTORY = "data/images_ordered";
const GENERATION_METHOD = () => orderedGenerator.next().value;
const AMOUNT_TO_SCRAPE = Infinity;
```

There are two generation methods already in the code, they are generateRandomId, which generates id's randomly, and generateOrderedId, which generates id's in order from a given start and end id. If you want a custom method you can code it and assign it to the GENERATION_METHOD variable.


# Warning

This vulnerability in the users of prnt.sc has been known for a long time, and there are many public tools for this that include features such as OCR for finding screenshotted passwords and sensitive information. I will not link them here since I have not checked them for backdoors.

Because the vulnerability is well known, and has been displayed in many places ranging from hacking forums to viral tiktok and youtube videos, there are scammers that seek to entrap the unskilled attackers that come from these sources and try to exploit the vulnerability.

The scammers intentionally post screenshots of username and password combinations to fake cryptocurrency sites, which are owned by the scammers. Some of the username and password combinations work, and the accounts appear to have varying amounts of cryptocurrency on them, ranging from a few dollars to hundreds of dollars. However, when the entrapped and unskilled attacker tries to remove this currency, the scam site will say that there is a minimum requirement for withdrawal, enticing the attacker into adding more money to the balance to reach the minimum (which they will obviously lose to the scammers).

Some of the scraping tools and youtube/tiktok videos explaining this vulnerability are likely to have been intentionally created by these scammers to get more victims. Even though I am creating and releasing a scraping tool for this vulnerability, I am not working with these scammers, which is why I mention this scam here.
