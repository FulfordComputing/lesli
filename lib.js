var LESLI = {
    support: [
        {
            name:"Childline",
            link: "https://www.childline.org.uk/",
            description: "Get help and advice about a wide range of issues, call us on 0800 1111, talk to a counsellor online, send Childline an email or post on the message boards.",
            video: "fCA6EhBhiC8",
            suitability: "111111" // all family friends school environment self
        },
        {
            name:"Mental Health UK",
            link: "https://mentalhealth-uk.org/",
            description: "Mental Health UK works across England, Scotland, Wales, and Northern Ireland to support people affected by mental health problems.",
            video: "ElyRNRe2k-0",
            suitability: "111111" // all family friends school environment self
        }
    ],
    questions: {
        categories: [{
            name:"Family",
            icon:"family_restroom",
            description: "Our families can have a big impact on our mental health and you can be a big influence on your family's mental health.",
            statements: [
                "I enjoy being at home with my family",
                "My family gets along well together",
                "I like spending time with my parents / carers",
                "My parents / carers and I like doing fun things together",
                "Members of my family talk nicely to one another",
                "My parents / carers treat me fairly"
            ]
        },
        {
            name:"Friends",
            icon:"people",
            description: "You can't choose your family but you can choose your friends. How do they influence you and how do you influence them?",
            statements: [
                "My friends treat me well",
                "My friends are nice to me",
                "My friends are great",
                "I have enough friends",
                "My friends will help me if I need it"
            ]
        },
        {
            name:"School",
            icon:"school",
            description: "Love it or hate it, school is a big part of teenage life. Have you found your place to belong, thrive and shine?",
            statements: [
                "I look forward to going to school",
                "I like being in school",
                "School is interesting",
                "I enjoy school activities",
                "I learn a lot at school",
            ]
        },
        {
            name:"Environment",
            icon:"holiday_village",
            description: "We can\'t always choose where we live or who lives nearby. But we can choose to make a positive difference to the world around us wherever we are",
            statements: [
                "I like where I live",
                "I like my neighbourhood",
                "I like my neighbours",
                "My family’s house is nice",
                "There are lots of fun things to do where I live"
            ]
        },
        {
            name:"Self",
            icon:"emoji_people",
            description: "Being ok with who you are doesn't mean loving yourself and being arrogant. People are flawed. Nobody is perfect. That's what makes us human. The people who are most worth knowing, know your flaws and accept you just as we are.",
            statements: [
                "I think I am good looking",
                "I am fun to be around",
                "I am a nice person",
                "Most people like me",
                "There are lots of things I can do well"
            ]
        }
    ]
    },
    plotGraph: function() {
        var canvas = document.getElementById("graph");
        var img = document.getElementById('logo');
        if(!canvas || !img)
            return;
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
                average: 0,
                highest: {
                    index: 0,
                    value: 0
                },
                lowest: {
                    index: 0,
                    value: 100
                }
            }
            for(var ci = 0; ci < LESLI.questions.categories[i].statements.length; ci++) {
                var id = 'q_' + c.name.replace(/ /, "_") + '_' + ci;
                var value = parseInt($('#' + id).val());
                LESLI.questions.categories[i].stats.total+=value;
                if(value > LESLI.questions.categories[i].stats.highest.value) {
                    LESLI.questions.categories[i].stats.highest.value = value;
                    LESLI.questions.categories[i].stats.highest.index = ci;
                }
                if(value < LESLI.questions.categories[i].stats.lowest.value) {
                    LESLI.questions.categories[i].stats.lowest.value = value;
                    LESLI.questions.categories[i].stats.lowest.index = ci;
                }
                LESLI.questions.categories[i].stats.count++;
            }
            LESLI.questions.categories[i].stats.average=
                LESLI.questions.categories[i].stats.total / LESLI.questions.categories[i].stats.count;
            total += LESLI.questions.categories[i].stats.average;
            if(LESLI.questions.categories[i].stats.average > max) {
                max = LESLI.questions.categories[i].stats.average;
            }
        }
        var highest = 0;
        var lowest = 0;
        for(var i = 0; i < LESLI.questions.categories.length; i++) {
            if(LESLI.questions.categories[i].stats.average > LESLI.questions.categories[highest].stats.average) {
                highest = i;
            }
            if(LESLI.questions.categories[i].stats.average < LESLI.questions.categories[lowest].stats.average) {
                lowest = i;
            }
        }
        var advice = "<h2>Tips:</h2><ul>"
        + '<li>It looks like <strong>' + LESLI.questions.categories[highest].name + '</strong> contributes most to your positive mental health</li>'
        + '<li>Check out what <a href="support.html#' + LESLI.questions.categories[lowest].name + '">support</a> is available to help with <strong>' + LESLI.questions.categories[lowest].name + '</strong></li>'
        + '</ul>';
        $('#advice').html(advice);
        LESLI.questions.average = total / LESLI.questions.categories.length;
        LESLI.questions.max = max;
        LESLI.plotGraph();
    },

    random: function(list) {
        return list[Math.round(Math.random() * (list.length -1))];
    },

    init_encourage: function() {
        $('#btn_encourage').click(LESLI.encourageChoose);
    },

    init_inspire: function() {
        var videos = ["CfvYlWG1cA0", "IDPDEKtd2yM", "2E54NTi6Xow", "NHf56w1AmPw", "YIG5mqXpVl4", "WT_xFNBbFRY"];
        $('#inspire').html('<iframe width="560" height="315" src="https://www.youtube.com/embed/' + LESLI.random(videos) + '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');
    },

    init_laugh: function() {
        var gifs = ['<iframe src="https://giphy.com/embed/T3Vx6sVAXzuG4" width="480" height="291" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/90s-baby-T3Vx6sVAXzuG4">via GIPHY</a></p>',
        '<iframe src="https://giphy.com/embed/3osxYk9qClrQVXVfiw" width="480" height="270" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/tvland-younger-youngertv-3osxYk9qClrQVXVfiw">via GIPHY</a></p>',
        '<iframe src="https://giphy.com/embed/JmD9mkDmzvXE7nxy7j" width="480" height="412" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/embarassed-anthony-fauci-dr-JmD9mkDmzvXE7nxy7j">via GIPHY</a></p>',
        '<iframe src="https://giphy.com/embed/GpyS1lJXJYupG" width="480" height="392" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/laughing-ryan-gosling-GpyS1lJXJYupG">via GIPHY</a></p>',
        '<iframe src="https://giphy.com/embed/ODofCyJUSRoDBH8lKe" width="480" height="393" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/election2020-laugh-donald-trump-lick-ODofCyJUSRoDBH8lKe">via GIPHY</a></p>',
        '<iframe src="https://giphy.com/embed/ZqlvCTNHpqrio" width="480" height="259" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/laughing-despicable-me-minions-ZqlvCTNHpqrio">via GIPHY</a></p>',
        '<iframe src="https://giphy.com/embed/3i7zenReaUuI0" width="480" height="480" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/laughing-scrubs-gif-3i7zenReaUuI0">via GIPHY</a></p>',
        '<iframe src="https://giphy.com/embed/Mjl0BsAgMGYTe" width="400" height="480" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/laughing-duck-donald-Mjl0BsAgMGYTe">via GIPHY</a></p>',
        '<iframe src="https://giphy.com/embed/CoDp6NnSmItoY" width="480" height="319" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/laughing-laugh-ricky-gervais-CoDp6NnSmItoY">via GIPHY</a></p>',
        '<iframe src="https://giphy.com/embed/88iYsvbegSUn9bSTF8" width="479" height="480" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/fallontonight-funny-lol-88iYsvbegSUn9bSTF8">via GIPHY</a></p>'
    ];
        var laugh = LESLI.random(gifs);
        $('#laugh').html(laugh);
    },

    encourageChoose: function(e) {
        var people = ["friend", "family member", "neighbour", "teacher", "relative", "teaching assistant"];
        var ideas = [
            "Write a note to a", 
            "Send a message to a",
            "Write an email to a",
            "Leave some chocolate for a"];
        var reasons = [
            "for being helpful",
            "for being awesome",
            "for being a good listener",
            "just for being them",
            "to thank them for their kindness",
            "to make them smile",
            "to improve their day",
            "so they know someone cares",
            "for looking out for others"
        ];
        var idea = LESLI.random(ideas) + " " + LESLI.random(people) + " " + LESLI.random(reasons);
        var partialIdea = "";
        var encourage = document.getElementById("encourage");
        function revealChar() {
            if(partialIdea.length < idea.length) {
                partialIdea += idea[partialIdea.length];
                encourage.innerText = partialIdea;
            }
            setTimeout(revealChar, 50);
        }
        revealChar();
        
    },

    init_support: function() {
        var html = '<ul class="nav nav-tabs" id="tabs-support" role="tablist">'
        + '<li class="nav-item" role="presentation">'
        + '<a id="tab-all" class="nav-link active" href="#All" data-toggle="tab" role="tab" arial-controls="all" aria-selected="true"><span class="material-icons">star_rate</span> All</a></li>';
        for(var i = 0; i < LESLI.questions.categories.length; i++) {
            var id = LESLI.questions.categories[i].name.replace(/ /, "_");
            html += '<li class="nav-item" role="presentation">'
            + '<a id="tab-' + id + '" class="nav-link active" data-toggle="tab" role="tab" arial-controls="' + id + '" aria-selected="false" href="#' + id + '"><span class="material-icons">' + LESLI.questions.categories[i].icon + '</span> ' + LESLI.questions.categories[i].name + '</a>'
            + '</li>';
        }
        html += '</ul>'
        + '</ul>'
        + '<div class="tab-content">'
        + '<div class="tab-pane fade show active" role="tabpanel" id="All" aria-labelledby="tab-All">'
        + '<div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">'
        + '<ol class="carousel-indicators">';
        for(var i = 0; i < LESLI.support.length; i++) {
            html += '<li data-target="#carouselExampleIndicators" data-slide-to="' + i + '"';
            if(i == 0) {
                html += 'class="active"';
            } 
            html += '></li>';
        }
        html += '</ol>'
        + '<div class="carousel-inner center highlight">';
        for(var i = 0; i < LESLI.support.length; i++){
            html += '<div class="carousel-item' + (i==0?" active":"") + '">'
            + '<h2>' + LESLI.support[i].name + '</h2>'
            + '<div>' + LESLI.support[i].description + '</div>'
            + '<iframe width="560" height="315" src="https://www.youtube.com/embed/' + LESLI.support[i].video + '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
            + '<p><a class="btn btn-secondary" href="' + LESLI.support[i].link + '">find out more</a></p>'
            + '<p>&nbsp;</p>'
            + '</div>'
        }
        html += '</div>'
        + '<a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">'
        + '<span class="carousel-control-prev-icon" aria-hidden="true"></span>'
        + '<span class="sr-only">Previous</span>'
        + '</a>'
        + '<a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">'
        + '<span class="carousel-control-next-icon" aria-hidden="true"></span>'
        + '<span class="sr-only">Next</span>'
        + '</a>'
        + '</div>'
        
        
        html += '</div>';
        for(var i = 0; i < LESLI.questions.categories.length; i++) {
            var id = LESLI.questions.categories[i].name.replace(/ /, "_");
            html += '<div class="tab-pane fade" role="tabpanel" id="' + id + '" aria-labelledby="tab-' + id + '">'
            + '<h4>' + LESLI.questions.categories[i].name + '</h4>'
            + LESLI.questions.categories[i].description;
            html += '</div>';
        }
        html += '</table>';
        html += '</div>';
        $('#questions').html(html);
    },

    init_listen: function() {
        var i = 0;
        var width = $('.container').width();
        if(width > 400) {
            width = 400;
        }
        var html = '<nav id="navbar-listen" class="navbar navbar-light bg-light px-3">'
        +'<ul class="nav nav-pills">'
        + '<div id="small_graph_holder">'
        + '</div>'
        + '<li class="nav-item"><a class="nav-link" href="#Summary"><span class="material-icons">auto_graph</span> Summary</a></li>';
        for(var i = 0; i < LESLI.questions.categories.length; i++) {
            var id = LESLI.questions.categories[i].name.replace(/ /, "_");
            html += '<li class="nav-item">'
            + '<a class="nav-link" href="#' + id + '"><span class="material-icons">' + LESLI.questions.categories[i].icon + '</span> ' + LESLI.questions.categories[i].name + '</a>'
            + '</li>';
        }
        html += '</ul>'
        + '</nav>'
        + '<div data-bs-spy="scroll" data-bs-target="navbar-listen" data-bs-offset="0" class="questions tab-content">'
        + '<div class="tab-pane show fade active" role="tabpanel" id="Summary">'
        + '<p>This diagram shows a summary of your responses for each category to help you understand and take control over your mental health</p>'
        + '<div id="graph_holder">'
        + '<canvas id="graph" width="' + width + '" height="' + width + '"></canvas>'
        + '</div>'
        + '<div id="advice">Take a few minutes to answer these questions as honestly as you can</div>'
        + '<h3>Remember:</h3>'
        + '<ul><li>It\'s OK not to be OK: there\'s <a href="support.html">support available</a> if you need it.</li>'
        + '<li>A higher scores (in this, or any other activity!) doesn\'t mean you\'re worth more, and lower scores doesn\'t mean you\'re worth less.'
        + '<li>You are not a statistic: don\'t compare yourself to anyone else.</li>'
        + '<li>Use these results to help you understand <em>how you\'re feeling</em>, not to understand <em>who you are</em>.</li>'
        + '<li>You\'re you. You\'re awesome as you are.</li>'
        + '<li>Your data is not shared with anyone - it stays securely on your device</li></ul>'
        + '</ul></div>';
        for(var i = 0; i < LESLI.questions.categories.length; i++) {
            var id = LESLI.questions.categories[i].name.replace(/ /, "_");
            html += '<div class="tab-pane show fade active" role="tabpanel" id="' + id + '">'
            + '<h4 id="h_' + i + '">' + LESLI.questions.categories[i].name + '</h4>'
            + LESLI.questions.categories[i].description;
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
                $('#small_graph_holder').html('<a href="#Summary"><canvas id="graph" width="' + width + '" height="' + width + '"></canvas></a>');
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
    },

    init: function() {
        var m = /\/([a-zA-Z]*)\.html/.exec(location.href);
        if(m) {
            if(m && m[1] && LESLI['init_' + m[1]]) {
                LESLI['init_' + m[1]]();
            }
        }
        $('[data-toggle="tooltip"]').tooltip()
    }
}
$(LESLI.init);