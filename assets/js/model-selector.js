var modelsJSON = null;
var selectorValues = {
    "language": "",
    "training": "",
    "gpu": "",
    "textLength": "",
    "amount": ""
};

$.getJSON("assets/models.json", function (json) {
    modelsJSON = json;

    modelsJSON.sort(function (a, b) {
        return parseFloat(b.glue) - parseFloat(a.glue);
    });

    fillTable();
});

$('#language').on('change', function () {
    console.log('Language: ', $(this).val());
    selectorValues.language = $(this).val();
    fillTable();
});

$('#training').on('change', function () {
    console.log('Training: ', $(this).val());
    selectorValues.training = $(this).val();
    fillTable();
});

$('#gpu').on('change', function () {
    console.log('GPU: ', $(this).val());
    selectorValues.gpu = $(this).val();
    fillTable();
});

$('#textLength').on('change', function () {
    console.log('Text Length: ', $(this).val());
    selectorValues.textLength = $(this).val();
    fillTable();
});

$('#amount').on('change', function () {
    console.log('Amount: ', $(this).val());
    selectorValues.amount = $(this).val();
    fillTable();
});

$('#search').on('click', function () {
    $('#table-container').removeClass('hide');
    fillTable();
});

function fillTable() {
    console.log(selectorValues);
    $('#table-body').empty();
    var lmFound = false;
    var lmCount = 0;

    for (var i = 0; i < modelsJSON.length; i++) {
        var html = '';
        var specs = modelsJSON[i];
        var training = specs.training;
        var gpu = specs.gpu;
        var amount = specs.amount;
        var textLength = specs.textLength;
        var languages = specs.languages;
        var check = selectorValues.language !== '' ? checkLanguage(languages, selectorValues.training) : true;
        var language = selectorValues.language !== '' ? check[0] : 'english';
        var iterator = selectorValues.language !== '' ? check[1] : 0;

        if ((selectorValues.training === '' || training === selectorValues.training) &&
            (selectorValues.gpu === '' || gpu <= selectorValues.gpu) &&
            (selectorValues.amount === '' || amount <= selectorValues.amount) &&
            (selectorValues.textLength === '' || textLength >= selectorValues.textLength) &&
            check !== false) {
            lmFound = true;
            lmCount++;
            
            if (lmCount <= 3) {
                html += '' +
                    '<tr>' +
                    '<td style="width: 90px; max-width: 90px;">' + modelsJSON[i].name + (selectorValues.training === 'trained' || selectorValues.training === '' ? '-' + language : '') + '</td>' +
                    '<td style="width: 80px; max-width: 80px;">' + modelsJSON[i].glue + '</td>' +
                    '<td style="width: 110px; max-width: 110px;"><a href="' + modelsJSON[i].github + '" target="_blank">' + modelsJSON[i].github + '</a></td>' +
                    '<td style="width: 250px; max-width: 250px;">' + modelsJSON[i].description + '</td>' +
                    '<td style="width: 110px; max-width: 110px;"><a href="' + modelsJSON[i].languages[iterator][language] + '" target="_blank">' + modelsJSON[i].languages[iterator][language] + '</a></td>' +
                    '<td><a href="' + modelsJSON[i].paper + '" target="_blank">' + modelsJSON[i].paper + '</a></td>' +
                    '</tr>';
            }
        }

        if(html !== '') {
            $("#table-body").append(html);
        }
    }

    if(!lmFound) {
        $("#table-body").append('<tr><td><p>Keine Ergebnisse gefunden</p></td></tr>');
    }
}

function checkLanguage(modelLanguages, training) {
    if(training === 'untrained') {
        return ['multi', 0];
    } else {
        for (var i = 0; i < modelLanguages.length; i++) {
            for (var language in modelLanguages[i]) {
                if(selectorValues.language === language) {
                    return [language, i];
                }
            }
        }
        return false;
    }
}