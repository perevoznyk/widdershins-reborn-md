'use strict';
module.exports = function anonymous(data
) {
var out='const hermes = require(\'hermesjs\');\nconst app = hermes();\n\napp.from.client.send({\n  topic: \''+(data.topicName)+'\',\n  payload: '+(data.payload)+'\n});\n';return out;
};
