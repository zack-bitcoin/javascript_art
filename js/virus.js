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
    never_sick,
    exposed,
    recovered,
    asymptomatic,
    symptomatic,
    intensive_care){
    return {
        never_sick: never_sick,
        exposed: exposed,
        recovered: recovered,

        asymptomatic: asymptomatic,
        symptomatic: symptomatic,
        intensive_care: intensive_care
    };
};
/*
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
*/


function new_workers(g0, g1, c0, c1, m0, m1) {
    //g0 is the general workers who start out as sick and asymptomatic.
    //g1 is the general workers who start out as healthy
    //c1,m1 are the amounts of the critical and medical workers.
    var g = new_disease_obj(g1,0,0,g0,0,0);
    var c = new_disease_obj(c1,0,0,g0,0,0);
    var m = new_disease_obj(m1,0,0,m0,0,0);
    return({
        general: g,
        critical: c,
        medical: m
    });
};


function new_pools(unintentionally_sick, g,
                   deliberate_critical, c,
                   deliberate_medical, m) {
    //all unintentionally sick start in the general population, for simplicity.
    // all deliberate sick start in quarantine, because we know who was infected.
    var f = new_workers(unintentionally_sick,g,0,c,0,m);
    var q = new_workers(0,0,deliberate_critical,
                        0,deliberate_medical,0);
    return({
        free: f,
        quarantine: q,
        dead: 0
    });
};

function move_portion_quarantine(P, type, portion) {
    var v = ["general", "critical", "medical"];
    v.map(function(t){
        x = P.free[t][type] * portion;
        P.quarantine[t][type] += x;
        P.free[t][type] -= x;
    });
    return(P);
};
function move_portion_free(P, type, portion) {
    var v = ["general", "critical", "medical"];
    v.map(function(t){
        x = P.quarantine[t][type] * portion;
        P.free[t][type] += x;
        P.quarantine[t][type] -= x;
    });
    return(P);
};


function quarantine_rule(P){
    //example of how we could decide who to quarantine
    
    //quarantine everyone who is symptomatic.
    //maybe add a maximum size of people who fit in quarantine.
    P = move_portion_quarantine(P, "symptomatic", 1);

    //unquarantine everyone who is recovered
    P = move_portion_free(P, "recovered", 1);

    return(P);
};

function infected_portion(P) {
    return(infected_portion2(P, ["quarantine", "free"], ["general", "critical", "medical"]));
};
        
function infected_portion2(P, qt, types) {
    var total = 0;
    var sick = 0;
    (qt).map(function(q){
        (types).map(function(wt){
            (["asymptomatic", "symptomatic", "intensive_care"]).map(function(sick_type){
                sick += P[q][wt][sick_type];
                total += P[q][wt][sick_type];
            });
            (["never_sick", "exposed", "recovered"]).map(function(well_type){
                total += P[q][wt][well_type];
            });
        });
    });
    if(total == 0){
        return(0);
    };
    return(sick/total);
};
function infected_free_medical(P) {
    return(infected_portion2(P, ["free"], ["medical"]));
    
};
function working(P, type){
    var total = 0;
    var working = 0;
    (["never_sick", "exposed", "recovered", "asymptomatic"]).map(function(wt){
        working += P.free[type][wt];
        total += P.free[type][wt];
        total += P.quarantine[type][wt];
    });
    (["symptomatic", "intensive_care"]).map(function(wt){
        total += P.free[type][wt];
        total += P.quarantine[type][wt];
    });
    if(total == 0){
        return(1);
    }
    return(working/total);
};

