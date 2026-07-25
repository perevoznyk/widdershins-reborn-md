'use strict';
module.exports = function anonymous(data) {
  var out = "<?php\n\nrequire 'vendor/autoload.php';\n\n";
  if (data.allHeaders.length) {
    out += '\n$headers = array(\n    ';
    var arr1 = data.allHeaders;
    if (arr1) {
      var p,
        index = -1,
        l1 = arr1.length - 1;
      while (index < l1) {
        p = arr1[(index += 1)];
        out += "'" + p.name + "' => '" + p.exampleValues.object + "',\n";
        if (index < data.allHeaders.length - 1) {
          out += '    ';
        }
      }
    }
    out += ');';
  }
  out +=
    "\n\n$client = new \\GuzzleHttp\\Client();\n\n// Define array of request body.\n$request_body = array();\n\ntry {\n    $response = $client->request('" +
    data.methodUpper +
    "','" +
    data.url +
    "', array(\n        'headers' => $headers,\n        'json' => $request_body,\n       )\n    );\n    print_r($response->getBody()->getContents());\n }\n catch (\\GuzzleHttp\\Exception\\BadResponseException $e) {\n    // handle exception or api errors.\n    print_r($e->getMessage());\n }\n\n // ...\n";
  return out;
};
