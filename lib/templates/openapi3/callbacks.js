'use strict';
module.exports = function anonymous(data
) {
var out='';if(typeof data.operation.callbacks === 'object'){out+='\n\n### Callbacks\n\n'; data.operationStack.push(data.operation); out+='\n\n'; for (var c of Object.keys(data.operation.callbacks)) { out+='\n\n#### '+(c)+'\n\n'; var callback = data.operation.callbacks && data.operation.callbacks[c]; out+='\n\n'; for (var e in callback) { out+='\n'; if (!e.startsWith('x-widdershins-')) { out+='\n\n**'+(e)+'**\n\n'; var exp = callback[e]; out+='\n\n'; for (var m in exp) { out+='\n\n'; data.operation = exp[m]; out+='\n'; data.method.operation = data.operation; out+='\n\n'+( data.templates.operation(data) )+'\n\n'; } /* of methods */ out+='\n\n'; } /* of expressions */ out+='\n\n'; } /* of if */ out+='\n\n'; } /* of callbacks */ out+='\n\n'; data.operation = data.operationStack.pop(); out+='\n'; data.method.operation = data.operation; out+='\n\n';}out+='\n';return out;
};
