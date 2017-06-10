(function(window){
    imagelab = new Object();
    imagelab.canvas = null;
    imagelab.context = null;
    imagelab.axeses = [];
    imagelab.status = 0;

    function Axis(x, y, w, h, c){
        this._x = x||"0";
        this._y = y||"0";
        this._w = w||"1";
        this._h = h||"1";
        this.c = c||"#fff";
        this.xlimit = [0,1];
        this.ylimit = [0,1];
        this.axis = true;
        this._xdata = null;
        this._ydata = null;
        this.xdata = [];
        this.ydata = [];
        this.offsetx = 20;
        this.offsety = 20;

        this.setxlimit = function(xlimit){
            this.xlimit = xlimit;
        }

        this.setylimit = function(ylimit){
            this.ylimit = ylimit;
        };

        this.setxdata = function(xdata){
            this._xdata = xdata;
        };

        this.setydata = function(ydata){
            this._ydata = ydata;
        };

        this.paint = function(context){
            this.x = typeof(this._x)==="number"?this._x:this._x*context.canvas.width;
            this.y = typeof(this._y)==="number"?this._y:this._y*context.canvas.height;
            this.w = typeof(this._w)==="number"?this._w:this._w*context.canvas.width;
            this.h = typeof(this._h)==="number"?this._h:this._h*context.canvas.height;
            if(this._xdata && this._ydata){
                for (var i = 0; i < this._xdata.length; i++) {
                    this.xdata[i] = (this._xdata[i]-this.xlimit[0])/(this.xlimit[1]-this.xlimit[0])*this.w+this.offsetx;
                }
                for (var i = 0; i < this._ydata.length; i++) {
                    this.ydata[i] = (1-(this._ydata[i]-this.ylimit[0])/(this.ylimit[1]-this.ylimit[0]))*this.h-this.offsety;
                }
            }
            var tmp = context.fillStyle;
            context.fillStyle = this.c;
            context.fillRect(this.x, this.y, this.w, this.h);
            context.fillStyle = tmp;
            if(this.axis){
                var img = context.createImageData(this.w, this.h);
                for (var i = 0; i < this.h; i++) {
                    for (var j = 0; j < this.w; j++) {
                        if((i==this.h-this.offsety-1) || (j==this.offsetx)){
                            img.data[4*(i*this.w+j)+0] = 0x00;
                            img.data[4*(i*this.w+j)+1] = 0x00;
                            img.data[4*(i*this.w+j)+2] = 0x00;
                        }else{
                            img.data[4*(i*this.w+j)+0] = 0xff;
                            img.data[4*(i*this.w+j)+1] = 0xff;
                            img.data[4*(i*this.w+j)+2] = 0xff;
                        }
                        if(this.xdata && this.ydata){
                            if(this.ydata[this.xdata.indexOf(j)] === i){
                                for (var k = 0; k < 4; k++) {
                                    img.data[4*((i-k)*this.w+j)+0] = 0x00;
                                    img.data[4*((i-k)*this.w+j)+1] = 0x00;
                                    img.data[4*((i-k)*this.w+j)+2] = 0x00;

                                    img.data[4*(i*this.w+(j-k))+0] = 0x00;
                                    img.data[4*(i*this.w+(j-k))+1] = 0x00;
                                    img.data[4*(i*this.w+(j-k))+2] = 0x00;

                                    img.data[4*((i+k)*this.w+j)+0] = 0x00;
                                    img.data[4*((i+k)*this.w+j)+1] = 0x00;
                                    img.data[4*((i+k)*this.w+j)+2] = 0x00;

                                    img.data[4*(i*this.w+(j+k))+0] = 0x00;
                                    img.data[4*(i*this.w+(j+k))+1] = 0x00;
                                    img.data[4*(i*this.w+(j+k))+2] = 0x00;
                                }
                            }
                        }
                        img.data[4*(i*this.w+j)+3] = 0xff;
                    }
                }
                context.putImageData(img,this.x,this.y);
            }
        };
        return this;
    }

    imagelab.start = function(first){
        if(first){
            imagelab.status = 1;
        }
        if(imagelab.status){
            imagelab._paint();
            for (var i = 0; i < imagelab.axeses.length; i++) {
                imagelab.axeses[i].paint(imagelab.context);
            }
        }
        window.setTimeout(imagelab.start, 40, false);
    };

    imagelab.figure = function(id, width, height){
        imagelab.canvas = document.getElementById(id);
        imagelab.context = imagelab.canvas.getContext('2d');
        imagelab.bgcolor = "#eee";
        if(width && height){
            imagelab.canvas.width = width;
            imagelab.canvas.height = height;
        }
        imagelab.createaxes(0, 0, imagelab.canvas.width, imagelab.canvas.height, "#eee");
        return imagelab;
    };

    imagelab.createaxes = function(x, y, w, h, c){
        imagelab.axeses.push(new Axis(x,y,w,h,c));
    };

    imagelab.plot = function(x, y){
        imagelab.axeses[imagelab.axeses.length-1].setxdata(x);
        imagelab.axeses[imagelab.axeses.length-1].setydata(y);
    };

    imagelab._paint = function(){
        var tmp = imagelab.context.fillStyle;
        imagelab.context.fillStyle = imagelab.bgcolor;
        imagelab.context.fillRect(0, 0, imagelab.canvas.width, imagelab.canvas.height);
        imagelab.context.fillStyle = tmp;
    };

    window.imagelab = imagelab;
})(window);