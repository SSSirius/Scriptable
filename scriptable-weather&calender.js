// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: quote-right;


const backgroundColor = "#101010";
const currentDayColor = "#000000";
const textColor = "#ffffff";
var today = new Date();
var widgetInputRAW = args.widgetParameter;
//API_KEY
let API_WEATHER = "xxxxxxxxxxxxxxxxxxxxxxxx"; //Load Your api in "".Get a free API key here: https://openweathermap.org/appid
let CITY_WEATHER = "xxxxxxx"; //add your city ID

//GET BACKGROUND//
try {
    widgetInputRAW.toString();
} catch (e) {
    throw new Error("Please long press the widget and add a parameter.");
}

var widgetInput = widgetInputRAW.toString();
var inputArr = widgetInput.split("|");

// iCloud file path
var scriptableFilePath = "/var/mobile/Library/Mobile Documents/iCloud~dk~simonbs~Scriptable/Documents/";
var removeSpaces1 = inputArr[0].split(" "); // Remove spaces from file name
var removeSpaces2 = removeSpaces1.join('');
var tempPath = removeSpaces2.split(".");
var backgroundImageURLRAW = scriptableFilePath + tempPath[0];
var fm = FileManager.iCloud();
var backgroundImageURL = scriptableFilePath + tempPath[0] + ".";
var backgroundImageURLInput = scriptableFilePath + removeSpaces2;

// For users having trouble with extensions
// Uses user-input file path is the file is found
// Checks for common file format extensions if the file is not found
if (fm.fileExists(backgroundImageURLInput) == false) {
    var fileTypes = ['png', 'jpg', 'jpeg', 'tiff', 'webp', 'gif'];

    fileTypes.forEach(function (item) {
        if (fm.fileExists((backgroundImageURL + item.toLowerCase())) == true) {
            backgroundImageURL = backgroundImageURLRAW + "." + item.toLowerCase();
        } else if (fm.fileExists((backgroundImageURL + item.toUpperCase())) == true) {
            backgroundImageURL = backgroundImageURLRAW + "." + item.toUpperCase();
        }
    });
} else {
    backgroundImageURL = scriptableFilePath + removeSpaces2;
}
var spacing = parseInt(inputArr[1]);


//Get storage
var base_path = "/var/mobile/Library/Mobile Documents/iCloud~dk~simonbs~Scriptable/Documents/weather/";
var fm = FileManager.iCloud();
// Fetch Image from Url
async function fetchimageurl(url) {
    const request = new Request(url)
    var res = await request.loadImage();
    return res;
}

// Load image from local drive
async function fetchimagelocal(path) {
    var finalPath = base_path + path + ".png";
    if (fm.fileExists(finalPath) == true) {
        // console.log("file exists: " + finalPath);
        return finalPath;
    } else {
        //throw new Error("Error file not found: " + path);
        if (fm.fileExists(base_path) == false) {
            // console.log("Directry not exist creating one.");
            fm.createDirectory(base_path);
        }
        console.log("Downloading file: " + finalPath);
        await downloadimg(path);
        if (fm.fileExists(finalPath) == true) {
            // console.log("file exists after download: " + finalPath);
            return finalPath;
        } else {
            throw new Error("Error file not found: " + path);
        }
    }
}

async function downloadimg(path) {
    const url = "http://a.animedlweb.ga/weather/weathers25_2.json";
    const data = await fetchWeatherData(url);
    var dataimg = null;
    var name = null;
    if (path.includes("bg")) {
        dataimg = data.background;
        name = path.replace("_bg", "");
    } else {
        dataimg = data.icon;
        name = path.replace("_ico", "");
    }
    var imgurl = null;
    switch (name) {
        case "01d":
            imgurl = dataimg._01d;
            break;
        case "01n":
            imgurl = dataimg._01n;
            break;
        case "02d":
            imgurl = dataimg._02d;
            break;
        case "02n":
            imgurl = dataimg._02n;
            break;
        case "03d":
            imgurl = dataimg._03d;
            break;
        case "03n":
            imgurl = dataimg._03n;
            break;
        case "04d":
            imgurl = dataimg._04d;
            break;
        case "04n":
            imgurl = dataimg._04n;
            break;
        case "09d":
            imgurl = dataimg._09d;
            break;
        case "09n":
            imgurl = dataimg._09n;
            break;
        case "10d":
            imgurl = dataimg._10d;
            break;
        case "10n":
            imgurl = dataimg._10n;
            break;
        case "11d":
            imgurl = dataimg._11d;
            break;
        case "11n":
            imgurl = dataimg._11n;
            break;
        case "13d":
            imgurl = dataimg._13d;
            break;
        case "13n":
            imgurl = dataimg._13n;
            break;
        case "50d":
            imgurl = dataimg._50d;
            break;
        case "50n":
            imgurl = dataimg._50n;
            break;
    }
    const image = await fetchimageurl(imgurl);
    // console.log("Downloaded Image");
    fm.writeImage(base_path + path + ".png", image);
}

