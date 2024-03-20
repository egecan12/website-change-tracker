// This function removes the protocol (http:// or https://) and 'www.' from the start of a URL, and the trailing slash if present.

exports.removeProtocolAndWWW = (url) => {
  let fixedUrl = url.toLowerCase();
  // Check if the URL starts with "www" or "https"
  if (
    fixedUrl.startsWith("www.") ||
    fixedUrl.startsWith("http://") ||
    fixedUrl.startsWith("https://")
  ) {
    fixedUrl = fixedUrl.replace(/(https?:\/\/)?(www\.)?/, "");
  }
  if (fixedUrl.endsWith("/")) {
    fixedUrl = fixedUrl.slice(0, -1);
  }
  return fixedUrl;
};

// This function adds the protocol (https://) and 'www.' to the start of a URL if they are not present, and removes the trailing slash if present.

exports.addProtocolAndWWW = (url) => {
  url = url.toLowerCase();
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }
  if (!url.startsWith("http://www.") && !url.startsWith("https://www.")) {
    url = url.replace("://", "://www.");
  }
  if (url.endsWith("/")) {
    url = url.slice(0, -1);
  }
  return url;
};

// This function checks if a string is a valid URL using a regular expression.

exports.validURL = function (str) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
};
