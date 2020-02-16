/* ) Disease stages: dead; well: never sick, exposed, recovered; sick: infectious but asymptomatic, symptomatic, intensive care
2) Pools: general, quarantine, medical. Those sick:symptomatic or in quarantine are NOT at work. 
3) Worker types: general, critical, medical
4) Model counts over time of how many workers of what type, at what disease stage, in what pools. 
5) Chances of [uninfected -> infected] depend on % infectious in own pool, plus leakage: % of all infectious
6) Chances of [symptomatic -> intensive care -> dead, recovered] depends on ratio of sick to healthy medical workers
7) Chances of [well -> sick] depend on general level of the economy, which depends on % of critical workers at work.
8) Perhaps some chance of [recovered -> sick]
9) Quarantines vary by # people hold, and how long everyone stays in them, if all in are deliberately exposed 
Outcome measure: total dead over a simulation run
What to change: % different types of workers in quarantine at different times  
Are there simple cases of fewer total dead if take medical, critical workers and put early into deliberate exposed quarantines?
*/

//each worker has a job-type, a pool, and a disease stage. It is a 3D matrix.

function new_disease_obj(
    dead,
    never_sick,
    exposed,
    recovered,
    asymptomatic,
    symptomatic,
    intensive_care){
    return {
        dead: dead,
        never_sick: never_sick,
        exposed: exposed,
        recovered: recovered,
        asymptomatic: asymptomatic,
        symptomatic: symptomatic,
        intensive_care: intensive_care
    };
};
function well(x) {
    return(x.never_sick +
           x.exposed +
           x.recovered);
};
function sick(x) {
    return(x.asymptomatic +
           x.symptomatic +
           x.intensive_care);
};


function new_workers(x, g1, c1, m1) {
    //x is the portion of general workers who start out as sick and asymptomatic.
    //g1,c1,m1 are the relative amounts of the 3 types of workers.
    var total = g1 + c1 + m1;
    var sick = g1*x/total;
    var well = (g1/total) - sick;
    if((x < 0) || (x > 1)) {
        console.log("can't be above 100 000");
        return(0);
    };
    var g = new_disease_obj(0,well,0,0,sick,0,0);
    var c = new_disease_obj(0,c1/total,0,0,0,0,0);
    var m = new_disease_obj(0,m1/total,0,0,0,0,0);
    return({
        general: g,
        critical: c,
        medical: m
    });
};

function new_pools(sick, g, c, m) {
    var g = new_workers(0,g,c,m);//everyone starts as not in quarantine.
    var q = new_workers(0,0,0,0);
    return({
        general: g,
        quarantine: q
    });
};


function time_step(P){
//5) Chances of [uninfected -> infected] depend on % infectious in own pool, plus leakage: % of all infectious
//6) Chances of [symptomatic -> intensive care -> dead, recovered] depends on ratio of sick to healthy medical workers
//7) Chances of [well -> sick] depend on general level of the economy, which depends on % of critical workers at work.
//8) Perhaps some chance of [recovered -> sick]

};


function doit(){
    var P = new_pools(0.001, 1000, 10, 10);
    return P;
};
