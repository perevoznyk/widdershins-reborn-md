'use strict';
module.exports = function anonymous(data
) {
var out='';if(data.response.links){out+='\n\n#### Links\n\n'; for (var l in data.response.links) { out+='\n'; var link = data.response.links[l]; out+='\n\n**'+(l)+'** => ';if(link.operationId){out+='<a href="#opId'+(link.operationId)+'">'+(link.operationId)+'</a>';}else{out+=''+(link.operationRef);}out+='\n\n';if(link.parameters){out+='\n|Parameter|Expression|\n|---|---|\n';for (var p in link.parameters) { out+='|'+(p)+'|'+(link.parameters[p])+'|'; } out+='\n';}out+='\n\n'; } /* of links */ out+='\n\n';}out+='\n';return out;
};
