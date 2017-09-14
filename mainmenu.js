//STYLE

$(document.head).append(`<link rel="stylesheet" href="${chrome.runtime.getURL('style/main.css')}">`);

$('.bg3').remove();
$('.bgtabon').remove();
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