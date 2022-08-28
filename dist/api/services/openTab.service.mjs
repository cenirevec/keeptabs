/**
 * Service to modify the rythm of tabs openning
 */

/**
 * First step: load all as "shadow" tabs
 * Second step: load all with this algorithm
 * Third step: create an hybrid mode opening "shadow" tabs all
 *             at the same time but loading them following the slow down algorithm
 */

export class OpenTabService{

    //Version one of the scheduler (only add on scheduler and load it)
    scheduler = new Object();



    checkDomain(URL,callback){
        //Fetch domain
        let domain = URL;

        //Add to scheduler
        //Pb the tabs wont keep the same order as saved with the scheduler

        // Solution pour le mode fake(win)dows créer des page avec titre et favicon non chargé
        // mais qui se charge tout seul quand on clique sur l'onglet. avec message du style
        // Afin de réduire l'impact sur les serveurs et sur l'environnement, le chargement de 
        // cette page a été différé. Chargement en cours... 
    }


}