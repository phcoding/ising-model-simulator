(function(){
    var engine={};
    engine.status = 0;
    engine.data = null;
    engine.idcount = 0;
    engine.child = [];
    engine.init = function(id, width, height){
        engine.status = 0;
        engine.data = null;
        this.display = document.getElementById(id);
        this.context = this.display.getContext('2d');
        if(width && height){
            this.setsize(width, height);
        }else{
            this.setsize(100, 100);
        }
        return engine;
    };

    engine.setsize = function(width, height){
        this.display.width = width;
        this.display.height = height;
        // img = new ImageData(this.display.width,this.display.height);
        // for (var i = 0; i < this.display.height; i++) {
        //     for (var j = 0; j < this.display.width; j++) {
        //         img.data[4*(i*this.display.width+j)+0] = 0x00;
        //         img.data[4*(i*this.display.width+j)+1] = 0x00;
        //         img.data[4*(i*this.display.width+j)+2] = 0x00;
        //         img.data[4*(i*this.display.width+j)+3] = 0xff;
        //     }
        // }
        // this.data = img;
        return engine;
    };

    engine.paint = function(context, data){
        if(data != null){
            context.putImageData(data, 0, 0);
        }
        for (var i = 0; i < engine.idcount; i++) {
            engine.child[i].paint(context, data);
        }
        engine._update(context, data);
        return engine;
    };

    engine.start = function(first){
        if(!first){
            engine.status = 1;
        }
        if (engine.status) {
            engine.paint(engine.context, engine.data);
            window.setTimeout(engine.start, 40, true);
        }
        return engine;
    };

    engine.stop = function(){
        engine.status = 0;
        return engine;
    };

    engine.addchild = function(child){
        engine.child[engine.idcount++] = child;
        return engine;
    };

    engine.update = function(func){
        engine._update = func;
        return engine;
    };

    //interface
    engine._update = function(context, data){};

    //regist engine object.
    window['engine'] = engine;
})();