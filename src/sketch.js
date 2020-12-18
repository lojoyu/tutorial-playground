// import p5 from 'p5';
import smooth from 'array-smooth';
let circle = 0;
let tri = 0;
let rect = 0;
let text = '';
let graph = [];
export function showShape(shape) {
    if (shape == 1) circle += 10;
    else if (shape == 2) tri += 10;
    else if (shape == 3) rect += 10;
    //else if (shape == 4) 
    //.log(shape, circle, tri);
}

export function showText(txt) {
    text = txt;
}

export function showGraph(arr) {
    graph = arr;
}

let p5canvas = function(p) {
    let texts = [];
    let lines = [];
    p.setup = function() {
        //.log(p.windowWidth, p.windowHeight)
        p.createCanvas(p.windowWidth, p.windowHeight);
    }

    p.draw = function() {

        p.clear();
        p.noStroke();
        if (circle) drawCircle();
        if (tri) drawTri();
        if (rect) drawRect();
        if (text != '') collectText();
        if (graph.length) collectGraph();
        drawText();
        //drawLine();
        drawVertex();
        // p.textFont('Georgia');
        // p.text('Georgia你好', 12, 100);
        // p.textFont('Helvetica');
        // p.text('Helvetica 哈 囉 ', 12, 500);
        //p.rect(12+30, 500-20, 50, 20);
       // p.line(12, 100, 42, 100);
    }


    p.mousePressed = function() {
       //circle+=10;
       
       //rect += 10;
       let arr = ['adfsdfa', '哈囉', 'this is a stupid question, dont you think?']
       //collectText(arr[Math.floor(Math.random()*3)]);
       graph = [0.1, 0.1, 0.1, 0.8, 0.8, 0.8];
    }

    p.touchMoved = function() {
        
        // lines.push({
        //     x: p.mouseX,
        //     y: p.mouseY,
        //     px: p.pmouseX,
        //     py: p.pmouseY,
        //     time: 0
        // })
        return false;
    }

    let drawLine = function() {
        for (let i=0; i<lines.length; i++) {
            p.stroke(255);
            p.strokeWeight(2);
            if (lines[i].time >= 0) p.line(lines[i].x, lines[i].y, lines[i].px, lines[i].py);
            lines[i].time++;
            if (lines[i].time >= 30) {
                lines.splice(i, 1);
                i--;
            }
        }
    }

    let drawVertex = function() {
        let pid = '';
        p.stroke(255);
        p.strokeWeight(2);
        p.noFill();
        p.beginShape();
        for (let i=0; i<lines.length; i++) {
            
            if (pid != lines[i].id) {
                p.endShape();
                p.beginShape();
                pid = lines[i].id;
            }

            if (lines[i].time >= 0) {
                //p.curveVertex((lines[i].px+lines[i].x)/2., (lines[i].py+lines[i].y)/2.);
                p.curveVertex(lines[i].px, lines[i].py);
            }
            lines[i].time++;
            if (lines[i].time >= 30) {
                lines.splice(i, 1);
                i--;
            }
        }
        p.endShape();
    }

    let collectGraph = function() {
        let id = Date.now+String(Math.random());
        let x = [];
        let y = [];
        for (let i=graph.length-1; i>=0; i-=2) {
            x.push(graph[i-1]*p.windowWidth);
            y.push(graph[i]*p.windowHeight)
        }
        //console.log(graph.length);
        const windowSize = 2
        const xs = smooth(x, windowSize)
        const ys = smooth(y, windowSize)
        for (let i=0; i<xs.length; i++){
            if (i-3 >= 0) {
                lines.push({
                    x: xs[i+1],
                    y: ys[i+1],
                    px: xs[i],
                    py: ys[i],
                    time: Math.floor(-i / 3.),
                    id: id
                })
            }
            
        }
        graph = [];
    }


    let collectText = function() {
        //console.log('collect');
        let l = Math.random()*p.windowWidth;
        let r = Math.random()*p.windowHeight;
        texts.push({
            text: text,
            pos: [l, r],
            rect: [l+20, r-10, 40, 15],
            prev: false,
            prevtxt: true,
            color: 'white',
            last: 60
        })
        text = '';
    }

    let drawText = function() {
        for (let i=0; i<texts.length; i++) {
            let s = 20;
            p.fill(255);
            p.textSize(s);
            p.textFont('Helvetica');
            if ((texts[i].prevtxt && Math.random() > 0.1) || ((!texts[i].prevtxt) && Math.random() > 0.7)) {
                p.text(texts[i].text, texts[i].pos[0], texts[i].pos[1]);                
                texts[i].prevtxt = true;
            } else {
                texts[i].prevtxt = false;
            }
            
            if ((texts[i].prev && Math.random() > 0.1) || ((!texts[i].prev) && Math.random() > 0.9)) {
                p.fill(texts[i].color);
                p.rect(texts[i].rect[0], texts[i].rect[1], texts[i].rect[2], texts[i].rect[3]);
                texts[i].prev = true;
            } else {
                texts[i].prev = false;
            }
            if (Math.random() > 0.95) {
                texts[i].color = Math.random() > 0.5 ? 'black' : 'white';
                texts[i].rect = [
                    texts[i].pos[0]+Math.random()*s*texts[i].text.length*0.5-15,
                    texts[i].pos[1]-s+Math.random()*s,
                    s + Math.random()*8*texts[i].text.length*0.5,
                    5 + Math.random()*18
                ]
            }
            texts[i].last--;
            if (texts[i].last <= 0) {
                texts.splice(i, 1);
                i--;
            }
        }

    }

    let drawRect = function() {
        p.rectMode(p.CENTER);
        p.fill(255);
        p.fill(`rgba(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, 255, 0.8)`);

        let l = Math.random()*p.windowWidth;
        p.rect(p.windowWidth / 2, p.windowHeight/2, l, l);
        rect--;
    }


    let drawCircle = function() {
        p.fill(`rgba(255, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, 1)`);
        let l = Math.random()*p.windowWidth;
        let r = Math.random()*p.windowHeight;
        let size = 10+Math.random()*200;
        p.circle(l, r, size);
        circle--;
    }

    let drawTri = function () {
        p.fill(`rgba(${Math.floor(Math.random()*255)}, 255, ${Math.floor(Math.random()*255)}, 1)`);

        let l = 10+Math.random()*100;
        let a = [Math.random()*p.windowWidth, Math.random()*p.windowHeight];
        p.triangle(a[0], a[1], a[0]+l, a[1]+l*Math.sqrt(3), a[0]+2*l, a[1]);
        tri--;
    }


    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
	}
}


new p5(p5canvas, 'p5Container');

