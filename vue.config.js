const path = require("path");

module.exports = {
    devServer: {
        proxy: {
            "/todos": {
                target: "http://localhost:3000/"
            }
        }
    }
}