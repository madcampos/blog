/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
module.exports = function(eleventyConfig) {
	eleventyConfig.setQuietMode(true);

	eleventyConfig.addPassthroughCopy('public/**');

	return {
		pathPrefix: '/blog/',
		markdownTemplateEngine: false,
		htmlTemplateEngine: 'hbs',
		dir: {
			input: "src",
			output: "dist"
		}
	};
};
