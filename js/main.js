
var input = document.getElementById('input'),
    output = document.getElementById('output'),
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
            var context = input.getContext('2d'),
                doodle = new Doodle();
            
            context.drawImage(img, 0, 0, input.clientWidth, input.clientHeight);
            
            input.addEventListener('mouseup', function(event){
                path.push([event.pageX, event.pageY]);
                doodle.update(path);
            }, false);
            
            input.addEventListener('mousemove', function(event){
                if (path.length){
                    path.push([event.pageX, event.pageY]);
                    doodle.update(path);
                    path.pop();
                }
            });
            
            document.addEventListener('keyup', function(event){
                if (String.fromCharCode(event.which) == 'Z'){
                    path.pop();
                    doodle.update(path);
                }
            }, false);
            
        };
        img.src = reader.result;
    };

    reader.readAsDataURL(file);
}, false);

var Doodle = function(){
    this.context = output.getContext('2d');
    this.context.lineWidth = 2;
    this.context.lineJoin = 'round';
};

Doodle.prototype.update = function(path){
    var context = this.context;
    context.clearRect(0, 0, 500, 500);
    
    context.beginPath();
    path.forEach(function(point, index){
        context[index ? 'lineTo' : 'moveTo'](point[0], point[1]);
    });
    
    context.stroke();
};
