let fs = require('fs');
let sharp = require('sharp');
function getRandomFontStyle() {
    var fontStyles = [
        'MediumItalic', 'Italic', 'Light', 'BlackItalic', 'Alternates-BoldItalic', 'Alternates-Bold', 'Alternates-LightItalic', 'Alternates-MediumItalic', 'SemiBold', 'Thin', 'Alternates-ExtraBold', 'Black', 'Regular', 'SemiBoldItalic', 'Alternates-ExtraBoldItalic', 'Bold', 'ExtraBoldItalic', 'Alternates-ExtraLightItalic', 'Alternates-Black', 'Alternates-ThinItalic', 'Alternates-ExtraLight', 'Medium', 'ExtraBold', 'Alternates-SemiBold', 'Alternates-BlackItalic', 'LightItalic', 'Alternates-SemiBoldItalic', 'Alternates-Light', 'ExtraLight', 'ThinItalic', 'ExtraLightItalic', 'BoldItalic', 'Alternates-Thin', 'Alternates-Medium', 'Alternates-Regular', 'Alternates-Italic',
    ].filter(font => {
        return !font.includes('Alternates') && !font.includes('Italic') && !font.includes('Light')
    })
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

let renderTransition = async (translated, transitionImage, id, job) => {
    job = job ?? {
        log: (message) => console.log(message)
    }
    job.log('Rendering transition')
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
    job.log("Rendering transition")
    job.log("Translated:", translated)
    job.log("Transition Image:", transitionImage)
    let transitionImageExists = fs.existsSync(transitionImage)
    let outputFile = outputFolder + "/transition-" + id + "-" + font + "-" + color + ".jpg"
    let resizedTransitionImage = "/tmp/resized-transition-" + id + ".jpg"
    let innerText = "/tmp/inner-text-" + id + ".png"
    let innerTextBlurred = "/tmp/inner-text-blurred-" + id + ".png"
    let compositeFile = '/tmp/composite-' + id + '.jpg'
    if (transitionImageExists) {
        job.log("Transition image exists")
        let imaginaryImagesService = process.env.DEBUG ? 'imaginary:9001' : 'localhost:9001'
        let imaginaryService = process.env.DEBUG ? 'imaginary-tmp' : 'localhost'
        job.log('Resizing transition image. File: ', transitionImage)
        let fetched = await fetch(`http://${imaginaryImagesService}/resize?width=2560&height=1440&nocrop=false&file=${transitionImage.replace('/app/storage/images/', '')}`)
        let resized = await fetched.arrayBuffer()
        fs.writeFileSync(resizedTransitionImage, Buffer.from(resized));
        // await sharp(transitionImage)
        //     .resize(3840, 2160)
        //     .toFile(resizedTransitionImage)
        let text = '<span foreground="#' + color + '">' + translated + '</span>';
        job.log('text: ', text)
        await sharp({
            text: {
                text,
                //   resolution is 4k
                width: 2560 * 0.8,
                height: 1440 * 0.8,
                font,
                rgba: true,
            }
        })
            .toFile(innerText)
        // add gaussian blur to the text
        let fetchedBlurred = await fetch(`http://${imaginaryService}:9000/blur?sigma=50&file=${innerText.replace('/tmp/', '')}`)
        let blurred = await fetchedBlurred.arrayBuffer()
        fs.writeFileSync(innerTextBlurred, Buffer.from(blurred));
        job.log('Resized transition image:', resizedTransitionImage, fs.readFileSync(resizedTransitionImage).length)
        job.log('Inner text:', innerText, fs.readFileSync(innerText).length)
        job.log('Inner text blurred:', innerTextBlurred, fs.readFileSync(innerTextBlurred).length)
        job.log('Composite file:', compositeFile)
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
            .toFile(compositeFile)
        fs.copyFileSync(compositeFile, outputFile)

        return outputFile;
    } else {
        job.log("Transition image does not exist")
    }

    return outputFile
}
module.exports = {
    renderTransition
}
