//check if need relogin
if(document.getElementById('UserID')){
    window.location.href = 'https://cas.coloradocollege.edu/cas/login?service=https%3A%2F%2Fbanssop.coloradocollege.edu%3A443%2Fssomanager%2Fc%2FSSB';
}

//STYLE
$('.pagetitlediv').remove();

var table = document.createElement('table');
table.setAttribute('class', 'menu-table');
var table_container = document.createElement('div');
document.body.appendChild(table_container);
table_container.appendChild(table);
table.appendChild(document.createElement('tbody'));

var fst = false;
$('.menuplaintable').eq(0).find('tr').each(function() {
    tr = $(this);
    var a = tr.find('a').last();
    var href = a.attr('href');
    var title = a.text();
    var desc = tr.find('span.menulinkdesctext').first().text().replace(/$\s*/, '');

    var row;
    if(fst){
        fst = false;
        row = table.rows[table.rows.length - 1];
    }else{
        fst = true;
        row = table.insertRow(-1);
    }
    var div = document.createElement('div');
    div.innerHTML = `<a class="list" href="${href}"> <div class="list-container"> <div class="list-title">${title}</div> <div class="list-description">${desc}</div> </div> </a>`;
    var cell = row.insertCell(0);
    cell.setAttribute('class', 'menu-cell');
    cell.appendChild(div);
});

//easier cc course tool
function load_tool(){
    var container = document.createElement('div');
    var cell = table.insertRow(0).insertCell(0);
    $(cell).attr('colspan', 2).html('<div id="cceasier-tool" style="width:100%;"></div>');
    $('#cceasier-tool').toggle().load(chrome.runtime.getURL('html/tool_div.html'), on_tool_loaded);
}

load_tool();

function show_modal_window(schedule) {
    var modal_window = $('[data-remodal-id=result_modal]').remodal();
    var courses = $('#course_pool').val().split(',');
    var hash = {};
    $.each(courses, function () { hash[this] = true; });
    courses = [];
    $.each(hash, function (k, v) { courses.push(k); });
    var departs = {};
    $.each(courses, function () {
        var course_code = this;
        if (schedule[course_code] == null) return;
        var depart_code = course_code.slice(0, 2);
        if (departs[depart_code] == null) departs[depart_code] = [[], [], [], [], [], [], [], []];
        $.each(schedule[course_code], function () {
            var block = parseInt(this['block']);
            if (isNaN(block)) return;
            departs[depart_code][block - 1].push(this);
        });
    });
    var modal_table = $('#result_modal_table')[0];
    modal_table.children[0].innerHTML = '';
    for (i = 0; i < 9; i++) modal_table.insertRow(-1);
    for (i = 1; i < 9; i++) {
        var cell = modal_table.rows[i].insertCell(-1);
        cell.innerText = i;
    }
    modal_table.rows[0].insertCell(-1);
    var depart2name = { "AN": "Anthropology", "AR": "Arabic", "AH": "Art History", "AS": "Art Studio", "PA": "Asian Studies", "BY": "Biology", "CH": "Chemistry", "CN": "Chinese Language", "CL": "Classics", "CO": "Comparative Literature", "CP": "Computer Science", "DS": "Dance Studio", "DA": "Dance Theory", "EC": "Economics", "ED": "Education", "EN": "English", "EV": "Environmental Program", "FG": "Feminist & Gender Studies", "FM": "Film and Media Studies", "FS": "Film Studies", "FR": "French", "GS": "General Studies", "GY": "Geology", "GR": "German", "HE": "Hebrew", "HY": "History", "HK": "Human Biology and Kinesiology", "IT": "Italian", "JA": "Japanese", "MA": "Mathematics", "MB": "Molecular Biology", "MU": "Music", "BE": "Organismal Biology and Ecology", "PH": "Philosophy", "PC": "Physics", "PS": "Political Science", "PG": "Portuguese", "PY": "Psychology", "RM": "Race, Ethnicity, and Migration", "RE": "Religion", "RU": "Russian", "RS": "Russian & Eurasian Studies", "SO": "Sociology", "SW": "Southwest Studies", "SP": "Spanish", "HS": "Studies in Humanities", "NS": "Studies in Natural Science", "TH": "Theatre" };
    $.each(departs, function (depart, blocks) {
        var cell = modal_table.rows[0].insertCell(-1);
        cell.innerText = depart2name[depart];
        for (j = 0; j < 8; j++) {
            var cell = modal_table.rows[j + 1].insertCell(-1);
            cell.innerHTML = '<table border=true><tbody><tr></tr></tbody></table>';
            var container_row = cell.children[0].children[0].children[0];
            $.each(blocks[j], function () {
                var card_container = container_row.insertCell(-1);
                card_container.innerHTML = `<h3>${this['course_no']}<h3><br>${this['available']}/${this['limit']} (<small>${this['waitlist']}</small>, <small>${this['reserved']}</small>)`
            });
        }
    });
    modal_window.open();
}

