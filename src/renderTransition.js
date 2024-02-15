let fs = require('fs');
let sharp = require('sharp');
let renderTransition = async (translated, transitionImage) => {
    console.log("Rendering transition")
    console.log("Translated:", translated)
    console.log("Transition Image:", transitionImage)
    let transitionImageExists = fs.existsSync(transitionImage)
    if (transitionImageExists) {
        console.log("Transition image exists")
        await sharp(transitionImage)
            .toFile('/app/storage/images/transition.jpg')
    } else {
        console.log("Transition image does not exist")
    }
}
module.exports = {
    renderTransition
}