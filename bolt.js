// Description:
//   TODO を管理できるボットです
// Commands:
//   ボット名 add      - TODO を作成
//   ボット名 done     - TODO を完了にする
//   ボット名 del      - TODO を消す
//   ボット名 list     - TODO の一覧表示
//   ボット名 donelist - 完了した TODO の一覧表示
'use strict';
const bolt = require('@slack/bolt');
const dotenv = require('dotenv');
dotenv.config();
const todo = require('todo');

const app = new bolt.App({
    token: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true,
    logLevel: 'debug'
});

//   ボット名 add      - TODO を作成
//正規表現の . ...改行以外の任意の１文字にマッチ
//正規表現の + ...直前の文字の１回以上の繰り返しにマッチ
//正規表現の i ...大文字小文字を区別しない
app.message(/add (.+)/i, ({context, say}) => {  //contextを使うと、正規表現によるマッチの結果に取得できる
    
    //context は無名関数の引数で渡された、メッセージに関わる情報が含まれたオブジェクト
    //trimメソッド....文字列の両端の空白を削除する
    const taskName = context.matches[1].trim();
    todo.add(taskName);
    say(`追加しました: ${taskName}`);
});

//   ボット名 done     - TODO を完了にする
app.message(/done (.+)/i, ({context, say}) => {
    const taskName = context.matches[1].trim();
    todo.done(taskName);
    say(`完了しました: ${taskName}`);
});

//   ボット名 del      - TODO を消す
app.message(/del (.+)/i, ({context, say}) => {
    const taskName = context.matches[1].trim();
    todo.del(taskName);
    say(`削除しました: ${taskName}`);
});

//   ボット名 list     - TODO の一覧表示（表示させるものが何もないとエラー落ちします）
//正規表現の ^ ...前方一致を表す（続く文字列が先頭となる文字列にマッチ）
app.message(/^list/i, ({context, say}) => {
    //joinメソッド....配列の全ての要素を、与えられた文字列で繋つないで1つの文字列にする関数(ここでは改行文字で結合)
    say(todo.list().join('\n'));
});

//   ボット名 donelist - 完了した TODO の一覧表示（表示させるものが何もないとエラー落ちします）
app.message(/donelist/i, ({context, say}) => {
    say(todo.donelist().join('\n'));
});

app.start();