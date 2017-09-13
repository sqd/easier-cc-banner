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