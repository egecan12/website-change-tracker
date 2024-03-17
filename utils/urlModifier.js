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
