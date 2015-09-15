# Lambda-OpenGraph-Spot
AWS Lambda to get properties of report spot

## 呼び出し方
JSON を Base64 + URLEncode して url のサブパスとして渡します。

``例) https://api.fathens.org/triton-note/open_graph/spot/<base64url>``

### JSON 内のプロパティ

|property|description|
|:--|:--|
|url|パラメータを除いたURL|
|appId|Facebook でのアプリケーションID|
|region|DynamoDB のリージョン名|
|table_report|Report のテーブル名|
|cognitoId|対象となる CatchReport のユーザの Cognito ID|
|reportId|対象となる CatchReport の ID|

