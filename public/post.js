function POST(data, callback) {
  var xmlDoc = new XMLHttpRequest();

  xmlDoc.open('POST', "/uploadData", true);
  xmlDoc.setRequestHeader("Content-type", "application/json;charset=UTF-8");

  xmlDoc.onreadystatechange = function() {
    if (xmlDoc.readyState === 4 && xmlDoc.status === 200) {
      callback(xmlDoc);
    }
  };

  xmlDoc.send(JSON.stringify(data));
}
