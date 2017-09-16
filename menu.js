//check if need relogin
if(document.getElementById('UserID')){
    window.location.href = 'https://cas.coloradocollege.edu/cas/login?service=https%3A%2F%2Fbanssop.coloradocollege.edu%3A443%2Fssomanager%2Fc%2FSSB';
}

function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
}

//create menu table
{
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
}

//load easier cc tool -> on_tool_loaded()
function load_tool(){
    var container = document.createElement('div');
    var cell = table.insertRow(0).insertCell(0);
    $(cell).attr('colspan', 2).html('<div id="cceasier-tool" style="width:100%;"></div>');
    $('#cceasier-tool').toggle().load(chrome.runtime.getURL('html/tool_div.html'), on_tool_loaded);
}

load_tool();

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
var tableLoaded=false;
function show_modal_window(schedule) {
    //preprocess data
    {
        //sieve out duplicated courses
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
    }

    //if no valid courses
    if(Object.keys(departs).length == 0) {
        $('#course_pool').css('transition', '200ms');
        $('#course_pool').css('background-color', '#ffcdd2');
        setTimeout(function(){
            $('#course_pool').css('transition', '200ms');
            $('#course_pool').css('background-color', 'transparent');
        }, 200);
        return;
    }

    //build table, build export array
    {
        var modal_table = $('#result_modal_table')[0];
        modal_table.children[0].innerHTML = '';
        for (i = 0; i < 9; i++) modal_table.insertRow(-1);
        for (i = 1; i < 9; i++) {
            var cell = modal_table.rows[i].insertCell(-1);
            cell.innerText = i;
        }
        modal_table.rows[0].insertCell(-1);

        var depart2name = { "JD": "Jedi-ing", "AN": "Anthropology", "AR": "Arabic", "AH": "Art History", "AS": "Art Studio", "PA": "Asian Studies", "BY": "Biology", "CH": "Chemistry", "CN": "Chinese Language", "CL": "Classics", "CO": "Comparative Literature", "CP": "Computer Science", "DS": "Dance Studio", "DA": "Dance Theory", "EC": "Economics", "ED": "Education", "EN": "English", "EV": "Environmental Program", "FG": "Feminist & Gender Studies", "FM": "Film and Media Studies", "FS": "Film Studies", "FR": "French", "GS": "General Studies", "GY": "Geology", "GR": "German", "HE": "Hebrew", "HY": "History", "HK": "Human Biology and Kinesiology", "IT": "Italian", "JA": "Japanese", "MA": "Mathematics", "MB": "Molecular Biology", "MU": "Music", "BE": "Organismal Biology and Ecology", "PH": "Philosophy", "PC": "Physics", "PS": "Political Science", "PG": "Portuguese", "PY": "Psychology", "RM": "Race, Ethnicity, and Migration", "RE": "Religion", "RU": "Russian", "RS": "Russian & Eurasian Studies", "SO": "Sociology", "SW": "Southwest Studies", "SP": "Spanish", "HS": "Studies in Humanities", "NS": "Studies in Natural Science", "TH": "Theatre" };
        $.each(departs, function (depart, blocks) {
            var cell = modal_table.rows[0].insertCell(-1);
            var depart_name = depart2name[depart];
            cell.innerText = depart_name;
            cell.setAttribute('class', 'modal-course-title');
            var max_len = Math.max(...$(blocks).map((_,x)=>x.length));
            for (j = 0; j < 8; j++) {
                var cell = modal_table.rows[j + 1].insertCell(-1);
                $.each(blocks[j], function () {
                    var div_container = document.createElement('div');
                    var course_code = this['course_no'];
                    div_container.setAttribute('class', 'modal-cell');
                    if(!(window.first_year && this['reserved'] != 0))
                        if(this['available'] == 0) $(div_container).addClass('modal-course-disabled');
                    var id = guid();
                    div_container.innerHTML = `<div class="modal-course-id">${course_code} </div>
                    <!--div class="modal-course-name">${this['course_title'].replace(/(\[.*\])|(\(.*\))/,'')}<img height=13px width=13px src=${chrome.runtime.getURL('img/outlink.svg')} onclick="javascript:window.open('https://www.coloradocollege.edu/academics/curriculum/catalog/detail.html?courseid=${course_code}');"></div-->
                    <div class="modal-course-name"><a href="https://www.coloradocollege.edu/academics/curriculum/catalog/detail.html?courseid=${course_code}" target='_blank'>${this['course_title'].replace(/(\[.*\])|(\(.*\))/,'')}</a></div>

                    <div class="modal-course-info1">${/( |^)(\S*)$/.exec(this['instructor'])[2]}</div>
                    <div class="modal-course-info1">${this['available']}/${this['limit']}</div>
                    <div class="modal-course-info2">(${this['waitlist']}, ${this['reserved']})</div>`
                    $(div_container).find('.modal-course-id').css('cursor', 'pointer');
                    if(this['available'] != 0)
                        $(div_container).find(".modal-course-id").click(function(){

                            if($(div_container).hasClass('wiggle')){
                                $(div_container).removeClass('wiggle');
                                $(div_container).find(".modal-course-id").removeClass('modal-course-id-selected');
                            }
                            else{
                                $(div_container).addClass('wiggle');
                                $(div_container).find(".modal-course-id").addClass('modal-course-id-selected');
                            } 
                        });
                    cell.appendChild(div_container);
                });
            }
        });
    }


    //modal table style
    
    var modalTableTrs = $('#result_modal_table').find('tr');
    //console.log(modalTableTrs);
    var modalTableTds = modalTableTrs.find('td');
    modalTableTrs.css('height','70px');
    $(modalTableTrs[0]).css('height','auto');
    $(modalTableTds[0]).css('width','5%');
    //title tds
    for(var i=0; i<(modalTableTds.length-modalTableTrs.length)/modalTableTrs.length; i++)
    {
        var x = 100*modalTableTrs.length/(modalTableTds.length-modalTableTrs.length);
        $(modalTableTds[i+1]).css('width',(x-5/x).toString()+'%');
        $(modalTableTds[i+1]).addClass('modal-course-title');
    }
    //all trs
    for(var i=0; i<modalTableTrs.length; i++)
    {
        if(i%2==0){
            $(modalTableTrs[i]).css('background-color','#eee');
        }

    }
    if(!tableLoaded)
    {
        var printImgUrl = chrome.runtime.getURL('img/print.png');
        $('#btn_export').append('<img src="' + printImgUrl + '"></img>');
    }
    
    //export
    {
        $('#btn_export').click(function(){
            var html_string = $('<div>').append($('#result_modal_table').clone()).html(); 
            var w = window.open('about:blank');
            $.get(chrome.runtime.getURL('style/main.css'), css => {
                var style = w.document.createElement('style');
                style.innerHTML = css;
                w.document.head.appendChild(style);
                w.document.body.innerHTML = html_string;
                w.window.print();
            });
        });
    }
    $('[data-remodal-id=result_modal]').remodal().open();

    tableLoaded=true;
}

