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
            table_header.innerHTML = '<td><b>Block</b></td><td><b>Instructor</b></td><td><b>Avail/Total</b> (<small><abbr title="Number of people in waitlist">WL</abbr></small>/<small><abbr title="Waitlist capacity">Reserved</abbr></small>)</td>';
            for(j=0;j<courses[course_no].length;j++){
                var off = courses[course_no][j];
                var row_off = tbody.insertRow(-1);
                row_off.innerHTML = `<td>${off['block']}</td><td>${off['instructor']}</td><td>${off['available']}/${off['limit']} (<small>${off['waitlist']}</small>/<small>${off['reserved']}</small>)</td>`;
                if(off['available']<=0) row_off.setAttribute('style', 'opacity: 0.5');
            }
        }catch(e){}
}

function get_course_schedule_html(callback){
    var site_map_link = $("a:contains('SITE')")[0];
    $.get(site_map_link.getAttribute('href'), function(html){
        var re = /href="(\w+\.p_disp_dyn_sched)"/;
        var schedule_ts_link = re.exec(html)[1];
        $.get(schedule_ts_link, function(html){
            var re = /action="(\/prod\/\w+\.p_proc_term_date)"/;
            var m = re.exec(html);
            var form_url = m[1];
            var year = ((new Date()).getFullYear()+1).toString();
            var term1 = year + '10', term2 = year + '20';
            var re = /value="(\w+\.p_disp_dyn_sched)"/;
            var src = re.exec(html)[1];
            var post_data = `p_calling_proc=${src}&p_term=${term1}&p_term=${term2}`;
            $.post(form_url, post_data, function(html){
                var re = /action="(\/prod\/\w+\.p_disp_dyn_sched_list)"/;
                var form_url = re.exec(html)[1];
                var post_data = `term_in=${term1}&term_in=${term2}&sel_subj=dummy&sel_day=dummy&sel_schd=dummy&sel_insm=dummy&sel_camp=dummy&sel_levl=dummy&sel_sess=dummy&sel_instr=dummy&sel_type=dummy&sel_rtng=dummy&sel_ptrm=dummy&sel_attr=dummy&sel_subj=%25&sel_crse=&sel_title=&sel_ptrm=%25&sel_instr=%25&sel_attr=%25&sel_vcncy=%25&sel_type=%25&sel_camp=%25&sel_rtng=%25&sel_schd=%25&sel_insm=%25&begin_hh=00&begin_mi=00&begin_ap=x&end_hh=00&end_mi=00&end_ap=xe`;
                $.post(form_url, post_data, callback);
            });
        });
    });
}

function parse_schedule_html(html){
    html.replace(/<script>/g, '<div hidden>');
    html.replace(/<\/script>/g, '</div>');
    var container = document.createElement('div');
    document.body.appendChild(container);
    container.setAttribute('hidden', 'true');
    container.innerHTML = html;
    var rows = $(container).find('tr');
    var courses = new Object();
    for(i = 0; i < rows.length; i++)
        try{
            var row = rows[i];
            var cols = row.children;
            var course_no = cols[2].innerHTML;
            var re = /[A-Z][A-Z]\d\d\d/; 
            course_no = re.exec(course_no)[0];
            var course = {
                "course_no": course_no,
                "block": cols[4].innerText,
                "instructor": cols[8].innerText,
                "limit": cols[9].innerText,
                "reserved": cols[10].innerText,
                "available": cols[12].innerText,
                "waitlist": cols[13].innerText
            };
            if(courses[course_no] == null) courses[course_no] = [];
            courses[course_no].push(course);
        }catch(e){}
    return courses;
}

function main(){
    $(document.head).append('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">');

    var header_col = $('.pldefault:contains(Catalog Entries)')[0];
    var loadind_indicator = document.createElement('h3');
    loadind_indicator.setAttribute('id', 'cceasier-loading-indicator');
    loadind_indicator.innerHTML = 'Easier CC Banner: <span style="color:green;">Enabled</span>.';
    header_col.appendChild(loadind_indicator);

    try{
        if(new Date().getTime() - parseInt(localStorage.getItem('cceasier-timestamp')) < 3600000){
            render_schedule(JSON.parse(localStorage.getItem('cceasier-schedule')));
            return;
        }
    }
    catch(e){}
    get_course_schedule_html(function(html){
        var schedule = parse_schedule_html(html);
        localStorage.setItem('cceasier-timestamp', new Date().getTime().toString());
        localStorage.setItem('cceasier-schedule', JSON.stringify(schedule));
        render_schedule(schedule);
    });
}

main();