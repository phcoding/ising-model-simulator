(function(window){
    numjs = {};

    numjs.arraymul = function(array){
        var amul = 1;
        for (var i = 0; i < array.length; i++) {
            amul *= array[i];
        }
        return amul;
    };

    numjs.getarrayshape = function(array){
        var a = array.concat(), shape = [];
        for (var dim = 0; typeof(a[0]) != 'undefined'; dim++) {
            shape[dim] = a.length;
            a = a[0];
        }
        return shape;
    };

    numjs.getarraydimension = function(array){
        var dim = 0, a = array.concat();
        for (; typeof(a[0]) != 'undefined'; dim++) {
            a = a[0];
        }
        return dim;
    };

    numjs.shapeequal = function(a, b){
        for (var i = 0; i < a.length; i++) {
            if(a[i] != b[i]) return false;
        }
        return true;
    };

    numjs.matrixadd = function(mata, matb){
        return mata.clone().add(matb);
    };

    numjs.matrixdot = function(mata, matb){
        return mata.clone().dot(matb);
    };

    function matrix(array) {
        var self = this;
        this.type = 'matrix';
        this.array = array || [];
        this.shape = numjs.getarrayshape(this.array);
        this.dimension = this.shape.length;

        this.clone = function(){
            return new numjs.matrix(self.array);
        };
        
        this.add = function(mat){
            if(numjs.shapeequal(mat.shape, self.shape)){
                for (var i = 0; i < self.array.length; i++) {
                    if(self.dimension > 1){
                        self.array[i]  = numjs.matrixadd(
                            new numjs.matrix(self.array[i]), 
                            new numjs.matrix(mat.array[i])).array;
                    }else{
                        self.array[i] += mat.array[i];
                    }
                }
            }else{
                console.error("shape don't equal !");
            }
            return this;
        };

        this.dot = function(mat){
            if(numjs.shapeequal(mat.shape, self.shape)){
                for (var i = 0; i < self.array.length; i++) {
                    if(self.dimension > 1){
                        self.array[i]  = numjs.matrixdot(
                            new numjs.matrix(self.array[i]), 
                            new numjs.matrix(mat.array[i])).array;
                    }else{
                        self.array[i] *= mat.array[i];
                    }
                }
            }else{
                console.error("shape don't equal !");
            }
            return this;
        };
        return this;
    };

    numjs.matrix = matrix;

    window['numjs'] = numjs;
})(window);