function on_tool_loaded(){
    //create cc easer tool toggler
    {
        var container = document.createElement('div');
        var cell = table.insertRow(0).insertCell(0);
        $(cell).attr('colspan', 2).attr('class', 'menu-cell');
        cell.appendChild(container);
        container.innerHTML = `<a class="list" href="javascript:0;"> <div class="list-container"> <div class="list-title" style="color:green;">Easier CC Banner Course Scheduler</div> <div class="list-description" style="color:green;">Scheduling courses has never been easier.</div> </div> </a>`;
        $('#course_pool_confirm').toggle();
        
        //$(container.children[0]).click(function () {
            if($('#course_pool_confirm').css('display') != 'none')
                $('#course_pool_confirm').toggle();
            $('#cceasier-tool').slideToggle(0, function(){
                if($('#course_pool_confirm').css('display') == 'none')
                    $('#course_pool_confirm').toggle();
            });
        //});

    }

    //course scheduler style
    {
        $("#course_pool").focus(function () {
            $(".dropdown-menu").css('display', 'block');
            $(".dropdown-menu").addClass("hover-over-boxshadow");
            $("#course_pool").addClass("hover-over-boxshadow");
        });
        $("#course_pool").blur(function () {
            $(".dropdown-menu").css('display', 'none');
            $(".dropdown-menu").removeClass("hover-over-boxshadow");
            $("#course_pool").removeClass("hover-over-boxshadow");
        });
        var arrowImgUrl = chrome.runtime.getURL('img/arrow.png');
        $("#course_pool_confirm").append('<img src="' + arrowImgUrl + '"></img>');
    }

    //confirm button positioning
    $('#course_pool_confirm').css('left',($(window).width()*0.75-35-25).toString()+'px' );
    $( window ).resize(function() {
        $('#course_pool_confirm').css('left',($(window).width()*0.75-35-25).toString()+'px' );
    });



    //transition & progress bar
    {
        $('#course_pool').css('background-color', '#b5b5b5 !important');
        var start_time = new Date().getTime();
        window.progressTimer = setInterval(function () {
            var t = (new Date().getTime() - start_time) / 1000;
            var p = 100 * (1 - Math.pow(0.85, t));
            $('#loading_bar').css('width', p + "%").css('width', '+=5px');
        }, 20);
        $('#cceasier-tool *').prop('disabled', true);
    }

    get_schedule(schedule => {
        var schedule_url = null;
        $('a').each(function(){ if(this.href.toString().endsWith('P_CrseSchdDetl')) schedule_url = this.href; });
        $.get(schedule_url, html => { window.first_year = html.search('First-Year') != -1; });
        on_schedule_loaded(schedule);
    });
}

