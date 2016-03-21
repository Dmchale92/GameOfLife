/*
main.js contains the logic for a simulation of Conway's Game of Life

Edges are treated as empty cells
 */

var gameOfLife = (function(){
    var gameOfLife ={},bits=64*128;
    var dt; // grid bits
    var i;  // which dt is current?
    var sp=20; // speed of animation. smaller = faster.
    var timeClr ;// for clearing Timeout.
    var editMode=false;

    gameOfLife.clearGrid = function(){
        dt = [  Array.apply(0, Array(bits/32)).map(function() { return 0; }),
            Array.apply(0, Array(bits/32)).map(function() { return 0; })]; //enough bits for 64x128 grid
        i =0;// 0 is current
    }

    gameOfLife.get = function(p){ // get status of pth bit
        return (dt[i][p>>>5]&(0x80000000>>>(p&31))) ==0?0:1;
    }

    gameOfLife.put = function(p,s,j){ // set status of pth bit to s
        s ? (dt[j][p>>>5]|=(0x80000000>>>(p&31))): (dt[j][p>>>5]&=~(0x80000000>>>(p&31)));
    }

    gameOfLife.clearTimeout = function(){
        clearTimeout(timeClr);
    }

    gameOfLife.editMode = function(f){
        editMode=f;
        f? rects.attr('class',"edit") : rects.attr('class',"");
    }

    function switchSq(p){
        if(!editMode) return;
        gameOfLife.put(p,1-gameOfLife.get(p),i);
        rects.style("fill",function(d){ return gameOfLife.get(d)==1? "steelblue":"white";});
    }

    gameOfLife.clearGrid();
    var rects = d3.select("svg").selectAll("rect").data(d3.range(0,bits)).enter().append("rect")
        .attr("x",function(d){ return (d&127)*7;})
        .attr("y",function(d){ return (d>>>7)*7;})
        .attr("width",7).attr("height",7)
        .style("fill",function(d){ return gameOfLife.get(d)==1? "steelblue":"white";})
        .on("click",function(d){ return switchSq(d);});

    gameOfLife.setGrid = function(ar){  //set the initial bits
        gameOfLife.clearGrid();
        gameOfLife.clearTimeout();

        if(arguments.length > 0){
            d3.range(0,ar.length).forEach(function(y){d3.range(0,ar[0].length)
                .forEach(function(x){gameOfLife.put(y*128+x,ar[y][x],i)})});
        }
        rects.style("fill",function(d){ return gameOfLife.get(d)==1? "steelblue":"white";});
    }

    gameOfLife.update = function(){
        for(var p=0; p<bits; p++){
            var q = p>>>7, r=p&127;// quotient and reminder
            var n= 	(q>0 && r>0 ? gameOfLife.get(p-129): 0) + // number of neighbours
                (q>0 ? gameOfLife.get(p-128): 0) +
                (q>0 && r<127 ? gameOfLife.get(p-127): 0)+
                (r>0 ? gameOfLife.get(p-1): 0) +
                (r<127 ? gameOfLife.get(p+1): 0)+
                (q<63 && r>0 ? gameOfLife.get(p+127): 0)+
                (q<63  ? gameOfLife.get(p+128): 0)+
                (q<63 && r<127 ? gameOfLife.get(p+129): 0);

            if(n<=1 || n>3) gameOfLife.put(p, 0, 1-i);
            else if(n==2) gameOfLife.put(p, gameOfLife.get(p), 1-i);
            else gameOfLife.put(p, 1, 1-i);
        }
        i=1-i;// switch current
        rects.style("fill",function(d){ return gameOfLife.get(d)==1? "steelblue":"white";});

        timeClr = setTimeout(function(){gameOfLife.update()},sp);
    }

    return gameOfLife;
}());
