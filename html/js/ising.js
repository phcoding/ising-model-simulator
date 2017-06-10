(function(engine){
    window.onload = function(e){
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

        //init varible
        var J = 1;
        var H = 0;
        var T = 2.27;
        var L = 500;
        var spin = null;
        var imgdata = null;
        var energy = null;

        //ctral varible
        var running = false;
        var times = 0;
        var steps = 1e4;

        //init engine
        engine.init('canvas', L, L)
        .update(function(context, data){
            if(imgdata){
                context.putImageData(imgdata, 0, 0);
            }
        })
        .start();

        initsimulator();

        //bind events
        start.onclick = function(e){
            running = !running;
            if (running) {
                start.value='Pause';
                start.style.backgroundColor='#f00';
                startup();
            }else{
                start.value='Start';
                start.style.backgroundColor='#00f';
            }
        };

        reset.onclick = function(e){
            initsimulator();
        };

        lrange.onchange = function(e){
            count_num = 0;
            L = Number(lrange.value);
            initsimulator();
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
        };

        hrange.onchange = function(e){
            H = (hrange.value/100);
            hvalue.value = H.toFixed(2);
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
        };

        trange.onchange = function(e){
            T = (trange.value/100);
            tvalue.value = T.toFixed(2);
        };

        tvalue.onkeyup = function(e){
            if(e.which === 13){
                trange.value = tvalue.value*100;
                trange.onchange();
            }
        };

        function startup(){
            if(running){
                for (var t = 0; t < steps; t++) {
                    var i = Math.round(Math.random()*(L-1));
                    var j = Math.round(Math.random()*(L-1));
                    var delta_e = getdelteenergy(spin, i, j);
                    if ((delta_e < 0) || (Math.random() < Math.exp(-delta_e/T))){
                        spin[i][j] *= -1;
                        updateimage(imgdata, i, j);
                    }
                }
                // console.log(gettotalenergy(spin));
                // console.log(gettotalmagnet(spin));
                times ++; 
            }
            window.setTimeout(startup, 1);
        };

        function initsimulator(){
            times = 0;
            running = false;
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
            start.value = 'Start';
            start.style.backgroundColor='#00f';
            spin = initspinsite(L, L);
            imgdata = spintoimage(spin);
        };

        function initspinsite(width, height){
            var s = new Array(height);
            for (var i = 0; i < height; i++) {
                s[i] = new Array(width);
                for (var j = 0; j < width; j++) {
                    s[i][j] = Math.random()<0.5?-1:1;
                }
            }
            return s;
        };

        function spintoimage(s){
            var img = engine.context.createImageData(s.length, s[0].length);
            for (var i = 0; i < s.length; i++) {
                for (var j = 0; j < s[i].length; j++) {
                    var p = s[i][j]==1?255:0;
                    img.data[4*(i*L+j)+0] = p;
                    img.data[4*(i*L+j)+1] = p;
                    img.data[4*(i*L+j)+2] = p;
                    img.data[4*(i*L+j)+3] = 255;
                }
            };
            return img;
        }

        function updateimage(img, i, j){
            var p = spin[i][j]==1?255:0;
            img.data[4*(i*L+j)+0] = p;
            img.data[4*(i*L+j)+1] = p;
            img.data[4*(i*L+j)+2] = p;
        };

        function getdelteenergy(s, i, j){
            var s_nl = i>0?s[i-1][j]:s[s.length-1][j];
            var s_nr = j<L-1?s[i][j+1]:s[i][0];
            var s_nt = j>0?s[i][j-1]:s[i][s[i].length-1];
            var s_nb = i<L-1?s[i+1][j]:s[0][j];
            return 2.0*s[i][j]*(J*(s_nl+s_nr+s_nt+s_nb)+H);
        };

        function gettotalenergy(s){
            var energy = 0;
            for (var i = 0; i < s.length; i++) {
                for (var j = 0; j < s[i].length; j++) {
                    var s_nr = j<L-1?s[i][j+1]:s[i][0];
                    var s_nb = i<L-1?s[i+1][j]:s[0][j];
                    energy += -s[i][j]*(J*(s_nr + s_nb) + H);
                }
            }
            return energy;
        };

        function gettotalmagnet(s){
            var magnetic = 0;
            for (var i = 0; i < spin.length; i++) {
                for (var j = 0; j < spin[i].length; j++) {
                    magnetic += spin[i][j];
                }
            }
            return magnetic;
        };

        window.gettotalenergy = function(){
            return gettotalenergy(spin);
        }

        window.gettotalmagnet = function(){
            return gettotalmagnet(spin);
        }
    };
})(window.engine);