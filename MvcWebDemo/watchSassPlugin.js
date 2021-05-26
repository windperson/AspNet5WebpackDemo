const path = require("path");

const watchSassPlugin = () => {
	return {
		postcssPlugin: 'scss-watcher',
		Once(root, {result}){
			result.messages.push({
				type: "dependency",
				file: path.resolve(__dirname, "wwwroot", "scss")
			});
		}
	}
};

module.exports = watchSassPlugin;
module.exports.postcss = true;
