let fs = require('fs');
let sharp = require('sharp');
function getRandomFontStyle() {
    var fontStyles = [
      'MediumItalic', 'Italic', 'Light', 'BlackItalic', 'Alternates-BoldItalic', 'Alternates-Bold', 'Alternates-LightItalic', 'Alternates-MediumItalic', 'SemiBold', 'Thin', 'Alternates-ExtraBold', 'Black', 'Regular', 'SemiBoldItalic', 'Alternates-ExtraBoldItalic', 'Bold', 'ExtraBoldItalic', 'Alternates-ExtraLightItalic', 'Alternates-Black', 'Alternates-ThinItalic', 'Alternates-ExtraLight', 'Medium', 'ExtraBold', 'Alternates-SemiBold', 'Alternates-BlackItalic', 'LightItalic', 'Alternates-SemiBoldItalic', 'Alternates-Light', 'ExtraLight', 'ThinItalic', 'ExtraLightItalic', 'BoldItalic', 'Alternates-Thin', 'Alternates-Medium', 'Alternates-Regular', 'Alternates-Italic',
    ].filter(font => {
      return !font.includes('Alternates') && !font.includes('Italic') && !font.includes('Light')
    } )
// 
// Montserrat-MediumItalic.otf
// Montserrat-Italic.otf
// Montserrat-Light.otf
// Montserrat-BlackItalic.otf
// fonts.scale
// MontserratAlternates-BoldItalic.otf
// MontserratAlternates-Bold.otf
// MontserratAlternates-LightItalic.otf
// MontserratAlternates-MediumItalic.otf
// Montserrat-SemiBold.otf
// Montserrat-Thin.otf
// MontserratAlternates-ExtraBold.otf
// Montserrat-Black.otf
// Montserrat-Regular.otf
// Montserrat-SemiBoldItalic.otf
// MontserratAlternates-ExtraBoldItalic.otf
// Montserrat-Bold.otf
// Montserrat-ExtraBoldItalic.otf
// MontserratAlternates-ExtraLightItalic.otf
// MontserratAlternates-Black.otf
// MontserratAlternates-ThinItalic.otf
// MontserratAlternates-ExtraLight.otf
// Montserrat-Medium.otf
// Montserrat-ExtraBold.otf
// MontserratAlternates-SemiBold.otf
// MontserratAlternates-BlackItalic.otf
// Montserrat-LightItalic.otf
// MontserratAlternates-SemiBoldItalic.otf
// MontserratAlternates-Light.otf
// Montserrat-ExtraLight.otf
// Montserrat-ThinItalic.otf
// Montserrat-ExtraLightItalic.otf
// Montserrat-BoldItalic.otf
// MontserratAlternates-Thin.otf
// MontserratAlternates-Medium.otf
// MontserratAlternates-Regular.otf
// MontserratAlternates-Italic.otf
// fonts.dir
  
    var fontStyle = fontStyles[Math.floor(Math.random() * fontStyles.length)];
    return "Montserrat-" + fontStyle;
}
var vibrantDarkColors = [
    "004895",
    "1A237E",
    "283593",
    "303F9F",
    "4A148C",
    "512DA8",
    "673AB7",
    "7B1FA2",
    "880E4F",
    "9C27B0",
  ];

let renderTransition = async (translated, transitionImage, id) => {
    let yearMonthDay = new Date().toISOString().split('T')[0] // 2021-08-01
    let outputFolder = "/app/storage/images/transitions/" + yearMonthDay
    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true });
    }
    let font = getRandomFontStyle();
    var color = vibrantDarkColors[Math.floor(Math.random() * vibrantDarkColors.length)];

    let sentences = translated.split(". ")
    translated = sentences.map(sentence => {
        return " - " + sentence
    }).join(".\n")
    console.log("Rendering transition")
    console.log("Translated:", translated)
    console.log("Transition Image:", transitionImage)
    let transitionImageExists = fs.existsSync(transitionImage)
    let outputFile = outputFolder + "/transition-" + id + "-" + font + "-" + color + ".jpg"
    let resizedTransitionImage = "/tmp/resized-transition-" + id + ".jpg"
    let innerText = "/tmp/inner-text-" + id + ".png"
    let innerTextBlurred = "/tmp/inner-text-blurred-" + id + ".png"
    if (transitionImageExists) {
        console.log("Transition image exists")
        await sharp(transitionImage)
            .resize(3840, 2160)
            .toFile(resizedTransitionImage)
        await sharp({
            text: {
                text: '<span foreground="#' + color + '">' + translated + '</span>',
                //   resolution is 4k
                width: 3840 * 0.8,
                height: 2160 * 0.8,
                font,
                rgba: true,
            }
        })
            .toFile(innerText)
        // add gaussian blur to the text
        await sharp({
            text: {
                text: '<span foreground="#FFFFFF">' + translated + '</span>',
                //   resolution is 4k
                width: 3840 * 0.8,
                height: 2160 * 0.8,
                font,
                rgba: true,
            }
        })
            .blur(50)
            .toFile(innerTextBlurred)
        await sharp(resizedTransitionImage)
            .composite([
                {
                    input: innerTextBlurred,
                    gravity: 'center'
                },
                {
                    input: innerText,
                    gravity: 'center'
                }
            ])
            .toFile(outputFile)
    } else {
        console.log("Transition image does not exist")
    }

    return outputFile
}
module.exports = {
    renderTransition
}