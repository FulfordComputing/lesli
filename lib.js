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
            name:"Living Environment",
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
    init: function() {
        var i = 0;
        var html = '<ul class="nav nav-tabs">';
        for(var i = 0; i < LESLI.questions.categories.length; i++) {
            html += '<li class="nav-item">'
            + '<a class="nav-link" href="#h_' + i + '">' + LESLI.questions.categories[i].name + '</a>'
            + '</li>';
        }
        html += '</ul>'
        + '<div class="questions tab-content">';
        for(var i = 0; i < LESLI.questions.categories.length; i++) {
            html += '<div class="tab-pane show fade active" role="tabpanel" id="h_' + i + '">'
            + '<h4 id="h_' + i + '">' + LESLI.questions.categories[i].name + '</h4>';
            for(var c = 0; c < LESLI.questions.categories[i].statements.length; c++) {
                var id = 'q_' + LESLI.questions.categories[i].name + '_' + c;
                html += '<div class="card question">'
                + '<div class="card-header">'
                + '<label for="' + id + '" class="form-label">' + LESLI.questions.categories[i].statements[c] + ':</label>'
                + '</div>'
                + '<div class="card-body">'
                + '<input type="range" class="form-range" id="' + id + '" min="0" max="100">'
                + '<span class="float-start">Never</span><span class="float-end">Always</span>'
                + '</div>'
                + '</div>';
            }
            html += '</div>';
        }
        html += '</table>';
        html += '</div>';
        
        $('#questions').html(html);
    }
}
$(LESLI.init);