function time_step(P){
    var infected_portion = infected_portion2(P, ["free", "quarantine"], ["general", "critical", "medical"]);
    var critical_working = working(P, "critical");
    var medical_working = working(P, "medical");
    //var infectious_constant = 835;//439.89;
    var infectious_constant = 1.4;//439.89;
    var deadliness_constant = 1;
    var recovery_constant = 0.02;
    var medical_max_constant = 1.01;
    var critical_max_constant = 1.01;

    var medical_infected = infected_portion2(P, ["free"], ["medical"]);
    var general_infected = infected_portion2(P, ["free"], ["general", "critical"]);
    var quarantine_infected = infected_portion2(P, ["quarantine"], ["general", "critical", "medical"]);

    (["free"]).map(function(q){
        (["medical"]).map(function(wt){
            (["never_sick", "exposed"]).map(function(type){
                var portion = (infected_portion + medical_infected) * (critical_max_constant - critical_working) * infectious_constant;
                portion = Math.min(portion, 1);
                var x = P[q][wt][type] * portion;
                P[q][wt]["asymptomatic"] += x;
                P[q][wt][type] -= x;
            });
        });
        (["general", "critical"]).map(function(wt){
            (["never_sick", "exposed"]).map(function(type){
                var portion = (infected_portion + general_infected) * (critical_max_constant - critical_working) * infectious_constant;
                portion = Math.min(portion, 1);
                var x = P[q][wt][type] * portion;
                P[q][wt]["asymptomatic"] += x;
                P[q][wt][type] -= x;
            });
        });
    });
    (["quarantine"]).map(function(q){
        (["general", "critical", "medical"]).map(function(wt){
            (["never_sick", "exposed"]).map(function(type){
                var portion = (infected_portion + quarantine_infected) * (critical_max_constant - critical_working) * infectious_constant;
                portion = Math.min(portion, 1);
                var x = P[q][wt][type] * portion;
                P[q][wt]["asymptomatic"] += x;
                P[q][wt][type] -= x;
            });
        });
    });
    (["free", "quarantine"]).map(function(q){
        (["medical", "general", "critical"]).map(function(wt){
            var portion = deadliness_constant * (medical_max_constant - medical_working);
            portion = Math.min(portion, 1);
            var a = P[q][wt]["asymptomatic"];
            var s = P[q][wt]["symptomatic"];
            var i = P[q][wt]["intensive_care"];
            P[q][wt]["asymptomatic"] -= portion*a;
            P[q][wt]["symptomatic"] += portion*(a-s);
            P[q][wt]["intensive_care"] += portion*(s-i);
            P.dead += portion*i;
        });
    });
    (["free", "quarantine"]).map(function(q){
        (["medical", "general", "critical"]).map(function(wt){
            (["asymptomatic", "symptomatic", "intensive_care"]).map(function(dt){
                var portion = recovery_constant;
                if(portion > 1) {
                    console.log("error portion too big");
                    return(0);
                };
                var x = P[q][wt][dt];
                P[q][wt][dt] -= (x*portion);
                P[q][wt]["recovered"] += (x*portion);
            });
        });
    });

    //not possible to have negative amounts of people
    /*
    (["free", "quarantine"]).map(function(q){
        (["medical", "general", "critical"]).map(function(wt){
            (["never_sick","exposed","recovered","asymptomatic", "symptomatic", "intensive_care"]).map(function(dt){
                var x = P[q][wt][dt];
                P[q][wt][dt] = Math.max(0, x);
            });
        });
    });
    */
//8) Perhaps some chance of [recovered -> sick]
    P = quarantine_rule(P);
    return(P);
};


function doit(P){
    var rounds = 2000;
    //var P = new_pools(10, total, 0, 1000, 0, 1000);
    //var total = 1000000;
    //var P = new_pools(10, total, 100, 1000, 100, 1000);
    for(var i = 0; i < rounds; i ++){
        P = time_step(P);
        /*
          if(P.dead > total){
            console.log("all dead");
            return(P);
        };
        */
    };
    var total = sum_all(P);
    console.log((total - P.dead)/total);
    console.log("portion survived");
    return P;
};
function sum_all(P){
    var total = 0;
    (["free", "quarantine"]).map(function(q){
        (["medical", "general", "critical"]).map(function(wt){
            (["never_sick", "exposed", "recovered", "asymptomatic", "symptomatic", "intensive_care"]).map(function(dt){
                total += P[q][wt][dt];
            });
        });
    });
    total += P.dead;
    return(total);
};


function test_infect() {
    var total = 1000000;
    var P = new_pools(10, total, 100, 1000, 100, 1000);
    return(doit(P));
};
function test_no_infect() {
    var total = 1000000;
    var P = new_pools(10, total, 0, 1000, 0, 1000);
    return(doit(P));
};
    
