$(function() {

    var cp = {x:0, y:0},
        d1 = {x:0, y:0},
        d2 = {x:0, y:0},
        dot = 0,
        dots = [],
        radius = 399,
        seconds = 0,
        speeds = [],
        speedSize = 1000,
        average = function (arr){
            if (arr.length === 0) { return 0; }
            var sum = 0;
            for( var i in arr) { sum += arr[i]; }
            return Math.round(sum / arr.length);
        },
        distance = function(p1, p2){
            var sqrd = Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)
            return Math.round(Math.sqrt(sqrd));
        },
        elem = {
            speed : $('#speed'),
            tick : $('#tick'),
            x : $('#x'),
            y : $('#y'),
            threshold : $('#threshold'),
            distance : $('#distance')
        };

    $('.target').on('inbound', function(){
        $(this).animate({height:300}, 100);
    });

    $('.target').on('outbound', function(){
        $(this).animate({height:50}, 100);
        $(this).removeAttr('count-down');
        $(this).removeAttr('hovering');
    });

    $('.target').mouseenter(function(){
        var self = $(this),
            countDown = self.attr('count-down');
        if (countDown){
            clearTimeout(parseInt(countDown));
            self.removeAttr('count-down');
            return;
        }
        var hovering = setTimeout(function(){
            self.trigger('inbound');
        }, 500);
        self.attr('hovering', hovering);
    });

    $('.target').mouseleave(function(){
        var self = $(this),
            hovering = self.attr('hovering');
        if (hovering){
            clearTimeout(parseInt(hovering));
            self.removeAttr('hovering');
            return;
        }else{
            self.trigger('outbound');
        }
    });

    $(document).mousemove(function(event) {

        var ep = {x:event.pageX, y:event.pageY};

        dot += distance(cp, ep);

        cp.x = ep.x;
        cp.y = ep.y;

        elem.x.html(cp.x);
        elem.y.html(cp.y);
    });

    setInterval(function(){
        dots.push(dot*10);
        dot = 0;
    }, 100);

    setInterval(function(){
        seconds++;
        elem.tick.html(seconds);

        d2.x = d1.x;
        d2.y = d1.y;
        d1.x = cp.x;
        d1.y = cp.y;

        var speed = average(dots);
        if (speed > 100){
            speeds.push(speed);
            if (speeds.length > speedSize){
                speeds.shift();
            }
        }
        elem.speed.html(speed);
        dots = [];
        var threshold = Math.round(average(speeds) * 0.8);
        elem.threshold.html(threshold);

        $('.target').each(function() {
            if (speed > 50){
                var self = $(this),
                    _pos = self.position(),
                    pos = { x:_pos.left, y:_pos.top },
                    dis1 = distance(pos, d1),
                    dis2 = distance(pos, d2),
                    delta = dis2 - dis1,
                    hovering = self.attr('hovering'),
                    isHovering = (typeof hovering !== typeof undefined &&
                                  hovering !== false);

                elem.distance.html(dis1 + ' to ' + self.attr('id'));

                if (delta > 100 &&
                    speed > threshold &&
                    dis1 <= radius &&
                   !isHovering){

                    self.trigger('inbound');

                    var countDown = setTimeout(function(){
                        self.trigger('outbound');
                    }, 3000);

                    self.attr('count-down', countDown);
                }

                if (delta < -100 && speed > (threshold * .8)){
                    self.trigger('outbound');
                }
            }
        });

    }, 1000);
});
