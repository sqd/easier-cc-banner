var sel_chg = [
    'subj_id', 15,
    'instr_id', 15,
    'ptrm_id', 5,
    'attr_id', 5,
    'camp_id', 5,
    'schd_id', 5,
    'divs_id', 5,
    'dept_id', 15,
    'rtng_id', 5,
    'rating_id', 5
    ];
var sel_nos = ['schd_id', 'divs_id', 'type_id', 'rtng_id', 'vcncy_id', 'rating_id', 'insm_id'];
for (i = 0; i < sel_chg.length; i += 2)
    try{ document.getElementById(sel_chg[i]).setAttribute('size', sel_chg[i + 1]); }
    catch(e){}
for (i = 0; i < sel_nos.length; i++)
    try{ document.getElementById(sel_nos[i]).setAttribute('style', 'overflow-y:auto'); }
    catch(e){}