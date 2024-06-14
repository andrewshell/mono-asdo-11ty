const path = require("path");
const eleventyImage = require("@11ty/eleventy-img");

module.exports = eleventyConfig => {
	function relativeToPublicPath(relativeFilePath) {
		return path.resolve(__dirname, './public', `./${relativeFilePath}`);
	}

	// Eleventy Image shortcode
	// https://www.11ty.dev/docs/plugins/image/
	eleventyConfig.addAsyncShortcode("image", async function imageShortcode(src, alt, size) {
		// Full list of formats here: https://www.11ty.dev/docs/plugins/image/#output-formats
		// Warning: Avif can be resource-intensive so take care!
		let formats = ["avif", "webp", "auto"];
		let file = relativeToPublicPath(src);

		let metadata = await eleventyImage(file, {
			widths: [size ? parseInt(size, 10) * 2 : 'auto'],
			formats,
			outputDir: path.join(eleventyConfig.dir.output, "img"), // Advanced usage note: `eleventyConfig.dir` works here because we’re using addPlugin.
		});

		sizes = `${size}px`;

		// TODO loading=eager and fetchpriority=high
		let imageAttributes = {
			alt,
			sizes,
      itemprop: "contentUrl",
			loading: "lazy",
			decoding: "async",
		};

    let options = {
      pictureAttributes: {
        itemscope: true,
        itemtype: "http://schema.org/ImageObject"
      },
    };

		return eleventyImage.generateHTML(metadata, imageAttributes, options);
	});
};
