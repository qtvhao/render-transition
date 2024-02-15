let {renderTransition} = require('./renderTransition.js');


(async () => {
    let translated = "I am a translated string"
    let transitionImage = __dirname + '/images/white_paper_texture_hd.jpg'
    await renderTransition(translated, transitionImage)
})();