//get Json weather
async function fetchWeatherData(url) {
    const request = new Request(url);
    const res = await request.loadJSON();
    return res;
}

// Get Location 
/*Location.setAccuracyToBest();
let curLocation = await Location.current();
console.log(curLocation.latitude);
console.log(curLocation.longitude);*/
let wetherurl = "http://api.openweathermap.org/data/2.5/weather?id=" + CITY_WEATHER + "&APPID=" + API_WEATHER + "&units=metric";
//"http://api.openweathermap.org/data/2.5/weather?lat=" + curLocation.latitude + "&lon=" + curLocation.longitude + "&appid=" + API_WEATHER + "&units=metric";
//"http://api.openweathermap.org/data/2.5/weather?id=" + CITY_WEATHER + "&APPID=" + API_WEATHER + "&units=metric"

const weatherJSON = await fetchWeatherData(wetherurl);
const cityName = weatherJSON.name;
const weatherarry = weatherJSON.weather;
const iconData = weatherarry[0].icon;
const weathername = weatherarry[0].main;
const curTempObj = weatherJSON.main;
const curTemp = curTempObj.temp;
const highTemp = curTempObj.temp_max;
const lowTemp = curTempObj.temp_min;
const feel_like = curTempObj.feels_like;
//Completed loading weather data




// Format the date info     // Date Calculations
const dateFormatter = new DateFormatter();
dateFormatter.dateFormat = "EEEE";
let dayOfWeek = dateFormatter.string(today).toUpperCase()
dateFormatter.useMediumDateStyle()
dateFormatter.useNoTimeStyle()
var hour = today.getHours();
// Holiday customization
var holidaysByKey = {
    // month,week,day: datetext
    "11,4,4": "感恩节快乐!" // fine, we don't have this in China
}
var holidaysByDate = {
    // month,date: greeting
    "1,1": (today.getFullYear()).toString() + "新年快乐!",
    "12,25": "圣诞节快乐!"
}
var holidayKey = (today.getMonth() + 1).toString() + "," + (Math.ceil(today.getDate() / 7)).toString() + "," + (today.getDay()).toString();
var holidayKeyDate = (today.getMonth() + 1).toString() + "," + (today.getDate()).toString();
// Support for multiple greetings per time period

var greeting = new String("Howdy.")
if (hour < 5 && hour >= 1) { // 1am - 5am
    greeting = "秃头警告!!!";
} else if (hour >= 23 || hour < 1) { // 11pm - 1am
    greeting = "该睡觉啦"
} else if (hour < 11) { // Before noon (5am - 12pm)
    greeting = "早上好";
} else if (hour >= 11 && hour <= 13) { // 11am - 1pm
    greeting = "中午好"
} else if (hour > 13 && hour <= 17) { // 1pm - 5pm
    greeting = "下午好"
} else if (hour > 17 && hour < 23) { // 5pm - 11pm
    greeting = "晚上好"
}
// Overwrite greeting if calculated holiday
if (holidaysByKey[holidayKey]) {
    greeting = holidaysByKey[holidayKey];
}
// Overwrite all greetings if specific holiday
if (holidaysByDate[holidayKeyDate]) {
    greeting = holidaysByDate[holidayKeyDate];
}

