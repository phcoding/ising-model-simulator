window.onload = function(){
    var canvas = document.getElementById('canvas');
    var start = document.getElementById('start');
    var reset = document.getElementById('reset');
    var lrange = document.getElementById('lrange');
    var hrange = document.getElementById('hrange');
    var trange = document.getElementById('trange');
    var lvalue = document.getElementById('lvalue');
    var hvalue = document.getElementById('hvalue');
    var tvalue = document.getElementById('tvalue');
    var span_count = document.getElementById('count-num');
    var scan_steps = document.getElementById('count-steps');

    //get context of canvas
    var context = canvas.getContext('2d');

    //set constant
    var J = 1;      //Coupling constant
    var L = 500;    //length of sites
    var H = 0;      //External magnetic field
    var T = 2/(Math.log(1+Math.sqrt(2)));   //temperature

    //create 2d spin sites.
    var spin = initSpins(L);
    //create imageData
    var img = context.createImageData(L, L);

    //ctral varible
    var running = false;
    var count_num = 0;
    var steps = 1e4;

    //init varibles
    init();

    //bind events
    start.onclick = function(e){
        running = !running;
        if (running) {
            start.value='Pause';
            start.style.backgroundColor='red';
            startup();
        }else{
            start.value='Start';
            start.style.backgroundColor='blue';
        }
    };

    reset.onclick = function(e){
        running = false;
        count_num = 0;
        start.value = 'Start';
        start.style.backgroundColor='blue';
        init();
    };

    lrange.onchange = function(e){
        count_num = 0;
        console.log(lrange.value);
        L = Number(lrange.value);
        init();
    };

    lvalue.onkeyup = function(e){
        if(e.which === 13){
            lrange.value = lvalue.value;
            lrange.onchange();
        }
    };

    hrange.onmousemove = function(e){
        H = (hrange.value/100);
        hvalue.value=H.toFixed(2);
        // console.log('H:'+H);
    };

    hrange.onchange = function(e){
        H = (hrange.value/100);
        hvalue.value = H.toFixed(2);
        // console.log('H:'+H);
    };

    hvalue.onkeyup = function(e){
        if(e.which === 13){
            hrange.value = hvalue.value*100;
            hrange.onchange();
        }
    };

    trange.onmousemove = function(e){
        T = (trange.value/100);
        tvalue.value = T.toFixed(2);
        // console.log('T:'+T);
    };

    trange.onchange = function(e){
        T = (trange.value/100);
        tvalue.value = T.toFixed(2);
        // console.log('T:'+T);
    };

    tvalue.onkeyup = function(e){
        if(e.which === 13){
            trange.value = tvalue.value*100;
            trange.onchange();
        }
    };

    //function to init varibles
    function init(){
        lrange.value = L;
        hrange.value = H*100;
        trange.value = T*100;
        canvas.width = L;
        canvas.height = L;
        canvas.style.width = L+'px';
        canvas.style.height = L+'px';
        lvalue.value = L;
        hvalue.value = H.toFixed(2);
        tvalue.value = T.toFixed(2);
        // scan_steps.innerText = '1e'+(Math.log(steps)/Math.log(10));
        spin = initSpins(L);
        img = context.createImageData(L, L);

        //init img
        for (var i = 0; i < L; i++) {
            for (var j = 0; j < L; j++) {
                var p = spin[i][j]==1?255:0;
                img.data[4*(i*L+j)+0] = p;
                img.data[4*(i*L+j)+1] = p;
                img.data[4*(i*L+j)+2] = p;
                img.data[4*(i*L+j)+3] = 255;
            }
        };
        context.putImageData(img,0,0);
    };

    //function to loop for lower energy
    function startup(){
        if(running){
            for (var t = 0; t < steps; t++) {
                var i = Math.round(Math.random()*(L-1));
                var j = Math.round(Math.random()*(L-1));
                var delta_e = getDeltaEnergy(i, j);
                if (delta_e < 0 || Math.random() < Math.exp(-delta_e/T)){
                    spin[i][j] *= -1;
                    updateImage(i, j);
                }
            }
            console.log(getTotalEnergy());
            context.putImageData(img,0,0);
            count_num ++;
        }
        // span_count.innerText = count_num;
        window.setTimeout(startup, 1)
    };

    //function to update Image data by given pixel position
    function updateImage(i, j){
        var p = spin[i][j]==1?255:0;
        img.data[4*(i*L+j)+0] = p;
        img.data[4*(i*L+j)+1] = p;
        img.data[4*(i*L+j)+2] = p;
    };

    //function to create a new spint site.
    function initSpins(L){
        var s = new Array(L);
        for (var i = s.length - 1; i >= 0; i--) {
            s[i] = new Array(L);
            for (var j = s[i].length - 1; j >= 0; j--) {
                s[i][j] = Math.random()<0.5?-1:1;
            }
        }
        return s;
    };

    function getDeltaEnergy(i, j){
        var s_nl = i>0?spin[i-1][j]:spin[spin.length-1][j];
        var s_nr = j<L-1?spin[i][j+1]:spin[i][0];
        var s_nt = j>0?spin[i][j-1]:spin[i][spin[i].length-1];
        var s_nb = i<L-1?spin[i+1][j]:spin[0][j];
        return 2.0*spin[i][j]*(J*(s_nl+s_nr+s_nt+s_nb)+H);
    };

    function getTotalEnergy(){
        var energy = 0;
        for (var i = 0; i < spin.length; i++) {
            for (var j = 0; j < spin[i].length; j++) {
                var s_nr = j<L-1?spin[i][j+1]:spin[i][0];
                var s_nb = i<L-1?spin[i+1][j]:spin[0][j];
                energy += -spin[i][j]*(J*(s_nr + s_nb) + H);
            }
        }
        return energy;
    };

    function getTotalMagneticMoment(){
        var magnetic = 0;
        for (var i = 0; i < spin.length; i++) {
            for (var j = 0; j < spin[i].length; j++) {
                magnetic += spin[i][j];
            }
        }
        return magnetic;
    };
};