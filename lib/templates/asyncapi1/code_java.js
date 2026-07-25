'use strict';
module.exports = function anonymous(data) {
  var out =
    '/* asyncapi-java-tools */\ntry (JmsServer client = builder.build()) {\n\n  client.' +
    data.topicName +
    '()\n    .publish(' +
    data.payload +
    ')\n    .toCompletableFuture()\n    .get();\n}\n';
  return out;
};
