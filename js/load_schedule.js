function load_course_schedule_html(callback){

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
                $.post(form_url, post_data, function(html){
                    callback(html);
                });
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

function cache_schedule(schedule){
    localStorage.setItem('cceasier-timestamp', new Date().getTime().toString());
    localStorage.setItem('cceasier-schedule', JSON.stringify(schedule));
}

function get_schedule(callback){
    if(localStorage.getItem('cceasier-timestamp') !== null
        && new Date().getTime() - parseInt(localStorage.getItem('cceasier-timestamp')) < 3600000)
        callback(JSON.parse(localStorage.getItem('cceasier-schedule')));
    else{
        load_course_schedule_html(html => {
            schedule = parse_schedule_html(html);
            cache_schedule(schedule);
            callback(schedule);
        });
    }
    
}