// START WIDGET
if (!config.runsInWidget) {
    const appleDate = new Date('2001/01/01')
    const timestamp = (today.getTime() - appleDate.getTime()) / 1000
    const callback = new CallbackURL("calshow:" + timestamp)
    callback.open()
    Script.complete()
    // Otherwise, create the widget.  
} else {
    let widget = new ListWidget();



    //widget background
    widget.backgroundImage = Image.fromFile(backgroundImageURL);
    widget.setPadding(16, 0, 16, 0);




    //All stacks' outlay
    const globalStack = widget.addStack();
    globalStack.layoutVertically()

    //top Half
    const topStack = globalStack.addStack()
    topStack.layoutVertically()
    topStack.addSpacer(0);
    let hello = topStack.addText(`${greeting}`);
    hello.font = Font.boldSystemFont(24);

    // date&weather
    topStack.addSpacer(8);
    let hStack = topStack.addStack();
    hStack.layoutHorizontally();

    // Date label in stack
    let datetext = hStack.addText(`${dateFormatter.string(today).toUpperCase()}${dayOfWeek}`);
    datetext.font = Font.regularSystemFont(14);
    datetext.textOpacity = (0.7);
    // datetext.centerAlignText();

    //image
    hStack.addSpacer(12);
    var img = Image.fromFile(await fetchimagelocal(iconData + "_ico"));

    //image in stack
    let widgetimg = hStack.addImage(img);
    widgetimg.imageSize = new Size(14, 14);

    //tempeture label in stack

    let temptext = hStack.addText('\xa0\xa0' + Math.round(curTemp).toString() + "\u2103");
    temptext.font = Font.regularSystemFont(14);
    temptext.textOpacity = (0.7);
    topStack.addSpacer(8)

    //batteryLine
    const batteryLine = topStack.addText(`当前电量: ${renderBattery()}`)
    batteryLine.textColor = new Color("#06eb00")
    batteryLine.font = Font.regularSystemFont(14);
    topStack.setPadding(16, 0, 20, 0)

    //Bottom Half
    const bottomStack = globalStack.addStack()
    bottomStack.layoutHorizontally()
    const leftStack = bottomStack.addStack();

    // opacity value for weekends and times
    const opacity = 0.7;

    // space between the two halves
    bottomStack.addSpacer(null);
    leftStack.layoutVertically();
    let agtitle = leftStack.addText("日程一览")
    agtitle.textColor = new Color("#AFEEEE")
    agtitle.font = Font.boldSystemFont(14);
    // Find future events that aren't all day and aren't canceled
    const events = await CalendarEvent.today([]);
    const futureEvents = [];
    for (const event of events) {
        if (
            event.startDate.getTime() > today.getTime() &&
            !event.isAllDay &&
            !event.title.startsWith("Canceled:")
        ) {
            futureEvents.push(event);
        }
    }

    // center the whole left part of the widget

    // if we have events today; else if we don't
    if (futureEvents.length !== 0) {
        // show the next 3 events at most
        const numEvents = futureEvents.length > 3 ? 3 : futureEvents.length;
        for (let i = 0; i < numEvents; i += 1) {
            formatEvent(leftStack, futureEvents[i], textColor, opacity);
            // don't add a spacer after the last event
            if (i < numEvents - 1) {
                leftStack.addSpacer(8);
            }
        }
    } else {
        addWidgetTextLine(leftStack, "今天没有日程了哦", {
            color: textColor,
            opacity,
            font: Font.regularSystemFont(14),
            align: "left",
        });
    }
    // for centering
    leftStack.addSpacer(2);

    // right half
    const rightStack = bottomStack.addStack();
    rightStack.layoutVertically();
    dateFormatter.dateFormat = "MMMM";
    // Current month line
    let monthline = rightStack.addText(" 本月日历")
    monthline.textColor = new Color("#AFEEEE")
    monthline.font = Font.boldSystemFont(14);
    // between the month and the week calendar
    const calendarStack = rightStack.addStack();
    calendarStack.spacing = 4;
    const month = buildMonthVertical();
    for (let i = 0; i < month.length; i += 1) {
        let weekdayStack = calendarStack.addStack();
        weekdayStack.layoutVertically();

        for (let j = 0; j < month[i].length; j += 1) {
            let dayStack = weekdayStack.addStack();
            dayStack.size = new Size(20, 20);
            dayStack.centerAlignContent();
            //         dayStack.addSpacer(5)
            if (month[i][j] === today.getDate().toString()) {
                const highlightedDate = getHighlightedDate(
                    today.getDate().toString(),
                    currentDayColor
                );
                dayStack.addImage(highlightedDate);
            } else {
                addWidgetTextLine(dayStack, `${month[i][j]}`, {
                    color: textColor,
                    opacity: i > 4 ? opacity : 1,
                    font: Font.boldSystemFont(10),
                    align: "center",
                });
            }
        }
    }
    Script.setWidget(widget);
    Script.complete();
}


