const moment = require("moment");

function convertUTCToLocal(utcTime) {
  return moment.utc(utcTime).local().format("YYYY-MM-DD HH:mm:ss");
}

function formatDateTime(dateTime, format) {
  return moment(dateTime).format(format);
}

module.exports = {
  convertUTCToLocal,
  formatDateTime,
};
