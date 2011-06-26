

var Screens = function(intput, output){
    this.inputContext_ = input.getContext('2d');
    this.outputContext_ = output.getContext('2d');
};

Screens.prototype = {

    initialize: function(img){
        this.img = img;
        this.updateInput_([]);
    },

    update: function(path){
        this.updateInput_(path);
        this.updateOutput_(path);
    },

    updateInput_: function(path){
        var context = this.inputContext_;
        context.clearRect(0, 0, 500, 500);
        context.drawImage(this.img, 0, 0, 500, 500);
        context.fillStyle = 'red';
        path.forEach(function(point, index){
            this.circle_(context, point);
        }, this);
    },

    updateOutput_: function(path){
        var context = this.outputContext_;
        context.clearRect(0, 0, 500, 500);
        context.lineJoin = 'round';
        context.beginPath();
        path.forEach(function(point, index){
            context[index ? 'lineTo' : 'moveTo'](point[0], point[1]);
        });

        context.stroke();
    },

    circle_: function(context, point){
        context.beginPath();
        context.arc(point[0], point[1], 3, 0, Math.PI*2, true);
        context.closePath();
        context.fill();
    }

};

var input = document.getElementById('input'),
    output = document.getElementById('output'),
    screens = new Screens(input, output),
    path = [];

var preventDefault = function(event){
    event.stopPropagation();
    event.preventDefault();
};

input.addEventListener('dragenter', preventDefault, false);
input.addEventListener('dragover', preventDefault, false);

input.addEventListener('drop', function(event){
    preventDefault(event);
    var file = event.dataTransfer.files[0],
        reader = new FileReader();

    reader.onload = function(event){
        var img = new Image();
        img.onload = function(){

            screens.initialize(img);

            input.addEventListener('mouseup', function(event){
                path.push([event.pageX, event.pageY]);
                screens.update(path);
            }, false);

            input.addEventListener('mousemove', function(event){
                path.push([event.pageX, event.pageY]);
                screens.update(path);
                path.pop();
            });

            document.addEventListener('keyup', function(event){
                if (String.fromCharCode(event.which) == 'Z'){
                    path.pop();
                    screens.update(path);
                }
            }, false);

        };
        img.src = reader.result;
    };

    reader.readAsDataURL(file);
}, false);
