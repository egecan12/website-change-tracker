exports.removeProtocolAndWWW = (url) => {
  let fixedUrl = url.toLowerCase().replace(/(https?:\/\/)?(www\.)?/, "");
  if (fixedUrl.endsWith("/")) {
    fixedUrl = fixedUrl.slice(0, -1);
  }
  return fixedUrl;
};

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
