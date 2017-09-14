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
{
    var container = document.createElement('div');
    var cell = table.insertRow(0).insertCell(0);
    $(cell).attr('colspan', 2).html('<div id="cceasier-tool" style="width:100%;"></div>');
    $('#cceasier-tool').toggle().load(chrome.runtime.getURL('html/tool_div.html'));
    container = document.createElement('div');
    cell = table.insertRow(0).insertCell(0);
    $(cell).attr('colspan', 2).attr('class', 'menu-cell');
    cell.appendChild(container);
    container.innerHTML = `<a class="list" href="javascript:0;"> <div class="list-container"> <div class="list-title" style="color:green;">Easier CC Banner Course Scheduler</div> <div class="list-description" style="color:green;">Scheduling courses has never been easier.</div> </div> </a>`;
    $(container.children[0]).click(function(){
        $('#cceasier-tool').slideToggle();
    });
}

//remove the orignal menu
$(document.body.children[1]).remove();

$(document.head).append(`<link rel="stylesheet" href="${chrome.runtime.getURL('style/main.css')}">`);