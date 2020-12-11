var modelsJSON = null;
var selectorValues = {
    "started": false,
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

    if(localStorage.getItem("selectorValues") !== null) {
        selectorValues = JSON.parse(localStorage.getItem("selectorValues"));
        checkSelectors();
    }
});

$('#language').on('change', function () {
    console.log('Language: ', $(this).val());
    selectorValues.started = true;
    selectorValues.language = $(this).val();
    localStorage.setItem('selectorValues', JSON.stringify(selectorValues));
    checkSelectors();
});

$('#training').on('change', function () {
    console.log('Training: ', $(this).val());
    selectorValues.started = true;
    selectorValues.training = $(this).val();
    localStorage.setItem('selectorValues', JSON.stringify(selectorValues));
    checkSelectors();
});

$('#gpu').on('change', function () {
    console.log('GPU: ', $(this).val());
    selectorValues.started = true;
    selectorValues.gpu = $(this).val();
    localStorage.setItem('selectorValues', JSON.stringify(selectorValues));
    checkSelectors();
});

$('#textLength').on('change', function () {
    console.log('Text Length: ', $(this).val());
    selectorValues.started = true;
    selectorValues.textLength = $(this).val();
    localStorage.setItem('selectorValues', JSON.stringify(selectorValues));
    checkSelectors();
});

$('#amount').on('change', function () {
    console.log('Amount: ', $(this).val());
    selectorValues.started = true;
    selectorValues.amount = $(this).val();
    localStorage.setItem('selectorValues', JSON.stringify(selectorValues));
    checkSelectors();
});

$('#search').on('click', function () {
    $('#table-container').removeClass('hide');
    fillTable();
});

function checkSelectors() {
    if(selectorValues.language !== "" &&
        selectorValues.training !== "" &&
        selectorValues.gpu !== "" &&
        selectorValues.amount !== "" &&
        selectorValues.textLength !== "") {
        $('#search').removeClass('disabled');
    }
}

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
        var check = checkLanguage(languages, selectorValues.training);
        var language = check[0];
        var iterator = check[1];

        if(selectorValues.started === true &&
            (training === selectorValues.training) &&
            (gpu <= selectorValues.gpu) &&
            (amount <= selectorValues.amount) &&
            (textLength >= selectorValues.textLength) && check !== false) {
            lmFound = true;
            lmCount++;
            
            console.log(lmCount);

            if (lmCount <= 3) {
                html += '' +
                    '<tr>' +
                    '<td style="width: 90px; max-width: 90px;">' + modelsJSON[i].name + (selectorValues.training === 'trained' ? '-' + language : '') + '</td>' +
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