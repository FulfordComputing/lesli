var LESLI = {
    questions: {
        categories: [{
            name:"Family",
            statements: [
                "I enjoy being at home with my family",
                "My family gets along well together",
                "I like spending time with my parents",
                "My parents and I doing fun things together",
                "My family is better than most",
                "Members of my family talk nicely to one another",
                "My parents treat me fairly"
            ]
        },
        {
            name:"Friends",
            statements: [
                "My friends treat me well",
                "My friends are nice to me",
                "I wish I had different friends",
                "My friends are mean to me",
                "My friends are great",
                "I have a bad time with my friends",
                "I have a lot of fun with my friends",
                "I have enough friends",
                "My friends will help me if I need it"
            ]
        },
        {
            name:"School",
            statements: [
                "I look forward to going to school",
                "I like being in school",
                "School is interesting",
                "I wish I didn’t have to go to school",
                "There are many things about school I don’t like",
                "I enjoy school activities",
                "I learn a lot at school",
                "I feel bad at school"
            ]
        },
        {
            name:"Environment",
            statements: [
                "I like where I live",
                "I wish there were different people in my neighourhood",
                "I wish I lived in a different house",
                "I wish I lived somewhere else",
                "I like my neighbourhood",
                "I like my neighbours",
                "This town is filled with mean people",
                "My family’s house is nice",
                "There are lots of fun things to do where I live"
            ]
        },
        {
            name:"Self",
            statements: [
                "I think I am good looking",
                "I am fun to be around",
                "I am a nice person",
                "Most people like me",
                "There are lots of things I can do well",
                "I like to try new things",
                "I like myself",
            ]
        }
    ]
    },
    plotGraph: function() {
        var canvas = document.getElementById("graph");
        var img = document.getElementById('logo');
        var w = canvas.width;
        var h = canvas.height;
        var cx = w / 2;
        var cy = h / 2;
        
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
        if(cx > 100) {
            ctx.font = '12pt Calibri';
        } else {
            ctx.font = '8pt Calibri';
        }
        ctx.textAlign = 'center';
        ctx.fillStyle = '#86867c';
        
        
        var catCount = LESLI.questions.categories.length;

        function xy(i, val) {
            return {
                x: cx - cx * val * Math.sin(i * 2 * Math.PI / catCount) / 100,
                y: cy - cx * val * Math.cos(i * 2 * Math.PI / catCount) / 100
            }
        }

        // draw grid
        ctx.strokeStyle = '#e5e0ce';
        ctx.lineWidth = 1;
        for(var i = 0; i < catCount; i++) {
            for(var r = 0; r <= 100; r+=10) {
            var pt = xy(i, r);
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, cx / 40, 0, 2 * Math.PI);
            ctx.stroke();
            }
        }
        
        // lines
        ctx.save();
        ctx.strokeStyle = '#86867c';
        ctx.lineWidth = 4;
        ctx.beginPath();
        for(var i = 0; i < catCount; i++) {
            var pt = xy(i, LESLI.questions.categories[i].stats.average);

            if(i == 0) {
                ctx.moveTo(pt.x, pt.y);
            } else {
                ctx.lineTo(pt.x, pt.y);
            }
            
        }
        ctx.closePath();
        ctx.clip();
        ctx.globalAlpha = 0.5;
        var a = LESLI.questions.max / 100;
        ctx.drawImage(img, cx - cx * a, cy - cy * a, cx * a * 2, cy * a * 2);
        ctx.stroke();
        ctx.restore();

        // label axes
        for(var i = 0; i < catCount; i++) {
            LESLI.drawTextAlongArc(ctx, LESLI.questions.categories[i].name, cx, cy, cx*.85, Math.PI * 0.03, i * 2 * Math.PI/catCount);
        }
    
    },

    drawTextAlongArc: function(context, str, centerX, centerY, radius, anglePerCharacter, startAngle) {
        var len = str.length,
            s;
        context.save();
        context.translate(centerX, centerY);
        context.rotate(-1 * startAngle - (anglePerCharacter * len/2));
        context.rotate(-1 * (anglePerCharacter) / 2);
        for (var n = 0; n < len; n++) {
            context.rotate(anglePerCharacter);
            context.save();
            context.translate(0, -1 * radius);
            s = str[n];
            context.fillText(s, 0, 0);
            context.restore();
        }
        context.restore();
    },

    updateData: function() {
        var total = 0;
        var max = 0;
        for(var i = 0; i < LESLI.questions.categories.length; i++) {
            var c = LESLI.questions.categories[i];
            LESLI.questions.categories[i].stats = {
                total: 0,
                count: 0,
                average: 0
            }
            for(var ci = 0; ci < LESLI.questions.categories[i].statements.length; ci++) {
                var id = 'q_' + c.name.replace(/ /, "_") + '_' + ci;
                var value = parseInt($('#' + id).val());
                LESLI.questions.categories[i].stats.total+=value;
                LESLI.questions.categories[i].stats.count++;
            }
            LESLI.questions.categories[i].stats.average=
                LESLI.questions.categories[i].stats.total / LESLI.questions.categories[i].stats.count;
            total += LESLI.questions.categories[i].stats.average;
            if(LESLI.questions.categories[i].stats.average > max) {
                max = LESLI.questions.categories[i].stats.average;
            }
        }
        LESLI.questions.average = total / LESLI.questions.categories.length;
        LESLI.questions.max = max;
        LESLI.plotGraph();
    },

    init: function() {
        
        var i = 0;
        var width = $('.container').width();
        if(width > 400) {
            width = 400;
        }
        var html = '<nav id="navbar-listen" class="navbar navbar-light bg-light px-3">'
        +'<ul class="nav nav-pills">'
        + '<div id="small_graph_holder">'
        + '</div>'
        + '<li class="nav-item"><a class="nav-link" href="#Summary">Summary</a></li>';
        for(var i = 0; i < LESLI.questions.categories.length; i++) {
            var id = LESLI.questions.categories[i].name.replace(/ /, "_");
            html += '<li class="nav-item">'
            + '<a class="nav-link" href="#' + id + '">' + LESLI.questions.categories[i].name + '</a>'
            + '</li>';
        }
        html += '</ul>'
        + '</nav>'
        + '<div data-bs-spy="scroll" data-bs-target="navbar-listen" data-bs-offset="0" class="questions tab-content">'
        + '<div class="tab-pane show fade active" role="tabpanel" id="Summary">'
        + '<div id="graph_holder">'
        + '<canvas id="graph" width="' + width + '" height="' + width + '"></canvas>'
        + '</div>'
        + '</div>';
        for(var i = 0; i < LESLI.questions.categories.length; i++) {
            var id = LESLI.questions.categories[i].name.replace(/ /, "_");
            html += '<div class="tab-pane show fade active" role="tabpanel" id="' + id + '">'
            + '<h4 id="h_' + i + '">' + LESLI.questions.categories[i].name + '</h4>';
            for(var c = 0; c < LESLI.questions.categories[i].statements.length; c++) {
                id = 'q_' + LESLI.questions.categories[i].name.replace(/ /, "_") + '_' + c;
                html += '<div class="card question">'
                + '<div class="card-header">'
                + '<label for="' + id + '" class="form-label">' + LESLI.questions.categories[i].statements[c] + ':</label>'
                + '</div>'
                + '<div class="card-body">'
                + '<input type="range" class="form-control-range" id="' + id + '" min="0" max="100">'
                + '<span class="float-left">Never</span><span class="float-right">Always</span>'
                + '</div>'
                + '</div>';
            }
            html += '</div>';
        }
        html += '</table>';
        html += '</div>';
        
        $('#questions').html(html);
        $('.form-control-range').change(LESLI.updateData);
        var g = document.getElementById('graph_holder');
        function checkVisible(elm) {
            var rect = elm.getBoundingClientRect();
            var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
            return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
          }
        var currentlyLarge = true;
        document.addEventListener('scroll', function() {
            var shouldBeLarge = checkVisible(g);
            if(!shouldBeLarge && currentlyLarge) {
                $('#graph_holder').html('');
                width = 100;
                $('#small_graph_holder').html('<canvas id="graph" width="' + width + '" height="' + width + '"></canvas>');
                LESLI.updateData();
                currentlyLarge = false;
            }
            if(shouldBeLarge && !currentlyLarge) {
                $('#small_graph_holder').html('');
                width = $('.container').width();
                if(width > 400) {
                    width = 400;
                }
                $('#graph_holder').html('<canvas id="graph" width="' + width + '" height="' + width + '"></canvas>');
                LESLI.updateData();
                currentlyLarge = true;
            }
        })
        LESLI.updateData();
    }
}
$(LESLI.init);