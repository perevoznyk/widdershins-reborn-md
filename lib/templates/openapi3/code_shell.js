'use strict';
module.exports = function anonymous(data
) {
var out='# You can also use wget\ncurl -X '+(data.methodUpper)+' '+(data.url)+(data.requiredQueryString);if(data.allHeaders.length){out+=' \\';}out+='\n';var arr1=data.allHeaders;if(arr1){var p,index=-1,l1=arr1.length-1;while(index<l1){p=arr1[index+=1];out+='  -H \''+(p.name)+': '+(p.exampleValues.object)+'\'';if(index < data.allHeaders.length-1){out+=' \\';}out+='\n';} } out+='\n';return out;
};
