const axios = require("axios");
const config = require("../config");

function healthCheck() {
  return new Promise(async (resolve, reject) => {
    try {
      let report = await axios.get(config.HOST_URL + "/health-check");
      console.log({msg:`Health-check report : ${report.data.msg} 😁😁😁`});
      resolve(report.data);
    } catch (error) {
      console.log({ error, msg:"Health-check abnormal ☹️☹️☹️☹️" });
      reject(error);
    }
  });
}

module.exports=healthCheck;
