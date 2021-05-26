const path = require("path");
const postcss = require("postcss");

const watchSassPlugin = () => (css, result) => {
	result.messages.push({
		type: "dependency",
		file: path.resolve(__dirname, "wwwroot", "scss")
	});
};

module.exports = postcss.plugin("postcss-assets", watchSassPlugin);
