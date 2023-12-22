const fs = require('fs');
const data = {};
const config = (argument = []) => {
  const { config } = data;
  if (config) {
    return config;
  }
  const configPath = argument[0] || '.';
  data.config = JSON.parse(fs.readFileSync(`./config.json`));
  return data.config;
};
module.exports = config;