function on_tool_loaded(){
    var container = document.createElement('div');
    var cell = table.insertRow(0).insertCell(0);
    $(cell).attr('colspan', 2).attr('class', 'menu-cell');
    cell.appendChild(container);
    container.innerHTML = `<a class="list" href="javascript:0;"> <div class="list-container"> <div class="list-title" style="color:green;">Easier CC Banner Course Scheduler</div> <div class="list-description" style="color:green;">Scheduling courses has never been easier.</div> </div> </a>`;
    $(container.children[0]).click(function(){
        $('#cceasier-tool').slideToggle();
    });

    //var bar = new ldBar('#progress');
    $('#course_pool').css('background-color','#b5b5b5 !important');
    var start_time = new Date().getTime();
    var timer = setInterval(function(){
        var t = (new Date().getTime() - start_time) / 1000;
        var p = 100*(1-Math.pow(0.85, t));
        //bar.set(p);
        $('#loading_bar').css('width',p+"%").css('width', '+=5px');
    }, 20);
    $('#cceasier-tool *').prop('disabled', true);
    get_schedule(schedule => {
        clearInterval(timer);
        setTimeout(function(){
            //bar.set(100);
            $('#loading_bar').css('width','100%').css('width', '+=5px');
            $('#loading_bar').css('transition','0.3s');
            $('#loading_bar').css('background-color','transparent');
            $('#course_pool').css('transition','1s');
            $('#course_pool').css('background-color','transparent');
        }, 1000);
        $('#cceasier-tool *').prop('disabled', false);

        var course_list = [];
        var instructor_sum = {};
        $.each(schedule, function() {
            var prof = '';
            var hash = {};
            $.each(schedule[this[0]['course_no']], function(){
                if(hash[this['instructor']] == null){
                    prof += this['instructor'] + ', ';
                    hash[this['instructor']] = true;
                }
            });
            prof = prof.slice(0, -2);
            course_list.push({
                "course_code": this[0]["course_no"],
                "course_title": this[0]["course_title"],
                "instructor": prof
            });
            instructor_sum[this[0]['course_no']] = prof;
        });
        var fuse = new Fuse(course_list, {
            shouldSort: true,
            threshold: 0.4,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 2,
            keys: [
                "course_code",
                "instructor",
                "course_title"]
        });

        new Textcomplete(new Textcomplete.editors.Textarea(document.getElementById('course_pool'))).register([
            {
                match: /(^|,)([^,]+)$/,
                search: function (term, callback) {
                    var result = fuse.search(term);
                    result = result.slice(0, 5);
                    var match = [];
                    $.each(result, function(){
                        match.push(this['course_code']);
                    });
                    callback(match);
                },
                template: function (course_code) {
                    return `<p><b>${course_code}</b> <small>(${instructor_sum[course_code]})</small></p>${schedule[course_code][0]['course_title']}<p></p>`
                },
                replace: function (course_code) {
                    return '$1' + course_code + ',';
                }
            }
        ]);

        //modal window
        $('#course_pool_confirm').click(function(){show_modal_window(schedule) });
        key('ctrl+enter', function(){
            console.log('hihi')
            if($('#course_pool').is(':focus')) show_modal_window(schedule);
        });
        key.filter = ev => true;
    });

    $(document.head).append(`<link rel="stylesheet" href="${chrome.runtime.getURL('style/main.css')}">`);

    //course scheduler style

    $("#course_pool").focus(function(){
$(".dropdown-menu").css('display','block');
        $(".dropdown-menu").addClass("hover-over-boxshadow");
        $("#course_pool").addClass("hover-over-boxshadow");
        //console.log('clicked');
    });
    $("#course_pool").blur(function(){
        $(".dropdown-menu").css('display','none');
        $(".dropdown-menu").removeClass("hover-over-boxshadow");
        $("#course_pool").removeClass("hover-over-boxshadow");
    });

    var arrowImgUrl = chrome.runtime.getURL('img/arrow.png');
    $("#course_pool_confirm").append('<img src="'+arrowImgUrl+'"></img>');
}

//remove the orignal menu
$(document.body.children[1]).remove();

