var etable = $('table.menuplaintable')[0];
var row = etable.insertRow(9);
var dummy = row.insertCell(-1);
dummy.setAttribute('class', 'mpdefault');
dummy.innerHTML = '&nbsp;';
var container = row.insertCell(-1);
container.setAttribute('class', 'mpdefault');

var switch_button = document.createElement('a');
container.appendChild(switch_button);
switch_button.innerHTML = 'CC Easier Banner Alternative<del>(TM)</del> Course Planning Tool';
switch_button.setAttribute('class', 'submenulinktext2');
switch_button.setAttribute('style', 'color:green;font-weight:bold;');
switch_button.setAttribute('href', 'javascript:0');

var div_tool = document.createElement('div');
div_tool.setAttribute('hidden', 'true');
container.appendChild(div_tool);
$(switch_button).click(function(){
    $(div_tool).toggle();
});
$(div_tool).load(chrome.runtime.getURL('html/tool_div.html'));

var desc = document.createElement('span');
desc.setAttribute('class', 'menulinkdesctext');
$(desc).html("&nbsp;&nbsp;&nbsp;&nbsp;Don't use the shitty thing below.");
container.appendChild(document.createElement('br'));
container.appendChild(desc);


$.get(chrome.runtime.getURL('html/tool_div.html'));

//STYLE

$(document.head).append(`<link rel="stylesheet" href="${chrome.runtime.getURL('style/mdl/material.min.css')}">`);
$(document.head).append(`<script src="${chrome.runtime.getURL('style/mdl/material.min.js')}"></script>`);
$(document.head).append('<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">');
$(document.head).append(`<link rel="stylesheet" href="${chrome.runtime.getURL('style/main.css')}">`);

$('.pagetitlediv').remove();
var trs = $("table.menuplaintable").find($("tr"));
trs.append('<a class="list"></a>');
$('a.list').append('<div class="list-container"></div>');
var tds = trs.children('td').detach();
var links=[];
var titles=[];
var descriptions=[];
for(var i=0; i<trs.length; i++)
{
	$($('a.list').children('div')[i]).append(tds[(i+1)*2 - 1]);
	$($('a.list').children('div')[i]).append(tds[(i+1)*2]);
	links.push($($('a.list')[i]).find('a').attr("href"));
	titles.push($($('a.list')[i]).find('a').text());
	descriptions.push($($('a.list')[i]).find('span').text());
	//console.log(titles[i-1]);
	//console.log(descriptions[i-1]);
	$($('a.list')[i]).children('div').append('<div class="list-title">'+titles[i]+'</div>');
	$($('a.list')[i]).children('div').append('<div class="list-description">'+descriptions[i]+'</div>');
	$(tds[(i+1)*2 - 1]).css("display","none");
	$(tds[(i+1)*2]).css("display","none");
	$($('a.list')[i]).attr("href",links[i]);
}