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
$(document.head).append(`<link rel="stylesheet" href="${chrome.runtime.getURL('style/textcomplete-menu.css')}">`);

function on_tool_loaded(){
    var container = document.createElement('div');
    var cell = table.insertRow(0).insertCell(0);
    $(cell).attr('colspan', 2).attr('class', 'menu-cell');
    cell.appendChild(container);
    container.innerHTML = `<a class="list" href="javascript:0;"> <div class="list-container"> <div class="list-title" style="color:green;">Easier CC Banner Course Scheduler</div> <div class="list-description" style="color:green;">Scheduling courses has never been easier.</div> </div> </a>`;
    $(container.children[0]).click(function(){
        $('#cceasier-tool').slideToggle();
    });

    $('#cceasier-tool *').prop('disabled', true);
    get_schedule(schedule => {
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
    });

}

//remove the orignal menu
$(document.body.children[1]).remove();

$(document.head).append(`<link rel="stylesheet" href="${chrome.runtime.getURL('style/main.css')}">`);