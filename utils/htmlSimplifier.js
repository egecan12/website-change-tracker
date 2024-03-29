const cheerio = require("cheerio");
// This function simplifies HTML content by parsing it, removing script and style tags, removing all attribute values, and returning the body content.

exports.simplifyHTML = (content) => {
  // Parse the HTML content
  const $ = cheerio.load(content);

  // Remove script and style tags
  $("script, style").remove();

  // Remove all text nodes
  // $("*")
  //   .contents()
  //   .each(function () {
  //     if (this.type === "text") {
  //       $(this).remove();
  //     }
  //   });

  // Remove all attribute values
  $("*").each(function () {
    for (let attr in this.attribs) {
      $(this).attr(attr, "");
    }
  });

  // Extract the body content
  const bodyContent = $("body").html();

  return bodyContent;
};
