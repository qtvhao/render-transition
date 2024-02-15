let {renderTransition} = require('./renderTransition.js');


(async () => {
    let translated = "\"Phân tích phương sai\" (variance analysis) là một công cụ mạnh mẽ giúp doanh nghiệp xác định nguyên nhân đằng sau sự khác biệt giữa các con số dự định hoặc ngân sách và các \"con số thực tế đạt được\" (actual figures achieved). Nó cho phép các nhà quản lý có cái nhìn sâu sắc về các yếu tố đóng góp vào những sự khác biệt này, cho dù chúng có tính thuận lợi hay bất lợi."
    let transitionImage = __dirname + '/images/white_paper_texture_hd.jpg'
    let outputFile = await renderTransition(translated, transitionImage, 'id651')
    console.log("Output File:", outputFile)
})();