/**
 * Creates an array of arrays, where the inner arrays include the same weekdays
 * along with an identifier in 0 position
 * [
 *   [ 'M', ' ', '7', '14', '21', '28' ],
 *   [ 'T', '1', '8', '15', '22', '29' ],
 *   [ 'W', '2', '9', '16', '23', '30' ],
 *   ...
 * ]
 *
 * @returns {Array<Array<string>>}
 */
function buildMonthVertical() {
    const date = new Date();
    const firstDayStack = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDayStack = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const month = [
        ["M"],
        ["T"],
        ["W"],
        ["T"],
        ["F"],
        ["S"],
        ["S"]
    ];

    let dayStackCounter = 0;

    for (let i = 1; i < firstDayStack.getDay(); i += 1) {
        month[i - 1].push(" ");
        dayStackCounter = (dayStackCounter + 1) % 7;
    }

    for (let date = 1; date <= lastDayStack.getDate(); date += 1) {
        month[dayStackCounter].push(`${date}`);
        dayStackCounter = (dayStackCounter + 1) % 7;
    }

    const length = month.reduce(
        (acc, dayStacks) => (dayStacks.length > acc ? dayStacks.length : acc),
        0
    );
    month.forEach((dayStacks, index) => {
        while (dayStacks.length < length) {
            month[index].push(" ");
        }
    });

    return month;
}

/**
 * Draws a circle with a date on it for highlighting in calendar view
 *
 * @param  {string} date to draw into the circle
 *
 * @returns {Image} a circle with the date
 */
function getHighlightedDate(date) {
    const drawing = new DrawContext();
    drawing.respectScreenScale = true;
    const size = 50;
    drawing.size = new Size(size, size);
    drawing.opaque = false;
    drawing.setFillColor(new Color("#fff"));
    drawing.fillEllipse(new Rect(1, 1, size - 2, size - 2));
    drawing.setFont(Font.boldSystemFont(25));
    drawing.setTextAlignedCenter();
    drawing.setTextColor(new Color("#000"));
    drawing.drawTextInRect(date, new Rect(0, 10, size, size));
    const currentDayImg = drawing.getImage();
    return currentDayImg;
}

/**
 * formats the event times into just hours
 *
 * @param  {Date} date
 *
 * @returns {string} time
 */
function formatTime(date) {
    let dateFormatter = new DateFormatter();
    dateFormatter.useNoDateStyle();
    dateFormatter.useShortTimeStyle();
    return dateFormatter.string(date);
}

/**
 * Adds a event name along with start and end times to widget stack
 *
 * @param  {WidgetStack} stack - onto which the event is added
 * @param  {CalendarEvent} event - an event to add on the stack
 * @param  {number} opacity - text opacity
 */
function formatEvent(stack, event, color, opacity) {
    addWidgetTextLine(stack, event.title, {
        color,
        font: Font.mediumSystemFont(14),
        lineLimit: 1,
    });

    // create line for event start and end times
    let timeStack = stack.addStack();
    const time = `${formatTime(event.startDate)} - ${formatTime(event.endDate)}`;
    addWidgetTextLine(timeStack, time, {
        color,
        opacity,
        font: Font.regularSystemFont(14),
    });
}

function addWidgetTextLine(
    widget,
    text, {
        color = "#ffffff",
        textSize = 12,
        opacity = 1,
        align,
        font = "",
        lineLimit = 0,
    }
) {
    let textLine = widget.addText(text);
    textLine.textColor = new Color(color);
    if (typeof font === "string") {
        textLine.font = new Font(font, textSize);
    } else {
        textLine.font = font;
    }
    textLine.textOpacity = opacity;
    switch (align) {
        case "left":
            textLine.leftAlignText();
            break;
        case "center":
            textLine.centerAlignText();
            break;
        case "right":
            textLine.rightAlignText();
            break;
        default:
            textLine.leftAlignText();
            break;
    }
}

// Get formatted Date
function getformatteddate() {
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[today.getMonth()] + " " + today.getDate()
}
// Set Battery Stye
function renderBattery() {
    const batteryLevel = Device.batteryLevel()
    let isCh = Device.isCharging() ? " Charging..." : ""
    const juice = "●".repeat(Math.floor(batteryLevel * 10))
    const used = "○".repeat(10 - juice.length)
    const batteryAscii = `[${juice}${used}] ${Math.round(batteryLevel * 100)}% ${isCh}`
    return batteryAscii
}