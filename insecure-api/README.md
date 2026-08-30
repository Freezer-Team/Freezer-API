# 不安全的API

## I/O

String io.readFile(String path) throws IOException;
void io.writeContent(String path, String content) throws IOException;
void io.writeContent(String path, String content, boolean append) throws IOException;

## Prop

void prop.set(String key, String value);
String prop.get(String key);

## Net

Pair<Integer, String> net.post(String link, String body, String... property) throws IOException, URISyntaxException;
Pair<Integer, String> net.get(String link, String... property) throws IOException, URISyntaxException;

example:

var result = net.get("https://freezer.sakion.top/v1/query");

var responseCode = result.first;
var responseBody = result.second;
