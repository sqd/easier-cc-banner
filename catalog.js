function assert(c){
    if(!c) throw "Assertion failure";
}

function render_schedule(courses){
    var poss_title = $('b');
    for(i=0;i<poss_title.length;i++)
        try{
            var eb = poss_title[i];
            var course_no = /[A-Z][A-Z] ?\d\d\d/.exec(eb.innerText)[0].replace(' ', '');
            var container = document.createElement('div');
            eb.parentElement.parentElement.nextElementSibling.children[0].appendChild(container);
            if(courses[course_no] == null){
                container.setAttribute('style', 'color:grey;');
                container.innerText = 'Not offered this year';
                continue;
            }
            var table = document.createElement('table');
            table.setAttribute('class', 'table');
            table.setAttribute('style', 'width:50%;');
            table.setAttribute('border', '1');
            var tbody = document.createElement('tbody');
            container.appendChild(table);
            table.appendChild(tbody);
            var table_header = tbody.insertRow(-1);
            table_header.innerHTML = '<td><b>Block</b></td><td><b>Instructor</b></td><td><b>Avail/Total</b> (<small><abbr title="Number of people in waitlist">WL</abbr></small>, <small><abbr title="...for freshmen.">Reserved</abbr></small>)</td>';
            for(j=0;j<courses[course_no].length;j++){
                var off = courses[course_no][j];
                var row_off = tbody.insertRow(-1);
                row_off.innerHTML = `<td>${off['block']}</td><td>${off['instructor']}</td><td>${off['available']}/${off['limit']} (<small>${off['waitlist']}</small>, <small>${off['reserved']}</small>)</td>`;
                if(off['available']<=0) row_off.setAttribute('style', 'opacity: 0.5');
            }
        }catch(e){}
}


function main(){
    $('.pldefault:contains(Catalog Entries)').eq(0).attr('id', 'progress-container').html('<div id="progress" class="ldBar label-center" data-value="0" data-preset="circle"></div>');
    var bar = new ldBar('#progress');
    var start_time = new Date().getTime();
    var timer = setInterval(function(){
        var t = (new Date().getTime() - start_time) / 1000;
        var p = 100*(1-Math.pow(0.85, t));
        bar.set(p);
    }, 1500);
    get_schedule(schedule => {
        clearInterval(timer);
        render_schedule(schedule);
        setTimeout(function(){bar.set(100);}, 1000);
    });
}

main();