function on_schedule_loaded(schedule) {
    //transition & progress bar
    {
        clearInterval(window.progressTimer);
        setTimeout(function () {
            $('#loading_bar').css('width', '100%').css('width', '+=5px');
            $('#loading_bar').css('transition', '0.3s');
            $('#loading_bar').css('background-color', 'transparent');
            $('#course_pool').css('transition', '1s');
            $('#course_pool').css('background-color', 'transparent');
        }, 1000);
        $('#cceasier-tool *').prop('disabled', false);
    }

    //preprocess schedule data
    schedule['JD101'] = [{
        "course_no": 'JD101',
        "course_title": "Elementary Jedi-ing. [Prerequisite: Travelling to Dagobah. Be prepared for your professor's death.]",
        "instructor": 'Yoda',
        "block": "never"
    }];
    {
        var course_list = [];
        var instructor_sum = {};
        $.each(schedule, function () {
            var prof = '';
            var hash = {};
            $.each(schedule[this[0]['course_no']], function () {
                if (hash[this['instructor']] == null) {
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
    }

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
                //if is course number
                if(/(^|,)([A-Z][A-Z]|[a-z][a-z])\d{0,3}$/.test(term)){
                    term = term.toUpperCase();
                    var ans = [];
                    for(i=0;i<course_list.length;i++){
                        if(course_list[i]['course_code'].startsWith(term)){
                            ans.push(course_list[i]['course_code']);
                            if(ans.length >= 8) break;
                        }
                    }
                    if (ans.length != 0) {
                        callback(ans);
                        return;
                    }
                }
                var result = fuse.search(term);
                result = result.slice(0, 8);
                var match = [];
                $.each(result, function () { match.push(this['course_code']); });
                callback(match);
            },
            template: function (course_code) {
                var title = schedule[course_code][0]['course_title'].replace(/(\[.*\])/g, '<small style="color:grey">$1</small>').replace(/(\(.*\))/g, '<small style="color:grey">$1</small>');
                return `<b>${course_code}</b> <small>(${instructor_sum[course_code]})</small><br>${title}`
            },
            replace: function (course_code) {
                return '$1' + course_code + ',';
            }
        }
    ]);

    //modal window event
    {
        $('#course_pool_confirm').click(function () { show_modal_window(schedule) });
        key('ctrl+enter', function () {
            if ($('#course_pool').is(':focus')) show_modal_window(schedule);
        });
        key.filter = ev => true;
    }



}

//remove the orignal menu
$(document.body.children[1]).remove();
