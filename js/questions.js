function get_question_data() {

    // セッション情報の初期設定
    var input_moji = 
        "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポァィゥェォャュョヴー";
    var mojilist = '';
    var countdown = 10;
    var status = "answering";
    var colors = {
        "ア": "white", "イ": "white", "ウ": "white", "エ": "white", "オ": "white",
        "カ": "white", "キ": "white", "ク": "white", "ケ": "white", "コ": "white",
        "サ": "white", "シ": "white", "ス": "white", "セ": "white", "ソ": "white",
        "タ": "white", "チ": "white", "ツ": "white", "テ": "white", "ト": "white",
        "ナ": "white", "ニ": "white", "ヌ": "white", "ネ": "white", "ノ": "white",
        "ハ": "white", "ヒ": "white", "フ": "white", "ヘ": "white", "ホ": "white",
        "マ": "white", "ミ": "white", "ム": "white", "メ": "white", "モ": "white",
        "ヤ": "white", "ユ": "white", "ヨ": "white",
        "ラ": "white", "リ": "white", "ル": "white", "レ": "white", "ロ": "white",
        "ワ": "white", "ヲ": "white", "ン": "white",
        "ガ": "white", "ギ": "white", "グ": "white", "ゲ": "white", "ゴ": "white",
        "ザ": "white", "ジ": "white", "ズ": "white", "ゼ": "white", "ゾ": "white",
        "ダ": "white", "ヂ": "white", "ヅ": "white", "デ": "white", "ド": "white",
        "バ": "white", "ビ": "white", "ブ": "white", "ベ": "white", "ボ": "white",
        "パ": "white", "ピ": "white", "プ": "white", "ペ": "white", "ポ": "white",
        "ァ": "white", "ィ": "white", "ゥ": "white", "ェ": "white", "ォ": "white",
        "ャ": "white", "ュ": "white", "ョ": "white",
        "ヴ": "white", "ッ": "white", "ー": "white"
    }
    window.sessionStorage.setItem(['input_moji'], [input_moji]);
    window.sessionStorage.setItem(['mojilist'], [mojilist]);
    window.sessionStorage.setItem(['countdown'], [countdown]);
    window.sessionStorage.setItem(['status'], [status]);
    // string型に変換してから保存
    var str_colors = JSON.stringify(colors);
    window.sessionStorage.setItem(['colors'], [str_colors]);

// 出題情報取得APIを叩きにいく
    $.ajax({
        url:'https://gjzlwif7k0.execute-api.ap-northeast-1.amazonaws.com/dev/question',
        type:'GET',
        dataType:'json',
    }).done(function(data){
        console.log('Get question data.');

        // 出題情報から、馬名を選択→スペースで埋める処理のために配列にする
        var theme = JSON.parse(data.body);
        var arr_horseName = [...theme.horseName];
        // 馬名が9文字未満の場合、スペースで埋める
        while(arr_horseName.length % 9 != 0){
            arr_horseName.push(" ");
        }
        // 配列化しているhorseNameを元のStringに戻す
        var horseName = arr_horseName.join("");
        window.sessionStorage.setItem(['horseName'], [horseName]);

    }).fail(function(){
        console.log('Communication failed.');
    });
}


function click_enter() {
    
    // セッションから正誤判定に必要なデータを取得
    var mojilist = window.sessionStorage.getItem(['mojilist']);
    var horseName = window.sessionStorage.getItem(['horseName']);
    var countdown = window.sessionStorage.getItem(['countdown']);
    var status = window.sessionStorage.getItem(['status']);
    var str_colors = window.sessionStorage.getItem(['colors']);
    // string型をObject型へ戻す（JSONデータ）
    var colors = JSON.parse(str_colors);

    // JSONデータとしてデータをセット
    var JSONdata = {
        "mojilist": mojilist,
        "horseName": horseName,
        "countdown": countdown,
        "status": status,
        "colors": colors
    }

    $.ajax({
        url:'https://2rzeqft60c.execute-api.ap-northeast-1.amazonaws.com/dev/question',
        type:'POST',
        dataType:'json',
        contentType:'application/json',
        data:JSON.stringify(JSONdata),
        scriptCharset: 'utf-8',
    }).done(function(data){
        console.log('send mojilist.');
        // dataの受け取りとセッションへの保存
        var status = data.status;
        var countdown = Number(data.countdown);
        window.sessionStorage.setItem(['countdown'], [countdown]);
        window.sessionStorage.setItem(['status'], [status]);
        // colorsの結果から、入力文字表示エリアと文字ボタンの色を変更する
        changeMojiColor(data);
    }).fail(function(){
        console.log('send mojilist failed.');
    });
}

