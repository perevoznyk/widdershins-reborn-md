'use strict';

module.exports = function anonymous(data) {
    var out = '# You can also use wget\n';
    out += 'curl -X ' + data.methodUpper + ' ' + data.url + data.requiredQueryString;

    var hasHeaders = data.allHeaders && data.allHeaders.length;
    var isPostLike = ['POST', 'PUT', 'PATCH'].includes(data.methodUpper);

    if (hasHeaders || isPostLike) {
        out += ' \\';
    }
    out += '\n';

    // Headers
    if (hasHeaders) {
        data.allHeaders.forEach(function (h, idx) {
            out += "  -H '" + h.name + ': ' + h.exampleValues.object + "'";

            if (idx < data.allHeaders.length - 1 || isPostLike) {
                out += ' \\';
            }

            out += '\n';
        });
    }

    // Request body
    if (isPostLike) {

        // Case 1: sample JSON is available
        if (data.bodyParameter.refName !== undefined) {
            out += "  --data '" + JSON.stringify(data.bodyParameter.exampleValues.json) + "'\n";
        }

        // Case 2: raw body text is available
        else if (data.postData && data.postData.text) {
            out += "  --data '" + data.postData.text.replace(/'/g, "'\\''") + "'\n";
        }

        // Case 3: no example available -> use file
        else {
            out += '  --data @request-body.json\n';
        }
    }

    out += '\n';
    return out;
};
