let fs = require('fs');
let sharp = require('sharp');
let renderTransition = async (translated, transitionImage) => {
    console.log("Rendering transition")
    console.log("Translated:", translated)
    console.log("Transition Image:", transitionImage)
    let transitionImageExists = fs.existsSync(transitionImage)
    if (transitionImageExists) {
        console.log("Transition image exists")
        let resizedTransitionImage = "/tmp/resized-transition.jpg"
        await sharp(transitionImage)
            .resize(3840, 2160)
            .toFile(resizedTransitionImage)
        let font = 'Montserrat'
        await sharp({
            text: {
                text: translated,
                //   resolution is 4k
                width: 3840 * 0.8,
                height: 2160 * 0.8,
                font,
                rgba: true,
            }
        })
            .toFile('/tmp/inner-text.png')
        await sharp(resizedTransitionImage)
            .composite([
                {
                    input: '/tmp/inner-text.png',
                    gravity: 'center'
                }
            ])
            .toFile('/app/storage/images/transition-' + font + '.jpg')
    } else {
        console.log("Transition image does not exist")
    }
}
module.exports = {
    renderTransition
}