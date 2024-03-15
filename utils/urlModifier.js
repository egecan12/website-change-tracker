exports.removeProtocolAndWWW = (url) => {
  let fixedUrl = url.replace(/(https?:\/\/)?(www\.)?/, "");
  if (fixedUrl.endsWith("/")) {
    fixedUrl = fixedUrl.slice(0, -1);
  }
  return fixedUrl;
};

exports.addProtocolAndWWW = (url) => {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }
  if (!url.startsWith("http://www.") && !url.startsWith("https://www.")) {
    url = url.replace("://", "://www.");
  }
  return url;
};
// in this file a function should add wwww and https to the url if it is missing
// in this file a function should remove wwww and https to the url if it is missing