function changeMojiColor(data){
    console.log(data);

    // dataの受け取りとセッションへの保存
    var colors = data.colors;
    console.log("colors: " + JSON.stringify(colors));
    // string型に変換してから保存
    var str_colors = JSON.stringify(colors);
    window.sessionStorage.setItem(['colors'], [str_colors]);

    // 入力文字列分だけ、色変更がないかチェックする
    var mojilist = window.sessionStorage.getItem(['mojilist']);
    var arr_mojilist = [...mojilist];
    var m_id = 'm_id';
    var t_id = 't';

    for(var m of arr_mojilist){
        // tableとbtnのidを取得する
        var input_moji = [...window.sessionStorage.getItem(['input_moji'])];
        var m_num = input_moji.indexOf(m);
        m_id = m_id + String(m_num);
        console.log("m: " + m);
        console.log("m_id: " + m_id);

        var t_num = arr_mojilist.indexOf(m);
        t_id = t_id + String(t_num);
        console.log("t_id: " + t_id);
        console.log("colors[m]: " + colors[m]);
        
        // tableとbtnの色を変える
        if(colors[m] === "gray"){
            document.getElementById(m_id).classList.add("btn_gray");
            document.getElementById(t_id).style.backgroundColor = '#a9a9a9'
        }else if(colors[m] === "yellow"){
            document.getElementById(m_id).classList.add("btn_yellow");
            document.getElementById(t_id).style.backgroundColor = '#f8e58c'
        }else if(colors[m] === "green"){
            document.getElementById(m_id).classList.add("btn_green");
            document.getElementById(t_id).style.backgroundColor = '#adccbc'
        }
        m_id = 'm_id';
        t_id = 't';
    }
    
}

function click_delete() {

    // セッションから入力文字列を受け取る
    var mojilist = window.sessionStorage.getItem(['mojilist']);

    // mojilistを一文字ずつ区切る
    var sp_mlist = mojilist.split('');

    // 末尾から１文字削除
    d_mlist = sp_mlist.slice(0, -1);

    // 削除する入力文字表示エリアの文字を非表示に戻す
    var t = 't' + String(d_mlist.length);
    document.getElementById(t).innerHTML = '';

    // セッションへ入力文字列を再登録する
    mojilist = d_mlist.join('');
    try{
        window.sessionStorage.setItem(['mojilist'],[mojilist]);
    }catch(err){
        throw new console.error(err);
    }
}

function click_line_delete() {

    // セッションから入力文字列を受け取る
    var mojilist = window.sessionStorage.getItem(['mojilist']);

    // mojilistを一文字ずつ区切る
    var sp_mlist = mojilist.split('');

    // 末尾からひと単語分削除
    d = sp_mlist.length % 9;
    d_mlist = sp_mlist.slice(0, -d);

    // 削除する入力文字表示エリアの文字を非表示に戻す
    for(var i=0; i<d; i++){
        var t = 't' + String((sp_mlist.length-1) - i);
        document.getElementById(t).innerHTML = '';
    }

    // セッションへ入力文字列を再登録する
    mojilist = d_mlist.join('');
    try{
        window.sessionStorage.setItem(['mojilist'],[mojilist]);
    }catch(err){
        throw new console.error(err);
    }
}


function click_moji(m_id) {
    // 入力文字ボタンの値を受け取る
    var moji = $('#' + m_id).val();

    // セッションから入力文字列を受け取る
    var mojilist = window.sessionStorage.getItem(['mojilist']);

    // mojilistにmojiを追加
    if(mojilist == ''){
        mojilist = moji;
    }else{
        mojilist += moji;
    }
    
    // セッションへ入力文字列を登録する
    try{
        window.sessionStorage.setItem(['mojilist'],[mojilist]);
    }catch(err){
        throw new console.error(err);
    }

    // mojilistを一文字ずつ区切る
    var sp_mlist = mojilist.split('');

    // 対応する入力文字表示エリアに入力文字を表示させる
    for(var i=0; i<sp_mlist.length; i++){
        var t = 't' + String(i);
        document.getElementById(t).innerHTML = sp_mlist[i];
    }

}
